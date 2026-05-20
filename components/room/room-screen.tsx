"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RoomComposer } from "./room-composer";
import { RoomHeader } from "./room-header";
import { RoomMessageList } from "./room-message-list";
import { useRoomChat } from "@/hooks/use-room-chat";

type RoomScreenProps = {
  roomId: string;
};

const ROOM_MATCH_STORAGE_KEY = "fantasychat:last-match";

export function RoomScreen({ roomId }: RoomScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [storedMatchData, setStoredMatchData] = useState<{
    roomId?: string;
    matchedUserId?: string;
    matchedUsername?: string;
  } | null>(null);
  const {
    errorMessage,
    isPartnerTyping,
    isReady,
    isSending,
    messages,
    participants,
    retry,
    sendMessage,
    status,
    syncTyping,
    typingParticipant,
  } = useRoomChat(roomId);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const rawValue = window.sessionStorage.getItem(ROOM_MATCH_STORAGE_KEY);

      if (!rawValue) {
        setStoredMatchData(null);
        return;
      }

      try {
        const parsedValue = JSON.parse(rawValue) as {
          roomId?: string;
          matchedUserId?: string;
          matchedUsername?: string;
        };

        setStoredMatchData(parsedValue.roomId === roomId ? parsedValue : null);
      } catch {
        setStoredMatchData(null);
      }
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [roomId]);

  const matchedParticipant =
    participants.find(
      (participant) => participant.userId === storedMatchData?.matchedUserId,
    ) ?? participants[0];

  const currentUser =
    participants.find(
      (participant) => participant.userId !== storedMatchData?.matchedUserId,
    ) ?? null;

  const handleSend = () => {
    const didSend = sendMessage(draft);

    if (didSend) {
      setDraft("");
    }
  };

  const handleDraftChange = (value: string) => {
    setDraft(value);
    syncTyping(value);
  };

  const handleLeave = () => {
    router.push("/");
  };

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#0f0f0f_0%,#090909_100%)] px-6 text-foreground">
        <div className="w-full max-w-lg rounded-[2rem] border border-red-400/16 bg-[linear-gradient(180deg,rgba(109,25,25,0.25),rgba(26,9,9,0.72))] px-8 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.35em] text-red-200/72">
            Room unavailable
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-white">
            Unable to load this chat right now
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/64">
            {errorMessage}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-[linear-gradient(90deg,#f6c400_0%,#ff9900_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#140d02]"
            >
              Retry room
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/74"
            >
              Back home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const showLoadingState = status === "connecting" || !isReady;

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
          <RoomHeader
            roomId={roomId}
            matchName={
              matchedParticipant?.username ??
              storedMatchData?.matchedUsername ??
              "Connecting"
            }
            onLeave={handleLeave}
          />

          {showLoadingState ? (
            <div className="flex flex-1 items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border border-gold/18 border-t-gold" />
                <p className="mt-5 text-sm uppercase tracking-[0.3em] text-white/38">
                  Preparing room
                </p>
              </div>
            </div>
          ) : (
            <RoomMessageList
              currentUserId={currentUser?.userId ?? null}
              messages={messages}
              isPartnerTyping={isPartnerTyping}
              typingParticipantName={typingParticipant?.username}
            />
          )}

          <RoomComposer
            draft={draft}
            onDraftChange={handleDraftChange}
            onSend={handleSend}
            disabled={!isReady || isSending}
            placeholder={
              isSending
                ? "Sending message..."
                : "Write your story line here..."
            }
          />
        </motion.section>
      </div>
    </main>
  );
}
