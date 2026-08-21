import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import Button from '../components/ui/button';
import SkeletonCard from '../components/ui/SkeletonLoader';
import SelectedRequestModal from '../components/ui/SelectedRequestModal';
import useShopProducts from '../Hooks/useShopProducts';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectWishlistIds,
  selectSelectedIds,
  selectSelectedCount,
  toggleSelected,
  removeWishlistItem as removeWishlistItemAction,
  selectAll,
  deselectAll,
  clearSelected,
} from '../features/wishlistSlice';
import WishlistHeader from '../Layout/Wishlist/WishlistHeader';
import WishlistEmptyState from '../Layout/Wishlist/WishlistEmptyState';
import WishlistCard from '../Layout/Wishlist/WishlistCard';
import { supabase } from '../supabaseClient';

export default function WishListPage() {
  const navigate = useNavigate();
  const { data: products = [], isLoading, isError, refetch } = useShopProducts();
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectWishlistIds);
  const selectedIds = useSelector(selectSelectedIds);
  const selectedCount = useSelector(selectSelectedCount);
  const allSelected = selectedIds.length > 0 && wishlistIds.length > 0 && selectedIds.length === wishlistIds.length;
  const [showSummary, setShowSummary] = useState(false);

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlistIds.some((id) => String(id) === String(product.id))),
    [products, wishlistIds]
  );

  const selectedProducts = useMemo(
    () => wishlistProducts.filter((p) => selectedIds.includes(String(p.id))),
    [wishlistProducts, selectedIds]
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === wishlistProducts.length) {
      dispatch(deselectAll());
    } else {
      const ids = wishlistProducts.map((p) => String(p.id));
      dispatch(selectAll(ids));
    }
  };

  const handleOpenSummary = () => {
    if (selectedIds.length === 0) return;
    setShowSummary(true);
  };

  const handleConfirmRequest = async ({
    message,
    fullName,
    contact,
    selectedProducts = [],
    mode = 'guest',
  } = {}) => {
    if (!selectedProducts.length) {
      toast.error('Please select at least one product before submitting.');
      return;
    }

    if (mode === 'login') {
      toast.info('Please log in or create an account to continue with your wishlist request.');
      setShowSummary(false);
      return;
    }

    dispatch(clearSelected());
  };

  const handleToggleSelected = (id) => dispatch(toggleSelected(id));
  const handleRemoveWishlistItem = (id) => dispatch(removeWishlistItemAction(id));

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <WishlistHeader count={wishlistProducts.length} selectedCount={selectedCount} allSelected={allSelected} onToggleSelectAll={toggleSelectAll} />

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
          <>
            {/* Desktop/tablet toolbar when selections exist */}
            {selectedCount > 0 && (
              <div className="mb-4 hidden items-center justify-between rounded-lg bg-white p-3 shadow-sm md:flex">
                <div className="text-sm text-gray-700">{selectedCount} selected</div>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" className="h-10 border-gray-200 text-gray-600" onClick={() => dispatch(deselectAll())}>
                    Deselect all
                  </Button>
                  <Button type="button" className="h-10 bg-[#064e3b] text-white" onClick={handleOpenSummary}>
                    Request Selected ({selectedCount})
                  </Button>
                </div>
              </div>
            )}

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wishlistProducts.map((product) => (
                <WishlistCard
                  key={product.id}
                  product={product}
                  selected={selectedIds.includes(String(product.id))}
                  onToggleSelect={handleToggleSelected}
                  onRemove={() => handleRemoveWishlistItem(product.id)}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Mobile sticky action bar */}
            {selectedCount > 0 && (
              <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 bg-white px-4 py-3 shadow-lg md:hidden">
                {/* <div className="flex-1 text-sm font-medium text-gray-800">{selectedCount} selected</div> */}
                <Button type="button" variant="outline" className="h-11 border-gray-200 text-gray-600" onClick={() => dispatch(deselectAll())}>Clear</Button>
                <Button type="button" className="h-11 bg-[#064e3b] text-white" onClick={handleOpenSummary}>Request Selected ({selectedCount})</Button>
              </div>
            )}
          </>
        )}
        <SelectedRequestModal
          open={showSummary}
          onClose={() => setShowSummary(false)}
          selectedProducts={selectedProducts}
          onRemoveItem={(id) => dispatch(toggleSelected(id))}
          onConfirm={handleConfirmRequest}
        />
      </div>
    </main>
  );
}
