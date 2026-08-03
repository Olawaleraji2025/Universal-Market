import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TbCurrencyNaira } from "react-icons/tb";

export default function SkeletonCard({ count = 3 }) {
  return (
    <div className="flex gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="w-3xs">
          {/* Image skeleton - aspect-square matches ProductCard */}
          <CardContent className="p-0">
            <Skeleton className="aspect-square w-full rounded-none" />
          </CardContent>

          {/* Title, price, button skeleton */}
          <CardHeader className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center">
              <Skeleton className="h-5 w-1/3" />
            </div>
            <Skeleton className="h-9 w-full rounded-md" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

