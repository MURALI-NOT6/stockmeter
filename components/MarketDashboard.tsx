"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCompany, setSector, setView } from "@/lib/redux/slices/filterSlice";
import { TrendingUp, TrendingDown, ExternalLink, Filter, Search, Trophy, ArrowUpNarrowWide, ArrowDownWideNarrow, X } from "lucide-react";
import useSWR from "swr";
import { useMemo, useState, useEffect } from "react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { formatCurrency } from "@/lib/currencyUtils";
import { formatPercentage } from "@/lib/formatters";
import { SECTOR_COMPANIES_MAP, COMPANY_TICKER_MAP } from "@/lib/stockMapping";
import Dropdown from "./Dropdown";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MarketDashboardProps {
  onViewMore: () => void;
}

export default function MarketDashboard({ onViewMore }: MarketDashboardProps) {
  const dispatch = useAppDispatch();
  const { sector, sortOrder, company, currency } = useAppSelector((state) => state.filters);
  const { exchangeRate, currencySymbol, isLoading: isRateLoading } = useExchangeRate(currency);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: stocksData, error, isLoading } = useSWR(
    `/api/stock/top-performers?sector=${encodeURIComponent(sector)}`,
    fetcher,
    { refreshInterval: 10000 } // Refresh every 10 seconds
  );

  // Filter and sort stocks based on user criteria
  const filteredAndSortedStocks = useMemo(() => {
    if (!stocksData) return [];
    
    // First, filter by search query
    const filtered = stocksData.filter((stock: any) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        stock.symbol.toLowerCase().includes(searchStr) ||
        (stock.shortName && stock.shortName.toLowerCase().includes(searchStr)) ||
        (stock.displayName && stock.displayName.toLowerCase().includes(searchStr))
      );
    });

    // Then sort by performance
    return [...filtered].sort((a, b) => {
      const valA = a.regularMarketChangePercent || 0;
      const valB = b.regularMarketChangePercent || 0;
      return sortOrder === "high-to-low" ? valB - valA : valA - valB;
    });
  }, [stocksData, sortOrder, searchQuery]);

  const handleSelectCompany = (stock: any) => {
    const internalName = Object.keys(COMPANY_TICKER_MAP).find(
      key => COMPANY_TICKER_MAP[key] === stock.symbol
    );
    
    dispatch(setCompany(internalName || stock.displayName || stock.shortName || stock.symbol));
    dispatch(setView("detailed"));
    onViewMore();
  };

  if (error) return (
    <div className="p-10 text-center bg-surface-container/20 backdrop-blur-xl border border-error/20 rounded-2xl">
      <p className="text-error font-headline uppercase tracking-widest text-sm">Failed to load market data</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black font-headline text-on-background tracking-tighter flex items-center gap-3">
            <Trophy className="text-primary-container glow-cyan" size={32} />
            MARKET LEADERS
          </h2>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest mt-1">
            Real-time performance ranking • {sector} • {sortOrder === "high-to-low" ? "Top Gainers" : "Top Losers"}
          </p>
        </div>

        {/* Search Filter Bar */}
        <div className="relative group/search w-full md:w-[320px] isolate">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Search size={16} className="text-primary-container opacity-70 group-focus-within/search:opacity-100 transition-opacity" />
          </div>
          <input
            type="text"
            placeholder="SEARCH COMPANY OR TICKER..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0c]/40 backdrop-blur-xl border border-white/5 focus:border-primary-container/30 text-[10px] font-label uppercase text-on-surface pl-11 pr-11 py-3 rounded-xl transition-all outline-none shadow-terminal focus:shadow-cyan/10 placeholder:text-on-surface-variant/20 text-left"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant/60 hover:text-primary-container transition-colors z-10 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div 
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-container/30 border border-outline-variant/10 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {filteredAndSortedStocks.length > 0 ? (
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
            >
              {filteredAndSortedStocks.map((stock: any, index: number) => {
                const isPositive = stock.regularMarketChangePercent >= 0;
                const rank = index + 1;
                
                return (
                  <div 
                    key={stock.symbol}
                    className="group relative bg-surface-container/20 backdrop-blur-md border border-outline-variant/10 hover:border-primary-container/30 transition-all duration-500 rounded-xl overflow-hidden cursor-pointer shadow-terminal hover:shadow-cyan/10 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleSelectCompany(stock)}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-0 left-0 bg-primary-container/10 px-3 py-1 text-[10px] font-black font-mono text-primary-container border-br border-outline-variant/10 z-10 transition-colors group-hover:bg-primary-container/20">
                      #{rank.toString().padStart(2, '0')}
                    </div>

                    <div className="p-5 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-0.5">
                          <h4 className="font-headline text-lg font-black tracking-tight text-on-background truncate max-w-[150px]">
                            {stock.shortName || stock.symbol}
                          </h4>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-mono text-primary-container font-bold px-1.5 py-0.5 bg-primary-container/5 border border-primary-container/10 rounded">
                               {stock.symbol}
                             </span>
                             <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest opacity-60">
                               {stock.fullExchangeName || "NASDAQ"}
                             </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black font-mono tracking-tighter text-on-background">
                            {isRateLoading ? (
                              <div className="h-6 w-20 bg-primary-container/10 animate-pulse ml-auto" />
                            ) : (
                              formatCurrency(stock.regularMarketPrice, exchangeRate, currencySymbol)
                            )}
                          </div>
                          <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isPositive ? 'text-secondary' : 'text-error'}`}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isPositive ? '+' : ''}{formatPercentage(stock.regularMarketChangePercent)}
                          </div>
                        </div>
                      </div>

                      <div className="h-1 w-full bg-outline-variant/5 rounded-full overflow-hidden mb-4">
                        <div 
                          className={`h-full transition-all duration-1000 ease-out ${isPositive ? 'bg-secondary glow-pink' : 'bg-error shadow-red'}`} 
                          style={{ width: `${Math.min(Math.abs(stock.regularMarketChangePercent) * 10, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-4">
                           <div className="flex flex-col">
                             <span className="text-[8px] font-label text-on-surface-variant/40 uppercase">Volume</span>
                             <span className="text-[10px] font-mono font-bold">{(stock.regularMarketVolume / 1000000).toFixed(1)}M</span>
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[8px] font-label text-on-surface-variant/40 uppercase">Day Range</span>
                             <span className="text-[10px] font-mono font-bold text-on-surface-variant/60">
                               {isRateLoading ? (
                                 <div className="h-3 w-24 bg-on-surface-variant/10 animate-pulse mt-0.5" />
                               ) : (
                                 `${formatCurrency(stock.regularMarketDayLow, exchangeRate, currencySymbol)} – ${formatCurrency(stock.regularMarketDayHigh, exchangeRate, currencySymbol)}`
                               )}
                             </span>
                           </div>
                        </div>
                        
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/10 hover:bg-primary-container/20 text-primary-container border border-primary-container/20 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-colors group-hover:scale-105 cursor-pointer">
                          VIEW MORE
                          <ExternalLink size={10} />
                        </button>
                      </div>
                    </div>

                    <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity ${isPositive ? 'bg-secondary' : 'bg-error'}`} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface-container/10 border border-outline-variant/10 rounded-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
              <div className="p-4 bg-primary-container/10 rounded-full mb-6 relative">
                 <Search size={32} className="text-primary-container opacity-40" />
                 <div className="absolute inset-0 bg-primary-container blur-[20px] opacity-20 animate-pulse" />
              </div>
              <h3 className="text-lg font-black font-headline text-on-background tracking-tight uppercase mb-2">No Matching Assets Found</h3>
              <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest text-center max-w-xs opacity-60">
                We couldn't find any results for "<span className="text-primary-container font-black">{searchQuery}</span>" in the <span className="text-primary-container font-black">{sector}</span> category.
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-8 px-6 py-2 bg-primary-container/10 hover:bg-primary-container/20 border border-primary-container/20 text-primary-container text-[10px] font-black uppercase tracking-widest transition-all rounded-lg cursor-pointer"
              >
                CLEAR SEARCH
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
