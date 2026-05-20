import type {
  ChatMessagePayload,
  ChatParticipantPayload,
} from "@/sockets/socket.types";

export type RoomParticipant = ChatParticipantPayload;
export type RoomRealtimeMessage = ChatMessagePayload;
