import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';

export const ADMIN_REQUESTS_QUERY_KEY = 'admin-requests';

export function cleanSearchQuery(q) {
  if (!q || typeof q !== 'string') return '';
  return q.replace(/[,%]/g, '').trim();
}

export function normalizeAdminRequestItem(r) {
  const hasUser = Boolean(r?.user_id);
  const name = (r?.userName || '').trim();
  const customerName = name || (hasUser ? 'Registered User' : 'Guest');

  const rawReqType = (r?.ReqType || '').trim();
  const isProduct = rawReqType.toLowerCase() === 'product request' || rawReqType.toLowerCase() === 'product';
  const typeDisplay = isProduct ? 'Product' : 'Custom';

  return {
    ...r,
    id: r?.id,
    created_at: r?.created_at,
    userName: customerName,
    isGuest: !hasUser && !name,
    UserPhoneNumber: r?.UserPhoneNumber || '',
    ItemName: r?.ItemName || 'Untitled Request',
    ReqType: r?.ReqType,
    typeDisplay,
    isProduct,
    ItemPrice: r?.ItemPrice,
    ItemBudget: r?.ItemBudget,
    status: r?.status || 'Pending',
  };
}

async function fetchAdminRequests({ status = 'All', type = 'All', q = '', page = 1, limit = 20 }) {
  const pageIndex = Math.max(1, Number(page) || 1);
  const pageSize = Number(limit) || 20;
  const start = (pageIndex - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('All_Requests')
    .select('id, created_at, user_id, userName, UserPhoneNumber, ItemName, ReqType, ItemPrice, ItemBudget, status', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Filter by status if not "All"
  if (status && status !== 'All') {
    query = query.eq('status', status);
  }

  // Filter by type if not "All"
  if (type && type !== 'All') {
    if (type === 'Product') {
      query = query.eq('ReqType', 'Product Request');
    } else if (type === 'Custom') {
      query = query.eq('ReqType', 'Custom Request');
    } else {
      query = query.eq('ReqType', type);
    }
  }

  // Filter by search query across customer name, phone number, item name
  const cleanQ = cleanSearchQuery(q);
  if (cleanQ) {
    query = query.or(
      `userName.ilike.%${cleanQ}%,ItemName.ilike.%${cleanQ}%,UserPhoneNumber.ilike.%${cleanQ}%`
    );
  }

  // Pagination range
  query = query.range(start, end);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching admin requests:', error);
    throw error;
  }

  const items = (data || []).map(normalizeAdminRequestItem);
  const totalCount = count ?? items.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items,
    totalCount,
    totalPages,
    page: pageIndex,
    pageSize,
  };
}

export function useAdminRequests({ status = 'All', type = 'All', q = '', page = 1, limit = 20 } = {}) {
  const cleanQ = cleanSearchQuery(q);

  return useQuery({
    queryKey: [ADMIN_REQUESTS_QUERY_KEY, { status, type, q: cleanQ, page, limit }],
    queryFn: () => fetchAdminRequests({ status, type, q: cleanQ, page, limit }),
    staleTime: 1000 * 15, // 15 seconds
    placeholderData: (prev) => prev,
  });
}
