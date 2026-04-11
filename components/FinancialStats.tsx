import { useAppSelector } from "@/lib/redux/hooks";
import { TrendingUp, BarChart, Activity, Zap, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/currencyUtils";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { getTicker } from "@/lib/stockMapping";

export default function FinancialStats() {
  const { company, currency } = useAppSelector((state) => state.filters);
  const symbol = getTicker(company);
  
  const { quote, isLoading: isQuoteLoading } = useStockQuote(symbol);
  const { exchangeRate, currencySymbol, isLoading: isRateLoading } = useExchangeRate(currency);


  const stats = [
    {
      label: "Market Cap",
      value: formatCurrency(quote?.marketCap, exchangeRate, currencySymbol, { compact: true }),
      icon: <Activity size={14} />,
      color: "text-primary-container",
      borderColor: "border-primary-container/20",
    },
    {
      label: "P/E Ratio",
      value: quote?.trailingPE?.toFixed(2) || "---",
      icon: <BarChart size={14} />,
      color: "text-secondary",
      borderColor: "border-secondary/20",
    },
    {
      label: "Day Range",
      value: `${formatCurrency(quote?.regularMarketDayLow, exchangeRate, currencySymbol)} – ${formatCurrency(quote?.regularMarketDayHigh, exchangeRate, currencySymbol)}`,
      icon: <Zap size={14} />,
      color: "text-tertiary",
      borderColor: "border-tertiary/20",
    },
    {
      label: "52W Range",
      value: `${formatCurrency(quote?.fiftyTwoWeekLow, exchangeRate, currencySymbol)} – ${formatCurrency(quote?.fiftyTwoWeekHigh, exchangeRate, currencySymbol)}`,
      icon: <ShieldCheck size={14} />,
      color: "text-on-surface-variant",
      borderColor: "border-on-surface-variant/20",
    },
    {
      label: "Volume",
      value: quote?.regularMarketVolume ? (quote.regularMarketVolume / 1e6).toFixed(2) + "M" : "---",
      icon: <TrendingUp size={14} />,
      color: "text-primary-container",
      borderColor: "border-primary-container/20",
    },
    {
      label: "Div. Yield",
      value: quote?.dividendYield ? quote.dividendYield.toFixed(2) + "%" : "0.00%",
      icon: <Activity size={14} />,
      color: "text-secondary",
      borderColor: "border-secondary/20",
    },
  ];

  const isDataLoading = isQuoteLoading || !quote;

  return (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 glow-primary shadow-terminal group">
      {/* Title always visible */}
      <h3 className="font-headline text-xs font-black italic uppercase tracking-tighter text-on-background mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
        Financial Health
      </h3>

      {/* Data grid — skeleton while loading */}
      <div className="grid grid-cols-2 gap-3">
        {isDataLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="bg-background/40 p-4 border border-outline-variant/5 min-h-[72px] animate-pulse">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-2 w-16 bg-on-surface-variant/10"></div>
                  <div className="w-3 h-3 bg-on-surface-variant/10 rounded-sm"></div>
                </div>
                <div className="h-4 w-20 bg-primary-container/10"></div>
              </div>
            ))
          : stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-background/40 p-4 border ${stat.borderColor} relative group/card hover:bg-surface-container/50 transition-all shadow-terminal min-h-[72px]`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[8px] font-label text-on-surface-variant uppercase tracking-tighter">
                {stat.label}
              </span>
              <div className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`}>
                {stat.icon}
              </div>
            </div>
            <div className={`font-headline font-black text-on-background tracking-tight leading-tight break-words ${
              stat.label.includes("Range") ? "text-[11px] mt-1" : "text-sm"
            }`}>
              {isRateLoading && (stat.label.includes("Cap") || stat.label.includes("Range")) ? (
                <div className="h-4 w-full bg-primary-container/10 animate-pulse"></div>
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
