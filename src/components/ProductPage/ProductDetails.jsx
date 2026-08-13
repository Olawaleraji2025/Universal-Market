import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import { useSelector } from "react-redux";
import { TbCurrencyNaira } from "react-icons/tb";
import Button from "../ui/button";
import RequestModal from "./RequestModal";
import SkeletonCard from "../ui/SkeletonLoader";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useShopProducts from "../../Hooks/useShopProducts";
import ErrorModal from '../Layout/ErrorModal.jsx';



export const ProductDetails = () => {
  const { id } = useParams();
  const clickedProduct = useSelector((state) => state.productDetailsClicked?.clickedProduct);
  const { data: products = [], isLoading, isError, isFetching, error, refetch  } = useShopProducts({
    staleTime: 5 * 60 * 1000,
  });

  

  const selectedProduct =
    clickedProduct?.id != null ? clickedProduct : products.find((p) => String(p.id) === String(id));


  const [requestOpen, setRequestOpen] = useState(false);

  if (isLoading && !selectedProduct ) {
    return (
      <section className="px-6 py-10">
        <div className="max-w-6xl m-auto">
          <div className="mb-6">
            <SkeletonCard count={1} />
          </div>
        </div>
      </section>
    );
  }

  if (!selectedProduct && isError) {
    return <div className="min-h-screen flex">
    <ErrorModal
                onRetry={() => refetch()}
                isRetrying={isFetching}
                error={error}
                title="Failed to load products"
                message="We couldn't load the products. Please check your internet connection and try again."
              />;
    
    
    </div>
    
  }

  const activeImage = selectedProduct.imageUrl;

  // Derived fields (handle variations in product shape)
  const categoryName = selectedProduct.Category || selectedProduct.category || selectedProduct.ProductCategory || "";
  const productName = selectedProduct.ProductName || selectedProduct.name || selectedProduct.ProductTitle || "Product";
  const rawPrice = selectedProduct.ProductPrice ?? selectedProduct.price ?? 0;
  const priceDisplay = `₦${Number(rawPrice).toLocaleString('en-NG')}`;
  const conditionRaw = selectedProduct.condition || selectedProduct.Condition || selectedProduct.ProductCondition || selectedProduct.ConditionName || "";
  const description = selectedProduct.ProductDescription || selectedProduct.description || selectedProduct.ProductDetails || "";

  const condition = String(conditionRaw || "").trim();
  const isNewCondition = condition.toLowerCase() === "new" || condition.toLowerCase() === "brand new" || condition.toLowerCase() === "unused";
  const normalizedCondition = isNewCondition ? "NEW" : "USED";

  let conditionClass = "mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] uppercase shadow-sm border ";
  let conditionDotClass = "h-2 w-2 rounded-full ";

  if (isNewCondition) {
    conditionClass += "border-red-100 bg-red-100";
    conditionDotClass += "bg-[#16A34A]";
  } else {
    conditionClass += "border-red-100 bg-red-100 ";
    conditionDotClass += "bg-[#7C3AED]";
  }

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
  // const remainingSpecifications = productSpecs.slice(6);

  return (
    <section className="px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
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
                  <Link to={`/shop?category=${encodeURIComponent(categoryName)}`} className="hover:underline">{categoryName}</Link>
                </li>
              </>
            )}
            <li aria-hidden>›</li>
            <li className="text-gray-700">{productName}</li>
          </ol>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-[4/3] w-full">
                <img
                  src={activeImage}
                  alt={selectedProduct.ProductName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#01241a]">{productName}</h1>
                  <p className="text-xl font-bold text-[#01241a] mt-2">{priceDisplay}</p>
                  <span className={conditionClass} aria-label={`Condition: ${normalizedCondition}`}>
                    <span className={conditionDotClass} aria-hidden="true" />
                    {normalizedCondition}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                </div>
              </div>

              {description && (
                <p className="text-gray-600 leading-relaxed mt-3">{description}</p>
              )}
            </div>

            {/* <p className="text-gray-600 leading-relaxed">{clickedProduct.ProductDescription}</p> */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-[#01241a] mb-3">Key specifications</h3>

              {keySpecifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {keySpecifications.map((spec, idx) => (
                    <div
                      key={`${spec.label}-${idx}`}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                    >
                      <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                        {spec.label}
                      </p>
                      <p className="text-sm font-medium text-[#01241a]">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                  
                </div>
              ) : (
                <p className="text-sm text-gray-500">No specifications available for this product yet.</p>
              )}

              
            </div>

            <div className="space-y-3">
              <Button
                asChild={false}
                className="w-full bg-[#064e3b] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 transition"
                onClick={() => setRequestOpen(true)}
              >
                <Package size={16} /> Request Item
              </Button>

              {requestOpen && (
                <RequestModal
                  open={requestOpen}
                  onClose={() => setRequestOpen(false)}
                  // whatsappMessage={whatsappMessage}
                  // requestWhatsAppNumber={requestWhatsAppNumber}
                />
              )}


              <p className="text-center text-sm text-gray-600">
                Product negotiation continues on WhatsApp.
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

