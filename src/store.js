import { configureStore } from '@reduxjs/toolkit';
import shopSearchReducer from './features/shopSearchSlice';
import productDetailsClickedReducer from './features/productDetailsClicked';
import flowReducer from './features/FlowSlice';
import guestFormValidation from "./Hooks/formValidation"

export const store = configureStore({
  reducer: {
    shopSearch: shopSearchReducer,
    productDetailsClicked: productDetailsClickedReducer,
    flow: flowReducer,
    guestForm: guestFormValidation,
  },
});



