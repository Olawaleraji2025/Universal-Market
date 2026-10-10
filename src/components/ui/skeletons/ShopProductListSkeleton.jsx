import { Skeleton } from '@/components/ui/skeleton';

// Mirrors src/Layout/Shop/ShopProductList.jsx. Update both together.
export default function ShopProductListSkeleton({ count = 3 }) {
  return (
    <div className="max-w-7xl mx-auto" aria-hidden="true">
      {/* <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={`shop-filter-skeleton-${index}`}
            className="h-9 w-24 shrink-0 rounded-full bg-slate-200"
          />
        ))}
      </div> */}

      <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`shop-product-skeleton-${index}`}
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

      {/* <div className="mt-5 flex items-center justify-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
        <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
      </div> */}
    </div>
  );
}
