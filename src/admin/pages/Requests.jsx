import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAdminRequests } from '../hooks/useAdminRequests';
import { useRequestCounts } from '../hooks/useRequestCounts';
import RequestTabs from '../components/RequestTabs';
import RequestFilters from '../components/RequestFilters';
import RequestTable from '../components/RequestTable';
import RequestCard from '../components/RequestCard';
import { Inbox, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

export default function Requests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL query parameters
  const statusParam = searchParams.get('status') || 'All';
  const typeParam = searchParams.get('type') || 'All';
  const queryParam = searchParams.get('q') || '';
  const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Helper to update query string parameters
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || (key === 'status' && val === 'All') || (key === 'type' && val === 'All') || (key === 'page' && val === 1)) {
        updated.delete(key);
      } else {
        updated.set(key, String(val));
      }
    });
    setSearchParams(updated, { replace: true });
  };

  // Queries
  const { data: counts = {}, isLoading: isCountsLoading } = useRequestCounts();
  const {
    data: requestsData,
    isLoading: isListLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminRequests({
    status: statusParam,
    type: typeParam,
    q: queryParam,
    page: pageParam,
    limit: 20,
  });

  const items = requestsData?.items || [];
  const totalCount = requestsData?.totalCount || 0;
  const totalPages = requestsData?.totalPages || 1;

  // Handlers
  const handleSelectTab = (newStatus) => {
    updateParams({ status: newStatus, page: 1 });
  };

  const handleSearchChange = (newQ) => {
    updateParams({ q: newQ, page: 1 });
  };

  const handleTypeChange = (newType) => {
    updateParams({ type: newType, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleRequestClick = (id) => {
    navigate(`/admin/requests/${id}`);
  };

  const isFiltering = statusParam !== 'All' || typeParam !== 'All' || Boolean(queryParam);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-[28px] font-bold text-[#01241a] tracking-tight leading-tight">
          Requests
        </h1>
        <p className="mt-1 text-sm text-[#475569]">
          Manage customer product requests, contact on WhatsApp, and update statuses.
        </p>
      </div>

      {/* Status Filter Tabs (Count chips from database RPC/table) */}
      <div className="pt-1">
        <RequestTabs
          activeTab={statusParam}
          onSelectTab={handleSelectTab}
          counts={counts}
        />
      </div>

      {/* Search and Type Filter */}
      <div>
        <RequestFilters
          searchQuery={queryParam}
          onSearchChange={handleSearchChange}
          typeFilter={typeParam}
          onTypeChange={handleTypeChange}
        />
      </div>

      {/* Main Content Area */}
      <div id="requests-content">
        {/* Loading State: Skeleton */}
        {isListLoading ? (
          <div className="space-y-3">
            {/* Laptop Skeleton Table */}
            <div className="hidden lg:block bg-white border border-[#e2e8f0] rounded-[14px] p-6 space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/4 animate-pulse" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>

            {/* Mobile Skeleton Cards */}
            <div className="lg:hidden space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-white border border-[#e2e8f0] rounded-[14px] p-4 animate-pulse flex flex-col justify-between"
                >
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : isError ? (
          /* Error State with Retry Button */
          <div className="bg-white border border-rose-200 rounded-[14px] p-8 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#01241a]">Failed to load requests</h3>
            <p className="mt-1 text-sm text-[#475569]">
              {error?.message || 'Could not retrieve requests. Please check your network connection.'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 min-h-[44px] px-5 py-2.5 rounded-[10px] bg-[#064e3b] text-white font-semibold text-sm hover:bg-emerald-900 inline-flex items-center gap-2 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-[#047857]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty States */
          isFiltering ? (
            /* Search/Filter finds nothing */
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#01241a]">No requests match.</h3>
              <p className="mt-1 text-sm text-[#475569]">
                Try adjusting your search terms or clearing the current filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-4 min-h-[44px] px-5 py-2.5 rounded-[10px] bg-white border border-[#e2e8f0] text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            /* No requests at all */
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#047857] flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#01241a]">No requests yet.</h3>
              <p className="mt-1 text-sm text-[#475569]">
                New customer requests will show up here.
              </p>
            </div>
          )
        ) : (
          /* Data Loaded */
          <div>
            {/* Laptop Table View (>= 1024px) */}
            <RequestTable
              requests={items}
              onRowClick={handleRequestClick}
              page={pageParam}
              pageSize={20}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isFetching}
            />

            {/* Mobile Card View (< 1024px) */}
            <div className="lg:hidden space-y-2.5">
              {items.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onClick={handleRequestClick}
                />
              ))}

              {/* Mobile "Load more" button or pagination */}
              {pageParam < totalPages ? (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pageParam + 1)}
                    disabled={isFetching}
                    className="w-full min-h-[48px] py-3 px-4 rounded-[10px] bg-white border border-[#e2e8f0] text-sm font-semibold text-[#01241a] hover:bg-slate-50 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  >
                    {isFetching ? 'Loading...' : 'Load more requests'}
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-[#475569]">
                  Showing all {totalCount} requests
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
