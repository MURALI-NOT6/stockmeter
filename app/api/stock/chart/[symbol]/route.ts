import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "1d";

    // Yahoo Finance valid range → interval mapping
    // Intraday intervals (15m, 1h) are limited to the last 60 days
    type YFInterval = "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo";

    const intervalMap: Record<string, YFInterval> = {
      "1d":  "15m",   // 1 day   → 15-minute bars
      "5d":  "1h",    // 5 days  → 1-hour bars
      "1mo": "1d",    // 1 month → daily bars
      "3mo": "1d",    // 3 months → daily bars
      "6mo": "1d",    // 6 months → daily bars
      "1y":  "1d",    // 1 year  → daily bars
    };

    const interval: YFInterval = intervalMap[range] ?? "1d";

    // Map range to period1 (Unix timestamp seconds)
    const now = Math.floor(Date.now() / 1000);
    const periodMap: Record<string, number> = {
      "1d":  86400 * 4,   // go back 4 days to catch last trading day over weekends
      "5d":  86400 * 8,
      "1mo": 86400 * 35,
      "3mo": 86400 * 95,
      "6mo": 86400 * 185,
      "1y":  86400 * 370,
    };
    const period1 = now - (periodMap[range] ?? 86400 * 4);

    console.log(`[Chart] ${symbol} | range=${range} | interval=${interval}`);

    const chart = await yahooFinance.chart(symbol, {
      period1,
      period2: now,
      interval,
    });

    const chartData = chart as any;
    if (!chartData.timestamp && !chartData.quotes && (!Array.isArray(chartData) || chartData.length === 0)) {
      console.warn(`[Chart] Yahoo returned empty data for ${symbol} (${range})`);
    }

    return NextResponse.json(chart);
  } catch (error: any) {
    console.error("Yahoo Finance Chart Error:", error);
    
    if (error.code === "UND_ERR_CONNECT_TIMEOUT" || error.message?.includes("timeout")) {
      return NextResponse.json(
        { error: "Target data source timed out. The service may be temporarily overloaded." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch chart" },
      { status: 500 }
    );
  }
}
