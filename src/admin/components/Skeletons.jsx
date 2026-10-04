import React from 'react';

/**
 * StatCardSkeleton
 * Skeleton placeholder matching the 4 stat cards on Dashboard
 */
export function StatCardSkeleton() {
  return (
    <div
      className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-5 flex flex-col justify-between min-h-[118px] sm:min-h-[128px] animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="h-3.5 bg-slate-200 rounded w-24" />
        <div className="h-4 w-4 bg-slate-200 rounded-full" />
      </div>
      <div className="my-2 sm:my-3">
        <div className="h-8 sm:h-9 bg-slate-200 rounded w-16" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-28" />
    </div>
  );
}

/**
 * RequestRowSkeleton (Desktop table)
 */
export function RequestRowSkeleton() {
  return (
    <tr className="border-b border-[#e2e8f0]/80 animate-pulse">
      <td className="py-4 px-4 sm:px-6">
        <div className="h-4 bg-slate-200 rounded w-28" />
      </td>
      <td className="py-4 px-4 sm:px-6">
        <div className="h-4 bg-slate-200 rounded w-44" />
      </td>
      <td className="py-4 px-4 sm:px-6">
        <div className="h-4 bg-slate-200 rounded w-16" />
      </td>
      <td className="py-4 px-4 sm:px-6">
        <div className="h-6 bg-slate-200 rounded-full w-20" />
      </td>
      <td className="py-4 px-4 sm:px-6 text-right">
        <div className="h-4 bg-slate-200 rounded w-14 ml-auto" />
      </td>
    </tr>
  );
}

/**
 * RequestCardMobileSkeleton (Mobile list)
 */
export function RequestCardMobileSkeleton() {
  return (
    <div
      className="p-4 bg-white border border-[#e2e8f0] rounded-[12px] animate-pulse flex items-center justify-between gap-3 min-h-[72px]"
      aria-hidden="true"
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
      <div className="h-6 bg-slate-200 rounded-full w-20 shrink-0" />
    </div>
  );
}
