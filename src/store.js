import { configureStore } from '@reduxjs/toolkit';
import shopSearchReducer from './features/shopSearchSlice';
import productDetailsClickedReducer from './features/productDetailsClicked';
import flowReducer from './features/FlowSlice';
import guestFormValidation from "./Hooks/formValidation"
import wishlistReducer from './features/wishlistSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shopSearch: shopSearchReducer,
    productDetailsClicked: productDetailsClickedReducer,
    flow: flowReducer,
    guestForm: guestFormValidation,
    wishlist: wishlistReducer,
  },
});



