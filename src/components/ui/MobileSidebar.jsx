import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarHeader from './mobile-sidebar/SidebarHeader';
import SidebarNav from './mobile-sidebar/SidebarNav';
import SidebarAuthActions from './mobile-sidebar/SidebarAuthActions';
import SidebarWhatsAppCard from './mobile-sidebar/SidebarWhatsAppCard';
import { menus } from './mobile-sidebar/menus';

export default function MobileSidebar({ user = null }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const triggerRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // focus first focusable
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    // trap focus
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

  const role = user?.role || 'guest';

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
            <SidebarHeader onClose={close} />

            <div className="p-4 flex flex-col flex-1 overflow-auto bg-white z-[10000]">
              {role === 'user' && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <img src="/src/assets/logos/UM-logo.png" alt="avatar" className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{user?.name || ''}</div>
                    <div className="text-xs text-gray-500">{user?.email || ''}</div>
                  </div>
                </div>
              )}

              <SidebarNav menus={menus} role={role} onNavigate={go} />

              <SidebarAuthActions role={role} onNavigate={go} onLogout={() => { const evt = new CustomEvent('app:logout'); window.dispatchEvent(evt); setOpen(false); }} />

              {/* <SidebarWhatsAppCard /> */}
            </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
