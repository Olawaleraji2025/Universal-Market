import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/authSlice';

export const normalizeRequest = (r) => {
  const rawDate = r?.created_at || r?.date;
  let formattedDate = '';
  if (rawDate) {
    try {
      formattedDate = new Date(rawDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      formattedDate = String(rawDate);
    }
  }

  return {
    ...r,
    id: r?.id,
    title: r?.ItemName || r?.title || r?.request_title || r?.name || 'Custom Request',
    specs:
      r?.ItemDetails ||
      r?.specs ||
      r?.description ||
      r?.details ||
      (r?.ItemCategory ? `Category: ${r.ItemCategory}` : 'No additional specifications provided'),
    date: formattedDate || 'Recently',
    rawDate: rawDate,
    status: r?.status || 'Pending',
    isCustom: r?.is_custom !== undefined ? !!r.is_custom : true,
    category: r?.ItemCategory || r?.category || 'General',
    budget: r?.ItemBudget || r?.budget || null,
    contact: r?.UserPhoneNumber || r?.contact || '',
  };
};

const fetchUserRequests = async (userId) => {
  let query = supabase
    .from('All_Requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: requests, error } = await query;

  if (error) {
    // If filtering by user_id fails or table doesn't have RLS / matches, fallback to general fetch
    const fallback = await supabase
      .from('All_Requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (fallback.error) throw fallback.error;
    return (fallback.data ?? []).map(normalizeRequest);
  }

  // If user is logged in and has specific requests, return them; otherwise if empty fallback to general requests
  if (userId && (!requests || requests.length === 0)) {
    const fallback = await supabase
      .from('All_Requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!fallback.error && fallback.data && fallback.data.length > 0) {
      return fallback.data.map(normalizeRequest);
    }
  }

  return (requests ?? []).map(normalizeRequest);
};

export default function useUserRequests(options = {}) {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || null;

  const query = useQuery({
    queryKey: ['userRequests', userId],
    queryFn: () => fetchUserRequests(userId),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  return useMemo(() => query, [query]);
}

