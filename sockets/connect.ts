import { getSocket } from "./index";

let isConnected = false;

export function connectSocket(token?: string) {
    const socket = getSocket();

    if (isConnected) return socket;

    if (token) {
        socket.auth = { token };
    }

    socket.connect();
    isConnected = true;

    return socket;
}

export function disconnectSocket() {
    const socket = getSocket();

    if (socket.connected) {
        socket.disconnect();
        isConnected = false;
    }
}