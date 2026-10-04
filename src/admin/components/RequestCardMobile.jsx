import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import {
  formatCustomerName,
  formatRequestType,
  formatDashboardDate,
} from '../lib/requestStatus';

/**
 * RequestCardMobile - Mobile card for Recent requests
 * Item name bold on the first line; "Customer · Type · Date" beneath; status badge on right.
 */
export default function RequestCardMobile({ request }) {
  const customer = formatCustomerName(request.userName, request.user_id);
  const item = request.ItemName || 'Unnamed Request';
  const type = formatRequestType(request.ReqType);
  const status = request.status || 'Pending';
  const date = formatDashboardDate(request.created_at);

  return (
    <Link
      to={`/admin/requests/${request.id}`}
      className="group block p-3.5 bg-white border border-[#e2e8f0] rounded-[12px] active:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
      aria-label={`Request: ${item} by ${customer}, ${type}, ${status}, ${date}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Item name and meta line */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#01241a] truncate group-hover:text-[#047857] transition-colors">
            {item}
          </h3>
          <p className="mt-1 text-xs text-[#475569] truncate">
            <span>{customer}</span>
            <span className="mx-1.5 opacity-60">·</span>
            <span>{type}</span>
            <span className="mx-1.5 opacity-60">·</span>
            <span>{date}</span>
          </p>
        </div>

        {/* Right: Status badge */}
        <div className="shrink-0 pt-0.5">
          <StatusBadge status={status} size="sm" />
        </div>
      </div>
    </Link>
  );
}
