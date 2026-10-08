import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatNaira, formatDisplayDate } from '../lib/requestStatus';

export default function RequestTable({
  requests = [],
  onRowClick,
  page = 1,
  pageSize = 20,
  totalCount = 0,
  totalPages = 1,
  onPageChange,
  isLoading = false,
}) {
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="hidden lg:block bg-white border border-[#e2e8f0] rounded-[14px] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Customer Requests Table">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs font-semibold text-[#475569] uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-6">Date</th>
              <th scope="col" className="py-3.5 px-6">Customer</th>
              <th scope="col" className="py-3.5 px-6">Item</th>
              <th scope="col" className="py-3.5 px-6">Type</th>
              <th scope="col" className="py-3.5 px-6">Amount</th>
              <th scope="col" className="py-3.5 px-6">Status</th>
              <th scope="col" className="py-3.5 pr-6 w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] text-sm text-[#01241a]">
            {requests.map((r) => {
              const isPending = (r.status || '').toLowerCase() === 'pending';
              const formattedDate = formatDisplayDate(r.created_at);

              let amountDisplay = '—';
              if (r.isProduct) {
                amountDisplay = formatNaira(r.ItemPrice) || 'Price on request';
              } else {
                const budgetStr = formatNaira(r.ItemBudget);
                amountDisplay = budgetStr ? `${budgetStr}` : 'No budget';
              }

              return (
                <tr
                  key={r.id}
                  tabIndex={0}
                  onClick={() => onRowClick(r.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRowClick(r.id);
                    }
                  }}
                  className={`group cursor-pointer transition-colors duration-150 focus:outline-none focus:bg-emerald-50/50 ${
                    isPending
                      ? 'bg-amber-50/20 hover:bg-emerald-50/40'
                      : 'hover:bg-slate-50'
                  }`}
                  aria-label={`View request for ${r.ItemName} from ${r.userName}`}
                >
                  {/* Date Column */}
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-[#475569]">
                    {formattedDate}
                  </td>

                  {/* Customer Column */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-medium text-[#01241a]">{r.userName}</div>
                    {r.UserPhoneNumber && (
                      <div className="text-xs text-[#475569]">{r.UserPhoneNumber}</div>
                    )}
                  </td>

                  {/* Item Column */}
                  <td className="py-4 px-6">
                    <span
                      className={`line-clamp-1 ${
                        isPending ? 'font-bold text-[#01241a]' : 'font-medium text-[#01241a]'
                      }`}
                    >
                      {r.ItemName}
                    </span>
                  </td>

                  {/* Type Column */}
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-[#475569]">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        r.isProduct
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {r.typeDisplay}
                    </span>
                  </td>

                  {/* Amount Column */}
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-[#01241a]">
                    {amountDisplay}
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <StatusBadge status={r.status} size="sm" />
                  </td>

                  {/* Chevron Column */}
                  <td className="py-4 pr-6 text-right">
                    <ChevronRight
                      className="w-4 h-4 text-gray-400 group-hover:text-[#047857] transition-transform group-hover:translate-x-0.5 inline-block"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-between text-sm text-[#475569] bg-white">
        <div>
          Showing{' '}
          <span className="font-semibold text-[#01241a]">{startItem}</span> to{' '}
          <span className="font-semibold text-[#01241a]">{endItem}</span> of{' '}
          <span className="font-semibold text-[#01241a]">{totalCount}</span> requests
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="min-h-[38px] px-3.5 py-1.5 inline-flex items-center gap-1 border border-[#e2e8f0] rounded-[10px] bg-white text-sm font-medium text-[#01241a] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="px-2 text-xs font-semibold text-[#475569]">
            Page {page} of {Math.max(1, totalPages)}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="min-h-[38px] px-3.5 py-1.5 inline-flex items-center gap-1 border border-[#e2e8f0] rounded-[10px] bg-white text-sm font-medium text-[#01241a] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
