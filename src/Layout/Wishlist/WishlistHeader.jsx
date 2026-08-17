import { Heart } from 'lucide-react';

export default function WishlistHeader({ count, selectedCount = 0 }) {
  return (
    <section className="mb-8 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm md:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#01241a] md:text-4xl">My Wishlist</h1>
          <p className="mt-2 max-w-xl text-sm text-gray-600 md:text-base">
            Save products you're interested in and request them whenever you're ready.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 sm:self-auto">
          <Heart className="h-4 w-4 fill-current" />
          <span>{count} Item{count === 1 ? '' : 's'}</span>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          {selectedCount} selected
        </div>
      )}
    </section>
  );
}
