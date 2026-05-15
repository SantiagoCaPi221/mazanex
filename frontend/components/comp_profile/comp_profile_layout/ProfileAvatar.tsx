import { Camera } from "lucide-react";

import { getInitials } from "@/app/utils/profile/layout/profileHelpers";

import { UploadType } from "@/app/types/profile";

interface Props {
  avatarUrl?: string | null;

  username?: string;

  avatarInputRef: React.RefObject<HTMLInputElement | null>;

  upload: (file: File, type: UploadType) => void;
}

export default function ProfileAvatar({
  avatarUrl,
  username,
  avatarInputRef,
  upload,
}: Props) {
  return (
    <div className="absolute -top-20 left-12">
      <div
        className="w-40 h-40 bg-white/50 backdrop-blur-sm rounded-[2.5rem] shadow-2xl flex items-center justify-center border-8 border-white/80 cursor-pointer group relative overflow-hidden"
        onClick={() => avatarInputRef.current?.click()}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <span className="text-4xl font-black text-indigo-600 uppercase">
            {getInitials(username)}
          </span>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      <input
        type="file"
        ref={avatarInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] && upload(e.target.files[0], "avatarUrl")
        }
      />
    </div>
  );
}
