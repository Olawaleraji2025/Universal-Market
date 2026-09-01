import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  LogOut as LogOutIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable UserMenu component for navbar
export default function UserMenu({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    setOpen((s) => !s);
  };

  return (
    <div className="relative user-menu-root" ref={rootRef}>
      <button
        ref={btnRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((s) => !s);
          }
        }}
        className="inline-flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-5 h-5" />
          )}
        </div>
        <span className="sr-only">Account menu</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-3 w-[290px] rounded-[16px] bg-white border border-gray-200 shadow-lg z-50"
            role="menu"
            aria-label="Account menu"
          >
            {/* caret */}
            <div className="absolute -top-1 right-6 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-200" aria-hidden />

            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="p-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('/profile');
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                role="menuitem"
              >
                <UserIcon className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-slate-900">My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('/my-requests');
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${isActive('/my-requests') ? 'bg-emerald-50' : 'hover:bg-emerald-50'}`}
                role="menuitem"
                aria-current={isActive('/my-requests') ? 'page' : undefined}
              >
                <ClipboardList className={`w-5 h-5 ${isActive('/my-requests') ? 'text-emerald-700' : 'text-gray-700'}`} />
                <span className={`text-sm ${isActive('/my-requests') ? 'text-emerald-700' : 'text-slate-900'}`}>My Requests</span>
              </button>
            </div>

            <div className="border-t border-gray-100" />

            <div className="p-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (onLogout) onLogout();
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md mt-1 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100"
                role="menuitem"
              >
                <LogOutIcon className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
