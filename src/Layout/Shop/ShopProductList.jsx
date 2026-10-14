import { useMemo, useState, useCallback, useRef, useEffect } from "react";

import Button from "../../components/ui/button";
import Pagination from "../../components/ui/Pagination";
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
import ShopProductListSkeleton from "../../components/ui/skeletons/ShopProductListSkeleton";
import { Heart, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import { toast } from "sonner";

const filters = [
  "All",
  "Phones",
  "Laptops",
  "Gadgets",
  "Audio & Studio Equipment",
  "Home Appliances",
  "Real Estate",
  "Cars & Motorcycles",
  "Others"
];

const ROW_SIZE = 10;
const ROWS_PER_PAGE = 2;
const PAGE_SIZE = ROW_SIZE * ROWS_PER_PAGE;

const clampPage = (page, totalPages) => {
  const numericPage = Number.isFinite(page) ? page : 1;
  return Math.min(Math.max(1, numericPage), Math.max(1, totalPages));
};

function ProductRow({
  rowNumber,
  products,
  rowRef,
  loadedImages,
  wishlistIds,
  toggleWishlist,
  onNavigateToProduct,
  handleImageLoad,
}) {
  const localRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = localRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScroll = Math.max(container.scrollWidth - container.clientWidth, 0);
    if (maxScroll <= 1) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(container.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const container = localRef.current;
    if (!container) return;

    const handleScroll = () => updateScrollState();
    const handleResize = () => updateScrollState();

    updateScrollState();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateScrollState, products.length]);

  const scrollRow = useCallback((direction) => {
    const container = localRef.current;
    if (!container) return;

    const card = container.querySelector('.shop-product-card');
    const cardWidth = card?.getBoundingClientRect().width ?? 240;
    container.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  }, []);

  return (
    <div className="mb-4">
      <div className="mb-3 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollRow(-1)}
          aria-label={`Scroll row ${rowNumber} left`}
          disabled={!canScrollLeft}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => scrollRow(1)}
          aria-label={`Scroll row ${rowNumber} right`}
          disabled={!canScrollRight}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={(node) => {
          localRef.current = node;
          if (rowRef) rowRef(node);
        }}
        className="flex gap-4 overflow-x-auto pb-3 scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const hasFinishedLoading = loadedImages.has(product.id);
          const isSold = Boolean(product?.isSold ?? false);
          const badgeText = product?.condition || product?.ProductStatus || 'USED';
          const badgeClass = badgeText === 'NEW'
            ? 'bg-emerald-100 text-emerald-800'
            : badgeText === 'FAIRLY USED'
              ? 'bg-amber-100 text-amber-800'
              : badgeText === 'SOLD'
                ? 'bg-slate-200 text-slate-700'
                : 'bg-violet-100 text-violet-800';

          return (
            <div
              key={product.id}
              className={`shop-product-card w-40 min-w-40 flex-none bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition flex flex-col ${isSold ? 'opacity-60 hover:shadow-none' : 'hover:shadow-lg'}`}
            >
              <div className="relative aspect-square bg-gray-50">
                <img
                  src={product.imageUrl}
                  alt={product.ProductName}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in ${hasFinishedLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(product.id)}
                />

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
                <p className="text-[15px] font-bold text-[#01241a] flex items-center">
                  <TbCurrencyNaira />
                  {product.ProductPrice.toLocaleString()}
                </p>

                <span
                  className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${badgeClass}`}
                >
                  {badgeText}
                </span>

                <Button
                  type="button"
                  disabled={isSold}
                  className={`mt-4 w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${
                    isSold
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#064e3b] text-white hover:bg-emerald-900 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (isSold) return;
                    onNavigateToProduct(product);
                  }}
                >
                  <Package size={16} /> {isSold ? 'Sold' : 'View details'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ShopProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistIds = useSelector(selectWishlistIds);
  const [requestOpen, setRequestOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const rowRefs = useRef([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const normalizedCategory = category && filters.includes(category) ? category : 'All';
  const query = useSelector((state) => state.shopSearch?.query ?? "");

  const { data: products = [], isLoading, isError, isFetching, error, refetch } = useShopProducts();

  const filteredProducts = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    let result = products;

    if (normalizedCategory !== 'All') {
      result = result.filter((p) => p.Category === normalizedCategory);
    }

    if (!q) return result;

    return result.filter((p) => {
      const name = String(p.ProductName ?? '').toLowerCase();
      const categoryName = String(p.Category ?? '').toLowerCase();
      const status = String(p.ProductStatus ?? '').toLowerCase();
      return name.includes(q) || categoryName.includes(q) || status.includes(q);
    });
  }, [normalizedCategory, products, query]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  }, [filteredProducts.length]);

  const pageParam = searchParams.get('page');
  const parsedPage = Number(pageParam);
  const page = clampPage(Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1, totalPages);

  useEffect(() => {
    if (pageParam === null) return;

    const nextPage = Number(pageParam);
    if (!Number.isFinite(nextPage) || nextPage <= 0) {
      const next = new URLSearchParams(searchParams);
      next.delete('page');
      setSearchParams(next, { replace: true });
      return;
    }

    const clamped = clampPage(nextPage, totalPages);
    if (clamped !== nextPage) {
      const next = new URLSearchParams(searchParams);
      if (clamped <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(clamped));
      }
      setSearchParams(next, { replace: true });
    }
  }, [pageParam, searchParams, setSearchParams, totalPages]);

  const resetPageKeyRef = useRef(`${normalizedCategory}|${query}`);
  useEffect(() => {
    const key = `${normalizedCategory}|${query}`;
    if (resetPageKeyRef.current === key) return;

    resetPageKeyRef.current = key;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('page');
      return next;
    }, { replace: true });
  }, [normalizedCategory, query, setSearchParams]);

  const changePage = useCallback((nextPage) => {
    const safePage = clampPage(nextPage, totalPages);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (safePage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(safePage));
      }
      return next;
    });
  }, [setSearchParams, totalPages]);

  const pageItems = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, page]);

  const rowOne = useMemo(() => pageItems.slice(0, ROW_SIZE), [pageItems]);
  const rowTwo = useMemo(() => pageItems.slice(ROW_SIZE, PAGE_SIZE), [pageItems]);

  useEffect(() => {
    rowRefs.current.forEach((node) => {
      if (node) {
        node.scrollLeft = 0;
      }
    });
  }, [page]);

  const handleImageLoad = useCallback((productId) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  }, []);

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

  const handleNavigateToProduct = useCallback((product) => {
    dispatch(setClickedProduct(product));
    navigate(`/product/${product.id}`);
  }, [dispatch, navigate]);

  const displayStart = filteredProducts.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const displayEnd = filteredProducts.length ? Math.min(page * PAGE_SIZE, filteredProducts.length) : 0;

  return (
    <section className="px-6 py-10" aria-busy={isLoading}>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: 'none' }}>
          {filters.map((f) => {
            const isActive = f === normalizedCategory;
            return (
              <Button
                key={f}
                type="button"
                onClick={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    if (f === 'All') {
                      next.delete('category');
                    } else {
                      next.set('category', f);
                    }
                    next.delete('page');
                    return next;
                  });
                }}
                className={
                  'whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold transition ' +
                  (isActive
                    ? 'bg-[#064e3b] border-[#064e3b] text-white'
                    : 'bg-white border-gray-200 text-[#01241a] hover:bg-gray-50')
                }
              >
                {f}
              </Button>
            );
          })}
        </div>

        {isError ? (
          <ErrorModal
            onRetry={() => refetch()}
            isRetrying={isFetching}
            error={error}
            title="Failed to load products"
            message="We couldn't load the products. Please check your internet connection and try again."
          />
        ) : isLoading ? (
          <ShopProductListSkeleton count={5} />
        ) : filteredProducts.length === 0 ? (
          <>
            <NoProductFound
              searchQuery={query}
              category={normalizedCategory}
              onRequestCustomItem={() => setRequestOpen(true)}
              onBrowseCategories={() => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete('category');
                  next.delete('page');
                  return next;
                }, { replace: true });
                dispatch(clearShopSearchQuery());
              }}
            />
            <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} initialItemName={query} />
          </>
        ) : (
          <>
            <div className="mb-3 text-sm font-medium text-[#01241a]">
              Showing {displayStart}–{displayEnd} of {filteredProducts.length} products
            </div>

            <div className="space-y-4">
              {rowOne.length > 0 && (
                <ProductRow
                  rowNumber={1}
                  products={rowOne}
                  rowRef={(node) => {
                    rowRefs.current[0] = node ?? null;
                  }}
                  loadedImages={loadedImages}
                  wishlistIds={wishlistIds}
                  toggleWishlist={toggleWishlist}
                  onNavigateToProduct={handleNavigateToProduct}
                  handleImageLoad={handleImageLoad}
                />
              )}

              {rowTwo.length > 0 && (
                <ProductRow
                  rowNumber={2}
                  products={rowTwo}
                  rowRef={(node) => {
                    rowRefs.current[1] = node ?? null;
                  }}
                  loadedImages={loadedImages}
                  wishlistIds={wishlistIds}
                  toggleWishlist={toggleWishlist}
                  onNavigateToProduct={handleNavigateToProduct}
                  handleImageLoad={handleImageLoad}
                />
              )}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
          </>
        )}
      </div>
    </section>
  );
}

