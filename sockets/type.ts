/* eslint-disable */
// @ts-nocheck
import type {
  MatchErrorPayload,
  MatchFoundPayload,
  MatchSearchingPayload,
} from "./socket.types";

export interface handlers {
  onNewMessage: (message: any) => void
  onTyping: (data: any) => void
  onUserJoined?: (data: any) => void
  onUserLeave?:(data:any)=>void
  onMatchFound?: (payload: MatchFoundPayload) => void
  onMatchSearching?: (payload: MatchSearchingPayload) => void
  onMatchError?: (payload: MatchErrorPayload) => void
}
export enum MessageType {
  TEXT,
}
