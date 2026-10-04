import React from 'react';
import { Menu } from 'lucide-react';

/**
 * TopBar - 64px dark green (#064e3b) top bar for Mobile and Tablet (<1024px)
 */
export default function TopBar({
  title = 'Dashboard',
  adminInitials = 'AD',
  onOpenMenu,
  pendingCount = 0,
}) {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-[#064e3b] text-white border-b border-emerald-900 h-16 px-4 flex items-center justify-between select-none">
      {/* Left: Menu Hamburger */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="min-h-[48px] min-w-[48px] -ml-2 rounded-lg text-white hover:bg-emerald-800 active:bg-emerald-900 transition flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Page Title */}
        <h1 className="font-bold text-base sm:text-lg text-white truncate">
          {title}
        </h1>
      </div>

      {/* Right: Pending Indicator + Admin initials */}
      <div className="flex items-center gap-2.5">
        {pendingCount > 0 && (
          <span
            className="hidden sm:inline-flex px-2 py-0.5 text-xs font-bold rounded-full bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa]"
            aria-label={`${pendingCount} pending requests`}
          >
            {pendingCount} Pending
          </span>
        )}

        <div
          className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs"
          title={`Admin (${adminInitials})`}
          aria-label={`Admin initials: ${adminInitials}`}
        >
          {adminInitials}
        </div>
      </div>
    </header>
  );
}
