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

export interface CommunityComment {
  authorName: string;
  content: string;
}

export interface CommunityPost {
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt?: string;
  mediaUrl?: string | null;
  authorAvatar?: string | null;
  likes?: number;
  isLiked?: boolean;
  comments?: CommunityComment[];
  likedBy?: number[];
}

export interface CommunityPublicationPayload {
  authorId: number;
  content: string;
  authorName?: string;
  mediaUrl?: string | null;
  authorAvatar?: string | null;
}

export interface CommunityCommentPayload {
  authorId: number;
  authorName: string;
  content: string;
}

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
  game?: string;
};

export type Evidence = {
  id: number;
  url: string;
};