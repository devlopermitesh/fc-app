"use client";

import { useEffect } from "react";
import { registerChatListeners } from "./listeners";

import { getSocket } from ".";
import { handlers } from "./type";
export function useSocket(handler: handlers) {
    const socket = getSocket()
    useEffect(() => {
        registerChatListeners(socket, handler);

        return () => {
            socket.off("chat:new-message", handler.onNewMessage);
            if (handler.onUserJoined) {
                socket.off("chat:user-joined", handler.onUserJoined);
            }
            if (handler.onMatchFound) {
                socket.off("match-found", handler.onMatchFound);
            }
            if (handler.onMatchSearching) {
                socket.off("match-searching", handler.onMatchSearching);
            }
            if (handler.onMatchError) {
                socket.off("match-error", handler.onMatchError);
            }
        };
    }, [handler, socket]);

    return socket;
}
