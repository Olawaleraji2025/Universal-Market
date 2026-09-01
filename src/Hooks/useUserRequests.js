import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const fetchUserRequests = async () => {
  const { data: requests, error } = await supabase
    .from('All_Requests')
    .select('*')
    // .order('created_at', { ascending: false });

  if (error) throw error;

  // Normalize minimal fields expected by RequestCard
  return (requests ?? []).map((r) => ({
    ...r,
    // id: r.id,
    title: r.ItemName || r.ItemName || r.ItemName || 'Request',
    // specs: r.ItemDetails || r.ItemDetails || r.ItemDetails || '',
    date: r.created_at,
    status: r.status || 'Pending',
    // isCustom: !!r.is_custom,
  }));
};

export default function useUserRequests(options = {}) {
  const query = useQuery({
    queryKey: ['userRequests'],
    queryFn: fetchUserRequests,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  return useMemo(() => query, [query]);
}
