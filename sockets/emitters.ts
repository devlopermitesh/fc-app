import type {
  JoinRoomAck,
  LeaveRoomAck,
  SendMessageAck,
  StartMatchmakingAck,
} from "./socket.types";
import { MATCHMAKING_EVENTS } from "./matchmaking.events";
import { ROOM_EVENTS } from "./room.events";
import { Socket } from "socket.io-client";

export function startMatchmaking(
  socket: Socket,
  ack?: (response: StartMatchmakingAck) => void,
) {
  socket.emit(MATCHMAKING_EVENTS.START, ack);
}

export function joinRoom(
  socket: Socket,
  payload: { roomId?: string },
  ack?: (response: JoinRoomAck) => void,
) {
  socket.emit(ROOM_EVENTS.JOIN, payload, ack);
}

export function leaveRoom(
  socket: Socket,
  payload: { roomId?: string },
  ack?: (response: LeaveRoomAck) => void,
) {
  socket.emit(ROOM_EVENTS.LEAVE, payload, ack);
}

export function sendRoomMessage(
  socket: Socket,
  payload: { roomId: string; text: string },
  ack?: (response: SendMessageAck) => void,
) {
  socket.emit(ROOM_EVENTS.SEND_MESSAGE, payload, ack);
}

export function emitTypingStart(socket: Socket, payload: { roomId?: string }) {
  socket.emit(ROOM_EVENTS.TYPING_START, payload);
}

export function emitTypingStop(socket: Socket, payload: { roomId?: string }) {
  socket.emit(ROOM_EVENTS.TYPING_STOP, payload);
}
