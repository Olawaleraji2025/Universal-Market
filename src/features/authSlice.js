import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  session: null,
  profile: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
      state.user = action.payload?.user || null;
      state.loading = false;
      state.error = null;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuth(state) {
      state.user = null;
      state.session = null;
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setSession,
  setProfile,
  setAuthLoading,
  setAuthError,
  clearAuth,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectUserProfile = (state) => state.auth.profile;
export const selectUserRole = (state) =>
  state.auth.profile?.role ||
  state.auth.user?.user_metadata?.role ||
  (state.auth.user ? 'user' : 'guest');
export const selectIsAuthenticated = (state) => !!state.auth.user;

export default authSlice.reducer;
