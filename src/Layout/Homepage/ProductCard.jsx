import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setClickedProduct } from '../../features/productDetailsClicked';
import {
  selectWishlistIds,
  toggleWishlist as toggleWishlistAction,
} from '../../features/wishlistSlice';
import useShopProducts from '../../Hooks/useShopProducts';
import { TbCurrencyNaira } from 'react-icons/tb';
import { ChevronLeft, ChevronRight, Package, Heart } from 'lucide-react';
import Button from '/src/components/ui/button.jsx';
import SkeletonCard from '../../components/ui/SkeletonLoader';
import ErrorModal from '../../components/ui/ErrorModal.jsx';
import { toast } from 'sonner';

export const ProductCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector(selectWishlistIds);
  const scrollRef = useRef(null);

  const { data: products, isLoading, isError, isFetching, error, refetch } = useShopProducts();

  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = useCallback((productId) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  }, []);

  const handleViewDetails = useCallback(
    (product) => {
      dispatch(setClickedProduct(product));
      navigate(`/product/${product.id}`);
    },
    [dispatch, navigate]
  );

  const toggleWishlist = useCallback((product) => {
    const productId = String(product.id);
    const isSaved = wishlistIds.some((id) => String(id) === productId);

    dispatch(toggleWishlistAction(productId));

    if (isSaved) {
      toast.info(`${product.ProductName} removed from wishlist.`, { id: 'wishlist-toast' });
    } else {
      toast.success(`${product.ProductName} added to wishlist.`, { id: 'wishlist-toast' });
    }
  }, [dispatch, wishlistIds]);

  const scrollProducts = useCallback((direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector('.product-card');
    const cardWidth = card?.getBoundingClientRect().width ?? 240;

    container.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: 'smooth',
    });
  }, []);

  return (
    <section className="px-6 py-16 mx-auto">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[20px] md:text-3xl font-bold text-[#01241a]">Fresh Arrivals</h2>
          <p className="text-[14px] text-gray-500 md:text-lg mt-2">
            Handpicked items that just landed in our shop.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollProducts(-1)}
            aria-label="Scroll products left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollProducts(1)}
            aria-label="Scroll products right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Error state — ErrorModal replaces the skeleton cards */}
        {isError ? (
          <ErrorModal
            onRetry={() => refetch()}
            isRetrying={isFetching}
            error={error}
            title="Failed to load products"
            message="We couldn't load the products. Please check your internet connection and try again."
          />
        ) : isLoading ? (
          <SkeletonCard count={3} />
        ) : (
          products.map((product) => {
            const hasFinishedLoading = loadedImages.has(product.id);

            // ── ONE card shape, always. Only the photo square toggles. ──
            return (
              <div
                key={product.id}
                className="product-card w-50 min-w-50 flex-none bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col h-full"
              >
                <div className="relative aspect-square bg-gray-50">
                  {/* Permanent image — always in the DOM, fenced by THIS div */}
                  <img
                    src={product.imageUrl}
                    alt={product.ProductName}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in ${
                      hasFinishedLoading
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(product.id)}
                  />
                  

                  {/* Skeleton overlay — exists ONLY until image loads, same fence */}
                  {!hasFinishedLoading && (
                    <div className="absolute inset-0">
                      <SkeletonCard count={1} />
                    </div>
                  )}

{hasFinishedLoading && (
                  <button
                    type="button"
                    aria-label={wishlistIds.some((id) => String(id) === String(product.id)) ? `Remove ${product.ProductName} from wishlist` : `Add ${product.ProductName} to wishlist`}
                    aria-pressed={wishlistIds.some((id) => String(id) === String(product.id))}
                    onClick={() => toggleWishlist(product)}
                    className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition hover:scale-105 ${
                      wishlistIds.some((id) => String(id) === String(product.id))
                        ? 'border-red-200 bg-red-50 text-red-500'
                        : 'border-white/80 bg-white/85 text-gray-700 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${wishlistIds.some((id) => String(id) === String(product.id)) ? 'fill-current' : ''}`}
                      strokeWidth={2}
                    />
                  </button>)}

                  
                </div>

                <div className="p-4 flex flex-col grow">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {product.ProductName}
                  </h3>
                  <p className="text-[15px] font-bold text-[#01241a] flex items-center">
                    <TbCurrencyNaira />
                    {product.ProductPrice.toLocaleString()}
                  </p>
                  <span
                    className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      product.ProductStatus === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.ProductStatus}
                  </span>
                  <Button
                    type="button"
                    onClick={() => handleViewDetails(product)}
                    className="mt-4 bg-[#064e3b] text-white w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-900 transition cursor-pointer"
                  >
                    <Package size={16} /> View details
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};