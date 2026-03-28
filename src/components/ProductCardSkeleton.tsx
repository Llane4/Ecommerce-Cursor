import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="h-full w-full gap-0 border-border bg-card py-0 text-card-foreground shadow-sm ring-0 dark:border-white/10">
      <CardContent className="flex flex-col gap-3 px-4 pt-4 pb-3">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        <Skeleton className="h-4 w-3/4 rounded-md" />

        <Skeleton className="h-7 w-2/5 rounded-md" />
      </CardContent>

      <CardFooter className="mt-auto flex-col gap-0 border-t border-border px-4 pb-4 pt-3 dark:border-white/10">
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  )
}
