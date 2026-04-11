import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ["financialData", "defaultKeyStatistics", "assetProfile", "recommendationTrend", "majorHoldersBreakdown", "institutionOwnership"],
    });
    
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("Yahoo Finance Summary Error:", error);

    if (error.code === "UND_ERR_CONNECT_TIMEOUT" || error.message?.includes("timeout")) {
      return NextResponse.json(
        { error: "Target data source timed out. The service may be temporarily overloaded." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
