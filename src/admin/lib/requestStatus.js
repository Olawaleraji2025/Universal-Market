/**
 * Universal Market - Admin Request Status Definitions and Rules
 */

export const REQUEST_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const STATUS_LIST = [
  REQUEST_STATUSES.PENDING,
  REQUEST_STATUSES.CONFIRMED,
  REQUEST_STATUSES.COMPLETED,
  REQUEST_STATUSES.CANCELLED,
];

export const STATUS_TABS = ['All', ...STATUS_LIST];

export function normalizeRequestStatus(status) {
  if (status == null || status === '') return REQUEST_STATUSES.PENDING;

  const value = String(status).trim();
  const match = Object.values(REQUEST_STATUSES).find(
    (item) => item.toLowerCase() === value.toLowerCase()
  );

  return match || value;
}

export const STATUS_COLORS = {
  Pending: {
    text: '#9a3412',
    bg: '#ffedd5',
    border: '#fed7aa',
    badgeClass: 'text-[#9a3412] bg-[#ffedd5] border-[#fed7aa]',
  },
  Confirmed: {
    text: '#1e40af',
    bg: '#dbeafe',
    border: '#bfdbfe',
    badgeClass: 'text-[#1e40af] bg-[#dbeafe] border-[#bfdbfe]',
  },
  Completed: {
    text: '#065f46',
    bg: '#d1fae5',
    border: '#a7f3d0',
    badgeClass: 'text-[#065f46] bg-[#d1fae5] border-[#a7f3d0]',
  },
  Cancelled: {
    text: '#334155',
    bg: '#e2e8f0',
    border: '#cbd5e1',
    badgeClass: 'text-[#334155] bg-[#e2e8f0] border-[#cbd5e1]',
  },
};

/**
 * Allowed status transitions:
 * - Pending -> Confirmed, Cancelled
 * - Confirmed -> Completed, Cancelled
 * - Completed -> None (final)
 * - Cancelled -> Pending (reopen)
 */
export const ALLOWED_STATUS_TRANSITIONS = {
  [REQUEST_STATUSES.PENDING]: [REQUEST_STATUSES.CONFIRMED, REQUEST_STATUSES.CANCELLED],
  [REQUEST_STATUSES.CONFIRMED]: [REQUEST_STATUSES.COMPLETED, REQUEST_STATUSES.CANCELLED],
  [REQUEST_STATUSES.COMPLETED]: [],
  [REQUEST_STATUSES.CANCELLED]: [REQUEST_STATUSES.PENDING],
};

export function getNextAllowedStatuses(currentStatus) {
  const normalizedCurrent = normalizeRequestStatus(currentStatus);
  return (ALLOWED_STATUS_TRANSITIONS[normalizedCurrent] || []).map((status) =>
    normalizeRequestStatus(status)
  );
}

export function isTerminalStatus(status) {
  return normalizeRequestStatus(status) === REQUEST_STATUSES.COMPLETED;
}

export function formatNaira(amount) {
  if (amount == null || amount === '') return null;
  const num = typeof amount === 'number' ? amount : Number(String(amount).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(num) || num <= 0) {
    if (typeof amount === 'string' && amount.trim()) return amount.trim();
    return null;
  }
  return `₦${num.toLocaleString('en-NG')}`;
}

export function formatDisplayDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Formats date for Dashboard: "2 Oct" for current year, "2 Oct 2025" for earlier years.
 */
export function formatDashboardDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const isThisYear = d.getFullYear() === currentYear;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      ...(isThisYear ? {} : { year: 'numeric' }),
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Customer rule: userName; show "Guest" when user_id is null and userName is empty.
 */
export function formatCustomerName(userName, userId) {
  const trimmed = (userName || '').trim();
  if (trimmed) return trimmed;
  if (!userId) return 'Guest';
  return 'Customer';
}

/**
 * Type rule: "Product Request" shows as "Product", "Custom Request" as "Custom".
 */
export function formatRequestType(reqType) {
  if (!reqType) return 'Product';
  const lower = reqType.toLowerCase();
  if (lower.includes('custom')) return 'Custom';
  if (lower.includes('product')) return 'Product';
  return reqType;
}

/**
 * Sidebar / Badge rule: pending count, hidden when 0, shows "99+" above 99.
 */
export function formatBadgeCount(count) {
  const num = Number(count) || 0;
  if (num <= 0) return null;
  if (num > 99) return '99+';
  return String(num);
}

/**
 * Numbers use thousands separators.
 */
export function formatNumber(val) {
  if (val == null || val === '') return '0';
  const num = Number(val);
  if (Number.isNaN(num)) return String(val);
  return num.toLocaleString('en-NG');
}

export function formatDisplayDateTime(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    const datePart = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timePart = d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${datePart}, ${timePart}`;
  } catch {
    return String(dateString);
  }
}
