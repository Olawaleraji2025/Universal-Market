import { useMemo, useState } from "react";

import Button from "../ui/button";

const products = [
  {
    id: 1,
    name: "iPhone 13 Pro 256GB",
    price: "485,000",
    image:
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400",
    category: "Phones",
    tag: "Like New",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    name: "Samsung QLED 55\" 4K",
    price: "310,000",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1-a4bb92f829d1?auto=format&fit=crop&q=80&w=400",
    category: "Laptops",
    tag: "Verified",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "MacBook Pro M2 14\"",
    price: "920,000",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
    category: "Laptops",
    tag: "Verified",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    price: "240,000",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    category: "Phones",
    tag: "Like New",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
];

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
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    return products.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filters.map((f) => {
              const isActive = f === activeFilter;
              return (
                <button
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
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[260px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col"
            >
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span
                  className={
                    "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase " +
                    product.tagColor
                  }
                >
                  {product.tag}
                </span>
              </div>

              <div className="p-4 flex flex-col grow">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-[#01241a] mb-4">₦{product.price}</p>

                <Button className="mt-auto bg-[#064e3b] text-white w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-900 transition cursor-pointer">
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

