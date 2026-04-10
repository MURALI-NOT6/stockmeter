import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  currency: string;
  company: string;
}

const initialState: FilterState = {
  currency: "USD ($)",
  company: "Apple",
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
  },
});

export const { setCurrency, setCompany } = filterSlice.actions;
export default filterSlice.reducer;
