"use client";

import { startTransition, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RoomComposer } from "./room-composer";
import { RoomHeader } from "./room-header";
import { RoomMessageList } from "./room-message-list";
import type { RoomMessage } from "./room.types";

const initialMessages: RoomMessage[] = [
  {
    id: "m-1",
    author: "match",
    body: "The moon looks particularly intense tonight. Do you ever feel like the stars only get loud in the strange hours?",
    timestamp: "11:05 pm",
  },
  {
    id: "m-2",
    author: "you",
    body: "I do. It feels like the kind of silence you only notice once the world has fallen asleep.",
    timestamp: "11:06 pm",
    emphasis: "gold",
  },
  {
    id: "m-3",
    author: "match",
    body: "I think so too. The world moves slower, and it feels like secrets have room to breathe then.",
    timestamp: "11:07 pm",
  },
  {
    id: "m-4",
    author: "system",
    body: "matched successfully",
    timestamp: "11:07 pm",
  },
  {
    id: "m-5",
    author: "you",
    body: "Maybe it is easier when you're just a voice out here. No names, just words.",
    timestamp: "11:08 pm",
    emphasis: "gold",
  },
];

const replyPool = [
  "That kind of mystery is exactly why I stayed in this room a little longer.",
  "It feels easier to be honest when the night keeps the edges of everything soft.",
  "You write like you already know the scene before it happens.",
];

type RoomScreenProps = {
  roomId: string;
};

const formatTimestamp = () =>
  new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

export function RoomScreen({ roomId }: RoomScreenProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const nextReply = useMemo(
    () => replyPool[messages.length % replyPool.length]!,
    [messages.length],
  );

  const sendMessage = () => {
    const content = draft.trim();

    if (!content) {
      return;
    }

    const outgoingMessage: RoomMessage = {
      id: `message-${crypto.randomUUID()}`,
      author: "you",
      body: content,
      timestamp: formatTimestamp(),
      emphasis: "gold",
    };

    startTransition(() => {
      setMessages((current) => [...current, outgoingMessage]);
      setDraft("");
      setIsPartnerTyping(true);
    });

    window.setTimeout(() => {
      const incomingMessage: RoomMessage = {
        id: `message-${crypto.randomUUID()}`,
        author: "match",
        body: nextReply,
        timestamp: formatTimestamp(),
      };

      startTransition(() => {
        setMessages((current) => [...current, incomingMessage]);
        setIsPartnerTyping(false);
      });
    }, 1400);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_bottom,rgba(246,196,0,0.14),transparent_22%),linear-gradient(180deg,#0f0f0f_0%,#090909_100%)] px-0 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative flex min-h-screen flex-col overflow-hidden border-x border-white/6 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(10,10,10,1)_100%)] shadow-[0_50px_120px_rgba(0,0,0,0.55)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_12%),radial-gradient(circle_at_80%_20%,rgba(246,196,0,0.08),transparent_18%)]" />
          <RoomHeader roomId={roomId} matchName="Lunar Veil" />
          <RoomMessageList
            messages={messages}
            isPartnerTyping={isPartnerTyping}
          />
          <RoomComposer
            draft={draft}
            onDraftChange={setDraft}
            onSend={sendMessage}
            disabled={isPartnerTyping}
          />
        </motion.section>
      </div>
    </main>
  );
}
