import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import SidebarHeader from './mobile-sidebar/SidebarHeader';
import SidebarNav from './mobile-sidebar/SidebarNav';
import SidebarAuthActions from './mobile-sidebar/SidebarAuthActions';
import { menus } from './mobile-sidebar/menus';
import logo from "../../assets/logos/UM-logo.png";
import { supabase } from '../../supabaseClient';
import { clearAuth } from '../../features/authSlice';
import { toast } from 'sonner';

export default function MobileSidebar({ user: userProp = null, onOpenAuth }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: authUser, profile } = useSelector((state) => state.auth);

  const activeUser = userProp || (authUser ? {
    name: profile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0],
    email: authUser?.email,
    avatar: profile?.avatar_url || authUser?.user_metadata?.avatar_url,
    role: profile?.role || authUser?.user_metadata?.role || 'user',
  } : null);

  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const triggerRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const els = drawerRef.current?.querySelectorAll(
        'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
      );
      if (els && els.length) els[0].focus();
      window.addEventListener('keydown', handleKeydown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeydown);
      try {
        previouslyFocused.current?.focus();
      } catch (e) {}
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [open]);

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = drawerRef.current?.querySelectorAll(
      'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
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
  };

  const close = () => setOpen(false);

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleOpenAuth = (mode) => {
    close();
    if (onOpenAuth) {
      onOpenAuth(mode);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(clearAuth());
      setOpen(false);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Error signing out");
    }
  };

  const role = activeUser?.role || 'guest';

  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        onClick={() => setOpen(true)}
        ref={triggerRef}
      >
        <Menu className="w-6 h-6" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9999] flex"
            role="dialog"
            aria-modal="true"
            onClick={onOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              ref={drawerRef}
              className="relative z-[10000] w-80 max-w-full bg-white h-screen shadow-xl flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarHeader onClose={close} umLogo={logo} />

              <div className="p-4 flex flex-col flex-1 overflow-auto bg-white z-[10000]">
                {activeUser && (
                  <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center overflow-hidden font-bold text-base flex-shrink-0">
                      {activeUser?.avatar ? (
                        <img
                          src={activeUser.avatar}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        activeUser?.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                        {activeUser?.name || 'User'}
                        {role === 'admin' && (
                          <span className="text-[10px] font-bold bg-emerald-700 text-white px-1.5 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{activeUser?.email || ''}</div>
                    </div>
                  </div>
                )}

                <SidebarNav menus={menus} role={role} onNavigate={go} />

                <SidebarAuthActions
                  role={role}
                  onNavigate={go}
                  onOpenAuth={handleOpenAuth}
                  onLogout={handleLogout}
                />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
