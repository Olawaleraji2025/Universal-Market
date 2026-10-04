import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { deleteProductImages } from '../lib/imageUtils';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useAdminProducts';
import { ADMIN_PRODUCT_QUERY_KEY } from './useAdminProduct';
import { toast } from 'sonner';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productName, imageNames = [] }) => {
      // 1. Delete the product row from DB first
      const { error } = await supabase
        .from('EachProductInformation')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete product from database');
      }

      // 2. If row deletion succeeded, clean up the images from storage
      if (imageNames.length > 0) {
        await deleteProductImages(imageNames);
      }

      return { id, productName };
    },
    onSuccess: (data) => {
      toast.success('Product deleted', {
        description: `"${data.productName}" has been removed from the shop.`,
      });

      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCT_QUERY_KEY, data.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
    onError: (err) => {
      toast.error('Could not delete product', {
        description: err.message || 'Database refused the request. Please try again.',
      });
    },
  });
}
