import { useAppSelector } from "@/lib/redux/hooks";
import { Users, Briefcase, Landmark, PieChart } from "lucide-react";
import { useStockSummary } from "@/hooks/useStockSummary";
import { getTicker } from "@/lib/stockMapping";

export default function StockHolders() {
  const { company } = useAppSelector((state) => state.filters);
  const symbol = getTicker(company);
  const { summary, isLoading } = useStockSummary(symbol);

  const isDataLoading = isLoading || !summary || !summary.majorHoldersBreakdown;

  if (isDataLoading) {
    return (
      <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 animate-pulse min-h-[440px]">
        <h3 className="h-3 w-32 bg-on-surface-variant/10 mb-6"></h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-background/40 p-4 border border-outline-variant/5 h-[72px]">
              <div className="flex justify-between items-start mb-2">
                <div className="h-2 w-12 bg-on-surface-variant/10"></div>
                <div className="w-3 h-3 bg-on-surface-variant/10 rounded-sm"></div>
              </div>
              <div className="h-4 w-16 bg-primary-container/10"></div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-on-surface-variant/10 mb-4 opacity-50"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-on-surface-variant/5 border-l-2 border-primary-container/5"></div>
          ))}
        </div>
      </div>
    );
  }

  const breakdown = summary.majorHoldersBreakdown;
  const institutions = summary.institutionOwnership?.ownershipList || [];
  const stats = summary.defaultKeyStatistics;

  return (
    <div className="bg-surface-container/30 backdrop-blur-md p-6 border border-outline-variant/10 glow-primary shadow-terminal group flex flex-col min-h-[450px]">
      {/* Title */}
      <h3 className="font-headline text-xs font-black italic uppercase tracking-tighter text-on-background mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse shadow-[0_0_5px_#00ffff]"></span>
        Holder Intelligence
      </h3>

      {/* Primary Ownership - Standard Card Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-background/40 p-4 border border-primary-container/20 group/card hover:bg-surface-container/50 transition-all shadow-terminal h-[72px]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[8px] font-label text-on-surface-variant uppercase tracking-tighter">Institutions</span>
            <Landmark size={14} className="text-primary-container opacity-40 group-hover/card:opacity-100 transition-opacity" />
          </div>
          <div className="font-headline text-sm font-black text-on-background tracking-tighter italic">
            {(breakdown.institutionsPercentHeld * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-background/40 p-4 border border-secondary/20 group/card hover:bg-surface-container/50 transition-all shadow-terminal h-[72px]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[8px] font-label text-on-surface-variant uppercase tracking-tighter">Insiders</span>
            <Users size={14} className="text-secondary opacity-40 group-hover/card:opacity-100 transition-opacity" />
          </div>
          <div className="font-headline text-sm font-black text-on-background tracking-tighter italic">
            {(breakdown.insidersPercentHeld * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Structured Ledger Area */}
      <div className="flex-grow">
        {/* Ledger Header */}
        <div className="flex justify-between items-center mb-4 px-3 py-1 border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <PieChart size={10} className="text-primary-container" />
            <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-[0.2em]">ENTITY // TOP POSITION</span>
          </div>
          <span className="text-[8px] font-black text-primary-container/60 uppercase tracking-widest leading-none">SHARES HELD</span>
        </div>

        {/* Ledger Content */}
        <div className="space-y-[2px]">
          {institutions.slice(0, 5).map((inst: any, i: number) => (
            <div key={i} className="flex justify-between items-center h-[34px] px-3 bg-background/20 border-l-2 border-primary-container/5 hover:border-primary-container hover:bg-surface-container/10 transition-all group/item cursor-default">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[8px] font-mono font-black text-primary-container/20 group-hover/item:text-primary-container/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-label text-on-surface-variant uppercase font-bold group-hover/item:text-on-background truncate max-w-[160px]">
                  {inst.organization}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono font-black text-primary-container group-hover/item:glow-cyan">
                  {(((inst.sharesHeld || inst.shares || 0) as number) / 1e6).toFixed(1)}M
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condensed Strategic Summary */}
      <div className="mt-8 pt-5 border-t border-outline-variant/10">
        <div className="grid grid-cols-2 gap-6 px-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Briefcase size={10} className="text-secondary opacity-60" />
              <span className="text-[8px] font-black text-on-surface-variant/60 uppercase tracking-widest">Cap Structure</span>
            </div>
            <div className="flex justify-between items-end border-b border-outline-variant/5 pb-1 mt-1">
              <span className="text-[8px] font-label text-on-surface-variant uppercase">Float</span>
              <span className="text-[10px] font-headline font-black text-on-background">
                {stats?.floatShares ? (stats.floatShares / 1e9).toFixed(2) + "B" : "---"}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[8px] font-label text-on-surface-variant uppercase">Institutions</span>
              <span className="text-[10px] font-headline font-black text-primary-container">
                {breakdown.numberOfInstitutionsHolding?.toLocaleString() || "---"}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-end items-end h-full">
            <div className="bg-primary-container/5 p-2 border border-primary-container/10 flex flex-col items-end w-full">
               <span className="text-[7px] font-label text-primary-container/60 uppercase text-right leading-none mb-1">Status</span>
               <span className="text-[9px] font-black text-primary-container uppercase tracking-tight italic">Strategic Majority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
