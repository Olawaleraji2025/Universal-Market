import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, RefreshCw, Inbox, AlertCircle } from 'lucide-react';
import { useAdminStats } from '../hooks/useAdminStats';
import { useRecentRequests } from '../hooks/useRecentRequests';
import StatCard from '../components/StatCard';
import RequestRow from '../components/RequestRow';
import RequestCardMobile from '../components/RequestCardMobile';
import {
  StatCardSkeleton,
  RequestRowSkeleton,
  RequestCardMobileSkeleton,
} from '../components/Skeletons';

/**
 * Admin Dashboard (/admin)
 * Answers staff's #1 question: "What needs my attention right now?"
 */
export default function Dashboard() {
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useAdminStats();

  const {
    data: recentRequests,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    refetch: refetchRequests,
  } = useRecentRequests();

  const pendingCount = stats?.pending ?? 0;
  const confirmedCount = stats?.confirmed ?? 0;
  const completedCount = stats?.completed ?? 0;
  const productsCount = stats?.products ?? 0;
  const outOfStockCount = stats?.out_of_stock ?? 0;

  // Header action buttons component
  // const ActionButtons = ({ className = '' }) => (
  //   <div className={`flex items-center gap-3 ${className}`}>
  //     {/* Secondary: View pending requests */}
  //     <Link
  //       to="/admin/requests?status=Pending"
  //       className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-4 py-2.5 rounded-[10px] bg-white border border-[#e2e8f0] hover:bg-slate-50 active:bg-slate-100 text-[#064e3b] text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
  //     >
  //       <span>View pending requests</span>
  //     </Link>

  //     {/* Primary: + Add product */}
  //     <Link
  //       to="/admin/products/new"
  //       className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-4 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] active:bg-[#064e3b] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 shadow-xs"
  //     >
  //       <Plus className="w-4 h-4" />
  //       <span>Add product</span>
  //     </Link>
  //   </div>
  // );

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1440px] mx-auto space-y-6 sm:space-y-8">
      {/* ============================================================== */}
      {/* TOP HEADER: Title & Action Buttons                             */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#01241a] tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#475569]">
            Overview of marketplace activity and customer requests.
          </p>
        </div>

        {/* Laptop / Desktop Action Buttons (sitting to the right of title) */}
        <div className={`flex items-center gap-3 hidden sm:flex`}>
      {/* Secondary: View pending requests */}
      <Link
        to="/admin/requests?status=Pending"
        className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-4 py-2.5 rounded-[10px] bg-white border border-[#e2e8f0] hover:bg-slate-50 active:bg-slate-100 text-[#064e3b] text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
      >
        <span>View pending requests</span>
      </Link>

      {/* Primary: + Add product */}
      <Link
        to="/admin/products/new"
        className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-4 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] active:bg-[#064e3b] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 shadow-xs"
      >
        <Plus className="w-4 h-4" />
        <span>Add product</span>
      </Link>
    </div>
        {/* <ActionButtons className="hidden sm:flex" /> */}
      </div>

      {/* ============================================================== */}
      {/* STAT CARDS: 4 across on Laptop, 2 by 2 on Mobile               */}
      {/* ============================================================== */}
      <section aria-label="Key Marketplace Metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {isStatsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              {/* 1. Pending requests (number in orange #9a3412) */}
              <StatCard
                label="Pending requests"
                value={pendingCount}
                caption="Need a reply"
                to="/admin/requests?status=Pending"
                isPendingHighlight={true}
                isError={isStatsError}
                onRetry={refetchStats}
              />

              {/* 2. Confirmed */}
              <StatCard
                label="Confirmed"
                value={confirmedCount}
                caption="In progress"
                to="/admin/requests?status=Confirmed"
                isError={isStatsError}
                onRetry={refetchStats}
              />

              {/* 3. Completed */}
              <StatCard
                label="Completed"
                value={completedCount}
                caption="All time"
                to="/admin/requests?status=Completed"
                isError={isStatsError}
                onRetry={refetchStats}
              />

              {/* 4. Products */}
              <StatCard
                label="Products"
                value={productsCount}
                caption={`${outOfStockCount} out of stock`}
                to="/admin/products"
                isError={isStatsError}
                onRetry={refetchStats}
              />
            </>
          )}
        </div>
      </section>

      {/* Mobile Action Buttons (Two full-width 48px buttons under stat cards) */}
      <div className="sm:hidden flex-col w-full">
        <div className={`flex items-center gap-3`}>
      {/* Secondary: View pending requests */}
      <Link
        to="/admin/requests?status=Pending"
        className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-4 py-2.5 rounded-[10px] bg-white border border-[#e2e8f0] hover:bg-slate-50 active:bg-slate-100 text-[#064e3b] text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
      >
        <span>View pending requests</span>
      </Link>

      {/* Primary: + Add product */}
      <Link
        to="/admin/products/new"
        className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-4 py-2.5 rounded-[10px] bg-[#047857] hover:bg-[#064e3b] active:bg-[#064e3b] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 shadow-xs"
      >
        <Plus className="w-4 h-4" />
        <span>Add product</span>
      </Link>
    </div>
        {/* <ActionButtons className="flex-col w-full" /> */}
      </div>

      {/* ============================================================== */}
      {/* RECENT REQUESTS CARD                                           */}
      {/* ============================================================== */}
      <section
        aria-labelledby="recent-requests-heading"
        className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden shadow-xs"
      >
        {/* Card Header: Heading + View all link */}
        <div className="p-4 sm:p-6 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2
              id="recent-requests-heading"
              className="text-base sm:text-lg font-bold text-[#01241a] tracking-tight"
            >
              Recent requests
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Latest incoming product and custom inquiries
            </p>
          </div>

          <Link
            to="/admin/requests"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#047857] hover:text-[#064e3b] transition-colors focus-visible:outline-none focus-visible:underline min-h-[44px] px-2 py-1"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Card Body */}
        {isRequestsLoading ? (
          <div>
            {/* Desktop skeleton */}
            <div className="hidden sm:block">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <RequestRowSkeleton />
                  <RequestRowSkeleton />
                  <RequestRowSkeleton />
                  <RequestRowSkeleton />
                  <RequestRowSkeleton />
                </tbody>
              </table>
            </div>

            {/* Mobile skeleton */}
            <div className="sm:hidden p-4 space-y-2.5">
              <RequestCardMobileSkeleton />
              <RequestCardMobileSkeleton />
              <RequestCardMobileSkeleton />
            </div>
          </div>
        ) : isRequestsError ? (
          /* Recent requests failed state: short message with Retry button */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[#01241a]">
              Failed to load recent requests
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#475569] max-w-sm">
              An error occurred while fetching requests. Please check your connection and retry.
            </p>
            <button
              type="button"
              onClick={() => refetchRequests()}
              className="mt-4 min-h-[44px] px-4 py-2 rounded-[10px] bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#064e3b] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : recentRequests && recentRequests.length > 0 ? (
          <div>
            {/* Laptop / Desktop View: Full Data Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-slate-50/50 text-[12px] font-semibold text-[#475569] uppercase tracking-wider">
                    <th scope="col" className="py-3 px-4 sm:px-6">Customer</th>
                    <th scope="col" className="py-3 px-4 sm:px-6">Item</th>
                    <th scope="col" className="py-3 px-4 sm:px-6">Type</th>
                    <th scope="col" className="py-3 px-4 sm:px-6">Status</th>
                    <th scope="col" className="py-3 px-4 sm:px-6">Date</th>
                    <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {recentRequests.map((req) => (
                    <RequestRow key={req.id} request={req} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Cards */}
            <div className="sm:hidden p-3 space-y-2">
              {recentRequests.map((req) => (
                <RequestCardMobile key={req.id} request={req} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state: No requests yet */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[#01241a]">
              No requests yet
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#475569] max-w-sm">
              New customer requests will show up here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
