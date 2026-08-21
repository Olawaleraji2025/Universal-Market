import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from 'react-icons/fa';


export default function WhatsAppModal({ open, onClose, onConfirm, isOpening, error, initialFocusRef }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;

    // Focus the dialog for screen readers
    setTimeout(() => dialogRef.current?.focus(), 0);

    function onKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab") {
        // Basic focus trap
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // return focus
      try {
        if (initialFocusRef && initialFocusRef.current) initialFocusRef.current.focus();
        else previous?.focus();
      } catch (e) {return e.message;}
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        ref={overlayRef}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Chat on WhatsApp"
          ref={dialogRef}
          tabIndex={-1}
          className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <FaWhatsapp className="w-6 h-6" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#01241a]">Chat on WhatsApp?</h3>
                <p className="text-sm text-gray-600">This will open WhatsApp and start a conversation with our team.</p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className="w-full px-4 py-3 bg-[#22c55e] text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-disabled={isOpening}
              >
                {isOpening ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Opening WhatsApp...
                  </>
                    ) : (
                  <>
                    <FaWhatsapp className="w-4 h-4" aria-hidden />
                    Yes, Open WhatsApp
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
