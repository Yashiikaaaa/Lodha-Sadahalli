import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formSubmitted: false,
};

const formSlice = createSlice({
  name: "showPricing",
  initialState,
  reducers: {
    submitForm: (state) => {
      state.formSubmitted = true;
    },
    resetForm: (state) => {
      state.formSubmitted = false;
    },
  },
});

export const { submitForm, resetForm } = formSlice.actions;
export default formSlice.reducer;
