import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const WISHLIST_STORAGE_KEY = 'universal-market-wishlist';

const readWishlist = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function useWishlist(products = []) {
  const [wishlistIds, setWishlistIds] = useState(() => readWishlist());
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const syncWishlist = () => setWishlistIds(readWishlist());
    syncWishlist();
    window.addEventListener('storage', syncWishlist);

    return () => window.removeEventListener('storage', syncWishlist);
  }, []);

  const wishlistProducts = useMemo(
    () =>
      products.filter((product) =>
        wishlistIds.some((id) => String(id) === String(product.id))
      ),
    [products, wishlistIds]
  );

  const isSaved = useCallback(
    (productId) => wishlistIds.some((id) => String(id) === String(productId)),
    [wishlistIds]
  );

  const toggleWishlist = useCallback((product) => {
    const productId = String(product.id);
    const next = new Set(wishlistIds.map(String));

    toast.dismiss('wishlist-toast');

    if (next.has(productId)) {
      next.delete(productId);
      setSelectedIds((prev) => prev.filter((id) => String(id) !== productId));
      toast.info(`${product.ProductName} removed from wishlist.`, { id: 'wishlist-toast' });
    } else {
      next.add(productId);
      toast.success(`${product.ProductName} added to wishlist.`, { id: 'wishlist-toast' });
    }

    const updated = [...next];
    setWishlistIds(updated);

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage failures.
    }
  }, [wishlistIds]);

  const removeWishlistItem = useCallback((product) => {
    const productId = String(product.id);
    const updated = wishlistIds.filter((id) => String(id) !== productId);

    toast.dismiss('wishlist-toast');
    toast.info(`${product.ProductName} removed from wishlist.`, { id: 'wishlist-toast' });

    setSelectedIds((prev) => prev.filter((id) => String(id) !== productId));
    setWishlistIds(updated);

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage failures.
    }
  }, [wishlistIds]);

  const toggleSelected = useCallback((productId) => {
    const id = String(productId);
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });
  }, []);

  return {
    wishlistIds,
    wishlistProducts,
    isSaved,
    toggleWishlist,
    removeWishlistItem,
    selectedIds,
    toggleSelected,
    selectedCount: selectedIds.length,
  };
}
