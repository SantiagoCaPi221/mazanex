import { ImageIcon } from "lucide-react";

import { UploadType } from "@/app/types/user";

interface Props {
  bannerUrl?: string | null;

  bannerInputRef: React.RefObject<HTMLInputElement | null>;

  upload: (file: File, type: UploadType) => void;
}

export default function ProfileBanner({
  bannerUrl,
  bannerInputRef,
  upload,
}: Props) {
  return (
    <div
      className="h-64 bg-slate-200 w-full relative group cursor-pointer overflow-hidden shrink-0"
      onClick={() => bannerInputRef.current?.click()}
    >
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Banner"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center">
          <span className="text-white/20 font-black text-4xl italic">
            MAZANEX
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
        <ImageIcon className="w-5 h-5" />
        Cambiar Banner
      </div>

      <input
        type="file"
        ref={bannerInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] && upload(e.target.files[0], "bannerUrl")
        }
      />
    </div>
  );
}
