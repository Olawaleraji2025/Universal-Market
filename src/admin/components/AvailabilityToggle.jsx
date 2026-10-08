import React from 'react';

export default function AvailabilityToggle({
  productName = 'Product',
  status = null,
  onChange,
  disabled = false,
  size = 'md', // 'sm' | 'md'
}) {
  const isSold = status === 'SOLD';

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled || !onChange) return;
    onChange(isSold ? null : 'SOLD');
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div className="inline-flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={isSold}
        aria-label={`${productName} ${isSold ? 'sold' : 'available'}`}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
          size === 'sm' ? 'h-6 w-11' : 'h-7 w-12'
        } ${isSold ? 'bg-[#475569]' : 'bg-[#047857]'}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'
          } ${isSold ? 'translate-x-0' : 'translate-x-5'}`}
        />
      </button>

      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none ${
          isSold
            ? 'bg-[#e2e8f0] text-[#334155] border border-[#cbd5e1]'
            : 'bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]'
        }`}
      >
        {isSold ? 'SOLD' : 'Available'}
      </span>
    </div>
  );
}
