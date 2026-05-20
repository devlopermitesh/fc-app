import { z } from "zod";

const matchedUserSchema = z.object({
  userId: z.string().min(1),
  username: z.string().min(1),
  avatar: z.string().min(1),
  fantasy: z.string().min(1),
});

export const matchSearchingPayloadSchema = z.object({
  queue: z.string().min(1),
  tags: z.array(z.string().min(1)),
  mask: z.string().min(1),
});

export const matchFoundPayloadSchema = z.object({
  roomId: z.string().min(1),
  commonTags: z.array(z.string().min(1)),
  matchedUser: matchedUserSchema,
});

export const matchErrorPayloadSchema = z.object({
  message: z.string().min(1),
});

export const chatParticipantPayloadSchema = z.object({
  userId: z.string().min(1),
  username: z.string().min(1),
  avatar: z.string().min(1),
  fantasy: z.string().min(1),
});

export const chatMessagePayloadSchema = z.object({
  messageId: z.string().min(1),
  roomId: z.string().min(1),
  text: z.string().min(1),
  sentAt: z.string().min(1),
  sender: chatParticipantPayloadSchema,
});

export const roomJoinedPayloadSchema = z.object({
  roomId: z.string().min(1),
  commonTags: z.array(z.string().min(1)),
  users: z.array(chatParticipantPayloadSchema),
  messages: z.array(chatMessagePayloadSchema),
});

export const chatPresencePayloadSchema = z.object({
  roomId: z.string().min(1),
  user: chatParticipantPayloadSchema,
});

export const chatErrorPayloadSchema = z.object({
  message: z.string().min(1),
});

export const joinRoomAckSchema = z.union([
  z.object({
    ok: z.literal(true),
    data: roomJoinedPayloadSchema,
  }),
  z.object({
    ok: z.literal(false),
    message: z.string().min(1),
  }),
]);

export const sendMessageAckSchema = z.union([
  z.object({
    ok: z.literal(true),
    data: chatMessagePayloadSchema,
  }),
  z.object({
    ok: z.literal(false),
    message: z.string().min(1),
  }),
]);

export const leaveRoomAckSchema = z.union([
  z.object({
    ok: z.literal(true),
    data: z.object({
      roomId: z.string().min(1),
    }),
  }),
  z.object({
    ok: z.literal(false),
    message: z.string().min(1),
  }),
]);

export const startMatchmakingAckSchema = z.union([
  z.object({
    ok: z.literal(true),
    status: z.literal("searching"),
    data: matchSearchingPayloadSchema,
  }),
  z.object({
    ok: z.literal(true),
    status: z.literal("matched"),
    data: matchFoundPayloadSchema,
  }),
  z.object({
    ok: z.literal(false),
    message: z.string().min(1),
  }),
]);

export type StartMatchmakingAck = z.infer<typeof startMatchmakingAckSchema>;
export type MatchFoundPayload = z.infer<typeof matchFoundPayloadSchema>;
export type MatchSearchingPayload = z.infer<typeof matchSearchingPayloadSchema>;
export type MatchErrorPayload = z.infer<typeof matchErrorPayloadSchema>;
export type ChatParticipantPayload = z.infer<typeof chatParticipantPayloadSchema>;
export type ChatMessagePayload = z.infer<typeof chatMessagePayloadSchema>;
export type RoomJoinedPayload = z.infer<typeof roomJoinedPayloadSchema>;
export type ChatPresencePayload = z.infer<typeof chatPresencePayloadSchema>;
export type ChatErrorPayload = z.infer<typeof chatErrorPayloadSchema>;
export type JoinRoomAck = z.infer<typeof joinRoomAckSchema>;
export type SendMessageAck = z.infer<typeof sendMessageAckSchema>;
export type LeaveRoomAck = z.infer<typeof leaveRoomAckSchema>;
