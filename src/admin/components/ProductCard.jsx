import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, MoreVertical, Trash2, Image as ImageIcon, EyeOff } from 'lucide-react';
import AvailabilityToggle from './AvailabilityToggle';
import { PRODUCT_STATUS } from '../lib/productConstants';

export default function ProductCard({
  product,
  onToggleStatus,
  onDeleteProduct,
  isToggling = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isSold = Boolean(product?.isSold);
  const displayCondition = product.condition || product.productStatus || 'USED';
  const formattedPrice = `₦${Number(product.price).toLocaleString('en-NG')}`;

  // Close overflow menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  return (
    <div
      className={`relative bg-white rounded-[14px] border border-[#e2e8f0] p-4 shadow-xs transition-colors ${
        isSold ? 'bg-[#f8fafc]/60 opacity-80' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail on left */}
        <div className="w-16 h-16 rounded-[12px] bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden flex items-center justify-center shrink-0">
          {product.coverImageUrl ? (
            <img
              src={product.coverImageUrl}
              alt={product.productName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#94a3b8]" />
          )}
        </div>

        {/* Info in middle */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              to={`/admin/products/${product.id}/edit`}
              className="font-bold text-sm text-[#01241a] hover:text-[#047857] truncate block"
            >
              {product.productName}
            </Link>
            {product.is_hidden && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#e2e8f0] text-[#475569]">
                <EyeOff className="w-2.5 h-2.5" />
                Hidden
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-[#475569]">
            <span className="font-semibold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded-[6px]">
              {product.category}
            </span>
            {/* <span>•</span>
            <span>{product.condition}</span> */}
          </div>

          <div className="mt-1.5 font-bold text-sm text-[#01241a]">
            {formattedPrice}
          </div>
        </div>

        {/* Right action & overflow menu */}
        <div className="flex items-center gap-1 shrink-0" ref={menuRef}>
          <Link
            to={`/admin/products/${product.id}/edit`}
            aria-label={`Edit ${product.productName}`}
            className="w-10 h-10 rounded-[8px] flex items-center justify-center text-[#047857] hover:bg-[#ecfdf5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
          >
            <Edit2 className="w-4 h-4" />
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="More actions"
              aria-expanded={menuOpen}
              className="w-10 h-10 rounded-[8px] flex items-center justify-center text-[#475569] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#047857]"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 w-44 bg-white rounded-[10px] shadow-lg border border-[#e2e8f0] py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100"
              >
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  role="menuitem"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#01241a] hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#047857]" />
                  <span>Edit details</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteProduct(product);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#b91c1c] hover:bg-rose-50 text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete product</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#475569]">Condition:</span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            displayCondition === 'NEW'
              ? 'bg-emerald-100 text-emerald-800'
              : displayCondition === 'FAIRLY USED'
                ? 'bg-amber-100 text-amber-800'
                : displayCondition === 'SOLD'
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-violet-100 text-violet-800'
          }`}
        >
          {displayCondition}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[#475569]">Availability:</span>
        <AvailabilityToggle
          productName={product.productName}
          status={product.availability || (isSold ? 'SOLD' : null)}
          disabled={isToggling}
          size="sm"
          onChange={(newStatus) =>
            onToggleStatus(product.id, newStatus, product.productName)
          }
        />
      </div>
    </div>
  );
}
