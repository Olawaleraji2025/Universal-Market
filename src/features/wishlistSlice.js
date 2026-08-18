import { createSlice } from '@reduxjs/toolkit';

const WISHLIST_STORAGE_KEY = 'universal-market-wishlist';

const readWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeWishlist = (ids) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
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
