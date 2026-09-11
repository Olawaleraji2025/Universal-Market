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
  
  const productImage =
    r?.ProductImage ||
    r?.ItemImage ||
    r?.itemImage ||
    r?.imageUrl ||
    r?.ImageUrl ||
    r?.image ||
    null;

  const rawReqType = r?.ReqType || r?.reqType || r?.req_type || '';
  const isProductRequest =
    rawReqType.trim().toLowerCase() === 'product request' ||
    (!rawReqType && Boolean(productImage));
  const reqType = isProductRequest ? 'Product Request' : (rawReqType || 'Custom Request');

  const itemPrice = r?.ItemPrice ?? r?.itemPrice ?? r?.price ?? r?.ProductPrice ?? null;
  const itemBudget = r?.ItemBudget ?? r?.itemBudget ?? r?.budget ?? null;

  return {
    ...r,
    id: r?.id,
    title: r?.ItemName || r?.title || r?.request_title || r?.name || 'Custom Request',
    specs: r?.ItemDetails || r?.userMessages || 'No extra specifications provided.',
    date: formattedDate || 'Recently',
    rawDate: rawDate,
    status: r?.status || 'Pending',
    ReqType: reqType,
    reqType: reqType,
    isProductRequest: isProductRequest,
    isCustom: !isProductRequest,
    category: r?.ItemCategory || r?.category || 'General',
    budget: itemBudget,
    ItemBudget: itemBudget,
    price: itemPrice,
    ItemPrice: itemPrice,
    contact: r?.UserPhoneNumber || r?.contact || '',
    ProductImage: productImage,
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

