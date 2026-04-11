import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  currency: string;
  company: string;
  sector: string;
}

const initialState: FilterState = {
  currency: "USD ($)",
  company: "Apple",
  sector: "All Sectors",
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
  },
});

export const { setCurrency, setCompany, setSector } = filterSlice.actions;
export default filterSlice.reducer;
