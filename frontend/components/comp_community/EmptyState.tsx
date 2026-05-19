"use client";

import { Target } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed">
      <Target className="w-12 h-12 text-slate-700 mx-auto mb-4 opacity-30" />

      <p className="text-slate-500 font-black uppercase tracking-widest">
        No players detected
      </p>
    </div>
  );
}