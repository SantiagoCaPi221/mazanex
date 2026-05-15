"use client";

interface Props {
  filter: "ALL" | "FRIENDS";
  setFilter: (value: "ALL" | "FRIENDS") => void;
}

export default function CommunityTabs({ filter, setFilter }: Props) {
  return (
    <div className="flex gap-10 border-b border-white/5">
      <button
        onClick={() => setFilter("ALL")}
        className={`pb-4 text-xs font-black tracking-[0.3em] relative ${
          filter === "ALL"
            ? "text-indigo-400"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        DISCOVER
        {filter === "ALL" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
        )}
      </button>

      <button
        onClick={() => setFilter("FRIENDS")}
        className={`pb-4 text-xs font-black tracking-[0.3em] relative ${
          filter === "FRIENDS"
            ? "text-indigo-400"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        MY FRIENDS
        {filter === "FRIENDS" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
        )}
      </button>
    </div>
  );
}
