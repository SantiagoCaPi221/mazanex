export interface PasswordForm {
  current: string;
  new: string;
}

export interface SecurityMessage {
  text: string;
  type: "success" | "error";
}
