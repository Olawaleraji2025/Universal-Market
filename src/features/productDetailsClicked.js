import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Stores the product object that was clicked on the previous page
  clickedProduct: null,
};

const productDetailsClickedSlice = createSlice({
  name: 'productDetailsClicked',
  initialState,
  reducers: {
    setClickedProduct(state, action) {
      state.clickedProduct = action.payload ?? null;
    },
    clearClickedProduct(state) {
      state.clickedProduct = null;
    },
  },
});

export const { setClickedProduct, clearClickedProduct } = productDetailsClickedSlice.actions;
export default productDetailsClickedSlice.reducer;

