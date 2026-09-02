import React, { useMemo, useState } from 'react';
import PageHeader from '../components/requests/PageHeader';
import RequestFilterTabs from '../components/requests/RequestFilterTabs';
import RequestCard from '../components/requests/RequestCard';
import RequestEmptyState from '../components/requests/RequestEmptyState';
// import { STATUS_VALUES } from '../lib/requestsData';
import { useNavigate } from 'react-router-dom';
import useUserRequests from '../Hooks/useUserRequests';
import SkeletonCard from '../components/ui/SkeletonLoader';

export default function MyRequestsPage() {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const { data: requests = [], isLoading, isError, refetch } = useUserRequests();

  const filtered = useMemo(() => {
    if (filter === 'All') return requests || [];
    return (requests || []).filter((r) => (r.status || 'Pending') === filter);
  }, [filter, requests]);

  return (
    <div className="min-h-screen max-w-[900px] mx-auto px-4">
      <PageHeader title="My Requests" />

      <div className="mt-2">
        <RequestFilterTabs tabs={STATUS_VALUES} value={filter} onChange={setFilter} />

        <div className="space-y-3 mt-4 pb-8">
          {isLoading ? (
            <div className="space-y-4">
              <SkeletonCard count={3} />
            </div>
          ) : filtered.length === 0 ? (
            <RequestEmptyState />
          ) : isError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-red-700">Requests could not load</p>
              <p className="mt-2 text-sm text-red-600">Please check your connection and try again.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#064e3b] px-4 py-2 text-white"
              >
                Retry
              </button>
            </div>
          ) : (
            filtered.map((r) => (
              <RequestCard
                key={r.id}
                item={{
                  id: r.id,
                  title: r.title || r.request_title || r.name || 'Request',
                  specs: r.specs || r.description || r.details || '',
                  date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
                  status: r.status || 'Pending',
                  isCustom: !!r.is_custom,
                }}
                onClick={() => navigate(`/requests/${r.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
