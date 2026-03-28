import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CartRehydration } from "@/components/CartRehydration";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeWatcher } from "@/components/ThemeWatcher";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CursorShop",
  description: "Catálogo de productos",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="flex min-h-full flex-col bg-background pb-[env(safe-area-inset-bottom)] text-foreground">
        <ThemeProvider>
          <ThemeWatcher>
            <CurrencyProvider>
              <CartRehydration />
              <SiteHeader />
              <main className="flex-1">{children}</main>
            </CurrencyProvider>
          </ThemeWatcher>
        </ThemeProvider>
      </body>
    </html>
  );
}
