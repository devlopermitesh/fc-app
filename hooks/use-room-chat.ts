"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket } from "@/sockets/connect";
import {
  emitTypingStart,
  emitTypingStop,
  joinRoom,
  leaveRoom,
  sendRoomMessage,
} from "@/sockets/emitters";
import { ROOM_EVENTS } from "@/sockets/room.events";
import {
  chatErrorPayloadSchema,
  chatMessagePayloadSchema,
  chatPresencePayloadSchema,
  joinRoomAckSchema,
  roomJoinedPayloadSchema,
  sendMessageAckSchema,
  type ChatParticipantPayload,
  type RoomJoinedPayload,
} from "@/sockets/socket.types";

type RoomStatus = "connecting" | "ready" | "error";

const JOIN_ERROR_MESSAGE =
  "We found an issue while preparing your room. Please retry.";
const SEND_ERROR_MESSAGE = "Message could not be sent. Please try again.";
const CONNECTION_ERROR_MESSAGE = "Connection lost. Please reconnect and continue.";
const SESSION_ERROR_MESSAGE = "Your session has expired. Please sign in again.";

const mapRoomErrorMessage = (message?: string) => {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("expired") ||
    normalizedMessage.includes("invalid token") ||
    normalizedMessage.includes("authentication")
  ) {
    return SESSION_ERROR_MESSAGE;
  }

  if (normalizedMessage.includes("message")) {
    return SEND_ERROR_MESSAGE;
  }

  return JOIN_ERROR_MESSAGE;
};

