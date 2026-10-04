import React, { useState, useEffect } from 'react';
import { getNextAllowedStatuses, isTerminalStatus } from '../lib/requestStatus';
import { AlertCircle, ChevronDown, Check } from 'lucide-react';

export default function RequestStatusSelect({
  currentStatus = 'Pending',
  onUpdateStatus,
  onRequestCancel,
  isUpdating = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const allowedNext = getNextAllowedStatuses(currentStatus);
  const isTerminal = isTerminalStatus(currentStatus);
  const hasChanged = selectedStatus !== currentStatus;

  const handleUpdate = () => {
    if (!hasChanged || isUpdating || isTerminal) return;

    if (selectedStatus === 'Cancelled') {
      onRequestCancel();
    } else {
      onUpdateStatus(selectedStatus);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        {/* Status Dropdown */}
        <div className="relative flex-1">
          <label htmlFor="request-status-dropdown" className="sr-only">
            Select Next Status
          </label>
          <select
            id="request-status-dropdown"
            value={selectedStatus}
            disabled={isTerminal || isUpdating}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full min-h-[44px] pl-3.5 pr-10 py-2.5 bg-white border border-[#e2e8f0] rounded-[10px] text-sm font-semibold text-[#01241a] appearance-none transition-all cursor-pointer disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 focus:border-[#047857]"
          >
            {/* Always keep current status in dropdown */}
            <option value={currentStatus}>
              {currentStatus} (Current)
            </option>

            {/* Next allowed options */}
            {allowedNext.map((status) => (
              <option key={status} value={status}>
                Change to {status}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#475569]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Update Button */}
        <button
          type="button"
          onClick={handleUpdate}
          disabled={!hasChanged || isUpdating || isTerminal}
          className="min-h-[44px] px-5 py-2.5 rounded-[10px] bg-[#064e3b] text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-emerald-900 cursor-pointer"
        >
          {isUpdating ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Update
            </span>
          )}
        </button>
      </div>

      {/* Explanatory notes */}
      {isTerminal ? (
        <p className="text-xs text-[#475569] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span>Completed requests can't be changed.</span>
        </p>
      ) : (
        <p className="text-xs text-[#475569]">
          Cancelling asks for confirmation first.
        </p>
      )}
    </div>
  );
}
