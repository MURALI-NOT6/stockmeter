import { createSlice } from "@reduxjs/toolkit";

interface MarketData {
  totalMarketValue: string;
  todaysGainLoss: string;
  portfolioValue: string;
  topPerformingStock: string;
  analysis: string;
}

interface MarketState {
  data: MarketData;
}

const initialState: MarketState = {
  data: {
    totalMarketValue: "$12,450,210",
    todaysGainLoss: "+$84,210 (1.2%)",
    portfolioValue: "$450,120",
    topPerformingStock: "NVDA (NVIDIA)",
    analysis: "Dashboard operating with local high-fidelity data feeds. Institutional flows remain stable.",
  },
};

export const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    // We could add local data update actions here if needed later
  },
});

export default marketSlice.reducer;
