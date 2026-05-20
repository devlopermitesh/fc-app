// sockets/listeners.ts
import { Socket } from "socket.io-client";
import { MATCHMAKING_EVENTS } from "./matchmaking.events";
import { handlers } from "./type";

export function registerChatListeners(
    socket: Socket,
    handlers: handlers
) {
    socket.off("chat:new-message", handlers.onNewMessage);
    socket.on("chat:new-message", handlers.onNewMessage);

    if (handlers.onUserJoined) {
        socket.off("chat:user-joined", handlers.onUserJoined);
        socket.on("chat:user-joined", handlers.onUserJoined);
    }

    if (handlers.onMatchFound) {
        socket.off(MATCHMAKING_EVENTS.FOUND, handlers.onMatchFound);
        socket.on(MATCHMAKING_EVENTS.FOUND, handlers.onMatchFound);
    }

    if (handlers.onMatchSearching) {
        socket.off(MATCHMAKING_EVENTS.SEARCHING, handlers.onMatchSearching);
        socket.on(MATCHMAKING_EVENTS.SEARCHING, handlers.onMatchSearching);
    }

    if (handlers.onMatchError) {
        socket.off(MATCHMAKING_EVENTS.ERROR, handlers.onMatchError);
        socket.on(MATCHMAKING_EVENTS.ERROR, handlers.onMatchError);
    }
}
