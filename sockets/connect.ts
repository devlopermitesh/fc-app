import { getSocket } from "./index";

export function connectSocket(token?: string | null) {
  const socket = getSocket();
  socket.auth = token ? { token } : {};

  if (socket.connected) {
    return socket;
  }

  socket.connect();

  return socket;
}

export function disconnectSocket() {
  const socket = getSocket();

  if (socket.connected) {
    socket.disconnect();
  }
}
