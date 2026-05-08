// sockets/listeners.ts
import { Socket } from "socket.io-client";
import { handlers } from "./type";

export function registerChatListeners(
    socket: Socket,
    handlers: handlers
) {

    socket.on("chat:new-message", handlers.onNewMessage);

    socket.on("chat:user-joined", (data) => {
        handlers.onUserJoined?.(data);
    });
    // socket.on("chat:typing-user",handlers.onTyping);
    
}
