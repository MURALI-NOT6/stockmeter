import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS, CURRENCY_TICKER_MAP } from "@/lib/constants/api";

interface StockQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  marketCap: number;
  trailingPE: number;
  forwardPE: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketVolume: number;
  averageDailyVolume10Day: number;
  dividendYield: number;
  shortName: string;
  longName: string;
  currency: string;
  exchange: string;
  marketState: string;
  fiftyDayAverageChangePercent: number;
  twoHundredDayAverageChangePercent: number;
}

interface StockChartPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface StockSummary {
  financialData: any;
  assetProfile: any;
  recommendationTrend: any;
  defaultKeyStatistics: any;
}

interface StockState {
  quote: StockQuote | null;
  chartData: StockChartPoint[];
  summary: StockSummary | null;
  exchangeRate: number;
  currencySymbol: string;
  isLoading: boolean;
  isChartLoading: boolean;
  isRateLoading: boolean;
  isFilterLoading: boolean;
  error: string | null;
  selectedRange: string;
}

const initialState: StockState = {
  quote: null,
  chartData: [],
  summary: null,
  exchangeRate: 1.0,
  currencySymbol: "$",
  isLoading: false,
  isChartLoading: false,
  isRateLoading: false,
  isFilterLoading: false,
  error: null,
  selectedRange: "1d",
};

export const fetchExchangeRate = createAsyncThunk(
  "stock/fetchExchangeRate",
  async (currency: string, { rejectWithValue }) => {
    try {
      const { ticker, symbol } = CURRENCY_TICKER_MAP[currency] || CURRENCY_TICKER_MAP["USD ($)"];

      // USD → USD is always 1:1, no API call needed
      if (ticker === "USDUSD=X") return { rate: 1.0, symbol: "$" };

      const data = await apiGet<{ price: number }>(API_ENDPOINTS.stock.exchangeRate(ticker));
      return { rate: data.price, symbol };
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchStockQuote = createAsyncThunk(
  "stock/fetchQuote",
  async (symbol: string, { rejectWithValue }) => {
    try {
      return await apiGet(API_ENDPOINTS.stock.quote(symbol));
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchStockChart = createAsyncThunk(
  "stock/fetchChart",
  async ({ symbol, range }: { symbol: string; range: string }, { rejectWithValue }) => {
    try {
      // Interval must match Yahoo Finance valid ranges
      const intervalMap: Record<string, string> = {
        "1d":  "15m",
        "5d":  "1h",
        "1mo": "1d",
        "3mo": "1d",
        "6mo": "1d",
        "1y":  "1d",
      };
      const interval = intervalMap[range] ?? "1d";
      const data = await apiGet<any>(API_ENDPOINTS.stock.chart(symbol), { range, interval });

      // Transform Yahoo Finance chart data to Recharts format
      const timestamps = data.timestamp || [];
      const quote = data.indicators?.quote?.[0] || {};
      const flatQuotes = data.quotes || [];

      if (!timestamps.length && !flatQuotes.length) return [];

      if (flatQuotes.length > 0) {
        return flatQuotes.map((q: any) => ({
          date: q.date,
          price: q.close || q.adjclose || q.open || 0,
          open: q.open,
          high: q.high,
          low: q.low,
          volume: q.volume,
        })).filter((p: any) => p.price > 0);
      }

      const prices = quote.close || [];
      const opens = quote.open || [];
      const highs = quote.high || [];
      const lows = quote.low || [];
      const volumes = quote.volume || [];

      return timestamps.map((ts: number, i: number) => ({
        date: new Date(ts * 1000).toISOString(),
        price: prices[i] || opens[i] || 0,
        open: opens[i],
        high: highs[i],
        low: lows[i],
        volume: volumes[i],
      })).filter((p: any) => p.price > 0);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchStockSummary = createAsyncThunk(
  "stock/fetchSummary",
  async (symbol: string, { rejectWithValue }) => {
    try {
      return await apiGet(API_ENDPOINTS.stock.summary(symbol));
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setRange: (state, action: PayloadAction<string>) => {
      state.selectedRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Quote
      .addCase(fetchStockQuote.pending, (state, action) => {
        state.isLoading = true;
        // Only trigger full skeleton (isFilterLoading) if the symbol actually changed
        // This prevents skeletons from flashing during background 5s updates
        if (state.quote?.symbol && state.quote.symbol !== action.meta.arg) {
          state.quote = null;
          state.isFilterLoading = true;
        } else if (!state.quote) {
          // Initial load
          state.isFilterLoading = true;
        }
      })
      .addCase(fetchStockQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFilterLoading = false;
        state.quote = action.payload as StockQuote;
      })
      .addCase(fetchStockQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.isFilterLoading = false;
        state.error = action.payload as string;
      })
      // Chart — uses isChartLoading only, so other cards don't show skeletons
      .addCase(fetchStockChart.pending, (state) => {
        state.isChartLoading = true;
      })
      .addCase(fetchStockChart.fulfilled, (state, action) => {
        state.isChartLoading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchStockChart.rejected, (state) => {
        state.isChartLoading = false;
      })
      .addCase(fetchExchangeRate.pending, (state) => {
        state.isRateLoading = true;
        state.isFilterLoading = true;
      })
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        state.isRateLoading = false;
        state.isFilterLoading = false;
        state.exchangeRate = action.payload.rate;
        state.currencySymbol = action.payload.symbol;
      })
      .addCase(fetchExchangeRate.rejected, (state) => {
        state.isRateLoading = false;
        state.isFilterLoading = false;
      })
      // Summary
      .addCase(fetchStockSummary.pending, (state, action) => {
        state.isLoading = true;
        // Only trigger full skeleton if we are switching to a new symbol
        if (state.quote?.symbol && state.quote.symbol !== action.meta.arg) {
          state.summary = null;
          state.isFilterLoading = true;
        }
      })
      .addCase(fetchStockSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFilterLoading = false;
        state.summary = action.payload as StockSummary;
      })
      .addCase(fetchStockSummary.rejected, (state) => {
        state.isLoading = false;
        state.isFilterLoading = false;
      });
  },
});

export const { setRange } = stockSlice.actions;
export default stockSlice.reducer;
