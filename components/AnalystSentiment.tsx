import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { Zap } from "lucide-react";

export default function AnalystSentiment() {
  const [isMounted, setIsMounted] = useState(false);
  const { summary, isFilterLoading } = useAppSelector((state) => state.stock);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !summary || isFilterLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 flex flex-col animate-pulse min-h-[520px]">
        {/* Header row: title + score */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-container/30"></div>
              <div className="h-5 w-44 bg-primary-container/10"></div>
            </div>
            <div className="h-2.5 w-36 bg-on-surface-variant/10"></div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-2.5 w-20 bg-on-surface-variant/10 ml-auto"></div>
            <div className="h-8 w-12 bg-primary-container/10 ml-auto"></div>
          </div>
        </div>

        {/* Circular gauge placeholder */}
        <div className="w-48 h-48 mx-auto mb-10 rounded-full border-4 border-primary-container/10 flex items-center justify-center relative">
          <div className="absolute inset-4 rounded-full border border-primary-container/5"></div>
          <div className="w-16 h-16 rounded-full bg-surface-container/50 border border-primary-container/10"></div>
        </div>

        {/* 5 recommendation rows */}
        <div className="flex-1 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-on-surface-variant/10"></div>
                <div className="h-2.5 w-20 bg-on-surface-variant/10"></div>
              </div>
              <div className="h-5 w-6 bg-on-surface-variant/10"></div>
            </div>
          ))}
        </div>

        {/* Footer badge */}
        <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
          <div className="h-3 w-24 bg-on-surface-variant/10"></div>
          <div className="h-6 w-32 bg-secondary/10"></div>
        </div>
      </div>
    );
  }

  const trend = summary?.recommendationTrend?.trend?.[0];
  const { buy = 0, sell = 0, hold = 0, strongBuy = 0, strongSell = 0 } = trend || {};
  const total = buy + sell + hold + strongBuy + strongSell;
  
  // Calculate Signal Strength Score (0-100)
  const strengthScore = total > 0 
    ? ((strongBuy * 100) + (buy * 75) + (hold * 50) + (sell * 25) + (strongSell * 0)) / total
    : 50;

  const recommendations = [
    { label: "Strong Buy", value: strongBuy, color: "bg-primary-container" },
    { label: "Buy", value: buy, color: "bg-primary-container/60" },
    { label: "Hold", value: hold, color: "bg-on-surface-variant/40" },
    { label: "Sell", value: sell, color: "bg-error/60" },
    { label: "Strong Sell", value: strongSell, color: "bg-error" },
  ];

  return (
    <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 h-full flex flex-col glow-primary shadow-terminal overflow-hidden relative">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="font-headline text-xl font-black italic uppercase tracking-tighter text-on-background flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse"></span>
            Institutional Sentiment
          </h3>
          <p className="text-[10px] font-label text-on-surface-variant uppercase mt-1 opacity-60 font-bold">Institutional Conviction Meter</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest block mb-1 font-bold">Signal Strength</span>
          <span className="font-headline text-3xl font-black text-primary-container leading-none italic">
            {strengthScore.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Sonar Gauge Visualization */}
      <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute inset-0 border border-primary-container/10 rounded-full"></div>
        <div className="absolute inset-4 border border-primary-container/5 rounded-full"></div>
        <div className="absolute inset-8 border border-primary-container/3 rounded-full"></div>
        
        {/* Sonar Sweep Animation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/0 to-primary-container/5 rounded-full animate-[spin_4s_linear_infinite]"></div>
        
        {/* Conviction Pointer (Gauge) */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            className="text-on-surface-variant/10"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={552.92}
            strokeDashoffset={552.92 - (552.92 * strengthScore) / 100}
            strokeLinecap="round"
            className="text-primary-container transition-all duration-1000 shadow-[0_0_15px_#00ffcc]"
          />
        </svg>

        {/* Center Indicator */}
        <div className="absolute inset-16 bg-surface-container/50 backdrop-blur-xl border border-primary-container/20 rounded-full flex flex-col items-center justify-center shadow-terminal">
          <span className="text-[8px] font-label text-on-surface-variant uppercase font-bold">Conviction</span>
          <span className={`text-xs font-black uppercase italic ${strengthScore > 70 ? 'text-primary-container' : 'text-secondary'}`}>
            {strengthScore > 70 ? 'MAX' : strengthScore > 40 ? 'MID' : 'LOW'}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {recommendations.map((r, i) => (
          <div key={i} className="flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <span className={`w-1 h-4 ${r.color}`}></span>
              <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-bold group-hover:text-on-background transition-colors">
                {r.label}
              </span>
            </div>
            <span className="font-headline font-black text-lg text-on-background opacity-80 italic">
              {r.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-outline-variant/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-secondary" size={14} />
            <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold tracking-widest">
              Tactical Edge
            </span>
          </div>
          <span className="bg-secondary/20 text-secondary px-3 py-1 text-xs font-headline font-black uppercase italic tracking-tighter border border-secondary/30">
            {strengthScore > 70 ? "HIGH CONVICTION BUY" : strengthScore > 40 ? "HOLD STRATEGY" : "WATCH & WAIT"}
          </span>
        </div>
      </div>
    </div>
  );
}
