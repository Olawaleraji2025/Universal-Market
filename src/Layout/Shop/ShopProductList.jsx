import { useMemo, useState } from "react";

import Button from "../../components/ui/button";
import NoProductFound from "../../components/ui/NoProductFound";
import useShopProducts from "../../Hooks/useShopProducts";
import ErrorModal from "../../components/ui/ErrorModal";
import { useSelector, useDispatch } from "react-redux";
import { setClickedProduct } from "../../features/productDetailsClicked";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { clearShopSearchQuery } from "../../features/shopSearchSlice";
import RequestModal from "../../components/ui/CustomRequestModal";
import SkeletonCard from "../../components/ui/SkeletonLoader";
import { Heart } from "lucide-react";

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
  const [requestOpen, setRequestOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = (productId) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  };

    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category') || '';

    const normalizedCategory = category && filters.includes(category) ? category : "All";
  
  const { data: products = [], isLoading, isError, isFetching, error, refetch } = useShopProducts();

  const query = useSelector((state) => state.shopSearch?.query ?? "");

  const effectiveCategory = normalizedCategory;


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
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filters.map((f) => {
              const isActive = f === effectiveCategory;
              return (
                <Button
                  key={f}
                  type="button"
                  onClick={() => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      if (f === "All"){
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
        </div>

        <div className="flex gap-6 overflow-x-auto pb-2">
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
            filteredProducts.map((product) => {
              const hasFinishedLoading = loadedImages.has(product.id);

              return (
                <div
                  key={product.id}
                  className="w-3xs bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col"
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

                    <button
                      type="button"
                      aria-label={`Add ${product.ProductName} to wishlist`}
                      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/85 text-gray-700 shadow-sm backdrop-blur-sm transition hover:scale-105 hover:text-red-500"
                    >
                      <Heart className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col grow">

                    {/* <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {product.Category}
                      </span>
                    </div> */}

                    <h3 className="font-semibold text-gray-800 mb-1 leading-snug">
                      {product.ProductName}
                    </h3>
                    <p className="text-xl font-bold text-[#01241a] flex items-center">
                      ₦{product.ProductPrice.toLocaleString()}
                    </p>

                    <span
                      className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${product.ProductStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.ProductStatus || ""}
                    </span>

                    <Button
                      className="mt-4 bg-[#064e3b] text-white w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-900 transition cursor-pointer"
                      onClick={() => {
                        dispatch(setClickedProduct(product));
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              );
            })
          )}

          {!isLoading && !isError && filteredProducts.length === 0 && (
            <>
              <NoProductFound
                searchQuery={query}
                category={effectiveCategory}
                onRequestCustomItem={() => setRequestOpen(true)}
                onBrowseCategories={() => {
                  // Clear URL category param and clear search query in redux
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
          )}
        </div>
      </div>
    </section>
  );
}

