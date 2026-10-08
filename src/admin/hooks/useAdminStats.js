import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';

export const ADMIN_STATS_QUERY_KEY = ['admin-dashboard-stats'];

/**
 * Fetches high-level admin dashboard statistics:
 * { pending, confirmed, completed, products, out_of_stock }
 *
 * Tries the supabase.rpc('admin_dashboard_stats') function first.
 * If the function does not exist or fails, falls back gracefully to
 * counting directly from `All_Requests` and `EachProductInformation`.
 */
async function fetchAdminDashboardStats() {
  try {
    const { data, error } = await supabase.rpc('admin_dashboard_stats');
    if (!error && data) {
      return {
        pending: Number(data.pending ?? data.Pending ?? 0),
        confirmed: Number(data.confirmed ?? data.Confirmed ?? 0),
        completed: Number(data.completed ?? data.Completed ?? 0),
        products: Number(data.products ?? data.Products ?? 0),
        out_of_stock: Number(data.Availability ?? data.Availability ?? data.Availability ?? 0),
      };
    }

    if (error?.code === '42501') {
      window.dispatchEvent(new CustomEvent('admin-permission-denied', { detail: error }));
      throw error;
    }
  } catch (rpcErr) {
    if (rpcErr?.code === '42501') throw rpcErr;
    console.warn('admin_dashboard_stats RPC failed or missing, using table fallback:', rpcErr?.message || rpcErr);
  }

  // Resilient fallback: Query All_Requests & EachProductInformation
  const [requestsRes, productsRes] = await Promise.all([
    supabase.from('All_Requests').select('status'),
    supabase.from('EachProductInformation').select('Availability'),
  ]);

  if (requestsRes.error?.code === '42501' || productsRes.error?.code === '42501') {
    const err = requestsRes.error?.code === '42501' ? requestsRes.error : productsRes.error;
    window.dispatchEvent(new CustomEvent('admin-permission-denied', { detail: err }));
    throw err;
  }

  if (requestsRes.error && productsRes.error) {
    throw new Error('Failed to load dashboard statistics from database');
  }

  let pending = 0;
  let confirmed = 0;
  let completed = 0;

  (requestsRes.data || []).forEach((row) => {
    const s = (row?.status || '').toLowerCase().trim();
    if (s === 'pending') pending += 1;
    else if (s === 'confirmed') confirmed += 1;
    else if (s === 'completed') completed += 1;
  });

  const allProducts = productsRes.data || [];
  const productsCount = allProducts.length;
  let outOfStock = 0;

  allProducts.forEach((p) => {
    const status = (p?.Availability || p?.Availability || p?.Availability || p?.Availability || '').toString().trim().toUpperCase();
    if (status === 'SOLD' || status === 'SOLD' || status === 'SOLD' || status === 'SOLD') {
      outOfStock += 1;
    }
  });

  return {
    pending,
    confirmed,
    completed,
    products: productsCount,
    out_of_stock: outOfStock,
  };
}

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_STATS_QUERY_KEY,
    queryFn: fetchAdminDashboardStats,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
