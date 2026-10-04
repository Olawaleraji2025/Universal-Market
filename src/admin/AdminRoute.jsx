import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  selectAuthLoading,
  selectIsAuthenticated,
  selectUserRole,
  selectRoleStatus,
  clearAuth,
} from '../features/authSlice';
import { saveReturnTarget } from '../lib/authRedirect';
import { supabase } from '../supabaseClient';
import AccessDenied from './pages/AccessDenied';
import { toast } from 'sonner';

/**
 * AdminRoute Guard
 * 1. Session loading, or logged in but role not yet 'ready' or 'error': centered spinner.
 * 2. Not logged in: save return target, redirect to /login.
 * 3. Logged in, role !== 'admin' or role lookup failed: render AccessDenied.
 * 4. Admin: render children.
 */
export default function AdminRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthLoading = useSelector(selectAuthLoading);
  const role = useSelector(selectUserRole);
  const roleStatus = useSelector(selectRoleStatus);

  // Global listener for permission errors (code 42501) or session expiry in admin calls
  useEffect(() => {
    const handleAuthError = async (event) => {
      const err = event?.detail;
      if (err?.code === '42501' || err?.message?.toLowerCase().includes('jwt expired')) {
        toast.error('Session expired or access revoked', {
          description: 'Please log in again with administrator credentials.',
        });
        await supabase.auth.signOut();
        queryClient.clear();
        dispatch(clearAuth());
        saveReturnTarget(location);
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('admin-permission-denied', handleAuthError);
    return () => window.removeEventListener('admin-permission-denied', handleAuthError);
  }, [dispatch, navigate, location, queryClient]);

  // Step 1: Session loading, or logged in but role not yet 'ready' or 'error'
  const isRolePending = isAuthenticated && roleStatus !== 'ready' && roleStatus !== 'error';
  if (isAuthLoading || isRolePending) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 border-3 border-emerald-200 border-t-[#064e3b] rounded-full animate-spin"
            role="status"
            aria-label="Loading admin credentials"
          />
        </div>
      </div>
    );
  }

  // Step 2: Not logged in
  if (!isAuthenticated) {
    saveReturnTarget(location);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Step 3: Logged in, role is not 'admin', or the role lookup failed
  if (role !== 'admin' || roleStatus === 'error') {
    return <AccessDenied />;
  }

  // Step 4: Admin authorized
  return children;
}
