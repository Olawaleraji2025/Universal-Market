import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { normalizeAdminProduct } from './useAdminProducts';
import { getProductImageUrl } from '../lib/imageUtils';

export const ADMIN_PRODUCT_QUERY_KEY = 'admin-product';

export function useAdminProduct(id) {
  return useQuery({
    queryKey: [ADMIN_PRODUCT_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('EachProductInformation')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message || 'Product not found');
      }

      const normalized = normalizeAdminProduct(data);

      // Pre-map images into form structure
      const formattedImages = (normalized.imageNames || []).map((name, index) => ({
        id: `existing-${index}-${name}`,
        fileName: name,
        url: getProductImageUrl(name),
        isCover: index === 0,
        isNew: false,
      }));

      return {
        ...normalized,
        formattedImages,
      };
    },
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}
