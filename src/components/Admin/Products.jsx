import { useMemo, useState } from "react";

import Button from "../ui/button";
import { Input } from "../ui/input";

const mockProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro 256GB",
    category: "Phones",
    price: "485,000",
    condition: "Like New",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Samsung QLED 55\" 4K",
    category: "Laptops",
    price: "310,000",
    condition: "Verified",
    status: "Sold",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "MacBook Pro M2 14\"",
    category: "Laptops",
    price: "920,000",
    condition: "Verified",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    category: "Phones",
    price: "240,000",
    condition: "Like New",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
  },
];

import AddProduct from "./AddProduct.jsx";

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  const cls =
    normalized === "available"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold " +
        cls
      }
    >
      {status}
    </span>
  );
}


export default function Products() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(mockProducts.map((p) => p.category)));
    return ["All", ...unique];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return mockProducts.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesCategory = category === "All" || p.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-600 mt-1">Manage inventory.</p>
          </div>

          <Button
            onClick={() => setShowAddProduct(true)}
            className="bg-[#064e3b] text-white hover:bg-emerald-900 transition"
          >
            + Add Product
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Products"
              className="bg-white border-gray-200"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="p-4">
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs font-bold text-gray-600 bg-gray-50">
              <div className="col-span-2">Image</div>
              <div className="col-span-3">Product Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-right">Price</div>
              <div className="col-span-2">Condition</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            <div className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-12 gap-2 px-5 py-4 items-center"
                >
                  <div className="col-span-2">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <p className="font-semibold text-gray-900 truncate">
                      {p.name}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-700">{p.category}</p>
                  </div>

                  <div className="col-span-1 text-right">
                    <p className="text-sm font-semibold text-gray-900">₦{p.price}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-700">{p.condition}</p>
                  </div>

                  <div className="col-span-1">
                    <StatusBadge status={p.status} />
                  </div>

                  <div className="col-span-1">
                    <div className="flex flex-col gap-2">
                      <Button
                        size="xs"
                        variant="secondary"
                        className="w-full"
                        onClick={() => alert(`Edit ${p.name} (mock)`) }
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="destructive"
                        className="w-full"
                        onClick={() => alert(`Delete ${p.name} (mock)`) }
                      >
                        Delete
                      </Button>
                      <Button
                        size="xs"
                        variant="secondary"
                        className="w-full"
                        onClick={() => alert(`${p.status === "Sold" ? "Mark Available" : "Mark Sold"} for ${p.name} (mock)`) }
                      >
                        {p.status === "Sold" ? "Mark Available" : "Mark Sold"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 ? (
                <div className="px-5 py-10">
                  <p className="text-sm text-gray-500">No products found.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="p-4">
          <div className="space-y-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-gray-100 bg-white overflow-hidden"
              >
                <div className="flex gap-3 p-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{p.category}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-sm font-bold text-gray-900">₦{p.price}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      Condition: <span className="font-semibold">{p.condition}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => alert(`Edit ${p.name} (mock)`) }
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() => alert(`Delete ${p.name} (mock)`) }
                    >
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => alert(`${p.status === "Sold" ? "Mark Available" : "Mark Sold"} for ${p.name} (mock)`) }
                    >
                      {p.status === "Sold" ? "Mark Available" : "Mark Sold"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 ? (
              <div className="py-10">
                <p className="text-sm text-gray-500">No products found.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* Add Product Modal */}
      {showAddProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddProduct(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Admin
                  </h2>
                  <p className="text-sm text-gray-600">Add a new product</p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  className="w-[90px]"
                  onClick={() => setShowAddProduct(false)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="p-6">
              <AddProduct
                onCancel={() => setShowAddProduct(false)}
                onSaved={() => setShowAddProduct(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


