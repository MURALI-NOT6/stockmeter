"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setRange, fetchStockChart } from "@/lib/redux/slices/stockSlice";
import { getTicker } from "@/lib/stockMapping";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/currencyUtils";

export default function PriceChart() {
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const { company } = useAppSelector((state) => state.filters);
  const { chartData, selectedRange, isChartLoading, isRateLoading, exchangeRate, currencySymbol } = useAppSelector((state) => state.stock);

  // Valid Yahoo Finance ranges with user-friendly labels
  const ranges = [
    { value: "1d", label: "1D" },
    { value: "5d", label: "5D" },
    { value: "1mo", label: "1M" },
    { value: "3mo", label: "3M" },
    { value: "6mo", label: "6M" },
    { value: "1y", label: "1Y" },
  ];
  const symbol = getTicker(company);

  const convertedChartData = useMemo(() => {
    return chartData.map(point => ({
      ...point,
      price: point.price * exchangeRate
    }));
  }, [chartData, exchangeRate]);

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchStockChart({ symbol, range: selectedRange }));
  }, [dispatch, symbol, selectedRange]);

  // Format tooltip date based on range granularity
  const isIntraday = selectedRange === "1d" || selectedRange === "5d";
  const formatDate = (dateStr: string) =>
    isIntraday
      ? format(new Date(dateStr), "MMM d, HH:mm")
      : format(new Date(dateStr), "MMM d, yyyy");

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface-container p-4 border-l-4 border-primary-container shadow-2xl z-50 min-w-[180px]">
          <p className="text-[10px] font-label text-on-surface-variant uppercase mb-3 tracking-widest border-b border-outline-variant/10 pb-1">
            {formatDate(data.date)}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
            <div className="space-y-0.5">
              <span className="text-[9px] font-label text-on-surface-variant/60 uppercase">Open</span>
              <p className="font-headline text-xs font-bold text-on-background">
                {formatCurrency(data.open, exchangeRate, currencySymbol)}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-label text-on-surface-variant/60 uppercase">Close</span>
              <p className="font-headline text-xs font-bold text-primary-container">
                {formatCurrency(data.price, 1.0, currencySymbol)}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-label text-on-surface-variant/60 uppercase">High</span>
              <p className="font-headline text-xs font-bold text-secondary">
                {formatCurrency(data.high, exchangeRate, currencySymbol)}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-label text-on-surface-variant/60 uppercase">Low</span>
              <p className="font-headline text-xs font-bold text-error">
                {formatCurrency(data.low, exchangeRate, currencySymbol)}
              </p>
            </div>
          </div>
          {data.volume && (
            <div className="pt-2 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="text-[9px] font-label text-on-surface-variant/60 uppercase tracking-tighter">Volume</span>
              <p className="text-[10px] font-headline font-bold text-on-surface-variant">
                {(data.volume / 1e6).toFixed(2)}M
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (!isMounted || isChartLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-6 sm:p-8 border border-outline-variant/10 min-h-[420px] animate-pulse">
        <div className="flex justify-between mb-8">
          <div className="space-y-3">
            <div className="h-6 w-48 bg-primary-container/10"></div>
            <div className="h-3 w-64 bg-on-surface-variant/10"></div>
          </div>
          <div className="h-8 w-32 bg-background border border-outline-variant/20"></div>
        </div>
        <div className="h-[280px] w-full bg-primary-container/5 relative overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="h-[1px] w-full bg-on-surface-variant/10"></div>
            <div className="h-[1px] w-full bg-on-surface-variant/10"></div>
            <div className="h-[1px] w-full bg-on-surface-variant/10"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 sm:p-8 relative overflow-hidden border border-outline-variant/10 min-h-[420px] glow-primary shadow-terminal group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="font-headline text-xl font-black italic uppercase tracking-tighter text-on-background flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse"></span>
            PRICE TRENDS & HISTORY
          </h3>
          <p className="text-[10px] font-label text-on-surface-variant uppercase mt-1 opacity-60">
            {company} ({symbol}) REAL-TIME PERFORMANCE DATA
          </p>
        </div>
        <div className="flex bg-background p-1 border border-outline-variant/20">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => dispatch(setRange(r.value))}
              className={`px-3 py-1 text-[10px] font-label uppercase font-bold transition-all ${selectedRange === r.value
                ? "bg-primary-container text-on-primary shadow-[0_0_10px_#00ffff44]"
                : "text-on-surface-variant hover:text-on-surface"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`transition-opacity duration-500 relative block w-full h-[320px] ${isChartLoading || isRateLoading ? "opacity-30" : "opacity-100"}`}>
        {(isChartLoading || isRateLoading) && (
          <div className="absolute inset-0 bg-primary-container/5 animate-pulse z-10"></div>
        )}

        {convertedChartData.length === 0 && !isChartLoading && !isRateLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant font-label opacity-40 uppercase tracking-widest text-[10px] gap-3">
            <div className="w-12 h-[1px] bg-outline-variant"></div>
            No chart data available
            <div className="w-12 h-[1px] bg-outline-variant"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={convertedChartData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#484751"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                hide={true}
              />
              <YAxis
                domain={["auto", "auto"]}
                hide={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00ffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chartGradient)"
                isAnimationActive={true} // Performance: Disable heavy main-thread animations
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="flex justify-between mt-6 text-[10px] font-label text-on-surface-variant uppercase">
          <span>{format(new Date(chartData[0].date), "MMM d")}</span>
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 bg-primary-container animate-pulse"></span>
            <span className="text-primary-container">Live Sync Active</span>
          </div>
          <span>{format(new Date(chartData[chartData.length - 1].date), "MMM d")}</span>
        </div>
      )}
    </div>
  );
}
