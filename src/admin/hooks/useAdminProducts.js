import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { getProductImageUrl } from '../lib/imageUtils';
import { PRODUCT_STATUS } from '../lib/productConstants';

export const ADMIN_PRODUCTS_QUERY_KEY = 'admin-products';

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

  // Normalize ProductStatus (e.g. legacy 'USED' or 'NEW' vs 'In Stock'/'Out of Stock')
  let status = PRODUCT_STATUS.IN_STOCK;
  const rawStatus = String(raw.ProductStatus || '').trim().toLowerCase();
  if (rawStatus === 'out of stock' || rawStatus === 'sold' || rawStatus === 'unavailable') {
    status = PRODUCT_STATUS.OUT_OF_STOCK;
  } else if (rawStatus === 'in stock' || rawStatus === 'available') {
    status = PRODUCT_STATUS.IN_STOCK;
  } else {
    // If legacy has 'USED' or 'NEW', treat as In Stock for catalog availability
    status = PRODUCT_STATUS.IN_STOCK;
  }

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

  return {
    id: raw.id,
    created_at: raw.created_at,
    productName: raw.ProductName || 'Unnamed Product',
    category: raw.Category || 'Other',
    price: Number(raw.ProductPrice) || 0,
    productStatus: status,
    condition: raw.ProductCondition || (['NEW', 'USED'].includes(raw.ProductStatus) ? raw.ProductStatus : 'Used'),
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

      const products = (data || []).map(normalizeAdminProduct);

      return {
        products,
        totalCount: count ?? products.length,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil((count ?? products.length) / pageSize)),
      };
    },
    staleTime: 30 * 1000,
  });
}
