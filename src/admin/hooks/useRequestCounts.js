import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';

export const ADMIN_COUNTS_QUERY_KEY = ['admin-request-counts'];

/**
 * Fetches status counts using admin_request_counts RPC,
 * with resilient fallback to counting from All_Requests table if RPC fails.
 */
async function fetchAdminRequestCounts() {
  try {
    const { data, error } = await supabase.rpc('admin_request_counts');
    if (!error && data) {
      return {
        all: Number(data.all ?? data.All ?? 0),
        pending: Number(data.pending ?? data.Pending ?? 0),
        confirmed: Number(data.confirmed ?? data.Confirmed ?? 0),
        completed: Number(data.completed ?? data.Completed ?? 0),
        cancelled: Number(data.cancelled ?? data.Cancelled ?? 0),
      };
    }
  } catch (rpcErr) {
    console.warn('admin_request_counts RPC call failed, trying table fallback:', rpcErr);
  }

  // Resilient fallback: calculate counts from All_Requests table
  const { data: rows, error: tableError } = await supabase
    .from('All_Requests')
    .select('status');

  if (tableError) {
    console.error('Failed to fetch request counts from table fallback:', tableError);
    // Return zero counts rather than blowing up the entire page
    return {
      all: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
  }

  const counts = {
    all: rows?.length || 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  (rows || []).forEach((row) => {
    const s = (row?.status || '').toLowerCase().trim();
    if (s === 'pending') counts.pending += 1;
    else if (s === 'confirmed') counts.confirmed += 1;
    else if (s === 'completed') counts.completed += 1;
    else if (s === 'cancelled') counts.cancelled += 1;
  });

  return counts;
}

export function useRequestCounts() {
  return useQuery({
    queryKey: ADMIN_COUNTS_QUERY_KEY,
    queryFn: fetchAdminRequestCounts,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
