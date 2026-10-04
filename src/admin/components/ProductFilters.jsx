import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { CATEGORIES, STATUS_FILTER_OPTIONS } from '../lib/productConstants';

export default function ProductFilters({
  search = '',
  category = 'all',
  status = 'all',
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onReset,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync internal search input with outer prop when prop changes (e.g. popstate)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const hasActiveFilters = Boolean(
    localSearch.trim() || category !== 'all' || status !== 'all'
  );

  return (
    <div className="bg-white rounded-[14px] border border-[#e2e8f0] p-4 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input with icon and clear button */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#475569]">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products by name..."
            aria-label="Search products"
            className="w-full min-h-[44px] pl-10 pr-9 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all placeholder:text-[#475569]/60"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#475569] hover:text-[#01241a] focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="md:col-span-3">
          <label htmlFor="category-filter" className="sr-only">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status dropdown */}
        <div className="md:col-span-3">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all cursor-pointer"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter summary & Clear all */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#475569]">
          <div className="flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#047857]" />
            <span>Active filters applied</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-[#047857] hover:text-[#064e3b] font-semibold underline underline-offset-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] rounded px-1"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
