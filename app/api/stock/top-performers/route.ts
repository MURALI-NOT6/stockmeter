import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";
import { COMPANY_TICKER_MAP, SECTOR_COMPANIES_MAP } from "@/lib/stockMapping";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector");

    let tickers: string[] = [];

    if (sector && sector !== "All Sectors") {
      const companies = SECTOR_COMPANIES_MAP[sector] || [];
      tickers = companies.map(name => COMPANY_TICKER_MAP[name]).filter(Boolean);
    } else {
      tickers = Object.values(COMPANY_TICKER_MAP);
    }

    if (tickers.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch quotes for all tickers in chunk if necessary, but 30-50 is usually fine for one call
    const quotes = await yahooFinance.quote(tickers);
    
    // Sort by performance (percent change)
    // Sometimes quote returns an array or a single object if only one ticker is requested
    const sortedQuotes = (Array.isArray(quotes) ? quotes : [quotes])
      .sort((a, b) => (b.regularMarketChangePercent || 0) - (a.regularMarketChangePercent || 0));

    return NextResponse.json(sortedQuotes);
  } catch (error: any) {
    console.error("Top Performers API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch top performers" },
      { status: 500 }
    );
  }
}
