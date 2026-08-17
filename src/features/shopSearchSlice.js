import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
};

const shopSearchSlice = createSlice({
  name: 'shopSearch',
  initialState,
  reducers: {
    setShopSearchQuery(state, action) {
      state.query = action.payload ?? '';
    },
    clearShopSearchQuery(state) {
      state.query = '';
    },
  },
});

export const { setShopSearchQuery, clearShopSearchQuery } = shopSearchSlice.actions;
export default shopSearchSlice.reducer;

