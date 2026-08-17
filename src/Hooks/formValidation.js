import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // store validated/entered values
  formData: {
    fullName: "",
    contact: "",
    message: "",
    termsAccepted: false,
  },
  // store validation errors keyed by field name
  errors: {},
};

const guestFormValidation = createSlice({
  name: 'formValid',
  initialState,
  reducers: {
    // payload should be a full formData object
    validate(state, action) {
      state.formData = action.payload;
    },
    // payload should be an errors object: { fullName?: string[], contact?: string[], ... }
    errors(state, action) {
      state.errors = action.payload;
    },
    resetForm(state) {
      state.formData = initialState.formData;
      state.errors = initialState.errors;
    },
  },
});

export const { validate, errors, resetForm } = guestFormValidation.actions;
export default guestFormValidation.reducer;


