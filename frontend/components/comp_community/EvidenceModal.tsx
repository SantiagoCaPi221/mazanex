import { X } from "lucide-react";

import type { RankingEntry } from "@/app/types/community";

type Props = {
  evidence: RankingEntry | null;
  onClose: () => void;
  onReport: (id: number) => void;
};

export function EvidenceModal({ evidence, onClose, onReport }: Props) {
  if (!evidence?.screenshotUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-black p-6 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <img src={evidence.screenshotUrl} className="max-h-[70vh]" />

        <button
          onClick={() => onReport(evidence.id)}
          className="mt-4 bg-red-500 px-4 py-2 rounded"
        >
          Reportar
        </button>
      </div>
    </div>
  );
}
