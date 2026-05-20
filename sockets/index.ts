import { env } from "@/utils/config";
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;

const buildNamespaceUrl = (baseUrl: string) => {
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  return `${normalizedBaseUrl}/chat`;
};

export const getSocket = () => {
  if (!socket) {
    socket = io(buildNamespaceUrl(env.NEXT_PUBLIC_SOCKET_URL!), {
      autoConnect: false,
      reconnection: true,
      withCredentials: true,
      path: "/socket.io",
    });
  }

  return socket;
};
