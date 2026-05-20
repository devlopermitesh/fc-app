import type { CategoryName } from "@/seed/constant/category.constant";

export type MatchStatus = "idle" | "waiting" | "matched";

export type AuthenticatedUser = {
  userId: string;
  username: string;
  fantasy: string;
  avatar: string;
  createdAt: string;
  attempScore: number;
  mask: string;
  tags: CategoryName[];
  queue: string | null;
  status: MatchStatus;
  categoryRoom: string | null;
};
