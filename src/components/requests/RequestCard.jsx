import React from 'react';
import { ChevronRight, ShoppingBag } from 'lucide-react';

const statusStyles = {
  Pending: 'text-orange-600 bg-orange-50',
  Confirmed: 'text-emerald-700 bg-emerald-50',
  Completed: 'text-teal-700 bg-emerald-50',
  Cancelled: 'text-red-600 bg-red-50',
};

export default function RequestCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-100 rounded-[14px] p-3 flex items-start gap-3 hover:shadow-sm active:scale-[0.997] transition-transform"
      aria-label={`${item.title} request, status ${item.status}`}
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center">
        {item.isCustom ? (
          <div className="text-emerald-700"><ShoppingBag className="w-6 h-6" /></div>
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 font-semibold">IMG</div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{item.title}</div>
            <div className="text-xs text-gray-500 truncate">{item.specs}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-gray-500">{item.date}</div>
          <div className={`text-xs px-2 py-1 rounded-full ${statusStyles[item.status] || 'text-gray-700 bg-gray-100'}`}>{item.status}</div>
        </div>
      </div>
    </button>
  );
}
