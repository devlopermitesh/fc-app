import { env } from "@/utils/config";
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;
export const getSocket = () => {
if (!socket) {
    socket = io(env.NEXT_PUBLIC_SOCKET_URL!, {
      autoConnect: false,
      reconnection:true,
      path: '/socket.io',
    })
  }
  return socket
};
