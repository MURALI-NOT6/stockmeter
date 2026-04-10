import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";

export async function GET(
  req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = await params;
    const quote = await yahooFinance.quote(symbol);
    
    return NextResponse.json(quote);
  } catch (error: any) {
    console.error("Yahoo Finance Quote Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