export function useRoomChat(roomId: string) {
  const [status, setStatus] = useState<RoomStatus>("connecting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomJoinedPayload | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [typingParticipant, setTypingParticipant] =
    useState<ChatParticipantPayload | null>(null);
  const [isSending, setIsSending] = useState(false);
  const isMountedRef = useRef(false);
  const isTypingRef = useRef(false);
  const typingStopTimerRef = useRef<number | null>(null);

  const failRoom = useCallback((message: string, detail?: unknown) => {
    if (!isMountedRef.current) {
      return;
    }

    if (detail) {
      console.error("[room-chat]", detail);
    }

    setStatus("error");
    setErrorMessage(message);
    setIsSending(false);
  }, []);

  const handleRoomSnapshot = useCallback((payload: RoomJoinedPayload) => {
    setRoom(payload);
    setStatus("ready");
    setErrorMessage(null);
  }, []);

  const hydrateRoom = useCallback(() => {
    joinRoom(connectSocket(), { roomId }, (response) => {
      const parsedAck = joinRoomAckSchema.safeParse(response);

      if (!parsedAck.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedAck.error.flatten());
        return;
      }

      if (!parsedAck.data.ok) {
        failRoom(mapRoomErrorMessage(parsedAck.data.message), parsedAck.data);
        return;
      }

      handleRoomSnapshot(parsedAck.data.data);
    });
  }, [failRoom, handleRoomSnapshot, roomId]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    const handleConnect = () => {
      hydrateRoom();
    };

    const handleJoined = (payload: unknown) => {
      const parsedPayload = roomJoinedPayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      handleRoomSnapshot(parsedPayload.data);
    };

    const handleMessage = (payload: unknown) => {
      const parsedPayload = chatMessagePayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      setRoom((current) => {
        if (!current || current.roomId !== parsedPayload.data.roomId) {
          return current;
        }

        if (
          current.messages.some(
            (message) => message.messageId === parsedPayload.data.messageId,
          )
        ) {
          return current;
        }

        return {
          ...current,
          messages: [...current.messages, parsedPayload.data],
        };
      });
      setIsSending(false);
    };

    const handlePresenceJoin = (payload: unknown) => {
      const parsedPayload = chatPresencePayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      setRoom((current) => {
        if (!current || current.roomId !== parsedPayload.data.roomId) {
          return current;
        }

        if (
          current.users.some((user) => user.userId === parsedPayload.data.user.userId)
        ) {
          return current;
        }

        return {
          ...current,
          users: [...current.users, parsedPayload.data.user],
        };
      });
    };

    const handlePresenceLeft = (payload: unknown) => {
      const parsedPayload = chatPresencePayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      setIsPartnerTyping(false);
      setTypingParticipant(null);
      setRoom((current) => {
        if (!current || current.roomId !== parsedPayload.data.roomId) {
          return current;
        }

        return {
          ...current,
          users: current.users.filter(
            (user) => user.userId !== parsedPayload.data.user.userId,
          ),
        };
      });
    };

    const handleTypingStarted = (payload: unknown) => {
      const parsedPayload = chatPresencePayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      setTypingParticipant(parsedPayload.data.user);
      setIsPartnerTyping(true);
    };

    const handleTypingStopped = (payload: unknown) => {
      const parsedPayload = chatPresencePayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      setTypingParticipant((current) =>
        current?.userId === parsedPayload.data.user.userId ? null : current,
      );
      setIsPartnerTyping(false);
    };

    const handleChatError = (payload: unknown) => {
      const parsedPayload = chatErrorPayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failRoom(JOIN_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      failRoom(mapRoomErrorMessage(parsedPayload.data.message), parsedPayload.data);
    };

    const handleDisconnect = () => {
      setStatus("error");
      setErrorMessage(CONNECTION_ERROR_MESSAGE);
      setIsPartnerTyping(false);
      setIsSending(false);
    };

    const handleConnectError = (error: Error) => {
      failRoom(mapRoomErrorMessage(error.message), error);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on(ROOM_EVENTS.JOINED, handleJoined);
    socket.on(ROOM_EVENTS.NEW_MESSAGE, handleMessage);
    socket.on(ROOM_EVENTS.USER_JOINED, handlePresenceJoin);
    socket.on(ROOM_EVENTS.USER_LEFT, handlePresenceLeft);
    socket.on(ROOM_EVENTS.TYPING_STARTED, handleTypingStarted);
    socket.on(ROOM_EVENTS.TYPING_STOPPED, handleTypingStopped);
    socket.on(ROOM_EVENTS.ERROR, handleChatError);

    if (socket.connected) {
      hydrateRoom();
    }

    return () => {
      if (typingStopTimerRef.current) {
        window.clearTimeout(typingStopTimerRef.current);
      }

      emitTypingStop(socket, { roomId });
      leaveRoom(socket, { roomId });
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off(ROOM_EVENTS.JOINED, handleJoined);
      socket.off(ROOM_EVENTS.NEW_MESSAGE, handleMessage);
      socket.off(ROOM_EVENTS.USER_JOINED, handlePresenceJoin);
      socket.off(ROOM_EVENTS.USER_LEFT, handlePresenceLeft);
      socket.off(ROOM_EVENTS.TYPING_STARTED, handleTypingStarted);
      socket.off(ROOM_EVENTS.TYPING_STOPPED, handleTypingStopped);
      socket.off(ROOM_EVENTS.ERROR, handleChatError);
    };
  }, [failRoom, handleRoomSnapshot, hydrateRoom, roomId]);

  const syncTyping = (draft: string) => {
    const socket = connectSocket();
    const hasText = draft.trim().length > 0;

    if (hasText && !isTypingRef.current) {
      emitTypingStart(socket, { roomId });
      isTypingRef.current = true;
    }

    if (typingStopTimerRef.current) {
      window.clearTimeout(typingStopTimerRef.current);
    }

    if (!hasText && isTypingRef.current) {
      emitTypingStop(socket, { roomId });
      isTypingRef.current = false;
      return;
    }

    if (hasText) {
      typingStopTimerRef.current = window.setTimeout(() => {
        emitTypingStop(socket, { roomId });
        isTypingRef.current = false;
      }, 1200);
    }
  };

  const sendMessage = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return false;
    }

    setIsSending(true);
    emitTypingStop(connectSocket(), { roomId });
    isTypingRef.current = false;

    sendRoomMessage(connectSocket(), { roomId, text: trimmedText }, (response) => {
      const parsedAck = sendMessageAckSchema.safeParse(response);

      if (!parsedAck.success) {
        failRoom(SEND_ERROR_MESSAGE, parsedAck.error.flatten());
        return;
      }

      if (!parsedAck.data.ok) {
        failRoom(SEND_ERROR_MESSAGE, parsedAck.data);
        return;
      }

      setIsSending(false);
    });

    return true;
  };

  const retry = () => {
    setStatus("connecting");
    setErrorMessage(null);
    hydrateRoom();
  };

  return {
    errorMessage,
    isPartnerTyping,
    isReady: status === "ready",
    isSending,
    messages: room?.messages ?? [],
    participants: room?.users ?? [],
    retry,
    sendMessage,
    status,
    syncTyping,
    typingParticipant,
  };
}
