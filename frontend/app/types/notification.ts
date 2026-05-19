export interface Notification {
  id: number;

  type: string;

  message: string;

  senderId?: number;

  read?: boolean;

  isRead?: boolean;

  aceptada?: boolean;
}
