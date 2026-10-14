import { Skeleton } from '@/components/ui/skeleton';

// Mirrors src/Layout/Shop/ShopProductList.jsx. Update both together.
export default function ShopProductListSkeleton({ count = 5 }) {
  return (
    <div className="max-w-7xl mx-auto space-y-5" aria-hidden="true">
      {Array.from({ length: 2 }).map((_, rowIndex) => (
        <div
          key={`shop-product-row-skeleton-${rowIndex}`}
          className="flex gap-4 overflow-x-auto pb-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: count }).map((__, index) => (
            <div
              key={`shop-product-skeleton-${rowIndex}-${index}`}
              className="w-40 min-w-40 flex-none overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="relative aspect-square bg-gray-50">
                <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-slate-200" />
              </div>

              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-4 w-28 rounded-md bg-slate-200" />
                <Skeleton className="h-5 w-20 rounded-md bg-slate-200" />
                <Skeleton className="h-5 w-16 rounded-full bg-slate-200" />
                <Skeleton className="mt-2 h-9 w-full rounded-md bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
