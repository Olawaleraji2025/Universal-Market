import { createSlice } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

export const WISHLIST_STORAGE_KEY = 'universal-market-wishlist';
export const GUEST_WISHLIST_STORAGE_KEY = 'universal-market-wishlist-guest';

let activeWishlistUserId = null;

export const setActiveWishlistUser = (userId) => {
  activeWishlistUserId = userId || null;
};

export const getWishlistStorageKey = (userId = activeWishlistUserId) => {
  if (userId) {
    return `universal-market-wishlist-user-${userId}`;
  }

  return GUEST_WISHLIST_STORAGE_KEY;
};

export const normalizeWishlistIds = (ids = []) => {
  const uniqueIds = new Set((ids || []).filter(Boolean).map(String));
  return [...uniqueIds];
};

export const readGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_STORAGE_KEY);
    return raw ? normalizeWishlistIds(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
};

export const readWishlist = (userId = activeWishlistUserId) => {
  try {
    const raw = localStorage.getItem(getWishlistStorageKey(userId));
    return raw ? normalizeWishlistIds(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
};

export const writeWishlist = (ids, userId = activeWishlistUserId) => {
  try {
    const key = getWishlistStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(normalizeWishlistIds(ids)));
  } catch {
    // ignore
  }
};

export const mergeWishlistIds = (localIds = [], remoteIds = []) => {
  return normalizeWishlistIds([...(localIds || []), ...(remoteIds || [])]);
};

export const fetchWishlistFromSupabase = async (user) => {
  if (!user?.id) return [];

  try {
    const metadataWishlist = Array.isArray(user.user_metadata?.wishlist)
      ? user.user_metadata.wishlist
      : [];

    if (metadataWishlist.length) {
      return normalizeWishlistIds(metadataWishlist);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('wishlist')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('Unable to fetch wishlist from profiles table:', error.message);
      return [];
    }

    if (Array.isArray(data?.wishlist)) {
      return normalizeWishlistIds(data.wishlist);
    }

    return [];
  } catch (err) {
    console.error('Failed to read wishlist from Supabase:', err);
    return [];
  }
};

export const canSyncWishlistToSupabase = (userId) => {
  return Boolean(userId) && activeWishlistUserId === userId;
};

export const syncWishlistToSupabase = async (wishlistIds, user) => {
  if (!user?.id || !canSyncWishlistToSupabase(user.id)) return [];

  const ids = normalizeWishlistIds(wishlistIds);

  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, wishlist: ids }, { onConflict: 'id' });

    if (profileError) {
      console.warn('Failed to save wishlist to profiles table:', profileError.message);
    }

    return ids;
  } catch (err) {
    console.error('Failed to sync wishlist to Supabase:', err);
    return ids;
  }
};

const initialState = {
  wishlistIds: readWishlist(),
  selectedIds: [],
};

const slice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist(state, action) {
      state.wishlistIds = (action.payload || []).map(String);
      // Clean up selectedIds to keep only valid items
      state.selectedIds = state.selectedIds.filter((s) => state.wishlistIds.includes(String(s)));
      writeWishlist(state.wishlistIds);
    },
    clearWishlist(state) {
      state.wishlistIds = [];
      state.selectedIds = [];
      writeWishlist([]);
    },
    toggleWishlist(state, action) {
      const id = String(action.payload);
      const set = new Set(state.wishlistIds.map(String));
      if (set.has(id)) {
        state.wishlistIds = state.wishlistIds.filter((i) => String(i) !== id);
        // also clear selection for removed id
        state.selectedIds = state.selectedIds.filter((s) => String(s) !== id);
      } else {
        state.wishlistIds = [...state.wishlistIds, id];
      }
      writeWishlist(state.wishlistIds);
    },
    removeWishlistItem(state, action) {
      const id = String(action.payload);
      state.wishlistIds = state.wishlistIds.filter((i) => String(i) !== id);
      state.selectedIds = state.selectedIds.filter((s) => String(s) !== id);
      writeWishlist(state.wishlistIds);
    },
    toggleSelected(state, action) {
      const id = String(action.payload);
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((s) => s !== id);
      } else {
        state.selectedIds = [...state.selectedIds, id];
      }
    },
    clearSelected(state) {
      state.selectedIds = [];
    },
    selectAll(state, action) {
      // payload: array of ids to select
      state.selectedIds = action.payload.map(String);
    },
    deselectAll(state) {
      state.selectedIds = [];
    },
  },
});

export const {
  setWishlist,
  clearWishlist,
  toggleWishlist,
  removeWishlistItem,
  toggleSelected,
  clearSelected,
  selectAll,
  deselectAll,
} = slice.actions;

export const selectWishlistIds = (state) => state.wishlist.wishlistIds;
export const selectSelectedIds = (state) => state.wishlist.selectedIds;
export const selectSelectedCount = (state) => state.wishlist.selectedIds.length;

export default slice.reducer;
