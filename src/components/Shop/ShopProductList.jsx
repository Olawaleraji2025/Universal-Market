import { useMemo, useState } from "react";
import Button from "../ui/button";
import useShopProducts from "../../Hooks/useShopProducts";
import { useSelector, useDispatch } from "react-redux";
import { setClickedProduct } from "../../features/shop/productDetailsClicked";
import { useNavigate } from "react-router-dom";

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
  
  const { data: products = [], isLoading, error } = useShopProducts();

  const [activeFilter, setActiveFilter] = useState("All");
  const query = useSelector((state) => state.shopSearch?.query ?? "");

  const filteredProducts = useMemo(() => {
    const q = (query || "").trim().toLowerCase();

    let result = products;

    if (activeFilter !== "All") {
      result = result.filter((p) => p.Category === activeFilter);
    }

    if (!q) return result;

    return result.filter((p) => {
      const name = String(p.ProductName ?? "").toLowerCase();
      const category = String(p.Category ?? "").toLowerCase();
      const status = String(p.ProductStatus ?? "").toLowerCase();
      return name.includes(q) || category.includes(q) || status.includes(q);
    });
  }, [activeFilter, products, query]);

  if (isLoading) return <p>Loading the shop...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filters.map((f) => {
              const isActive = f === activeFilter;
              return (
                <Button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="w-3xs bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col"
            >
              <div className="relative aspect-square">
                <img
                  src={product.imageUrl}
                  alt={product.ProductName}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.ProductStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {product.ProductStatus || ""}
                </span>
              </div>

              

              <div className="p-4 flex flex-col grow">

                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {product.Category}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-800 mb-1 leading-snug">
                  {product.ProductName}
                </h3>
                <p className="text-xl font-bold text-[#01241a] mb-4">
                  ₦{product.ProductPrice.toLocaleString()}
                </p>


                <Button
                  className="mt-auto bg-[#064e3b] text-white w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-900 transition cursor-pointer"
                  onClick={() => {
                    dispatch(setClickedProduct(product));
                    navigate('/product');
                  }}
                >
                  View details
                </Button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-gray-500">No products found.</div>
          )}
        </div>
      </div>
    </section>
  );
}

