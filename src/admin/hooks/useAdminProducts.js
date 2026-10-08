import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { getProductImageUrl } from '../lib/imageUtils';
import { PRODUCT_STATUS } from '../lib/productConstants';

export const ADMIN_PRODUCTS_QUERY_KEY = 'admin-products';

export function getAvailabilityState(raw) {
  if (!raw) return { isSold: false, availability: null };

  const rawAvailability = raw.Availabilty ?? raw.availability ?? raw.Availability ?? null;
  const normalized = String(rawAvailability ?? '').trim().toUpperCase();
  const isSold = normalized === 'SOLD';

  return {
    isSold,
    availability: isSold ? 'SOLD' : null,
  };
}

export function getProductConditionLabel(raw) {
  if (!raw) return 'USED';

  const rawStatus = String(raw.ProductStatus ?? raw.ProductCondition ?? raw.condition ?? raw.Condition ?? '').trim();
  if (!rawStatus) return 'USED';

  const normalizedStatus = rawStatus.toUpperCase();
  if (normalizedStatus === 'NEW' || normalizedStatus === 'BRAND NEW') return 'NEW';
  if (normalizedStatus === 'USED' || normalizedStatus === 'SECOND HAND') return 'USED';
  if (normalizedStatus === 'FAIRLY USED' || normalizedStatus === 'FAIRLY_USED' || normalizedStatus === 'FAIRLY-USED') return 'FAIRLY USED';
  if (normalizedStatus === 'SOLD') return 'SOLD';

  return rawStatus.toUpperCase();
}

/**
 * Normalizes DB product row into standard admin product object
 */
export function normalizeAdminProduct(raw) {
  if (!raw) return null;

  // Extract filenames from ImageName
  let fileNames = [];
  if (Array.isArray(raw.ImageName)) {
    fileNames = raw.ImageName.filter(Boolean);
  } else if (typeof raw.ImageName === 'string' && raw.ImageName.trim()) {
    const trimmed = raw.ImageName.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        fileNames = Array.isArray(parsed) ? parsed.filter(Boolean) : [trimmed];
      } catch {
        fileNames = [trimmed];
      }
    } else {
      fileNames = [trimmed];
    }
  }

  // Fallback to ImageItems if ImageName is empty
  if (fileNames.length === 0 && raw.ImageItems) {
    fileNames = [raw.ImageItems];
  }

  const coverFileName = fileNames[0] || null;
  const coverImageUrl = coverFileName ? getProductImageUrl(coverFileName) : null;
  const { isSold, availability } = getAvailabilityState(raw);

  // Parse specifications
  let specifications = [];
  if (raw.ProductSpecifications && typeof raw.ProductSpecifications === 'object') {
    if (Array.isArray(raw.ProductSpecifications)) {
      specifications = raw.ProductSpecifications;
    } else {
      specifications = Object.entries(raw.ProductSpecifications).map(([k, v]) => ({
        key: k,
        value: String(v ?? ''),
      }));
    }
  }

  const condition = getProductConditionLabel(raw);

  return {
    id: raw.id,
    created_at: raw.created_at,
    productName: raw.ProductName || 'Unnamed Product',
    category: raw.Category || 'Other',
    price: Number(raw.ProductPrice) || 0,
    productStatus: condition,
    condition,
    isSold,
    availability,
    location: raw.Location || raw.ProductLocation || '',
    description: raw.ProductDescription || '',
    specifications,
    imageNames: fileNames,
    coverImageUrl,
    is_hidden: Boolean(raw.is_hidden),
    raw,
  };
}

export function useAdminProducts({
  search = '',
  category = 'all',
  status = 'all',
  page = 1,
  pageSize = 20,
} = {}) {
  return useQuery({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, { search, category, status, page, pageSize }],
    queryFn: async () => {
      // Clean query parameter
      const sanitizedSearch = search.replace(/[%_,]/g, '').trim();

      let query = supabase
        .from('EachProductInformation')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (sanitizedSearch) {
        query = query.ilike('ProductName', `%${sanitizedSearch}%`);
      }

      // Apply category filter
      if (category && category !== 'all') {
        query = query.eq('Category', category);
      }

      // Apply status filter
      if (status === 'in_stock') {
        query = query.neq('ProductStatus', 'Out of Stock');
      } else if (status === 'out_of_stock') {
        query = query.eq('ProductStatus', 'Out of Stock');
      } else if (status === 'hidden') {
        // If column exists
        query = query.eq('is_hidden', true);
      }

      // Order by created_at descending
      query = query.order('created_at', { ascending: false });

      // Apply pagination range
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        // If the error was due to is_hidden column not existing in DB yet, gracefully retry without hidden filter
        if (status === 'hidden' && error.message?.includes('is_hidden')) {
          return {
            products: [],
            totalCount: 0,
            page,
            pageSize,
            totalPages: 1,
          };
        }
        throw new Error(error.message || 'Failed to load products');
      }

      let products = (data || []).map(normalizeAdminProduct);
      if (status === 'in_stock') {
        products = products.filter((product) => !product?.isSold);
      } else if (status === 'out_of_stock') {
        products = products.filter((product) => product?.isSold);
      }

      const normalizedTotalCount = status === 'all' ? (count ?? products.length) : products.length;

      return {
        products,
        totalCount: normalizedTotalCount,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(normalizedTotalCount / pageSize)),
      };
    },
    staleTime: 30 * 1000,
  });
}
