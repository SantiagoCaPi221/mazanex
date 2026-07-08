export interface Notification {
  id: number;
  type: string;
  message: string;
  senderId?: number;
  read?: boolean;
  isRead?: boolean;
  aceptada?: boolean;
}

export interface NotificationPayload {
  senderId?: number;
  type?: string;
  message?: string;
  read?: boolean;
  isRead?: boolean;
  aceptada?: boolean;
}
