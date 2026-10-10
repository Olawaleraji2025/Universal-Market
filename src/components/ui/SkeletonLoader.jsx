const shimmer = 'animate-pulse rounded-lg bg-slate-200';

function ProductCardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className={`${shimmer} aspect-square w-full rounded-b-none`} />
          <div className="space-y-3 p-4">
            <div className={`${shimmer} h-4 w-3/4`} />
            <div className={`${shimmer} h-4 w-1/3`} />
            <div className={`${shimmer} h-10 w-full`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistCardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className={`${shimmer} h-4 w-16`} />
            <div className={`${shimmer} h-6 w-6 rounded-full`} />
          </div>
          <div className={`${shimmer} mt-4 aspect-square w-full rounded-xl`} />
          <div className={`${shimmer} mt-4 h-4 w-2/3`} />
          <div className={`${shimmer} mt-2 h-4 w-1/2`} />
          <div className="mt-4 flex gap-2">
            <div className={`${shimmer} h-10 flex-1`} />
            <div className={`${shimmer} h-10 w-10`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RequestCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className={`${shimmer} h-4 w-2/3`} />
              <div className={`${shimmer} h-3 w-1/3`} />
              <div className={`${shimmer} h-3 w-1/2`} />
            </div>
            <div className={`${shimmer} h-7 w-20 rounded-full`} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className={`${shimmer} h-10 w-full`} />
            <div className={`${shimmer} h-10 w-full`} />
            <div className={`${shimmer} h-10 w-full`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RequestDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`${shimmer} h-16 w-16 rounded-xl`} />
          <div className="flex-1 space-y-2">
            <div className={`${shimmer} h-5 w-2/3`} />
            <div className={`${shimmer} h-3 w-1/2`} />
            <div className={`${shimmer} h-3 w-1/3`} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <div className={`${shimmer} mx-auto h-10 w-10 rounded-full`} />
              <div className={`${shimmer} mx-auto h-3 w-20`} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className={`${shimmer} h-4 w-32`} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className={`${shimmer} h-12 w-full`} />
          <div className={`${shimmer} h-12 w-full`} />
          <div className={`${shimmer} h-12 w-full`} />
          <div className={`${shimmer} h-12 w-full`} />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonCard({ count = 3, variant = 'product-card' }) {
  switch (variant) {
    case 'wishlist-card':
      return <WishlistCardSkeleton count={count} />;
    case 'request-card':
      return <RequestCardSkeleton count={count} />;
    case 'request-detail':
      return <RequestDetailSkeleton />;
    default:
      return <ProductCardSkeleton count={count} />;
  }
}

