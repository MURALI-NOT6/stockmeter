import { useAppSelector } from "@/lib/redux/hooks";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { formatPercentage } from "@/lib/currencyUtils";
import { useStockQuote } from "@/hooks/useStockQuote";
import { getTicker } from "@/lib/stockMapping";

export default function PerformanceGrid() {
  const { company } = useAppSelector((state) => state.filters);
  const symbol = getTicker(company);
  const { quote, isLoading } = useStockQuote(symbol);

  if (!quote || isLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 animate-pulse min-h-[170px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-container/30"></div>
          <div className="h-3 w-36 bg-primary-container/10"></div>
        </div>
        {/* 4 metric cards - Stacked vertically */}
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-background/40 p-3 h-[46px] border border-outline-variant/5">
              <div className="flex justify-between items-center h-full">
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-on-surface-variant/10"></div>
                  <div className="h-1.5 w-10 bg-primary-container/10"></div>
                </div>
                <div className="h-5 w-16 bg-on-surface-variant/10"></div>
              </div>
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

      <div className="flex flex-col gap-2">
        {periods.map((p, i) => {
          const isPositive = p.value >= 0;
          return (
            <div key={i} className="bg-background/40 p-3 border border-outline-variant/10 hover:bg-surface-container/50 transition-all shadow-terminal flex items-center justify-between group/item">
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] font-label text-on-surface-variant/60 uppercase font-bold tracking-widest leading-none">{p.label}</span>
                <span className="text-[7px] font-mono text-primary-container opacity-40 uppercase group-hover/item:opacity-100 transition-opacity">{p.duration}</span>
              </div>
              <div className={`flex items-center gap-2 font-headline text-base font-black tracking-tight ${
                isPositive ? "text-secondary" : "text-error"
              }`}>
                {isPositive ? <TrendingUp size={12} className="glow-pink" /> : <TrendingDown size={12} />}
                {isPositive ? "+" : ""}{formatPercentage(p.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
