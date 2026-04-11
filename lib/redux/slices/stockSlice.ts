import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StockState {
  selectedRange: string;
}

const initialState: StockState = {
  selectedRange: "1d",
};

export const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setRange: (state, action: PayloadAction<string>) => {
      state.selectedRange = action.payload;
    },
  },
});

export const { setRange } = stockSlice.actions;
export default stockSlice.reducer;
