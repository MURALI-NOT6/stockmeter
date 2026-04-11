export interface StockQuote {
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

export interface StockChartPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface StockSummary {
  financialData: any;
  assetProfile: any;
  recommendationTrend: any;
  defaultKeyStatistics: any;
  majorHoldersBreakdown?: any;
  institutionOwnership?: any;
}

export interface StockNewsItem {
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
}

export interface StockInsights {
  summary: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  signals: {
    bullish: string[];
    bearish: string[];
  };
  news: StockNewsItem[];
  error?: string;
}
