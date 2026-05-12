import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./redux/showPricingSlice"; // Import the form reducer

export const store = configureStore({
  reducer: {
    form: formReducer, // Register the form reducer
  },
});

export default store;
