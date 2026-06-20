import { createSlice } from "@reduxjs/toolkit";

// Controls which step is shown in RequestModal.
// chooser -> show GuestCard/LoginCard
// guest    -> show GuestForm
const initialState = {
  step: "chooser",
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    loginSetStep(state) {
      state.step = "login";
    },
    SignupSetStep(state) {
      state.step = "signup";
    },
    SuccessSetStep(state) {
      state.step = "success";
    },
    resetFlow(state) {
      state.step = "chooser";
    },
  },
});

export const { setStep, loginSetStep, SignupSetStep, resetFlow, SuccessSetStep } = flowSlice.actions;
export default flowSlice.reducer;

