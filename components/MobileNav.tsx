import { LayoutDashboard, BarChart3, Wallet, User } from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d16]/90 backdrop-blur-xl border-t border-primary-container/10 flex justify-around items-center h-16 z-50">
      <button className="flex flex-col items-center gap-1 text-primary-container cursor-pointer">
        <LayoutDashboard size={20} strokeWidth={2.5} />
        <span className="text-[8px] font-label uppercase">Dash</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-outline-variant cursor-pointer">
        <BarChart3 size={20} />
        <span className="text-[8px] font-label uppercase">Market</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-outline-variant cursor-pointer">
        <Wallet size={20} />
        <span className="text-[8px] font-label uppercase">Assets</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-outline-variant cursor-pointer">
        <User size={20} />
        <span className="text-[8px] font-label uppercase">Profile</span>
      </button>
    </nav>
  );
}
