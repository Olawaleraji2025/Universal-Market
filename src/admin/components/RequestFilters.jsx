import React, { useEffect, useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { cleanSearchQuery } from '../hooks/useAdminRequests';

export default function RequestFilters({
  searchQuery = '',
  onSearchChange,
  typeFilter = 'All',
  onTypeChange,
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync internal state when external prop changes (e.g. from URL or reset)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search typing by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      const sanitized = cleanSearchQuery(localSearch);
      if (sanitized !== searchQuery) {
        onSearchChange(sanitized);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, onSearchChange]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    // Strip commas and % while typing
    const stripped = rawValue.replace(/[,%]/g, '');
    setLocalSearch(stripped);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-3">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <label htmlFor="admin-requests-search" className="sr-only">
          Search name, phone or item
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#475569]">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>

        <input
          id="admin-requests-search"
          type="text"
          value={localSearch}
          onChange={handleInputChange}
          placeholder="Search name, phone or item"
          className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-white border border-[#e2e8f0] rounded-[10px] text-sm text-[#01241a] placeholder-[#94a3b8] transition-all focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 focus:border-[#047857]"
        />

        {localSearch ? (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search text"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94a3b8] hover:text-[#01241a] focus:outline-none focus:text-[#01241a]"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Type Dropdown Filter */}
      <div className="flex items-center gap-2 shrink-0">
        <label htmlFor="admin-requests-type" className="sr-only">
          Filter by Type
        </label>
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#475569]">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          </div>

          <select
            id="admin-requests-type"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full md:w-44 min-h-[44px] pl-9 pr-8 py-2.5 bg-white border border-[#e2e8f0] rounded-[10px] text-sm font-medium text-[#01241a] appearance-none cursor-pointer hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 focus:border-[#047857]"
          >
            <option value="All">All Types</option>
            <option value="Product">Product Request</option>
            <option value="Custom">Custom Request</option>
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#475569]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
