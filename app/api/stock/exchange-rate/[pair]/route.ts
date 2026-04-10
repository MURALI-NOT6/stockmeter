import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pair: string }> }
) {
  try {
    const { pair } = await params;
    
    // For USD -> USD, return 1.0 immediately
    if (pair === "USDUSD=X") {
      return NextResponse.json({ price: 1.0 });
    }

    const quote = await yahooFinance.quote(pair);
    
    if (!quote || !quote.regularMarketPrice) {
      throw new Error(`Failed to fetch rate for ${pair}`);
    }

    return NextResponse.json({ 
      price: quote.regularMarketPrice,
      currency: quote.currency 
    });
  } catch (error: any) {
    console.error("Exchange Rate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}
