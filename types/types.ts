export type MatchStatus = "idle" | "waiting" | "matched";

export type AuthenticatedUser = {
  userId: string;
  username: string;
  fantasy: string;
  avatar: string;
  createdAt: string;
  attempScore: number;
  mask: string;
  tags: string[];
  queue: string | null;
  status: MatchStatus;
  categoryRoom: string | null;
};
