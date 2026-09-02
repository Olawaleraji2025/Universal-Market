import React from 'react';

export const DEFAULT_REQUEST_STATUS_TABS = [
  'All',
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
];

export default function RequestFilterTabs({
  tabs = DEFAULT_REQUEST_STATUS_TABS,
  value = 'All',
  onChange,
  counts = {},
}) {
  const safeTabs = Array.isArray(tabs) && tabs.length > 0 ? tabs : DEFAULT_REQUEST_STATUS_TABS;

  return (
    <div className="overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 px-1">
        {safeTabs.map((tab) => {
          const tabKey = typeof tab === 'object' ? tab.value || tab.label : tab;
          const tabLabel = typeof tab === 'object' ? tab.label : tab;
          const active = String(tabKey).toLowerCase() === String(value).toLowerCase();
          const count = counts?.[tabKey];

          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => onChange && onChange(tabKey)}
              className={`inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 ${
                active
                  ? 'bg-[#064e3b] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
              }`}
              aria-pressed={active}
            >
              <span>{tabLabel}</span>
              {typeof count === 'number' && (
                <span
                  className={`inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full font-semibold ${
                    active
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

