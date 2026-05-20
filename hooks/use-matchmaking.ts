"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { connectSocket, disconnectSocket } from "@/sockets/connect";
import { startMatchmaking } from "@/sockets/emitters";
import { MATCHMAKING_EVENTS } from "@/sockets/matchmaking.events";
import {
  matchErrorPayloadSchema,
  matchFoundPayloadSchema,
  matchSearchingPayloadSchema,
  startMatchmakingAckSchema,
  type MatchFoundPayload,
} from "@/sockets/socket.types";
import { useToast } from "@/components/Providers/toast-provider";

type MatchmakingStatus = "idle" | "connecting" | "searching" | "error";

type UseMatchmakingOptions = {
  enabled: boolean;
  onMatchFound?: () => void;
};

const GENERIC_ERROR_MESSAGE =
  "Unable to start matchmaking right now. Please try again.";
const EXPIRED_SESSION_MESSAGE = "Your session has expired. Please sign in again.";
const CONNECTION_LOST_MESSAGE =
  "Connection lost while searching for a match. Please reconnect and try again.";
const PREPARING_MATCH_MESSAGE =
  "We found an issue while preparing your match. Please retry.";
const ROOM_MATCH_STORAGE_KEY = "fantasychat:last-match";

const mapErrorMessage = (message?: string) => {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("expired") ||
    normalizedMessage.includes("invalid token") ||
    normalizedMessage.includes("authentication")
  ) {
    return EXPIRED_SESSION_MESSAGE;
  }

  if (
    normalizedMessage.includes("xhr poll error") ||
    normalizedMessage.includes("websocket error") ||
    normalizedMessage.includes("transport")
  ) {
    return CONNECTION_LOST_MESSAGE;
  }

  return GENERIC_ERROR_MESSAGE;
};

export function useMatchmaking({
  enabled,
  onMatchFound,
}: UseMatchmakingOptions) {
  const router = useRouter();
  const { showToast } = useToast();
  const [retryKey, setRetryKey] = useState(0);
  const [phase, setPhase] = useState<"idle" | "searching" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasStartedRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  const isMountedRef = useRef(false);

  const failMatchmaking = useEffectEvent((message: string, detail?: unknown) => {
    if (!isMountedRef.current) {
      return;
    }

    if (detail) {
      console.error("[matchmaking]", detail);
    }

    disconnectSocket();
    setPhase("error");
    setErrorMessage(message);
  });

  const navigateToRoom = useEffectEvent((payload: MatchFoundPayload) => {
    if (hasNavigatedRef.current) {
      return;
    }

    hasNavigatedRef.current = true;
    setPhase("idle");
    setErrorMessage(null);
    window.sessionStorage.setItem(
      ROOM_MATCH_STORAGE_KEY,
      JSON.stringify({
        roomId: payload.roomId,
        matchedUserId: payload.matchedUser.userId,
        matchedUsername: payload.matchedUser.username,
      }),
    );
    onMatchFound?.();
    showToast({
      title: "Match found",
      description: "Your room is ready. Entering now.",
      variant: "success",
    });
    router.push(`/room/${payload.roomId}`);
  });

  const beginMatchmaking = useEffectEvent(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    setPhase("searching");
    startMatchmaking(connectSocket(), (response) => {
      const parsedAck = startMatchmakingAckSchema.safeParse(response);

      if (!parsedAck.success) {
        failMatchmaking(PREPARING_MATCH_MESSAGE, parsedAck.error.flatten());
        return;
      }

      if (!parsedAck.data.ok) {
        failMatchmaking(mapErrorMessage(parsedAck.data.message), parsedAck.data);
        return;
      }

      if (parsedAck.data.status === "matched") {
        const parsedPayload = matchFoundPayloadSchema.safeParse(parsedAck.data.data);

        if (!parsedPayload.success) {
          failMatchmaking(PREPARING_MATCH_MESSAGE, parsedPayload.error.flatten());
        }
      }
    });
  });

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      hasStartedRef.current = false;
      hasNavigatedRef.current = false;
      disconnectSocket();
      return;
    }

    const socket = connectSocket();
    hasStartedRef.current = false;
    hasNavigatedRef.current = false;

    const handleConnect = () => {
      beginMatchmaking();
    };

    const handleSearching = (payload: unknown) => {
      const parsedPayload = matchSearchingPayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failMatchmaking(PREPARING_MATCH_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      setPhase("searching");
      setErrorMessage(null);
    };

    const handleFound = (payload: unknown) => {
      const parsedPayload = matchFoundPayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failMatchmaking(PREPARING_MATCH_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      navigateToRoom(parsedPayload.data);
    };

    const handleMatchError = (payload: unknown) => {
      const parsedPayload = matchErrorPayloadSchema.safeParse(payload);

      if (!parsedPayload.success) {
        failMatchmaking(GENERIC_ERROR_MESSAGE, parsedPayload.error.flatten());
        return;
      }

      failMatchmaking(mapErrorMessage(parsedPayload.data.message), parsedPayload.data);
    };

    const handleConnectError = (error: Error) => {
      failMatchmaking(mapErrorMessage(error.message), error);
    };

    const handleDisconnect = (reason: string) => {
      if (hasNavigatedRef.current || reason === "io client disconnect") {
        return;
      }

      failMatchmaking(CONNECTION_LOST_MESSAGE, { reason });
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on(MATCHMAKING_EVENTS.SEARCHING, handleSearching);
    socket.on(MATCHMAKING_EVENTS.FOUND, handleFound);
    socket.on(MATCHMAKING_EVENTS.ERROR, handleMatchError);

    if (socket.connected) {
      beginMatchmaking();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off(MATCHMAKING_EVENTS.SEARCHING, handleSearching);
      socket.off(MATCHMAKING_EVENTS.FOUND, handleFound);
      socket.off(MATCHMAKING_EVENTS.ERROR, handleMatchError);
      disconnectSocket();
    };
  }, [enabled, retryKey]);

  const retry = () => {
    setPhase("idle");
    setErrorMessage(null);
    setRetryKey((current) => current + 1);
  };

  const status: MatchmakingStatus =
    enabled && phase === "idle" ? "connecting" : phase;

  return {
    errorMessage,
    isBusy: status === "connecting" || status === "searching",
    retry,
    status,
  };
}
