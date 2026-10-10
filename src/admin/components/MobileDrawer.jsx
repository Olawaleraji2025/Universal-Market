import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  X,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { formatBadgeCount } from '../lib/requestStatus';

/**
 * MobileDrawer - 300px slide-in drawer over dimmed backdrop (<1024px)
 * Accessible focus trap, Escape key dismiss, and scroll locking.
 */
export default function MobileDrawer({
  isOpen,
  onClose,
  pendingCount = 0,
  adminName = 'Admin',
  onLogout,
}) {
  const location = useLocation();
  const drawerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const badgeLabel = formatBadgeCount(pendingCount);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab') {
          if (!focusableElements || focusableElements.length === 0) return;
          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 lg:hidden flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 300px Drawer Body */}
      <div
        ref={drawerRef}
        className="relative w-[300px] max-w-[85vw] bg-[#064e3b] text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200"
      >
        {/* Top bar with Universal Market / Admin and Close button */}
        <div className="p-4 sm:p-5 border-b border-emerald-900/80 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-white tracking-tight leading-tight">
              Universal Market
            </div>
            <div className="text-xs font-medium text-emerald-300 tracking-wide mt-0.5">
              Admin
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="min-h-[48px] min-w-[48px] -mr-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 active:bg-emerald-900 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
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
                  className="min-h-[48px] flex items-center justify-between px-4 py-2.5 rounded-[10px] text-sm font-medium text-emerald-300/40 cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-emerald-400/40" />
                    <span>{item.label}</span>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[48px] flex items-center justify-between px-4 py-2.5 rounded-[10px] text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                  isActive
                    ? 'bg-emerald-50 text-[#064e3b] font-bold shadow-xs'
                    : 'text-emerald-100 font-medium hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-[#064e3b]' : 'text-emerald-300'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>

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

        {/* Bottom Section */}
        <div className="p-4 border-t border-emerald-900/80 space-y-3">
          {/* Back to site */}
          <NavLink
            to="/"
            onClick={onClose}
            className="min-h-[48px] flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm font-medium text-emerald-200 hover:bg-emerald-900/50 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-300" />
            <span>Go Back Home</span>
          </NavLink>

          {/* Admin name & Logout */}
          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between px-3">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate">{adminName}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="min-h-[44px] text-xs text-emerald-300 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded px-1.5 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
