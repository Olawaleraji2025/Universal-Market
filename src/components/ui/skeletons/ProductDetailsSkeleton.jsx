import { Skeleton } from '@/components/ui/skeleton';

// Mirrors src/Layout/ProductPage/ProductDetails.jsx. Update both together.
export default function ProductDetailsSkeleton() {
  return (
    <section className="px-6 py-10" aria-hidden="true">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500" aria-hidden="true">
          <Skeleton className="h-4 w-12 rounded bg-slate-200" />
          <Skeleton className="h-4 w-3 rounded bg-slate-200" />
          <Skeleton className="h-4 w-12 rounded bg-slate-200" />
          <Skeleton className="h-4 w-3 rounded bg-slate-200" />
          <Skeleton className="h-4 w-24 rounded bg-slate-200" />
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="mx-auto block w-full max-w-[420px] space-y-3 md:max-w-full">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl bg-slate-200" />
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={`product-gallery-thumb-${index}`}
                  className="h-16 w-16 rounded-lg bg-slate-200"
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <Skeleton className="h-9 w-4/5 rounded bg-slate-200" />
              <Skeleton className="h-8 w-28 rounded bg-slate-200" />
              <Skeleton className="h-4 w-32 rounded bg-slate-200" />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <Skeleton className="h-3 w-24 rounded bg-slate-200" />
              <Skeleton className="mt-2 h-5 w-40 rounded bg-slate-200" />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <Skeleton className="h-4 w-28 rounded bg-slate-200" />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={`product-spec-${index}`}
                    className="h-10 w-full rounded-xl bg-slate-200"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-32 rounded bg-slate-200" />
              <Skeleton className="h-4 w-full rounded bg-slate-200" />
              <Skeleton className="h-4 w-11/12 rounded bg-slate-200" />
              <Skeleton className="h-4 w-10/12 rounded bg-slate-200" />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <Skeleton className="h-11 w-full rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
