import { Skeleton } from '@/components/ui/skeleton';

// Mirrors src/pages/WishListPage.jsx. Update both together.
export default function WishlistPageSkeleton({ count = 3 }) {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 md:px-6 lg:px-8" aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-9 w-40 rounded bg-slate-200 md:h-11 md:w-52" />
              <Skeleton className="h-4 w-72 rounded bg-slate-200 md:h-5 md:w-96" />
            </div>

            <div className="flex items-center gap-3 text-center">
              <Skeleton className="h-9 w-28 rounded-full bg-slate-200" />
              <Skeleton className="h-6 w-24 rounded bg-slate-200" />
            </div>
          </div>
        </section>

        {/* <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={`wishlist-card-skeleton-${index}`}
              className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              <Skeleton className="h-6 w-6 rounded-md bg-slate-200" />

              <Skeleton className="h-16 w-16 rounded-xl bg-slate-200 sm:h-20 sm:w-20" />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded bg-slate-200 sm:h-5" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 rounded bg-slate-200" />
                  <Skeleton className="h-4 w-2 rounded bg-slate-200" />
                  <Skeleton className="h-4 w-12 rounded bg-slate-200" />
                </div>
              </div>

              <Skeleton className="h-9 w-9 rounded-full bg-slate-200" />
            </div>
          ))}
        </div> */}
      </div>
    </main>
  );
}
