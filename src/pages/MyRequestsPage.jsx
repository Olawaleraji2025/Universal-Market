import React, { useMemo, useState } from 'react';
import PageHeader from '../components/requests/PageHeader';
import RequestFilterTabs, { DEFAULT_REQUEST_STATUS_TABS } from '../components/requests/RequestFilterTabs';
import RequestCard from '../components/requests/RequestCard';
import RequestEmptyState from '../components/requests/RequestEmptyState';
import CustomRequestModal from '../components/ui/CustomRequestModal';
import { useNavigate } from 'react-router-dom';
import useUserRequests from '../Hooks/useUserRequests';
import SkeletonCard from '../components/ui/SkeletonLoader';
import { Plus } from 'lucide-react';
import Button from '../components/ui/button';

export const STATUS_VALUES = DEFAULT_REQUEST_STATUS_TABS;

export default function MyRequestsPage() {
  const [filter, setFilter] = useState('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: requests = [], isLoading, isError, refetch } = useUserRequests();

  const filtered = useMemo(() => {
    if (!requests || !Array.isArray(requests)) return [];
    if (filter === 'All') return requests;
    return requests.filter((r) => {
      const itemStatus = (r?.status || 'Pending').trim().toLowerCase();
      return itemStatus === filter.trim().toLowerCase();
    });
  }, [filter, requests]);

  const counts = useMemo(() => {
    const safeRequests = Array.isArray(requests) ? requests : [];
    const countsMap = { All: safeRequests.length };

    STATUS_VALUES.forEach((tab) => {
      if (tab !== 'All') {
        countsMap[tab] = safeRequests.filter(
          (r) => (r?.status || 'Pending').trim().toLowerCase() === tab.trim().toLowerCase()
        ).length;
      }
    });

    return countsMap;
  }, [requests]);

  return (
    <div className="min-h-screen max-w-[900px] mx-auto px-4 pb-16">
      <div className="flex items-center justify-between pt-2">
        <PageHeader title="My Requests" />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex-1 overflow-hidden">
            <RequestFilterTabs
              tabs={STATUS_VALUES}
              value={filter}
              onChange={setFilter}
              counts={counts}
            />
          </div>
          <Button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="self-start sm:self-auto shrink-0 bg-[#064e3b] text-white hover:bg-emerald-900 h-10 px-4 rounded-xl inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Button>
        </div>

        <div className="space-y-3 pb-8">
          {isLoading ? (
            <div className="space-y-3">
              <SkeletonCard count={3} />
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-red-700">Requests could not load</p>
              <p className="mt-2 text-sm text-red-600">
                Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#064e3b] px-4 py-2 text-white font-medium hover:bg-emerald-900 transition"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <RequestEmptyState
              filter={filter}
              onResetFilter={() => setFilter('All')}
              onOpenRequestModal={() => setIsRequestModalOpen(true)}
            />
          ) : (
            filtered.map((r) => (
              <RequestCard
                key={r.id}
                item={{
                  id: r.id,
                  title: r.title,
                  specs: r.specs,
                  date: r.date,
                  status: r.status,
                  isCustom: r.isCustom,
                }}
                onClick={() => navigate(`/requests/${r.id}`)}
              />
            ))
          )}
        </div>
      </div>

      <CustomRequestModal
        open={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

