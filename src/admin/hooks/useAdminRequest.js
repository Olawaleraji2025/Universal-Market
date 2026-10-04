import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';

export const ADMIN_SINGLE_REQUEST_KEY = 'admin-request';

export function normalizeSingleRequest(r) {
  if (!r) return null;
  const hasUser = Boolean(r?.user_id);
  const name = (r?.userName || '').trim();
  const customerName = name || (hasUser ? 'Registered user' : 'Guest');

  const rawReqType = (r?.ReqType || '').trim();
  const isProduct = rawReqType.toLowerCase() === 'product request' || rawReqType.toLowerCase() === 'product';
  const typeDisplay = isProduct ? 'Product' : 'Custom';

  return {
    ...r,
    id: r.id,
    created_at: r.created_at,
    updated_at: r.updated_at,
    user_id: r.user_id,
    userName: customerName,
    rawUserName: name,
    isGuest: !hasUser && !name,
    isRegisteredUser: hasUser,
    UserPhoneNumber: r.UserPhoneNumber || '',
    ReqType: r.ReqType || (isProduct ? 'Product Request' : 'Custom Request'),
    typeDisplay,
    isProduct,
    ItemName: r.ItemName || 'Untitled Request',
    ItemCategory: r.ItemCategory || 'General',
    ItemDetails: r.ItemDetails || '',
    ItemBudget: r.ItemBudget,
    ItemPrice: r.ItemPrice,
    ItemImage: r.ItemImage || r.ProductImage || null,
    status: r.status || 'Pending',
    admin_notes: r.admin_notes || '',
  };
}

async function fetchAdminRequestById(id) {
  if (!id) return null;

  const { data, error } = await supabase
    .from('All_Requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin request detail:', error);
    throw error;
  }

  return normalizeSingleRequest(data);
}

export function useAdminRequest(id) {
  return useQuery({
    queryKey: [ADMIN_SINGLE_REQUEST_KEY, id],
    queryFn: () => fetchAdminRequestById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 20,
  });
}
