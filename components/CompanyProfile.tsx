import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { Users, Info, Building2, User } from "lucide-react";

export default function CompanyProfile() {
  const [isMounted, setIsMounted] = useState(false);
  const { summary, isFilterLoading } = useAppSelector((state) => state.stock);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !summary || isFilterLoading) {
    return (
      <div className="bg-surface-container p-8 border border-outline-variant/10 animate-pulse min-h-[440px]">
        {/* Header: icon + title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-5 h-5 bg-primary-container/10 rounded-sm"></div>
          <div className="h-6 w-44 bg-primary-container/10"></div>
        </div>

        {/* 2-col info grid */}
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

        {/* Description block */}
        <div className="space-y-2.5 mb-6">
          <div className="h-2.5 w-20 bg-on-surface-variant/10"></div>
          <div className="h-3 w-full bg-on-surface-variant/5"></div>
          <div className="h-3 w-full bg-on-surface-variant/5"></div>
          <div className="h-3 w-3/4 bg-on-surface-variant/5"></div>
        </div>

        {/* Expand button placeholder */}
        <div className="h-3 w-28 bg-primary-container/10 mb-8"></div>

        {/* Footer: headcount + location */}
        <div className="pt-8 border-t border-outline-variant/10 flex items-center gap-6">
          <div className="h-3 w-28 bg-on-surface-variant/10"></div>
          <div className="h-3 w-24 bg-on-surface-variant/10"></div>
        </div>
      </div>
    );
  }

  const profile = summary?.assetProfile;

  return (
    <div className="bg-surface-container p-8 border border-outline-variant/10 h-full">
      <div className="flex items-center gap-3 mb-8">
        <Building2 className="text-primary-container" size={20} />
        <h3 className="font-headline text-xl font-black uppercase tracking-tight italic">
          Corporate Profile
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest block mb-2 font-bold">
            Sector / Industry
          </span>
          <p className="text-on-background font-headline text-sm font-bold opacity-80 uppercase italic">
            {profile?.sector || "---"} / {profile?.industry || "---"}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest block mb-2 font-bold flex items-center gap-2">
            <User size={12} /> Key Executive (CEO)
          </span>
          <p className="text-primary-container font-headline text-sm font-bold uppercase italic">
            {profile?.companyOfficers?.[0]?.name || "Information Unavailable"}
          </p>
        </div>
      </div>

      <div className="relative">
        <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest block mb-3 font-bold flex items-center gap-2">
          <Info size={12} /> Description
        </span>
        <div className={`text-on-surface-variant font-body text-xs leading-relaxed overflow-hidden transition-all duration-700 ${isExpanded ? "max-h-[1000px]" : "max-h-24"
          }`}>
          {profile?.longBusinessSummary || "No description available for this asset."}
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent"></div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-6 text-[10px] font-label uppercase text-primary-container hover:text-primary-container/80 transition-colors flex items-center gap-2"
      >
        <span className="w-1 h-4 bg-primary-container"></span>
        {isExpanded ? "Collapse Intel" : "Read Full Intel"}
      </button>

      <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Users className="text-on-surface-variant" size={14} />
          <span className="text-[10px] font-label text-on-surface-variant uppercase">
            Headcount: <span className="text-on-background font-bold">{profile?.fullTimeEmployees?.toLocaleString() || "---"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="text-on-surface-variant" size={14} />
          <span className="text-[10px] font-label text-on-surface-variant uppercase">
            {profile?.city}, {profile?.country}
          </span>
        </div>
      </div>
    </div>
  );
}

function Globe({ className, size }: { className?: string, size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
