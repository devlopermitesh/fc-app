"use client";

import { motion } from "framer-motion";

type RoomHeaderProps = {
  roomId: string;
  matchName: string;
  onLeave?: () => void;
};

export function RoomHeader({ roomId, matchName, onLeave }: RoomHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative border-b border-white/8 bg-[linear-gradient(180deg,rgba(40,40,40,0.95),rgba(24,24,24,0.94))] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:px-5"
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(246,196,0,0.36),transparent)]" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-[radial-gradient(circle_at_30%_30%,rgba(246,196,0,0.28),rgba(246,196,0,0.06)_55%,rgba(255,255,255,0.02)_100%)] text-sm font-semibold text-gold shadow-[0_0_26px_rgba(246,196,0,0.12)]">
            M
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              MagicalSoul
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/42">
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-1">
                room {roomId.slice(0, 6)}
              </span>
              <span className="rounded-full border border-gold/16 bg-gold/8 px-2 py-1 text-gold/90">
                {matchName}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLeave}
          className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-gold/28 hover:bg-gold/10 hover:text-gold"
        >
          Leave
        </button>
      </div>
    </motion.header>
  );
}
