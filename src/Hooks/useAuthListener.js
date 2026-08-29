import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import {
  setSession,
  setProfile,
  clearAuth,
  setAuthLoading,
} from '../features/authSlice';

export const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(true));

    const fetchUserProfile = async (userId) => {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data && !error) {
          dispatch(setProfile(data));
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    // 1. Initial Session Check on app mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setSession(session));
        if (session.user?.id) {
          fetchUserProfile(session.user.id);
        }
      } else {
        dispatch(clearAuth());
      }
      dispatch(setAuthLoading(false));
    });

    // 2. Real-time subscription to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        dispatch(setSession(session));
        await fetchUserProfile(session.user.id);
      } else {
        dispatch(clearAuth());
      }
      dispatch(setAuthLoading(false));
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);
};

export default useAuthListener;
