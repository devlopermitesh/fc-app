import { Socket } from 'socket.io-client'
import type { MessageType } from './type'

export function sendMessage(
  socket: Socket,
  payload: {
    content: string
    type: MessageType
    roomId:string
  }
) {
  socket.emit('chat:sendmessage', payload)
}

export function joinChat(socket: Socket, payload: { roomId: string; message: string }) {
  socket.emit('chat:join', payload)
}
export function leaveChat(socket: Socket, payload: { roomId: string; message: string }) {
  socket.emit('chat:leave', payload)
}

// export function startTyping(socket: Socket, payload: { roomId: string; memberId: string }) {
//   socket.emit('chat:typing-start', {
//     roomId: payload.roomId,
//     memberId: payload.memberId,
//   })
// }

// export function stopTyping(socket: Socket, payload: { roomId: string; memberId: string }) {
//   socket.emit('chat:typing-stop', {
//     roomId: payload.roomId,
//     memberId: payload.memberId,
//   })
// }