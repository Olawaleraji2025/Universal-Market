import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useAdminProducts';
import { ADMIN_PRODUCT_QUERY_KEY } from './useAdminProduct';
import { toast } from 'sonner';

export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const nextAvailability = newStatus === 'SOLD' ? 'SOLD' : null;
      const payload = { Availability: nextAvailability };

      let { data, error } = await supabase
        .from('EachProductInformation')
        .update(payload)
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
      await queryClient.cancelQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });

      const previousData = queryClient.getQueryData([ADMIN_PRODUCTS_QUERY_KEY]);

      queryClient.setQueriesData({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] }, (old) => {
        if (!old || !old.products) return old;
        return {
          ...old,
          products: old.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  isSold: newStatus === 'SOLD',
                  availability: newStatus === 'SOLD' ? 'SOLD' : null,
                }
              : p
          ),
        };
      });

      return { previousData, id, newStatus, productName };
    },
    onError: (err, variables, context) => {
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
      const statusLabel = variables.newStatus === 'SOLD' ? 'sold' : 'available';

      toast.success(`${variables.productName || 'Product'} marked as ${statusLabel}`, {
        description: 'Changes are reflected across the catalogue.',
      });

      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCT_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}
