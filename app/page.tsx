"use client";

import dynamic from "next/dynamic";

// ─── Static Imports ───────────────────────────────────────────────────────────
// Load immediately — these are small and above the fold
import Background from "@/components/Background";
import Header from "@/components/Header";
import CompanyOverview from "@/components/CompanyOverview";
import MarketDashboard from "@/components/MarketDashboard";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setView } from "@/lib/redux/slices/filterSlice";

// ─── Dynamic Imports ──────────────────────────────────────────────────────────
// Code-split heavy components to improve initial page load.
// Each renders its own skeleton while loading so no layout shift occurs.

const PriceChart = dynamic(() => import("@/components/PriceChart"), {
  ssr: false, // recharts requires browser APIs (SVG, ResizeObserver)
  loading: () => (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 sm:p-8 border border-outline-variant/10 min-h-[420px] animate-pulse">
      <div className="flex justify-between mb-8">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-primary-container/10"></div>
          <div className="h-3 w-64 bg-on-surface-variant/10"></div>
        </div>
        <div className="h-8 w-40 bg-background border border-outline-variant/20"></div>
      </div>
      <div className="h-[280px] w-full bg-primary-container/5 flex flex-col justify-between p-4">
        <div className="h-[1px] w-full bg-on-surface-variant/10"></div>
        <div className="h-[1px] w-full bg-on-surface-variant/10"></div>
        <div className="h-[1px] w-full bg-on-surface-variant/10"></div>
      </div>
    </div>
  ),
});

const PerformanceGrid = dynamic(() => import("@/components/PerformanceGrid"), {
  loading: () => (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-primary-container/30"></div>
        <div className="h-3 w-36 bg-primary-container/10"></div>
      </div>
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
  ),
});

const CompanyProfile = dynamic(() => import("@/components/CompanyProfile"), {
  loading: () => (
    <div className="bg-surface-container p-8 border border-outline-variant/10 animate-pulse">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-5 h-5 bg-primary-container/10 rounded-sm"></div>
        <div className="h-6 w-44 bg-primary-container/10"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <div className="h-2.5 w-28 bg-on-surface-variant/10"></div>
          <div className="h-4 w-52 bg-primary-container/10"></div>
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-28 bg-on-surface-variant/10"></div>
          <div className="h-4 w-40 bg-primary-container/10"></div>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="h-3 w-full bg-on-surface-variant/5"></div>
        <div className="h-3 w-full bg-on-surface-variant/5"></div>
        <div className="h-3 w-3/4 bg-on-surface-variant/5"></div>
      </div>
    </div>
  ),
});

const AnalystSentiment = dynamic(() => import("@/components/AnalystSentiment"), {
  loading: () => (
    <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 flex flex-col animate-pulse">
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container/30"></div>
            <div className="h-5 w-44 bg-primary-container/10"></div>
          </div>
          <div className="h-2.5 w-36 bg-on-surface-variant/10"></div>
        </div>
        <div className="space-y-1">
          <div className="h-2.5 w-20 bg-on-surface-variant/10 ml-auto"></div>
          <div className="h-8 w-12 bg-primary-container/10 ml-auto"></div>
        </div>
      </div>
      <div className="w-48 h-48 mx-auto mb-10 rounded-full border-4 border-primary-container/10 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-surface-container/50 border border-primary-container/10"></div>
      </div>
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
    </div>
  ),
});

const FinancialStats = dynamic(() => import("@/components/FinancialStats"), {
  loading: () => (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-secondary/30"></div>
        <div className="h-3 w-32 bg-on-surface-variant/10"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-background/40 p-4 border border-outline-variant/5">
            <div className="flex justify-between items-start mb-2">
              <div className="h-2 w-16 bg-on-surface-variant/10"></div>
              <div className="w-3 h-3 bg-on-surface-variant/10 rounded-sm"></div>
            </div>
            <div className="h-4 w-20 bg-primary-container/10"></div>
          </div>
        ))}
      </div>
    </div>
  ),
});

const StockInsights = dynamic(() => import("@/components/StockInsights"), {
  loading: () => (
    <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 animate-pulse min-h-[400px]">
      <div className="h-6 w-48 bg-primary-container/10 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-on-surface-variant/5"></div>
        ))}
      </div>
    </div>
  ),
});

const StockHolders = dynamic(() => import("@/components/StockHolders"), {
  ssr: false,
  loading: () => (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 animate-pulse min-h-[400px]">
      <div className="h-4 w-40 bg-primary-container/10 mb-6"></div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="h-20 bg-background/40"></div>
        <div className="h-20 bg-background/40"></div>
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-on-surface-variant/5"></div>
        ))}
      </div>
    </div>
  ),
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { view } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  const handleViewMore = () => {
    dispatch(setView("detailed"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background relative selection:bg-primary-container/30">
      <Background />

      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 relative z-10">
        <Header />
        
        {view === "market" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MarketDashboard onViewMore={handleViewMore} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CompanyOverview />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Main Analytical Block — 3 columns */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <PriceChart />
                <StockInsights />
                <CompanyProfile />
                <StockHolders />
              </div>

              {/* Tactical Intel Panel — 1 column, stacks below on mobile */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <AnalystSentiment />
                <FinancialStats />
                <PerformanceGrid />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
