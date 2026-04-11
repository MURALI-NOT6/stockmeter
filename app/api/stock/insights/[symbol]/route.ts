import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import yahooFinance from "@/lib/yahoo";

// Initialize Gemini
const apiKey = process.env.GOOGLE_GENAI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Helper to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    if (!genAI) {
      return NextResponse.json(
        { error: "AI Intelligence is not configured. (GOOGLE_GENAI_API_KEY missing)" },
        { status: 401 }
      );
    }

    // 1. Fetch news using yahoo-finance2
    const searchResults = await yahooFinance.search(symbol, { newsCount: 10 });
    const news = searchResults.news || [];

    if (news.length === 0) {
      return NextResponse.json({
        summary: "No recent news found for this asset to generate insights.",
        sentiment: "NEUTRAL",
        signals: { bullish: [], bearish: [] },
        news: []
      });
    }

    // 2. Prepare context for AI
    const newsContext = news.map(item => `- [${item.publisher}] ${item.title}`).join("\n");

    // 3. Prompt Gemini with internal retry logic
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      Analyze the following news headlines for "${symbol}" and provide a concise intelligence report.
      
      News Headlines:
      ${newsContext}
      
      Return a JSON object with:
      "marketPulse": a 2-sentence summary.
      "sentiment": "POSITIVE", "NEGATIVE", or "NEUTRAL".
      "bullishSignals": array of 2-3 brief points.
      "bearishSignals": array of 2-3 brief points.
    `;

    let result;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        result = await model.generateContent(prompt);
        break; // Success!
      } catch (error: any) {
        const isRateLimit = error.message?.includes("429") || error.status === 429;

        if (isRateLimit && attempts < maxAttempts) {
          console.warn(`[AI API] Rate limited. Attempt ${attempts}/${maxAttempts}. Waiting to retry...`);
          await sleep(3000); // Wait 3 seconds before one retry
          continue;
        }

        // If not rate limit or max attempts reached, throw
        throw error;
      }
    }

    if (!result) throw new Error("Failed to generate content after retries.");

    const responseText = result.response.text();
    const insights = JSON.parse(responseText);

    return NextResponse.json({
      summary: insights.marketPulse,
      sentiment: insights.sentiment,
      signals: {
        bullish: insights.bullishSignals || [],
        bearish: insights.bearishSignals || []
      },
      news: news.map(n => ({
        title: n.title,
        publisher: n.publisher,
        link: n.link,
        providerPublishTime: n.providerPublishTime
      }))
    });

  } catch (error: any) {
    const isRateLimit = error.message?.includes("429") || error.status === 429;
    console.error("AI Insights Error:", error);

    if (isRateLimit) {
      return NextResponse.json(
        {
          error: "AI Quota Exceeded. The market intelligence layer is cooling down. Please try again in a minute.",
          code: "RATE_LIMIT_EXCEEDED"
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `AI Error: ${error.message}` },
      { status: 500 }
    );
  }
}