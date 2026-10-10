import { useState } from "react";
import { Package, Heart, MapPin, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/button";
import RequestModal from "./ProductRequestModal";
import ProductDetailsSkeleton from "../../components/ui/skeletons/ProductDetailsSkeleton";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useShopProducts from "../../Hooks/useShopProducts";
import ErrorModal from '../../components/ui/ErrorModal.jsx';
import { selectWishlistIds, toggleWishlist as toggleWishlistAction } from '../../features/wishlistSlice';
import { toast } from 'sonner';
import ProductImageGallery from '../../components/ui/ProductImageGallery';

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const getFirstMeaningfulValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];
    const text = normalizeText(value);
    if (text) return text;
  }

  return "";
};

const parseExtraDetails = (value) => {
  if (value === null || value === undefined || value === "") return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parseExtraDetails(parsed);
      } catch {
        // fall through to text parsing
      }
    }

    return trimmed
      .split(/[\n|;•]+|\s*\|\s*|\s*,\s*/)
      .map((item) => item.replace(/^[•\s-]+/, "").trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  return [];
};



export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const clickedProduct = useSelector((state) => state.productDetailsClicked?.clickedProduct);
  const wishlistIds = useSelector(selectWishlistIds);
  const { data: products = [], isLoading, isError, isFetching, error, refetch  } = useShopProducts({
    staleTime: 5 * 60 * 1000,
  });

  const selectedProduct =
    clickedProduct?.id != null ? clickedProduct : products.find((p) => String(p.id) === String(id));

  const [requestOpen, setRequestOpen] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const isWishlisted = selectedProduct ? wishlistIds.some((itemId) => String(itemId) === String(selectedProduct.id)) : false;

  const handleToggleWishlist = () => {
    if (!selectedProduct) return;

    const productId = String(selectedProduct.id);
    const willSave = !wishlistIds.some((itemId) => String(itemId) === productId);

    dispatch(toggleWishlistAction(productId));

    if (willSave) {
      toast.success(`${selectedProduct.ProductName || 'Product'} added to wishlist.`, { id: 'wishlist-toast' });
    } else {
      toast.info(`${selectedProduct.ProductName || 'Product'} removed from wishlist.`, { id: 'wishlist-toast' });
    }
  };

  if (isLoading && !selectedProduct ) {
    return <ProductDetailsSkeleton />;
  }

  if (!selectedProduct && isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <ErrorModal
          onRetry={() => refetch()}
          isRetrying={isFetching}
          error={error}
          title="Failed to load products"
          message="We couldn't load the products. Please check your internet connection and try again."
        />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <section className="px-6 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#01241a]">Product not found</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            The product you're looking for may have been removed or is no longer available.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#064e3b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  // Build the gallery image array.
  // Today products have a single `imageUrl` from Supabase storage.
  // If a product ever gains an `images` array field, it will be used instead.
  const galleryImages = (() => {
    if (Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0) {
      return selectedProduct.images.filter(Boolean);
    }
    if (selectedProduct.imageUrl) return [selectedProduct.imageUrl];
    return [];
  })();

  // Derived fields (handle variations in product shape)
  const categoryName = getFirstMeaningfulValue(selectedProduct, ['Category', 'category', 'ProductCategory']) || "";
  const productName = getFirstMeaningfulValue(selectedProduct, ['ProductName', 'name', 'ProductTitle']) || "Product";
  const rawPrice = selectedProduct.ProductPrice ?? selectedProduct.price ?? 0;
  const priceDisplay = `₦${Number(rawPrice).toLocaleString('en-NG')}`;
  const productStatus = getFirstMeaningfulValue(selectedProduct, ['ProductStatus', 'status']) || "";
  const rawAvailability = getFirstMeaningfulValue(selectedProduct, ['Availabilty', 'availability', 'Availability']) || "";
  const isSold = String(rawAvailability || '').trim().toUpperCase() === 'SOLD';
  const statusClass = productStatus?.toUpperCase() === 'NEW'
    ? 'bg-emerald-100 text-emerald-800'
    : productStatus?.toUpperCase() === 'FAIRLY USED'
      ? 'bg-amber-100 text-amber-800'
      : productStatus?.toUpperCase() === 'SOLD'
        ? 'bg-slate-200 text-slate-700'
        : 'bg-violet-100 text-violet-800';
  const description = getFirstMeaningfulValue(selectedProduct, ['ProductDescription', 'description', 'ProductDetails']) || "";
  const productCondition = getFirstMeaningfulValue(selectedProduct, ['ProductCondition', 'condition', 'Condition']) || "";
  const conditionBadge = productCondition || productStatus || 'USED';
  const locationValue = getFirstMeaningfulValue(selectedProduct, ['Location', 'location', 'ProductLocation', 'City', 'State', 'PickupLocation']) || "";
  const extraDetails = parseExtraDetails(
    getFirstMeaningfulValue(selectedProduct, ['ExtraDetails', 'extraDetails', 'Extra_Details', 'extra_details', 'ProductExtraDetails']) || ""
  );

  const specSource = selectedProduct.ProductSpecifications ?? null;

  const productSpecs = (() => {
    if (!specSource || typeof specSource !== "object" || Array.isArray(specSource)) {
      return [];
    }

    return Object.entries(specSource)
      .filter(([rawKey, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "object") return false;
        if (String(rawKey).trim() === "") return false;
        return String(value).trim() !== "";
      })
      .map(([rawKey, value]) => {
        const label = String(rawKey)
          .replace(/^\d+\.\s*/, "")
          .replace(/^\d+\s*[-:]\s*/, "")
          .replace(/\s+/g, " ")
          .trim();

        return {
          label: label || "Details",
          value: String(value).trim(),
        };
      });
  })();

  const keySpecifications = productSpecs;
  const visibleSpecs = showAllSpecs ? keySpecifications : keySpecifications.slice(0, 6);
  const visibleExtraDetails = showAllDetails ? extraDetails : extraDetails.slice(0, 3);

  return (
    <section className="px-6 py-10" aria-busy={isLoading}>
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link to="/shop" className="hover:underline">Shop</Link>
            </li>
            {categoryName && (
              <>
                <li aria-hidden>›</li>
                <li>
                  <Link to={`/shop?category=${encodeURIComponent(categoryName)}`} className="hover:underline text-[13px]">{categoryName}</Link>
                </li>
              </>
            )}
            <li aria-hidden>›</li>
            <li className="text-gray-700">{productName}</li>
          </ol>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="space-y-4 block my-0 mx-auto w-full max-w-105 lg:max-w-full">
            <ProductImageGallery images={galleryImages} alt={productName} />
          </div>

          <div className="space-y-5">
            <div>
              <h1 className="wrap-break-word text-3xl font-bold text-[#01241a] leading-tight">{productName}</h1>
              <p className="mt-2 text-xl font-bold text-[#01241a]">{priceDisplay}</p>

              {/* {conditionBadge && (
                <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusClass}`}>
                  {conditionBadge}
                </span>
              )} */}

              {(productCondition || conditionBadge) && (
                <p className="mt-3 text-sm font-medium text-gray-700">
                  Condition: <span className="text-[#01241a]">{productCondition || conditionBadge}</span>
                </p>
              )}
            </div>

            {locationValue && (
              <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Location</span>
                </div>
                <p className="mt-1 wrap-break-word text-sm font-medium text-[#01241a]">{locationValue}</p>
              </div>
            )}

            {extraDetails.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Extra details</span>
                </div>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {visibleExtraDetails.map((detail, idx) => (
                    <li key={`${detail}-${idx}`} className="wrap-break-word leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>

                {extraDetails.length > 3 && (
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#064e3b] transition hover:text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    onClick={() => setShowAllDetails((prev) => !prev)}
                    aria-expanded={showAllDetails}
                  >
                    {showAllDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {showAllDetails ? 'Show less' : 'View more'}
                  </button>
                )}
              </div>
            )}

             {description && (
              <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Condition</p>
                <p className="mt-2 wrap-break-word text-sm leading-relaxed text-[#01241a] font-semibold">{description}</p>
              </div>
            )}

            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h3 className="font-semibold text-[#01241a]">Key specifications</h3>

              {visibleSpecs.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {visibleSpecs.map((spec, idx) => (
                    <div
                      key={`${spec.label}-${idx}`}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                        {spec.label}
                      </p>
                      <p className="mt-1 wrap-break-word text-sm font-medium text-[#01241a]">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No specifications available for this product yet.</p>
              )}

              {keySpecifications.length > 6 && (
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-[#064e3b] transition hover:text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  onClick={() => setShowAllSpecs((prev) => !prev)}
                  aria-expanded={showAllSpecs}
                >
                  {showAllSpecs ? 'Show less specifications' : 'View all specifications'}
                </button>
              )}
            </div>

           

            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  asChild={false}
                  className="w-full bg-[#064e3b] py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:max-w-42"
                  onClick={() => setRequestOpen(true)}
                >
                  <Package size={16} className="mr-2" /> Request Item
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className={`w-full border py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:max-w-42 ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-200 bg-white text-[#01241a] hover:bg-gray-50'
                  } ${isSold ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => { if (isSold) return; handleToggleWishlist(); }}
                  disabled={isSold}
                  aria-disabled={isSold}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={2} />
                  {isSold ? 'Sold' : (isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist')}
                </Button>
              </div>

              {requestOpen && (
                <RequestModal
                  open={requestOpen}
                  onClose={() => setRequestOpen(false)}
                />
              )}
            </div>

            <p className="text-center text-sm text-gray-600">Product negotiation continues on WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

