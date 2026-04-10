"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#0a0a0c]">
      {/* Base Mesh Gradient */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 2px 2px, #333 1px, transparent 0)`,
             backgroundSize: "40px 40px" 
           }}>
      </div>
      
      {/* Top Right Neon Green Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00ffcc]/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      
      {/* Bottom Left Deep Purple Glow */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7b1fa2]/5 rounded-full blur-[120px]"></div>

      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,.03),rgba(0,255,0,.01),rgba(0,0,255,.03))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
    </div>
  );
}
