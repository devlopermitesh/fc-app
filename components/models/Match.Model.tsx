"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useModel } from "@/hooks/use-model";
import { useMatchmaking } from "@/hooks/use-matchmaking";

const fallbackTags = ["Shadow Realm", "Healer Class", "High Stakes"];

const summarizeFantasyTags = (fantasy?: string) => {
  if (!fantasy) {
    return fallbackTags;
  }

  const words = fantasy
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 5);

  const uniqueWords = Array.from(new Set(words)).slice(0, 3);

  if (uniqueWords.length < 3) {
    return fallbackTags;
  }

  return uniqueWords.map((word) =>
    word
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  );
};

const searchMessages = [
  "Analyzing your fantasy and searching for a compatible connection",
  "Crossing hidden realms to find someone drawn to the same story spark",
  "Scanning the ether for matching mood, danger, chemistry, and mystery",
];

export default function MatchModel() {
  const { isOpen, onClose, data, modelType } = useModel();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(34);
  const { errorMessage, retry, status } = useMatchmaking({
    enabled: isOpen && modelType === "matchModel",
    onMatchFound: onClose,
  });
  const tags = useMemo(() => summarizeFantasyTags(data.fantasy), [data.fantasy]);
  const isSearching = status === "connecting" || status === "searching";
  const statusHeading =
    status === "connecting" ? "Preparing your search..." : "Finding your match...";
  const statusEyebrow =
    status === "connecting" ? "Secure connection" : "Search in progress";
  const statusMessage =
    status === "connecting"
      ? "Securing your session and stepping into the matchmaking realm."
      : searchMessages[messageIndex];

  useEffect(() => {
    if (!isOpen || modelType !== "matchModel" || !isSearching) {
      return;
    }

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 86) {
          return 56;
        }

        return Math.min(current + 8, 86);
      });
    }, 1100);

    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % searchMessages.length);
    }, 2400);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(messageTimer);
    };
  }, [isOpen, isSearching, modelType]);

  if (!isOpen || modelType !== "matchModel") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 18 }}
          transition={{ duration: 0.34, ease: "easeOut" }}
          className="flex min-h-screen items-center justify-center p-0 md:p-6"
        >
          <div className="relative flex min-h-screen w-full overflow-hidden border border-gold/10 bg-[linear-gradient(180deg,#201905_0%,#0a0906_42%,#030303_100%)] shadow-[0_40px_140px_rgba(0,0,0,0.65)] md:min-h-0 md:max-h-[92vh] md:max-w-2xl md:rounded-[2rem]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(246,196,0,0.18),transparent_22%),radial-gradient(circle_at_50%_46%,rgba(246,196,0,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]" />

            <div className="relative flex w-full flex-col px-6 pb-10 pt-7 sm:px-8 md:px-10 md:pb-12">
              <div className="mb-8 flex items-center justify-between border-b border-white/8 pb-5">
                <div>
                  <p className="font-display text-2xl font-semibold tracking-[0.12em] text-gold sm:text-3xl">
                    Fantasy Chat
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.32em] text-white/38">
                    {statusEyebrow}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/72 transition hover:border-gold/35 hover:text-gold"
                  aria-label="Close match search modal"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center text-center">
                {isSearching ? (
                  <div className="contents">
                    <div className="relative mb-10 flex h-[15.5rem] w-[15.5rem] items-center justify-center sm:h-[18rem] sm:w-[18rem]">
                      <motion.div
                        className="absolute inset-0 rounded-full border border-gold/18"
                        animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.12, 0.22] }}
                        transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute inset-[1.55rem] rounded-full border border-gold/22"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.32, 0.16, 0.32] }}
                        transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute inset-[3.35rem] rounded-full border border-gold/45 bg-[radial-gradient(circle,rgba(246,196,0,0.30),rgba(246,196,0,0.08)_55%,rgba(255,255,255,0)_72%)] shadow-[0_0_70px_rgba(246,196,0,0.16)]"
                        animate={{
                          boxShadow: [
                            "0 0 70px rgba(246,196,0,0.16)",
                            "0 0 96px rgba(246,196,0,0.28)",
                            "0 0 70px rgba(246,196,0,0.16)",
                          ],
                        }}
                        transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />

                      <motion.div
                        className="absolute left-[18%] top-[52%] h-2 w-2 rounded-full bg-[#ffb120] shadow-[0_0_18px_rgba(255,177,32,0.9)]"
                        animate={{ x: [0, 16, 0], y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute right-[18%] top-[58%] h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_20px_rgba(246,196,0,0.95)]"
                        animate={{ x: [0, -18, 0], y: [0, 10, 0], opacity: [0.45, 1, 0.45] }}
                        transition={{ duration: 4.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute top-[24%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.95)]"
                        animate={{ y: [0, 12, 0], opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />

                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="relative flex h-20 w-20 items-center justify-center"
                      >
                        <motion.div
                          className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-br-full border-b-[4px] border-r-[4px] border-gold"
                          animate={{ opacity: [0.55, 1, 0.55], scale: [0.95, 1.05, 0.95] }}
                          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-bl-full border-b-[4px] border-l-[4px] border-gold"
                          animate={{ opacity: [1, 0.45, 1], scale: [1.02, 0.92, 1.02] }}
                          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
                        />
                        <motion.div
                          className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 rounded-bl-full border-b-[4px] border-l-[4px] border-gold"
                          animate={{ opacity: [0.55, 1, 0.55], scale: [0.95, 1.08, 0.95] }}
                          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
                        />
                      </motion.div>
                    </div>

                    <h2 className="text-[1.8rem] font-medium tracking-[-0.03em] text-[#f6f1e5] sm:text-[2.2rem]">
                      {statusHeading}
                    </h2>

                    <div className="mt-5 min-h-20 max-w-md">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${status}-${messageIndex}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="text-lg leading-8 text-[#b8a68d] sm:text-xl"
                        >
                          {statusMessage}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-lg rounded-[2rem] border border-red-400/18 bg-[linear-gradient(180deg,rgba(109,25,25,0.28),rgba(26,9,9,0.72))] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-300/18 bg-red-500/10 text-3xl text-red-200">
                      !
                    </div>
                    <h2 className="mt-6 text-[1.8rem] font-medium tracking-[-0.03em] text-[#f6f1e5] sm:text-[2.2rem]">
                      Matchmaking paused
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-[#d8b8b8] sm:text-xl">
                      {errorMessage}
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={retry}
                        className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,#f6c400_0%,#ff9900_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#140d02] transition hover:brightness-105"
                      >
                        Retry search
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/72 transition hover:border-white/24 hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {data.username ? (
                  <p className="mt-3 text-sm uppercase tracking-[0.32em] text-gold/72">
                    Seeking for {data.username}
                  </p>
                ) : null}

                {isSearching ? (
                  <div className="mt-9 w-full max-w-[18rem] sm:max-w-xs">
                    <div className="h-1 rounded-full bg-white/12">
                      <motion.div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#f6c400_0%,#ff9900_100%)]"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ) : null}

                {isSearching ? (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="rounded-full border border-white/16 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#e5d8c0] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-10 flex justify-center md:mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm font-medium text-[#b4a488] transition hover:text-gold"
                >
                  {isSearching ? "Cancel Search" : "Dismiss"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
