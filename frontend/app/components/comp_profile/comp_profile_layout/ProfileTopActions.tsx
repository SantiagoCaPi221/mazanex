import { Eye, EyeOff, MonitorPlay } from "lucide-react";

import { UploadType } from "@/app/components/types/user";

interface Props {
  isProfileVisible: boolean;

  setIsProfileVisible: (value: boolean) => void;

  backgroundInputRef: React.RefObject<HTMLInputElement | null>;

  upload: (file: File, type: UploadType) => void;
}

export default function ProfileTopActions({
  isProfileVisible,
  setIsProfileVisible,
  backgroundInputRef,
  upload,
}: Props) {
  return (
    <div className="absolute top-6 right-6 z-20 flex flex-col gap-3 items-end">
      <button
        type="button"
        onClick={() => setIsProfileVisible(!isProfileVisible)}
        className="bg-black/20 hover:bg-black/60 text-white/60 hover:text-white p-3 rounded-full backdrop-blur-md flex items-center transition-all duration-300 group shadow-sm hover:shadow-xl"
      >
        {isProfileVisible ? (
          <EyeOff className="w-5 h-5 shrink-0" />
        ) : (
          <Eye className="w-5 h-5 shrink-0" />
        )}

        <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-300 whitespace-nowrap text-sm font-bold overflow-hidden">
          {isProfileVisible ? "Ocultar Perfil" : "Mostrar Perfil"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => backgroundInputRef.current?.click()}
        className="bg-black/20 hover:bg-black/60 text-white/60 hover:text-white p-3 rounded-full backdrop-blur-md flex items-center transition-all duration-300 group shadow-sm hover:shadow-xl"
      >
        <MonitorPlay className="w-5 h-5 shrink-0" />

        <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-300 whitespace-nowrap text-sm font-bold overflow-hidden">
          Cambiar Fondo
        </span>
      </button>

      <input
        type="file"
        ref={backgroundInputRef}
        className="hidden"
        accept="image/*,image/gif"
        onChange={(e) =>
          e.target.files?.[0] && upload(e.target.files[0], "backgroundUrl")
        }
      />
    </div>
  );
}
