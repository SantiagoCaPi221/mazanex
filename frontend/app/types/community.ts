export type RelationshipStatus = "NONE" | "PENDING" | "ACCEPTED";

export interface User {
  id: number;

  name: string;

  avatarUrl?: string;

  email?: string;

  bio?: string;
}

export interface Relationship {
  status: RelationshipStatus;

  isSender: boolean;
}

export interface RankingPlayer {
  id: number;

  name: string;

  avatarUrl?: string;

  score: number;

  game: string;
}
