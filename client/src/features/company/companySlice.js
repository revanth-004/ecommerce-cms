import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/organizers";

export const fetchCompanies = createAsyncThunk(
  "company/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);
const getSavedCompany = () => {
  try {
    const saved = localStorage.getItem("selectedCompany");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const companySlice = createSlice({
  name: "company",
  initialState: {
    list: [],
    selectedCompany: getSavedCompany(),
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
      localStorage.setItem("selectedCompany", JSON.stringify(action.payload));
    },
    resetStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        if (!state.selectedCompany && action.payload.length > 0) {
          state.selectedCompany = action.payload[0];
          localStorage.setItem(
            "selectedCompany",
            JSON.stringify(action.payload[0]),
          );
        }
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedCompany, resetStatus } = companySlice.actions;
export default companySlice.reducer;
