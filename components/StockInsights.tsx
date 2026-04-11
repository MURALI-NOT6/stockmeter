"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { BrainCircuit, ExternalLink, TrendingUp, TrendingDown, Info, Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { useStockInsights } from "@/hooks/useStockInsights";
import { getTicker } from "@/lib/stockMapping";
import { mutate } from "swr";
import { API_ENDPOINTS } from "@/lib/constants/api";

export default function StockInsights() {
  const { company } = useAppSelector((state) => state.filters);
  const symbol = getTicker(company);
  const { insights, isLoading, error } = useStockInsights(symbol);

  const handleRefresh = () => {
    if (symbol) {
      mutate(API_ENDPOINTS.stock.insights(symbol));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 flex flex-col animate-pulse min-h-[400px] relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20"></div>
          <div className="h-6 w-48 bg-primary-container/10"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-on-surface-variant/5"></div>
          <div className="h-4 w-full bg-on-surface-variant/5"></div>
          <div className="h-4 w-3/4 bg-on-surface-variant/5"></div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="h-24 bg-background/40 border border-outline-variant/5"></div>
          <div className="h-24 bg-background/40 border border-outline-variant/5"></div>
        </div>
      </div>
    );
  }

  // Specific check for Rate Limit
  const errorString = error instanceof Error ? error.message : String(error || "");
  const isRateLimited = errorString.includes("Quota Exceeded") || errorString.includes("RATE_LIMIT_EXCEEDED");

  if (error || !insights) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 text-center flex flex-col items-center justify-center min-h-[300px] relative group">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-error/10 blur-3xl rounded-full"></div>
        
        {isRateLimited ? (
          <AlertTriangle className="text-secondary mb-4 animate-bounce" size={40} />
        ) : (
          <Info className="text-on-surface-variant/40 mb-3" size={32} />
        )}

        <h4 className="text-on-surface font-headline text-lg italic uppercase tracking-tighter font-black">
          {isRateLimited ? "Neural Link Cooling Down" : "Intelligence Offline"}
        </h4>
        
        <p className="text-[11px] text-on-surface-variant/70 mt-3 max-w-[280px] leading-relaxed">
          {isRateLimited 
            ? "Your AI quota has been reached. Please wait about 60 seconds for the system to recover." 
            : "Could not establish a connection to the high-frequency market intelligence layer."}
        </p>

        <button 
          onClick={handleRefresh}
          className="mt-8 flex items-center gap-2 px-6 py-2 bg-background border border-outline-variant/20 hover:border-primary-container/50 text-[10px] font-label font-black uppercase tracking-widest text-on-surface-variant hover:text-primary-container transition-all group"
        >
          <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          Retry Connection
        </button>
      </div>
    );
  }

  const sentimentColors = {
    POSITIVE: "text-primary-container border-primary-container/30 bg-primary-container/10 shadow-[0_0_10px_rgba(0,255,204,0.1)]",
    NEGATIVE: "text-error border-error/30 bg-error/10 shadow-[0_0_10px_rgba(255,68,68,0.1)]",
    NEUTRAL: "text-on-surface-variant border-outline-variant/30 bg-on-surface-variant/10",
  };

  return (
    <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 h-full flex flex-col glow-secondary shadow-terminal overflow-hidden relative group">
      {/* AI Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary-container/30 transition-colors"></div>
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-container/20 border border-primary-container/30 rounded-lg">
            <BrainCircuit className="text-primary-container" size={20} />
          </div>
          <div>
            <h3 className="font-headline text-xl font-black italic uppercase tracking-tighter text-on-background">
              AI Market Intelligence
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse"></span>
              <p className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-widest">Gemini 2.0 Real-time Analysis</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 border text-[10px] font-black uppercase italic tracking-tighter ${sentimentColors[insights.sentiment]}`}>
            {insights.sentiment} SENTIMENT
          </div>
          <button 
            onClick={handleRefresh}
            className="p-1.5 bg-background/40 border border-outline-variant/10 hover:border-primary-container/50 hover:bg-background/60 transition-all rounded-sm group/btn"
            title="Refresh AI Insights"
          >
            <RotateCcw size={14} className="text-on-surface-variant group-hover/btn:text-primary-container group-hover/btn:rotate-180 transition-all duration-500" />
          </button>
        </div>
      </div>

      {/* Market Pulse Summary */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-label text-primary-container uppercase font-black tracking-[0.2em]">Market Pulse</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-primary-container/30 to-transparent"></div>
        </div>
        <p className="text-sm text-on-surface font-medium leading-relaxed italic border-l-2 border-primary-container/30 pl-4 py-1">
          "{insights.summary}"
        </p>
      </div>

      {/* Bullish/Bearish Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="bg-background/40 p-4 border border-outline-variant/10 hover:border-primary-container/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-primary-container" />
            <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-widest">Bullish Catalysts</span>
          </div>
          <ul className="space-y-2">
            {insights.signals.bullish.map((signal, i) => (
              <li key={i} className="text-[11px] text-on-surface flex items-start gap-2">
                <span className="text-primary-container mt-0.5">•</span>
                {signal}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-background/40 p-4 border border-outline-variant/10 hover:border-error/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={14} className="text-error" />
            <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-widest">Bearish Risks</span>
          </div>
          <ul className="space-y-2">
            {insights.signals.bearish.map((signal, i) => (
              <li key={i} className="text-[11px] text-on-surface flex items-start gap-2">
                <span className="text-error mt-0.5">•</span>
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* News Feed */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-widest">Intelligence Sources</span>
          <div className="h-[1px] flex-1 bg-outline-variant/10"></div>
        </div>
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {insights.news.slice(0, 4).map((item, i) => (
            <a 
              key={i} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group/item bg-background/20 p-3 border border-outline-variant/5 hover:border-primary-container/20 hover:bg-background/40 transition-all"
            >
              <div className="flex justify-between items-start gap-3">
                <h4 className="text-[12px] font-bold text-on-background group-hover/item:text-primary-container transition-colors line-clamp-2 leading-tight">
                  {item.title}
                </h4>
                <ExternalLink size={12} className="text-on-surface-variant group-hover/item:text-primary-container flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] font-label text-primary-container uppercase font-black">{item.publisher}</span>
                <span className="text-[9px] text-on-surface-variant">•</span>
                <span className="text-[9px] font-label text-on-surface-variant uppercase">{new Date(item.providerPublishTime * 1000).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer Edge */}
      <div className="mt-6 pt-6 border-t border-outline-variant/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="text-primary-container animate-spin-slow" size={12} />
          <span className="text-[9px] font-label text-on-surface-variant uppercase font-bold tracking-widest">Neural Link Active</span>
        </div>
        <span className="text-[9px] font-label text-on-surface-variant/40 uppercase tracking-tighter">DATA SOURCE: YAHOO FINANCE NEWS</span>
      </div>
    </div>
  );
}
