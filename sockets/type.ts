/* eslint-disable */
// @ts-nocheck
export interface handlers {
  onNewMessage: (message: any) => void
  onTyping: (data: any) => void
  onUserJoined?: (data: any) => void
  onUserLeave?:(data:any)=>void
}
export enum MessageType {
  TEXT,
}