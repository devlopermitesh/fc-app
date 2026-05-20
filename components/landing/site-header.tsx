"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-white/6 bg-black/55 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/20 bg-gold/8 shadow-[0_0_35px_rgba(246,196,0,0.12)]">
            <Image src={logo} alt="Fantasy Chat logo" className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold tracking-[0.24em] text-gold sm:text-2xl">
              Fantasy Chat
            </p>
            <p className="text-xs uppercase tracking-[0.42em] text-white/40">
              Anonymous dream matching
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          <a className="transition hover:text-gold" href="#how-it-works">
            How It Works
          </a>
          <a className="transition hover:text-gold" href="#experiences">
            Experiences
          </a>
          <a className="transition hover:text-gold" href="#footer">
            Contact
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
