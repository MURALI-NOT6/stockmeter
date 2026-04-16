"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCurrency, setCompany, setSector, setView, setSortOrder } from "@/lib/redux/slices/filterSlice";
import Dropdown from "./Dropdown";
import { SECTORS, getCompaniesBySector } from "@/lib/stockMapping";
import { LayoutDashboard, BarChart3 } from "lucide-react";

export default function Header() {
  const dispatch = useAppDispatch();
  const { currency, company, sector, view, sortOrder } = useAppSelector((state) => state.filters);

  const currencies = ["USD ($)", "INR (₹)", "EUR (€)", "GBP (£)"];
  const companies = getCompaniesBySector(sector);
  const sortOptions = ["Top Gainers", "Top Losers"];
  const currentSortLabel = sortOrder === "high-to-low" ? "Top Gainers" : "Top Losers";

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
      {/* ... (title area stays the same) ... */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 w-full lg:w-auto">
        <div>
          <h1 className="font-headline text-4xl font-black text-on-background uppercase tracking-tighter">
            STOCK METER <span className="text-primary-container glow-cyan">V1.0</span>
          </h1>
          <p className="text-on-surface-variant font-label text-xs tracking-widest mt-2 uppercase">
            Real-Time Quantitative Analytics Engine
          </p>
        </div>

        {/* View Toggle */}
        <div className="relative flex bg-[#0a0a0c]/60 backdrop-blur-2xl border border-white/5 p-1 rounded-xl w-[280px] h-[48px] shadow-2xl overflow-hidden group/toggle">
          {/* ... (Sliding Highlight stays the same) ... */}
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/5 backdrop-blur-md border border-white/10 rounded-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
            style={{ 
              transform: view === "market" ? "translateX(0)" : "translateX(100%)",
              left: "4px"
            }}
          >
            <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary-container shadow-[0_0_12px_rgba(0,255,204,0.8)] rounded-full" />
          </div>
          
          <button
            onClick={() => dispatch(setView("market"))}
            className={`flex-1 flex items-center justify-center gap-2.5 z-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer ${
              view === "market" ? "text-primary-container" : "text-on-surface-variant/50 hover:text-on-surface-variant hover:bg-white/5"
            }`}
          >
            <LayoutDashboard size={16} className={`transition-all duration-500 ${view === "market" ? "scale-110" : "opacity-40"}`} />
            Market
          </button>
          
          <button
            onClick={() => dispatch(setView("detailed"))}
            className={`flex-1 flex items-center justify-center gap-2.5 z-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer ${
              view === "detailed" ? "text-primary-container" : "text-on-surface-variant/50 hover:text-on-surface-variant hover:bg-white/5"
            }`}
          >
            <BarChart3 size={16} className={`transition-all duration-500 ${view === "detailed" ? "scale-110" : "opacity-40"}`} />
            Analysis
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Dropdown
          options={currencies}
          value={currency}
          width="120px"
          onChange={(v) => dispatch(setCurrency(v))}
        />
        {/* Show Sort only in Market view */}
        {view === "market" && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Dropdown
              options={sortOptions}
              value={currentSortLabel}
              width="160px"
              prefix="Sort"
              onChange={(v) => {
                dispatch(setSortOrder(v === "Top Gainers" ? "high-to-low" : "low-to-high"));
              }}
            />
          </div>
        )}
        <Dropdown
          options={SECTORS}
          value={sector}
          width="240px"
          onChange={(v) => {
            dispatch(setSector(v));
            const filtered = getCompaniesBySector(v);
            // Instant synchronization: Select the first valid company of the new sector
            // to prevent the Analysis view from showing a stale or mismatched company.
            if (filtered.length > 0 && !filtered.includes(company)) {
              dispatch(setCompany(filtered[0]));
            }
          }}
          prefix="Sector"
        />
        {/* Only show Asset selector in Analysis view */}
        {view === "detailed" && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Dropdown
              options={companies}
              value={company}
              width="220px"
              onChange={(v) => dispatch(setCompany(v))}
              prefix="Asset"
            />
          </div>
        )}
      </div>
    </div>
  );
}
