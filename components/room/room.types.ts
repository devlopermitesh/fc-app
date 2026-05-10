export type RoomMessage = {
  id: string;
  author: "you" | "match" | "system";
  body: string;
  timestamp: string;
  emphasis?: "default" | "gold";
};
