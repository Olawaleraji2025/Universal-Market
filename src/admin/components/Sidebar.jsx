import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { formatBadgeCount } from '../lib/requestStatus';

/**
 * Sidebar - Fixed 240px dark green sidebar (#064e3b) for Laptop (1024px+)
 */
export default function Sidebar({ pendingCount = 0, adminName = 'Admin', onLogout }) {
  const location = useLocation();
  const badgeLabel = formatBadgeCount(pendingCount);

  const navItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products', to: '/admin/products', icon: Package },
    {
      label: 'Requests',
      to: '/admin/requests',
      icon: ClipboardList,
      badge: badgeLabel,
    },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col w-[240px] shrink-0 bg-[#064e3b] text-white min-h-screen sticky top-0 h-screen z-30 select-none"
      aria-label="Admin Navigation Sidebar"
    >
      {/* Top: Universal Market / Admin */}
      <div className="p-6 border-b border-emerald-900/60">
        <NavLink
          to="/admin"
          className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded-md"
        >
          <div className="text-base font-bold text-white tracking-tight leading-tight">
            Universal Market
          </div>
          <div className="text-xs font-medium text-emerald-300 tracking-wide mt-0.5">
            Admin
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          if (item.disabled) {
            return (
              <div
                key={item.label}
                aria-disabled="true"
                className="min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-sm font-medium text-emerald-300/40 cursor-not-allowed"
                title="Coming soon"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-emerald-400/40" />
                  <span>{item.label}</span>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                isActive
                  ? 'bg-emerald-50 text-[#064e3b] font-bold shadow-xs'
                  : 'text-emerald-100/90 font-medium hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#064e3b]' : 'text-emerald-300'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Sidebar chip: Pending requests */}
              {item.badge && (
                <span
                  className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa] shrink-0"
                  aria-label={`${item.badge} pending requests`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Area: Back to site, admin name, log out */}
      <div className="p-4 border-t border-emerald-900/60 space-y-3">
        {/* Back to site */}
        <NavLink
          to="/"
          className="min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-medium text-emerald-200 hover:bg-emerald-900/50 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-300" />
          <span>Go Back Home</span>
        </NavLink>

        {/* Admin info & Logout */}
        <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between px-3">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-white truncate">{adminName}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs text-emerald-300 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded px-1 py-0.5 shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
