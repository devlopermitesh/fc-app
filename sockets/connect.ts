import { getSocket } from "./index";

export function connectSocket(token?: string | null) {
  const socket = getSocket();

  if (socket.connected) {
    return socket;
  }

  socket.auth = token ? { token } : {};
  socket.connect();

  return socket;
}

export function disconnectSocket() {
  const socket = getSocket();

  if (socket.connected) {
    socket.disconnect();
  }
}
