import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDisplayDate } from '../lib/requestStatus';

export default function RequestCard({ request, onClick }) {
  if (!request) return null;

  const isPending = (request.status || '').toLowerCase() === 'pending';
  const formattedDate = formatDisplayDate(request.created_at);

  return (
    <button
      type="button"
      onClick={() => onClick(request.id)}
      className={`w-full text-left min-h-[56px] p-4 bg-white border border-[#e2e8f0] rounded-[14px] shadow-xs flex items-center justify-between gap-3 transition-colors active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 ${
        isPending ? 'bg-amber-50/15 border-amber-200/50' : 'hover:bg-slate-50'
      }`}
      aria-label={`${request.ItemName} from ${request.userName}, status: ${request.status}`}
    >
      <div className="min-w-0 flex-1">
        {/* First Line: Bold Item Name */}
        <p
          className={`text-sm md:text-base text-[#01241a] truncate ${
            isPending ? 'font-bold' : 'font-semibold'
          }`}
        >
          {request.ItemName}
        </p>

        {/* Second Line: Customer · Type · Date in small grey text */}
        <p className="mt-1 text-xs text-[#475569] truncate">
          <span>{request.userName}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{request.typeDisplay}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{formattedDate}</span>
        </p>
      </div>

      {/* Right side: Status badge */}
      <div className="shrink-0 flex items-center">
        <StatusBadge status={request.status} size="sm" />
      </div>
    </button>
  );
}
