import { useAppSelector } from "@/lib/redux/hooks";
import { Users, Briefcase, Landmark, PieChart, ShieldCheck } from "lucide-react";
import { useStockSummary } from "@/hooks/useStockSummary";
import { getTicker } from "@/lib/stockMapping";

export default function StockHolders() {
  const { company } = useAppSelector((state) => state.filters);
  const symbol = getTicker(company);
  const { summary, isLoading } = useStockSummary(symbol);

  const isDataLoading = isLoading || !summary || !summary.majorHoldersBreakdown;

  if (isDataLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 animate-pulse min-h-[440px]">
        <h3 className="h-3 w-32 bg-on-surface-variant/10 mb-8"></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-background/40 p-5 border border-outline-variant/5 h-[80px]">
              <div className="flex justify-between items-start mb-2">
                <div className="h-2 w-16 bg-on-surface-variant/10"></div>
                <div className="w-4 h-4 bg-on-surface-variant/10 rounded-sm"></div>
              </div>
              <div className="h-5 w-20 bg-primary-container/10"></div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-3 w-full bg-on-surface-variant/10 mb-6 opacity-50"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-on-surface-variant/5 border-l-2 border-primary-container/5"></div>
          ))}
        </div>
      </div>
    );
  }

  const breakdown = summary.majorHoldersBreakdown;
  const institutions = summary.institutionOwnership?.ownershipList || [];
  const stats = summary.defaultKeyStatistics;

  return (
    <div className="bg-surface-container/30 backdrop-blur-md p-8 border border-outline-variant/10 glow-primary shadow-terminal group flex flex-col min-h-[450px]">
      {/* Title */}
      <h3 className="font-headline text-xs font-black italic uppercase tracking-tighter text-on-background mb-8 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse shadow-[0_0_5px_#00ffff]"></span>
        Holder Intelligence
      </h3>

      {/* Primary Ownership - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-background/40 p-5 border border-primary-container/20 group/card hover:bg-surface-container/50 transition-all shadow-terminal flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-black">Institutions</span>
            <Landmark size={16} className="text-primary-container opacity-40 group-hover/card:opacity-100 transition-opacity" />
          </div>
          <div className="font-headline text-2xl font-black text-on-background tracking-tighter italic leading-none">
            {(breakdown.institutionsPercentHeld * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-background/40 p-5 border border-secondary/20 group/card hover:bg-surface-container/50 transition-all shadow-terminal flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-black">Insiders</span>
            <Users size={16} className="text-secondary opacity-40 group-hover/card:opacity-100 transition-opacity" />
          </div>
          <div className="font-headline text-2xl font-black text-on-background tracking-tighter italic leading-none">
            {(breakdown.insidersPercentHeld * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Structured Ledger Area */}
      <div className="flex-grow">
        {/* Ledger Header */}
        <div className="flex justify-between items-center mb-5 px-4 py-2 border-b border-outline-variant/10 bg-background/20">
          <div className="flex items-center gap-2">
            <PieChart size={12} className="text-primary-container" />
            <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">ENTITY // TOP POSITION</span>
          </div>
          <span className="text-[9px] font-black text-primary-container/60 uppercase tracking-widest leading-none">SHARES HELD</span>
        </div>

        {/* Ledger Content */}
        <div className="space-y-1">
          {institutions.slice(0, 5).map((inst: any, i: number) => (
            <div key={i} className="flex justify-between items-center py-2.5 px-4 bg-background/20 border-l-2 border-primary-container/5 hover:border-primary-container hover:bg-surface-container/10 transition-all group/item cursor-default">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-[10px] font-mono font-black text-on-surface-variant/30 group-hover/item:text-primary-container transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase font-bold group-hover/item:text-on-background truncate flex-1 min-w-0">
                  {inst.organization}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                <span className="text-[11px] font-mono font-black text-primary-container group-hover/item:glow-cyan">
                  {(((inst.sharesHeld || inst.shares || 0) as number) / 1e6).toFixed(1)}M
                </span>
                <div className="w-1 h-3 bg-primary-container/20 group-hover/item:bg-primary-container transition-colors"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condensed Strategic Summary - Responsive Grid */}
      <div className="mt-10 pt-6 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Briefcase size={12} className="text-secondary opacity-60" />
              <span className="text-[9px] font-black text-on-surface-variant/60 uppercase tracking-widest">Cap Structure</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-outline-variant/5 pb-1">
                <span className="text-[9px] font-label text-on-surface-variant uppercase font-bold">Float Shares</span>
                <span className="text-[11px] font-headline font-black text-on-background italic">
                  {stats?.floatShares ? (stats.floatShares / 1e9).toFixed(2) + "B" : "---"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-label text-on-surface-variant uppercase font-bold">Distinct Holders</span>
                <span className="text-[11px] font-headline font-black text-primary-container italic">
                  {breakdown.numberOfInstitutionsHolding?.toLocaleString() || "---"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <div className="bg-primary-container/10 p-3 border-r-2 border-primary-container flex flex-col items-end w-full relative overflow-hidden group/status">
               <div className="absolute top-0 right-0 w-8 h-8 bg-primary-container/5 -rotate-45 translate-x-4 -translate-y-4"></div>
               <div className="flex items-center gap-2 mb-1">
                 <ShieldCheck size={10} className="text-primary-container" />
                 <span className="text-[8px] font-black text-primary-container/60 uppercase tracking-widest">Strategic Status</span>
               </div>
               <span className="text-[11px] font-black text-primary-container uppercase tracking-tight italic">Strategic Majority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
