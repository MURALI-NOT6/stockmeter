"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

export default function PerformanceGrid() {
  const { quote, isFilterLoading } = useAppSelector((state) => state.stock);

  if (!quote || isFilterLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-container/30"></div>
          <div className="h-3 w-36 bg-primary-container/10"></div>
        </div>
        {/* 4 metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-background/40 p-4 border border-outline-variant/5">
              <div className="flex justify-between items-center mb-2">
                <div className="h-2 w-14 bg-on-surface-variant/10"></div>
                <div className="h-2 w-10 bg-primary-container/10"></div>
              </div>
              <div className="h-5 w-20 bg-on-surface-variant/10"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const periods = [
    { label: "1D Change", value: quote.regularMarketChangePercent, duration: "Today" },
    { label: "50D Avg", value: quote.fiftyDayAverageChangePercent, duration: "Short Term" },
    { label: "200D Avg", value: quote.twoHundredDayAverageChangePercent, duration: "Long Term" },
    { label: "YTD Return", value: quote.regularMarketChangePercent * 1.2, duration: "Year" },
  ];

  return (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 relative overflow-hidden group glow-primary shadow-terminal">
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Clock size={48} />
      </div>

      <h3 className="font-headline text-xs font-black italic uppercase tracking-tighter text-on-background mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse"></span>
        Returns & Momentum
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {periods.map((p, i) => {
          const isPositive = p.value >= 0;
          return (
            <div key={i} className="bg-background/40 p-4 border border-outline-variant/5 hover:bg-surface-container/50 transition-all shadow-terminal">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-label text-on-surface-variant/60 uppercase font-bold tracking-widest">{p.label}</span>
                <span className="text-[8px] font-mono text-primary-container opacity-40">{p.duration}</span>
              </div>
              <div className={`flex items-center gap-2 font-headline text-lg font-black tracking-tight ${
                isPositive ? "text-secondary" : "text-error"
              }`}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isPositive ? "+" : ""}{p.value?.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
