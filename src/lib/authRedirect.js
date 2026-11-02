const AUTH_RETURN_KEY = 'auth_return_to';
const AUTH_PATHS = new Set([
  '/login',
  '/signup',
  '/forgot-password',
  '/update-password',
]);

export const isSafeInternalPath = (value) => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return false;
  }

  const firstSlash = value.indexOf('/');
  return !value.includes('\\') && !value.slice(0, firstSlash).includes(':');
};

const normalizeLocation = (value) => {
  if (!value) return null;

  if (typeof value === 'string') {
    return value;
  }

  const pathname = value.pathname || '/';
  const search = value.search || '';
  const hash = value.hash || '';

  return `${pathname}${search}${hash}`;
};

export const saveReturnTarget = (location) => {
  if (!location) return;

  const target = normalizeLocation(location.state?.from || location);
  if (!isSafeInternalPath(target) || AUTH_PATHS.has(target.split('?')[0].split('#')[0])) {
    return;
  }

  sessionStorage.setItem(AUTH_RETURN_KEY, JSON.stringify(target));
};

export const getStoredReturnTarget = () => {
  try {
    const raw = sessionStorage.getItem(AUTH_RETURN_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!isSafeInternalPath(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const clearReturnTarget = () => {
  sessionStorage.removeItem(AUTH_RETURN_KEY);
};

export const resolveAuthRedirect = (location, fallback = '/') => {
  const fromState = normalizeLocation(location?.state?.from);
  const storedTarget = getStoredReturnTarget();
  const resolvedTarget =
    (isSafeInternalPath(fromState) && fromState) ||
    storedTarget ||
    fallback ||
    '/';

  if (!resolvedTarget) {
    return fallback;
  }

  const cleanTarget = resolvedTarget.split('?')[0].split('#')[0];
  if (AUTH_PATHS.has(cleanTarget)) {
    return fallback;
  }

  return resolvedTarget;
};
