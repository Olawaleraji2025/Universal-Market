import { Heart, ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/button';

export default function WishlistEmptyState({ onBrowse }) {
  return (
    <section className="rounded-[28px] border border-dashed border-emerald-200 bg-white p-8 text-center shadow-sm md:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <Heart className="h-9 w-9" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-[#01241a]">Your wishlist is empty</h2>
      <p className="mt-3 text-sm text-gray-500 md:text-base">
        Save items you like and keep them here for your next purchase.
      </p>
      <Button
        type="button"
        onClick={onBrowse}
        className="mt-6 bg-[#064e3b] text-white hover:bg-emerald-900"
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Browse products
      </Button>
    </section>
  );
}
