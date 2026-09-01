import React from 'react';

export default function RequestFilterTabs({ tabs = [], value, onChange }) {
  return (
    <div className="overflow-x-auto no-scrollbar py-3">
      <div className="flex gap-3 px-4">
        {tabs.map((t) => {
          const active = t === value;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`${active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'} whitespace-nowrap px-3 py-2 rounded-[12px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200`}
              aria-pressed={active}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
