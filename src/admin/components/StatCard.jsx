import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { formatNumber } from '../lib/requestStatus';

/**
 * StatCard
 * @param {string} label - Card label, e.g. "Pending requests", "Confirmed"
 * @param {number|string} value - Big stat number
 * @param {string} caption - Helper caption, e.g. "Need a reply", "In progress"
 * @param {string} to - Destination link
 * @param {boolean} isPendingHighlight - If true, displays the number in orange (#9a3412)
 * @param {boolean} isError - If stats failed to load
 * @param {function} onRetry - Retry callback if isError
 */
export default function StatCard({
  label,
  value,
  caption,
  to,
  isPendingHighlight = false,
  isError = false,
  onRetry,
}) {
  return (
    <Link
      to={to}
      className="group relative bg-white border border-[#e2e8f0] hover:border-slate-300 rounded-[14px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-150 hover:shadow-xs active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 min-h-[120px] sm:min-h-[134px] overflow-hidden"
      aria-label={`${label}: ${isError ? 'Could not load' : value}. ${caption}`}
    >
      {/* Top row: Label & chevron */}
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-xs sm:text-[13px] font-medium text-[#475569] truncate">
          {label}
        </span>
        <ChevronRight
          className="w-4 h-4 text-slate-400 group-hover:text-[#047857] group-hover:translate-x-0.5 transition-transform shrink-0"
          aria-hidden="true"
        />
      </div>

      {/* Middle row: Big Number or Error state */}
      <div className="my-1.5 sm:my-2">
        {isError ? (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-300">—</span>
            {onRetry && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRetry();
                }}
                className="inline-flex items-center gap-1 text-xs text-[#047857] hover:text-[#064e3b] font-medium hover:underline p-1 -m-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : (
          <div
            className={`text-[28px] sm:text-[36px] font-bold leading-none tracking-tight ${
              isPendingHighlight ? 'text-[#9a3412]' : 'text-[#01241a]'
            }`}
          >
            {formatNumber(value)}
          </div>
        )}
      </div>

      {/* Bottom row: Caption */}
      <div className="text-xs sm:text-[13px] text-[#475569] font-normal truncate">
        {caption}
      </div>
    </Link>
  );
}
