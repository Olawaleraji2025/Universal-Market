import { useNavigate } from 'react-router-dom';

import Button from '../components/ui/button';
import SkeletonCard from '../components/ui/SkeletonLoader';
import useShopProducts from '../Hooks/useShopProducts';
import useWishlist from '../Hooks/useWishlist';
import WishlistHeader from '../Layout/Wishlist/WishlistHeader';
import WishlistEmptyState from '../Layout/Wishlist/WishlistEmptyState';
import WishlistCard from '../Layout/Wishlist/WishlistCard';

export default function WishListPage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading, isError, refetch } = useShopProducts();
  const { wishlistProducts, removeWishlistItem, selectedIds, toggleSelected, selectedCount } = useWishlist(products);

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <WishlistHeader count={wishlistProducts.length} selectedCount={selectedCount} />

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard count={3} />
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-red-700">Wishlist could not load</p>
            <p className="mt-2 text-sm text-red-600">
              Please check your connection and try again.
            </p>
            <Button
              type="button"
              onClick={() => refetch()}
              className="mt-4 bg-[#064e3b] text-white hover:bg-emerald-900"
            >
              Retry
            </Button>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <WishlistEmptyState onBrowse={() => navigate('/shop')} />
        ) : (
          <div className="space-y-4">
            {wishlistProducts.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                selected={selectedIds.includes(String(product.id))}
                onToggleSelect={toggleSelected}
                onRemove={removeWishlistItem}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
