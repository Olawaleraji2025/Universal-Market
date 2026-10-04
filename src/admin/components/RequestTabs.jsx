import React from 'react';
import { STATUS_TABS } from '../lib/requestStatus';

export default function RequestTabs({
  activeTab = 'All',
  onSelectTab,
  counts = {},
}) {
  return (
    <div
      className="w-full overflow-x-auto no-scrollbar scroll-smooth py-1"
      role="tablist"
      aria-label="Request status filter tabs"
    >
      <div className="flex items-center gap-2 min-w-max pb-1">
        {STATUS_TABS.map((tab) => {
          const isSelected = activeTab.toLowerCase() === tab.toLowerCase();
          const count = counts[tab.toLowerCase()] ?? counts[tab] ?? 0;

          return (
            <button
              key={tab}
              role="tab"
              type="button"
              id={`tab-${tab.toLowerCase()}`}
              aria-selected={isSelected}
              aria-controls="requests-content"
              onClick={() => onSelectTab(tab)}
              className={`min-h-[44px] inline-flex items-center gap-2.5 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 ${
                isSelected
                  ? 'bg-[#064e3b] text-white shadow-xs border border-[#064e3b]'
                  : 'bg-white text-[#475569] border border-[#e2e8f0] hover:bg-gray-50 hover:text-[#01241a] hover:border-gray-300'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-[#f1f5f9] text-[#475569]'
                }`}
                aria-label={`${count} requests`}
              >
                {typeof count === 'number' ? count.toLocaleString() : count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
