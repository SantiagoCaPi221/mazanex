export type RelationshipStatus =
  | "NONE"
  | "PENDING"
  | "ACCEPTED";

export type Relationship = {
  status: RelationshipStatus;
  isSender: boolean;
};

export type User = {
  id: number;
  name: string;
  avatarUrl?: string;
};

export type UsersFilterType = "ALL" | "FRIENDS";

export type GameType = "SNAKE";

export type RankingEntry = {
  id: number;
  user?: {
    name?: string;
  };
  username?: string;
  playerName?: string;
  highScore?: number;
  puntajeMaximo?: number;
  mode?: string;
  modo?: string;
  screenshotUrl?: string;
};

export type Evidence = {
  id: number;
  url: string;
};