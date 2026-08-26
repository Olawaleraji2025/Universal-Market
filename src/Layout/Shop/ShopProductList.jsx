import { useMemo, useState, useCallback, useRef } from "react";

import Button from "../../components/ui/button";
import NoProductFound from "../../components/ui/NoProductFound";
import useShopProducts from "../../Hooks/useShopProducts";
import ErrorModal from "../../components/ui/ErrorModal";
import { useSelector, useDispatch } from "react-redux";
import { setClickedProduct } from "../../features/productDetailsClicked";
import { selectWishlistIds, toggleWishlist as toggleWishlistAction } from "../../features/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { clearShopSearchQuery } from "../../features/shopSearchSlice";
import RequestModal from "../../components/ui/CustomRequestModal";
import SkeletonCard from "../../components/ui/SkeletonLoader";
import { Heart, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import { toast } from "sonner";

const filters = [
  "All",
  "Phones",
  "Laptops",
  "TVs",
  "Refrigerators",
  "Gaming Consoles",
  "Appliances",
];

export default function ShopProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector(selectWishlistIds);
  const [requestOpen, setRequestOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const scrollRef = useRef(null);

  const scrollProducts = useCallback((direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.querySelector('.shop-product-card');
    const cardWidth = card?.getBoundingClientRect().width ?? 240;
    container.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  }, []);

  const handleImageLoad = useCallback((productId) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';

  const normalizedCategory = category && filters.includes(category) ? category : "All";

  const { data: products = [], isLoading, isError, isFetching, error, refetch } = useShopProducts();

  const query = useSelector((state) => state.shopSearch?.query ?? "");

  const effectiveCategory = normalizedCategory;

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


  const filteredProducts = useMemo(() => {
    const q = (query || "").trim().toLowerCase();

    let result = products;

    if (effectiveCategory !== "All") {
      result = result.filter((p) => p.Category === effectiveCategory);
    }


    if (!q) return result;


    return result.filter((p) => {
      const name = String(p.ProductName ?? "").toLowerCase();
      const category = String(p.Category ?? "").toLowerCase();
      const status = String(p.ProductStatus ?? "").toLowerCase();
      return name.includes(q) || category.includes(q) || status.includes(q);
    });
  }, [products, query, effectiveCategory]);

  // Render flow handled below: show ErrorModal on error, skeleton while loading,
  // otherwise render products with per-image skeleton overlays.

  return (
    <section className="px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* ── Header: filter pills ── */}
        <div className="flex gap-3 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: 'none' }}>
          {filters.map((f) => {
            const isActive = f === effectiveCategory;
            return (
              <Button
                key={f}
                type="button"
                onClick={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    if (f === "All") {
                      next.delete("category");
                    } else next.set("category", f);
                    return next;
                  });
                }}
                className={
                  "whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold transition " +
                  (isActive
                    ? "bg-[#064e3b] border-[#064e3b] text-white"
                    : "bg-white border-gray-200 text-[#01241a] hover:bg-gray-50")
                }
              >
                {f}
              </Button>
            );
          })}
        </div>

        {/* ── Carousel rail ── */}
        {isError ? (
          <ErrorModal
            onRetry={() => refetch()}
            isRetrying={isFetching}
            error={error}
            title="Failed to load products"
            message="We couldn't load the products. Please check your internet connection and try again."
          />
        ) : isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <SkeletonCard count={3} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <>
            <NoProductFound
              searchQuery={query}
              category={effectiveCategory}
              onRequestCustomItem={() => setRequestOpen(true)}
              onBrowseCategories={() => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete('category');
                  return next;
                });
                dispatch(clearShopSearchQuery());
              }}
            />
            <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} initialItemName={query} />
          </>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.map((product) => {
              const hasFinishedLoading = loadedImages.has(product.id);

              return (
                <div
                  key={product.id}
                  className="shop-product-card w-50 min-w-50 flex-none bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <img
                      src={product.imageUrl}
                      alt={product.ProductName}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in ${hasFinishedLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(product.id)}
                    />

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
                      </button>
                    )}
                  </div>

                  <div className="p-4 flex flex-col grow">
                    <h3 className="font-semibold text-gray-800 mb-1 leading-snug">
                      {product.ProductName}
                    </h3>
                    <p className="text-xl font-bold text-[#01241a] flex items-center">
                      <TbCurrencyNaira />
                      {product.ProductPrice.toLocaleString()}
                    </p>

                    <span
                      className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${product.ProductStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.ProductStatus || ""}
                    </span>

                    <Button
                      type="button"
                      className="mt-4 bg-[#064e3b] text-white w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-900 transition cursor-pointer"
                      onClick={() => {
                        dispatch(setClickedProduct(product));
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      <Package size={16} /> View details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Centered scroll nav below the carousel ── */}
        {!isError && !isLoading && filteredProducts.length > 0 && (
          <div className="flex justify-center items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => scrollProducts(-1)}
              aria-label="Scroll products left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollProducts(1)}
              aria-label="Scroll products right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

