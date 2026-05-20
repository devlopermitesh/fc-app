"use client";

import { motion } from "framer-motion";
import type { RoomRealtimeMessage } from "./room.types";

type RoomMessageListProps = {
  currentUserId: string | null;
  messages: RoomRealtimeMessage[];
  isPartnerTyping: boolean;
  typingParticipantName?: string | null;
};

const bubbleStyles = {
  you: "border-gold/22 bg-[linear-gradient(180deg,rgba(246,196,0,0.22),rgba(147,92,8,0.34))] text-[#fff4d8]",
  match:
    "border-white/10 bg-[linear-gradient(180deg,rgba(48,48,48,0.92),rgba(25,25,25,0.92))] text-white/82",
};

export function RoomMessageList({
  currentUserId,
  messages,
  isPartnerTyping,
  typingParticipantName,
}: RoomMessageListProps) {
  return (
    <div className="relative flex-1 overflow-y-auto px-3 pb-36 pt-4 sm:px-4 sm:pt-5">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[radial-gradient(circle_at_bottom,rgba(246,196,0,0.16),transparent_54%)] opacity-70" />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender.userId === currentUserId;
          const senderName = isCurrentUser ? "You" : message.sender.username;

          return (
            <motion.div
              key={message.messageId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.05 }}
              className={`max-w-[88%] rounded-[1.45rem] border px-4 py-3 shadow-[0_18px_35px_rgba(0,0,0,0.18)] sm:max-w-[72%] ${isCurrentUser ? "ml-auto" : "mr-auto"} ${isCurrentUser ? bubbleStyles.you : bubbleStyles.match}`}
            >
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/34">
                {senderName}
              </p>
              <p className="text-sm leading-6 sm:text-[15px]">{message.text}</p>
              <p className="mt-2 text-right text-[10px] uppercase tracking-[0.2em] text-white/30">
                {new Date(message.sentAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </motion.div>
          );
        })}

        {isPartnerTyping ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mr-auto flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(45,45,45,0.94),rgba(24,24,24,0.94))] px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/42 shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center gap-1">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
              />
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.18 }}
              />
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.36 }}
              />
            </div>
            {(typingParticipantName ?? "Match").slice(0, 18)} is typing
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
