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
  if (!userId) return [];

  const { data: requests, error } = await supabase
    .from('All_Requests')
    .select('id, created_at, ItemName, ItemDetails, status, ReqType, ItemCategory, ItemImage, ItemPrice, ItemBudget, UserPhoneNumber')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (requests ?? []).map(normalizeRequest);
};

export default function useUserRequests(options = {}) {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || null;

  const query = useQuery({
    queryKey: ['userRequests', userId],
    queryFn: () => fetchUserRequests(userId),
    staleTime: 0.5 * 60 * 1000,
    ...options,
  });

  return useMemo(() => query, [query]);
}
