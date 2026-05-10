"use client";

import { motion } from "framer-motion";

type RoomComposerProps = {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function RoomComposer({
  draft,
  onDraftChange,
  onSend,
  disabled = false,
}: RoomComposerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
      className="absolute inset-x-0 bottom-0 p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-white/8 bg-[linear-gradient(180deg,rgba(28,28,28,0.95),rgba(18,18,18,0.98))] px-3 py-2 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-sm text-white/42">
          +
        </div>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Write message</span>
          <input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            disabled={disabled}
            placeholder="Write your story line here..."
            className="w-full bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-white/24 disabled:cursor-not-allowed sm:text-[15px]"
          />
        </label>
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !draft.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffd038_0%,#f6c400_45%,#d99500_100%)] text-base font-black text-[#201100] shadow-[0_10px_22px_rgba(246,196,0,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Send message"
        >
          ➜
        </button>
      </div>
    </motion.div>
  );
}
