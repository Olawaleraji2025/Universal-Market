import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import {
  setSession,
  setProfile,
  setRoleStatus,
  clearAuth,
  setAuthLoading,
} from '../features/authSlice';
import {
  fetchWishlistFromSupabase,
  mergeWishlistIds,
  readWishlist,
  setActiveWishlistUser,
  setWishlist,
  syncWishlistToSupabase,
} from '../features/wishlistSlice';

export const useAuthListener = () => {
  const dispatch = useDispatch();
  const currentUserId = useRef(null);

  useEffect(() => {
    dispatch(setAuthLoading(true));

    const fetchUserProfile = async (userId, { silent = false } = {}) => {
      if (!userId) {
        if (!silent) dispatch(setRoleStatus('idle'));
        return;
      }
      try {
        if (!silent) dispatch(setRoleStatus('loading'));
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data && !error) {
          dispatch(setProfile(data));
        } else if (!silent) {
          dispatch(setRoleStatus('error'));
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        if (!silent) dispatch(setRoleStatus('error'));
      }
    };

    const hydrateWishlistAfterLogin = async (user) => {
      if (!user?.id) return;

      const guestWishlist = readWishlist(null);
      const remoteWishlist = await fetchWishlistFromSupabase(user);
      const mergedWishlist = mergeWishlistIds(guestWishlist, remoteWishlist);

      setActiveWishlistUser(user.id);
      dispatch(setWishlist(mergedWishlist));
      await syncWishlistToSupabase(mergedWishlist, user);
    };

    // 1. Initial Session Check on app mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        currentUserId.current = session.user?.id ?? null;
        dispatch(setSession(session));
        if (session.user?.id) {
          await fetchUserProfile(session.user.id);
          await hydrateWishlistAfterLogin(session.user);
        }
      } else {
        setActiveWishlistUser(null);
        dispatch(clearAuth());
      }
      dispatch(setAuthLoading(false));
    });

    // 2. Real-time subscription to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        if (!session?.user) {
          currentUserId.current = null;
          setActiveWishlistUser(null);
          dispatch(clearAuth());
          dispatch(setAuthLoading(false));
          return;
        }

        const newId = session.user.id;
        if (newId === currentUserId.current) {
          if (event === 'TOKEN_REFRESHED') {
            dispatch(setSession(session));
          }
          return;
        }

        currentUserId.current = newId;
        dispatch(setSession(session));
        await fetchUserProfile(newId);
        await hydrateWishlistAfterLogin(session.user);
        dispatch(setAuthLoading(false));
      }, 0);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);
};

export default useAuthListener;
