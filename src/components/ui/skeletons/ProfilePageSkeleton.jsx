import { Skeleton } from '@/components/ui/skeleton';

// Mirrors src/pages/ProfilePage.jsx. Update both together.
export default function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8fafc] px-3 pb-10 pt-2 sm:px-4 md:px-6" aria-hidden="true">
      <div className="mx-auto max-w-2xl">
        <header className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm sm:px-4">
          <Skeleton className="h-9 w-9 rounded-full bg-slate-200" />
          <Skeleton className="h-5 w-20 rounded-full bg-slate-200" />
        </header>

        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <Skeleton className="mx-auto mb-4 h-20 w-20 rounded-full bg-slate-200 sm:h-24 sm:w-24" />
            <Skeleton className="mx-auto mb-2 h-5 w-36 rounded-full bg-slate-200" />
            <Skeleton className="mx-auto h-4 w-44 rounded-full bg-slate-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="space-y-4 p-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`profile-info-skeleton-${index}`} className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-full bg-slate-200" />
                  <Skeleton className="h-5 w-full rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
