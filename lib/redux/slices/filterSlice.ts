import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  currency: string;
  company: string;
  sector: string;
  view: "market" | "detailed";
  sortOrder: "high-to-low" | "low-to-high";
}

const initialState: FilterState = {
  currency: "USD ($)",
  company: "Apple",
  sector: "All Sectors",
  view: "market",
  sortOrder: "high-to-low",
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setCompany: (state, action: PayloadAction<string>) => {
      state.company = action.payload;
    },
    setSector: (state, action: PayloadAction<string>) => {
      state.sector = action.payload;
    },
    setView: (state, action: PayloadAction<"market" | "detailed">) => {
      state.view = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"high-to-low" | "low-to-high">) => {
      state.sortOrder = action.payload;
    },
  },
});

export const { setCurrency, setCompany, setSector, setView, setSortOrder } = filterSlice.actions;
export default filterSlice.reducer;
