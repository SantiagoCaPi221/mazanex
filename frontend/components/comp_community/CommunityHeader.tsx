"use client";

import { Search, Users } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function CommunityHeader({ search, setSearch }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          <Users className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
          Community <span className="text-indigo-500">Mazanex</span>
        </h1>
      </div>

      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400" />

        <input
          type="text"
          placeholder="SEARCH PLAYER..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black"
        />
      </div>
    </div>
  );
}
