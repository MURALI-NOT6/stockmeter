import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/currencyUtils";

export default function CompanyOverview() {
  const [isMounted, setIsMounted] = useState(false);
  const { quote, isLoading, isRateLoading, isFilterLoading, exchangeRate, currencySymbol } = useAppSelector((state) => state.stock);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !quote || isFilterLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md px-6 py-5 border border-outline-variant/10 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse">
        {/* Left: icon + name block */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-container/10 border border-primary-container/20 shrink-0"></div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-48 bg-primary-container/10"></div>
              <div className="h-4 w-12 bg-primary-container/5"></div>
            </div>
            <div className="h-3 w-32 bg-on-surface-variant/10"></div>
          </div>
        </div>
        {/* Right: price + change */}
        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <div className="h-7 w-28 bg-primary-container/10"></div>
          <div className="h-4 w-36 bg-on-surface-variant/10"></div>
        </div>
      </div>
    );
  }

  const isPositive = (quote?.regularMarketChange || 0) >= 0;

  return (
    <div className="bg-surface-container/30 backdrop-blur-md px-6 py-5 border border-outline-variant/10 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-none">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-container/20 flex items-center justify-center border border-primary-container/30 shrink-0">
          <span className="font-headline text-base font-black text-primary-container">
            {quote?.symbol?.[0] || "?"}
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="font-headline text-lg font-black tracking-tight uppercase text-on-background">
              {quote?.longName || quote?.shortName || "Loading..."}
            </h2>
            <span className="text-[10px] font-mono text-primary-container opacity-60">
              {quote?.symbol}
            </span>
            <span className={`px-1.5 py-0.5 text-[8px] font-label font-bold uppercase ${
              quote?.marketState === "OPEN" ? "bg-secondary/20 text-secondary" : "bg-error/20 text-error"
            }`}>
              {quote?.marketState || "---"}
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-widest">
            {quote?.exchange || "---"} &nbsp;·&nbsp; {quote?.currency || "---"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end gap-1">
        {isRateLoading ? (
          <div className="h-7 w-32 bg-primary-container/10 animate-pulse"></div>
        ) : (
          <span className="font-headline text-2xl font-black tracking-tight text-on-background">
            {formatCurrency(quote?.regularMarketPrice, exchangeRate, currencySymbol)}
          </span>
        )}
        {isRateLoading ? (
          <div className="h-4 w-24 bg-secondary/10 animate-pulse"></div>
        ) : (
          <div className={`flex items-center gap-1 font-label text-xs font-bold ${
            isPositive ? "text-secondary" : "text-error"
          }`}>
            {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            <span>
              {isPositive ? "+" : ""}{formatCurrency(quote?.regularMarketChange, exchangeRate, currencySymbol)} ({quote?.regularMarketChangePercent?.toFixed(2)}%)
            </span>
            <span className="text-on-surface-variant font-normal text-[10px] ml-1">Today</span>
          </div>
        )}
      </div>
    </div>
  );
}
