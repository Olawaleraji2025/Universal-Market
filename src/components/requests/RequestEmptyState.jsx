import React from 'react';
import { ShoppingBag, Compass, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/button';

export default function RequestEmptyState({
  filter = 'All',
  onResetFilter,
  onOpenRequestModal,
}) {
  const navigate = useNavigate();
  const isFiltered = filter !== 'All';

  return (
    <div className="rounded-[24px] border border-dashed border-emerald-200/80 bg-white p-8 text-center shadow-sm md:p-12 my-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <ShoppingBag className="h-8 w-8" />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#01241a]">
        {isFiltered ? `No ${filter.toLowerCase()} requests` : 'No requests yet'}
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        {isFiltered
          ? `You do not have any requests with status "${filter}". Try switching filter or creating a new request.`
          : 'You haven’t made any custom requests yet. Can’t find what you need in the shop? We can source it for you!'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onResetFilter && (
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilter}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 h-10 px-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Show all requests
          </Button>
        )}

        {onOpenRequestModal && (
          <Button
            type="button"
            onClick={onOpenRequestModal}
            className="bg-[#064e3b] text-white hover:bg-emerald-900 h-10 px-4"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Make a Request
          </Button>
        )}

        <Button
          type="button"
          onClick={() => navigate('/shop')}
          variant={isFiltered ? 'secondary' : 'outline'}
          className="border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 h-10 px-4"
        >
          <Compass className="mr-2 h-4 w-4" />
          Browse Shop
        </Button>
      </div>
    </div>
  );
}

