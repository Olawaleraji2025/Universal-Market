import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';
import { ADMIN_SINGLE_REQUEST_KEY } from './useAdminRequest';
import { ADMIN_REQUESTS_QUERY_KEY } from './useAdminRequests';
import { ADMIN_COUNTS_QUERY_KEY } from './useRequestCounts';
import { normalizeRequestStatus } from '../lib/requestStatus';

/**
 * Hook to update a request's status and/or admin_notes.
 * Enforces that only { status, admin_notes } are transmitted.
 */
export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, admin_notes, isNoteSave = false }) => {
      if (!id) throw new Error('Request ID is required for update');

      const normalizedStatus = status !== undefined ? normalizeRequestStatus(status) : undefined;
      const payload = {};
      if (normalizedStatus !== undefined) payload.status = normalizedStatus;
      if (admin_notes !== undefined) payload.admin_notes = admin_notes;

      const { data, error } = await supabase
        .from('All_Requests')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, isNoteSave, updatedStatus: normalizedStatus };
    },

    onMutate: async ({ id, status, admin_notes }) => {
      const normalizedStatus = status !== undefined ? normalizeRequestStatus(status) : undefined;

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: [ADMIN_SINGLE_REQUEST_KEY, id] });

      // Snapshot the previous value
      const previousRequest = queryClient.getQueryData([ADMIN_SINGLE_REQUEST_KEY, id]);

      // Optimistically update to the new value
      if (previousRequest) {
        queryClient.setQueryData([ADMIN_SINGLE_REQUEST_KEY, id], (old) => {
          if (!old) return old;
          return {
            ...old,
            ...(normalizedStatus !== undefined ? { status: normalizedStatus } : {}),
            ...(admin_notes !== undefined ? { admin_notes } : {}),
          };
        });
      }

      return { previousRequest, id };
    },

    onError: (err, variables, context) => {
      // Rollback optimistic update
      if (context?.previousRequest && context?.id) {
        queryClient.setQueryData([ADMIN_SINGLE_REQUEST_KEY, context.id], context.previousRequest);
      }

      console.error('Update request failed:', err);
      const errorMsg = err?.message || 'Failed to update request. Please try again.';
      toast.error(errorMsg);
    },

    onSuccess: (result, variables) => {
      const nextStatus = variables.status !== undefined ? normalizeRequestStatus(variables.status) : undefined;

      if (variables.isNoteSave) {
        toast.success('Note saved.');
      } else if (nextStatus) {
        toast.success(`Marked as ${nextStatus}.`);
      }

      // Invalidate relevant queries: single request, list, counts, dashboard stats
      queryClient.invalidateQueries({ queryKey: [ADMIN_SINGLE_REQUEST_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_REQUESTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ADMIN_COUNTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-recent-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-requests'] });
    },
  });
}
