import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ProductDeleteDialog({
  isOpen,
  productName = 'this product',
  onConfirmDelete,
  onMarkOutOfStock,
  onCancel,
  isLoading = false,
}) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

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
      aria-labelledby="delete-product-title"
      aria-describedby="delete-product-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-[14px] shadow-xl border border-[#e2e8f0] w-full max-w-md p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-[#b91c1c]">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="delete-product-title" className="text-lg font-bold text-[#01241a]">
                Delete {productName}?
              </h3>
              <p id="delete-product-desc" className="mt-1.5 text-sm text-[#475569]">
                This cannot be undone. The product will be removed from the shop and its photos will be deleted.
              </p>

              {/* Gentle alternative link */}
              {onMarkOutOfStock && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onMarkOutOfStock}
                    className="text-xs font-semibold text-[#047857] hover:text-[#064e3b] underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#047857] rounded"
                  >
                    Mark as out of stock instead
                  </button>
                </div>
              )}
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
            className="min-h-[44px] px-4 py-2.5 rounded-[10px] border border-[#e2e8f0] bg-white text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#047857] disabled:opacity-50"
          >
            Keep product
          </button>

          <button
            type="button"
            onClick={onConfirmDelete}
            disabled={isLoading}
            className="min-h-[44px] px-4 py-2.5 rounded-[10px] bg-[#b91c1c] hover:bg-rose-800 text-white text-sm font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-600 disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
