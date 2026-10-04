import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useAdminProducts';
import { ADMIN_PRODUCT_QUERY_KEY } from './useAdminProduct';
import { PRODUCT_STATUS } from '../lib/productConstants';
import { toast } from 'sonner';

export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const { data, error } = await supabase
        .from('EachProductInformation')
        .update({ ProductStatus: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update product status');
      }

      return data;
    },
    // Optimistic update
    onMutate: async ({ id, newStatus, productName }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData([ADMIN_PRODUCTS_QUERY_KEY]);

      // Optimistically update list queries
      queryClient.setQueriesData({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] }, (old) => {
        if (!old || !old.products) return old;
        return {
          ...old,
          products: old.products.map((p) =>
            p.id === id ? { ...p, productStatus: newStatus } : p
          ),
        };
      });

      return { previousData, id, newStatus, productName };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueriesData(
          { queryKey: [ADMIN_PRODUCTS_QUERY_KEY] },
          context.previousData
        );
      }
      toast.error('Failed to update availability', {
        description: err.message || 'Please check your connection and try again.',
      });
    },
    onSuccess: (data, variables) => {
      const statusLabel =
        variables.newStatus === PRODUCT_STATUS.IN_STOCK ? 'in stock' : 'out of stock';

      toast.success(`${variables.productName || 'Product'} marked as ${statusLabel}`, {
        description: 'Changes are reflected across the catalogue.',
      });

      // Invalidate queries to ensure fresh server state
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCT_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}
