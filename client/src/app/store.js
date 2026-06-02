import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "../features/company/companySlice";
import brandReducer from "../features/brand/brandSlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    brand: brandReducer,
  },
});
