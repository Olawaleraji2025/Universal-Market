import { configureStore } from '@reduxjs/toolkit';
import shopSearchReducer from './features/shop/shopSearchSlice';
import productDetailsClickedReducer from './features/shop/productDetailsClicked';
import flowReducer from './features/shop/FlowContext';

export const store = configureStore({
  reducer: {
    shopSearch: shopSearchReducer,
    productDetailsClicked: productDetailsClickedReducer,
    flow: flowReducer,
  },
});



