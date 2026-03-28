import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

type CheckoutProduct = {
  title: string;
  unit_price: number;
  quantity: number;
  id?: string;
};

const MP_CURRENCY_IDS = new Set(["USD", "ARS", "EUR"]);

function parseCurrencyId(body: unknown): string {
  if (!body || typeof body !== "object") return "ARS";
  const raw = (body as Record<string, unknown>).currency_id;
  if (typeof raw === "string" && MP_CURRENCY_IDS.has(raw)) return raw;
  return "ARS";
}

function parseProducts(body: unknown): CheckoutProduct[] | null {
  const list = Array.isArray(body) ? body : (body as { products?: unknown })?.products;
  if (!Array.isArray(list)) return null;
  const out: CheckoutProduct[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== "object") return null;
    const p = entry as Record<string, unknown>;
    const title = p.title;
    const unit_price = p.unit_price;
    const quantity = p.quantity;
    if (typeof title !== "string" || title.trim() === "") return null;
    if (typeof unit_price !== "number" || !Number.isFinite(unit_price) || unit_price < 0) return null;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) return null;
    const id = p.id;
    out.push({
      title: title.trim(),
      unit_price,
      quantity,
      ...(typeof id === "string" && id.length > 0 ? { id } : {}),
    });
  }
  return out;
}

function mercadoPagoErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message: unknown }).message;
    if (typeof m === "string" && m.trim() !== "") return m;
  }
  return "Error al crear la preferencia";
}

function logMercadoPagoPayload(label: string, payload: unknown): void {
  try {
    console.log(label, JSON.stringify(payload, null, 2));
  } catch {
    console.log(label, payload);
  }
}

export async function POST(request: Request) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Falta MP_ACCESS_TOKEN en el entorno" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const products = parseProducts(body);
  if (!products || products.length === 0) {
    return NextResponse.json(
      {
        error:
          "Se espera un array de productos con title, unit_price y quantity (entero ≥ 1), o { products: [...] }",
      },
      { status: 400 },
    );
  }

  const currency_id = parseCurrencyId(body);

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const items = products.map((p, index) => ({
    id: p.id ?? `item-${index}`,
    title: p.title,
    unit_price: p.unit_price,
    quantity: p.quantity,
    currency_id,
  }));

  // MP exige back_urls.success en HTTPS para usar auto_return; http://localhost falla con invalid_auto_return.
  const publicBaseUrl =
    typeof process.env.MP_PUBLIC_BASE_URL === "string" && process.env.MP_PUBLIC_BASE_URL.trim() !== ""
      ? process.env.MP_PUBLIC_BASE_URL.trim().replace(/\/$/, "")
      : "http://localhost:3000";

  try {
    const body: {
      items: typeof items;
      payer: { email: string };
      back_urls: { success: string; failure: string; pending: string };
      auto_return?: "approved";
      binary_mode: boolean;
    } = {
      items,
      payer: {
        email: "test_user_123456@testuser.com",
      },
      back_urls: {
        success: publicBaseUrl,
        failure: publicBaseUrl,
        pending: publicBaseUrl,
      },
      binary_mode: true,
    };
    if (publicBaseUrl.startsWith("https://")) {
      body.auto_return = "approved";
    }
    logMercadoPagoPayload("[checkout] Request → Mercado Pago (preferencia):", body);

    const result = await preference.create({ body });

    logMercadoPagoPayload(
      "[checkout] Respuesta ← Mercado Pago (preferencia, completa):",
      result,
    );

    const id = result.id;
    const init_point = result.init_point;
    if (!id || !init_point) {
      logMercadoPagoPayload(
        "[checkout] Respuesta MP inválida (falta id o init_point), cuerpo:",
        result,
      );
      return NextResponse.json(
        { error: "Respuesta de Mercado Pago sin id o init_point", mercadoPago: result },
        { status: 502 },
      );
    }

    return NextResponse.json({
      id,
      init_point,
      mercadoPago: result,
    });
  } catch (err) {
    console.log("[checkout] Error Mercado Pago (objeto lanzado por el SDK):", err);
    logMercadoPagoPayload(
      "[checkout] Error Mercado Pago (JSON, p. ej. cause / invalid_installments):",
      err && typeof err === "object" ? err : { thrown: String(err) },
    );
    const message = mercadoPagoErrorMessage(err);
    return NextResponse.json(
      {
        error: message,
        mercadoPago: err && typeof err === "object" ? err : { detail: String(err) },
      },
      { status: 502 },
    );
  }
}
