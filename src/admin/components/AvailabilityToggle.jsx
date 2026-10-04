import React from 'react';
import { PRODUCT_STATUS } from '../lib/productConstants';

export default function AvailabilityToggle({
  productName = 'Product',
  status = PRODUCT_STATUS.IN_STOCK,
  onChange,
  disabled = false,
  size = 'md', // 'sm' | 'md'
}) {
  const isInStock = status === PRODUCT_STATUS.IN_STOCK;

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled || !onChange) return;
    const nextStatus = isInStock
      ? PRODUCT_STATUS.OUT_OF_STOCK
      : PRODUCT_STATUS.IN_STOCK;
    onChange(nextStatus);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div className="inline-flex items-center gap-2.5">
      {/* Switch element */}
      <button
        type="button"
        role="switch"
        aria-checked={isInStock}
        aria-label={`${productName} ${isInStock ? 'in stock' : 'out of stock'}`}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
          size === 'sm' ? 'h-6 w-11' : 'h-7 w-12'
        } ${isInStock ? 'bg-[#047857]' : 'bg-[#cbd5e1]'}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'
          } ${
            isInStock
              ? size === 'sm'
                ? 'translate-x-5'
                : 'translate-x-5'
              : 'translate-x-0'
          }`}
        />
      </button>

      {/* Explicit visual label badge */}
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none ${
          isInStock
            ? 'bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]'
            : 'bg-[#e2e8f0] text-[#334155] border border-[#cbd5e1]'
        }`}
      >
        {isInStock ? 'In stock' : 'Out of stock'}
      </span>
    </div>
  );
}
