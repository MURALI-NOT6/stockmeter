import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ["financialData", "defaultKeyStatistics", "assetProfile", "recommendationTrend"],
    });
    
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("Yahoo Finance Summary Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
