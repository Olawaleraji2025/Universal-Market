import React from 'react';
import { STATUS_COLORS } from '../lib/requestStatus';

/**
 * StatusBadge Component
 * Always renders the status text along with its distinct background and border color.
 * Never relies on color alone.
 */
export default function StatusBadge({ status = 'Pending', className = '', size = 'md' }) {
  const normalizedKey =
    Object.keys(STATUS_COLORS).find(
      (k) => k.toLowerCase() === (status || '').toLowerCase().trim()
    ) || 'Pending';

  const config = STATUS_COLORS[normalizedKey] || STATUS_COLORS.Pending;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-xs md:text-sm px-3 py-1 rounded-full font-semibold',
    lg: 'text-sm px-3.5 py-1.5 rounded-full font-bold',
  }[size] || 'text-xs px-3 py-1 rounded-full font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 border leading-none transition-colors ${config.badgeClass} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Status: ${normalizedKey}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.text }}
        aria-hidden="true"
      />
      <span>{normalizedKey}</span>
    </span>
  );
}
