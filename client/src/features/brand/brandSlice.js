import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/brands";

export const fetchBrandsByCompany = createAsyncThunk(
  "brand/fetchByCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}?companyId=${companyId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const brandSlice = createSlice({
  name: "brand",
  initialState: {
    list: [],
    selectedBrand: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearBrands: (state) => {
      state.list = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandsByCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsByCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchBrandsByCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearBrands } = brandSlice.actions;
export default brandSlice.reducer;
