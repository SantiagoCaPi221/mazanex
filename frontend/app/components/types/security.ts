export interface PasswordForm {
  current: string;
  new: string;
}

export interface SecurityMessage {
  text: string;
  type: "success" | "error";
}

export interface SecurityCardProps {
  msg?: SecurityMessage | null;
  pass: PasswordForm;
  setPass: React.Dispatch<React.SetStateAction<PasswordForm>>;
  loading: boolean;
  updatePassword: (e: React.FormEvent) => Promise<void>;
}
