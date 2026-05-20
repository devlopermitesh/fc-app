export const MATCHMAKING_EVENTS = {
  START: "start-matchmaking",
  SEARCHING: "match-searching",
  FOUND: "match-found",
  ERROR: "match-error",
} as const;

export type MatchmakingEventName =
  (typeof MATCHMAKING_EVENTS)[keyof typeof MATCHMAKING_EVENTS];
