import { User, Mail, AlignLeft } from "lucide-react";

import SectionHeader from "./SectionHeader";
import InputField from "./InputField";
import TextareaField from "./TextareaField";

interface Props {
  user: any;

  name: string;
  setName: (value: string) => void;

  bio: string;
  setBio: (value: string) => void;

  isEditing: boolean;
  setIsEditing: (value: boolean) => void;

  loading: boolean;

  handleSave: () => void;
}

export default function ProfileCard({
  user,

  name,
  setName,

  bio,
  setBio,

  isEditing,
  setIsEditing,

  loading,

  handleSave,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader
        isEditing={isEditing}
        loading={loading}
        handleSave={handleSave}
        setIsEditing={setIsEditing}
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            label="Nombre Público"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
          />

          <InputField
            label="Email"
            icon={Mail}
            value={user.email}
            disabled={true}
          />
        </div>

        <TextareaField
          label="Biografía"
          icon={AlignLeft}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={!isEditing}
          placeholder="Cuéntanos algo sobre ti..."
        />
      </div>
    </div>
  );
}
