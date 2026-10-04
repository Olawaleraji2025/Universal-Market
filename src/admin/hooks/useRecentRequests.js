import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';

export const RECENT_REQUESTS_QUERY_KEY = ['admin-recent-requests'];

/**
 * Fetches the 5 most recent customer requests from `All_Requests` table.
 */
async function fetchRecentRequests() {
  const { data, error } = await supabase
    .from('All_Requests')
    .select('id, created_at, userName, ItemName, ReqType, status, user_id')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    if (error.code === '42501') {
      window.dispatchEvent(new CustomEvent('admin-permission-denied', { detail: error }));
    }
    throw new Error(error.message || 'Failed to fetch recent requests');
  }

  return data || [];
}

export function useRecentRequests() {
  return useQuery({
    queryKey: RECENT_REQUESTS_QUERY_KEY,
    queryFn: fetchRecentRequests,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
