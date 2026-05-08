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
            socket.off("chat:new-message");
            socket.off("chat:user-joined");
        };
    }, [handler.onNewMessage]);

    return socket;
}