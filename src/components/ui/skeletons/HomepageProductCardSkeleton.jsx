import { Skeleton } from '@/components/ui/skeleton';

// Mirrors src/Layout/Homepage/ProductCard.jsx. Update both together.
export default function HomepageProductCardSkeleton({ count = 3 }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`homepage-product-card-skeleton-${index}`}
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
  );
}
