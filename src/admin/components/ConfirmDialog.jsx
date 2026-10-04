import React, { useEffect, useRef } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Cancel this request?',
  description = 'The customer will see it as cancelled.',
  confirmText = 'Yes, cancel',
  cancelText = 'Keep request',
  onConfirm,
  onCancel,
  isDestructive = true,
  isLoading = false,
}) {
  const cancelBtnRef = useRef(null);

  // Focus trap / escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    // Auto-focus the cancel button when opened
    cancelBtnRef.current?.focus();

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-[14px] shadow-xl border border-[#e2e8f0] w-full max-w-md p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="confirm-dialog-title" className="text-lg font-bold text-[#01241a]">
                {title}
              </h3>
              <p id="confirm-dialog-desc" className="mt-1.5 text-sm text-[#475569]">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#047857]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-[44px] px-4 py-2.5 rounded-[10px] border border-[#e2e8f0] bg-white text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`min-h-[44px] px-4 py-2.5 rounded-[10px] text-sm font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
              isDestructive
                ? 'bg-rose-700 hover:bg-rose-800 text-white focus:ring-rose-600'
                : 'bg-[#047857] hover:bg-[#064e3b] text-white focus:ring-[#047857]'
            }`}
          >
            {isLoading ? 'Updating...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
