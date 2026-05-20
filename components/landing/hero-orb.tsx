"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import orb from "@/assets/Symbolic Illustration.png";

export function HeroOrb() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="relative mx-auto flex aspect-square w-full max-w-[28rem] items-center justify-center"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(246,196,0,0.34),rgba(246,196,0,0.08)_45%,transparent_72%)] blur-2xl"
      />

      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[62%] h-4 w-4 rounded-full bg-gold-strong shadow-[0_0_18px_rgba(255,152,0,0.7)]"
      />
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute right-[19%] top-[18%] h-3 w-3 rounded-full bg-gold shadow-[0_0_16px_rgba(246,196,0,0.8)]"
      />

      <div className="relative h-[78%] w-[78%] rounded-full border border-gold/20 bg-[radial-gradient(circle,rgba(246,196,0,0.2),rgba(15,15,15,0.25)_50%,transparent_76%)] shadow-[0_0_100px_rgba(246,196,0,0.18)]" />
      <Image
        src={orb}
        alt="Mystic orb illustration"
        priority
        className="absolute h-[92%] w-[92%] object-contain drop-shadow-[0_0_70px_rgba(246,196,0,0.28)]"
      />
    </motion.div>
  );
}
