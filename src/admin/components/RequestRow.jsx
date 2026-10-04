import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import {
  formatCustomerName,
  formatRequestType,
  formatDashboardDate,
} from '../lib/requestStatus';

/**
 * RequestRow - Desktop table row for Recent requests
 * Whole row clickable with keyboard navigation, hover effect, and a chevron.
 */
export default function RequestRow({ request }) {
  const navigate = useNavigate();

  const customer = formatCustomerName(request.userName, request.user_id);
  const item = request.ItemName || 'Unnamed Request';
  const type = formatRequestType(request.ReqType);
  const status = request.status || 'Pending';
  const date = formatDashboardDate(request.created_at);
  const targetUrl = `/admin/requests/${request.id}`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(targetUrl);
    }
  };

  return (
    <tr
      tabIndex={0}
      role="link"
      onClick={() => navigate(targetUrl)}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer border-b border-[#e2e8f0] last:border-b-0 hover:bg-slate-50/80 transition-colors focus-visible:outline-none focus-visible:bg-emerald-50/40"
      aria-label={`Request from ${customer} for ${item}, status ${status}, received ${date}`}
    >
      {/* Customer */}
      <td className="py-3.5 px-4 sm:px-6 text-sm font-medium text-[#01241a] whitespace-nowrap">
        <a
          href={targetUrl}
          onClick={(e) => e.preventDefault()}
          tabIndex={-1}
          className="hover:underline focus:outline-none"
        >
          {customer}
        </a>
      </td>

      {/* Item */}
      <td className="py-3.5 px-4 sm:px-6 text-sm text-[#01241a] max-w-[280px] truncate font-medium">
        <span title={item}>{item}</span>
      </td>

      {/* Type */}
      <td className="py-3.5 px-4 sm:px-6 text-sm text-[#475569] whitespace-nowrap">
        {type}
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
        <StatusBadge status={status} size="sm" />
      </td>

      {/* Date */}
      <td className="py-3.5 px-4 sm:px-6 text-sm text-[#475569] whitespace-nowrap">
        {date}
      </td>

      {/* Chevron */}
      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
        <ChevronRight
          className="w-4 h-4 text-slate-400 group-hover:text-[#047857] group-hover:translate-x-0.5 transition-all inline-block"
          aria-hidden="true"
        />
      </td>
    </tr>
  );
}
