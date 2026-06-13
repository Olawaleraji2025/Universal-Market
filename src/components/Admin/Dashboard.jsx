import { useMemo } from "react";

const StatCard = ({ title, value, trend }) => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-600">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {trend ? (
        <div
          className={
            "text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap " +
            trend.className
          }
        >
          {trend.text}
        </div>
      ) : null}
    </div>
  </div>
);

const StatusPill = ({ status }) => {
  const normalized = (status || "").toLowerCase();
  const map = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-rose-100 text-rose-800 border-rose-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    available: "bg-emerald-100 text-emerald-800 border-emerald-200",
    sold: "bg-gray-100 text-gray-800 border-gray-200",
    new: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const cls = map[normalized] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span
      className={
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border " +
        cls
      }
    >
      {status}
    </span>
  );
};

export default function Dashboard() {
  const stats = useMemo(
    () => [
      {
        title: "Total Products",
        value: 128,
        trend: { text: "+12% this month", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
      },
      {
        title: "Available Products",
        value: 86,
        trend: { text: "In stock", className: "bg-blue-50 text-blue-700 border-blue-100" },
      },
      {
        title: "Sold Products",
        value: 42,
        trend: { text: "Strong demand", className: "bg-gray-50 text-gray-700 border-gray-100" },
      },
      {
        title: "New Requests",
        value: 17,
        trend: { text: "Awaiting review", className: "bg-yellow-50 text-yellow-700 border-yellow-100" },
      },
    ],
    []
  );

  const recentRequests = useMemo(
    () => [
      {
        id: 1,
        customerName: "Adeyemi Collins",
        requestedProduct: "iPhone 13 Pro 256GB",
        date: "2026-06-03",
        status: "Pending",
      },
      {
        id: 2,
        customerName: "Fatima Musa",
        requestedProduct: "Sony WH-1000XM5",
        date: "2026-06-01",
        status: "Approved",
      },
      {
        id: 3,
        customerName: "John Okafor",
        requestedProduct: "MacBook Pro M2 14\"",
        date: "2026-05-30",
        status: "Processing",
      },
      {
        id: 4,
        customerName: "Ngozi Eze",
        requestedProduct: "Samsung QLED 55\" 4K",
        date: "2026-05-28",
        status: "Rejected",
      },
    ],
    []
  );

  const recentProducts = useMemo(
    () => [
      {
        id: 101,
        name: "iPhone 13 Pro 256GB",
        status: "Available",
        image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: 102,
        name: "Samsung QLED 55\" 4K",
        status: "Sold",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: 103,
        name: "MacBook Pro M2 14\"",
        status: "Available",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: 104,
        name: "Sony WH-1000XM5",
        status: "New",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
      },
    ],
    []
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Quick overview of inventory and customer activity.
            </p>
          </div>
          <div className="text-xs text-gray-500">Last updated: just now</div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} trend={s.trend} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Requests */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Recent Requests</h2>
                <p className="text-sm text-gray-600 mt-1">Track customer product requests.</p>
              </div>

              <div className="p-2">
                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-xs font-bold text-gray-600">
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-4">Requested Product</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Status</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {recentRequests.map((r) => (
                    <div
                      key={r.id}
                      className="grid grid-cols-12 gap-2 px-4 py-4 sm:py-3 items-center"
                    >
                      <div className="col-span-12 sm:col-span-3">
                        <p className="font-semibold text-gray-900">{r.customerName}</p>
                      </div>
                      <div className="col-span-12 sm:col-span-4">
                        <p className="text-sm text-gray-700 truncate">{r.requestedProduct}</p>
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <p className="text-sm text-gray-600">{r.date}</p>
                      </div>
                      <div className="col-span-6 sm:col-span-3 flex justify-end sm:justify-start">
                        <StatusPill status={r.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Products */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Recent Products</h2>
                <p className="text-sm text-gray-600 mt-1">Latest inventory updates.</p>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {recentProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                        <div className="mt-1">
                          <StatusPill status={p.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

