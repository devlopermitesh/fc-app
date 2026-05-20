"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";

type FeatureCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  image?: StaticImageData;
  align?: "top" | "bottom";
};

export function FeatureCard({
  title,
  description,
  eyebrow,
  image,
  align = "bottom",
}: FeatureCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,196,0,0.08),transparent_32%,rgba(255,255,255,0.02))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,196,0,0.14),transparent_35%)] opacity-80 transition duration-500 group-hover:opacity-100" />

      {image ? (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            className={`object-cover opacity-32 transition duration-500 group-hover:scale-105 group-hover:opacity-40 ${
              align === "top" ? "object-top" : "object-bottom"
            }`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.1),rgba(9,9,9,0.7)_60%,rgba(9,9,9,0.95))]" />
        </div>
      ) : null}

      <div className="relative flex min-h-[18rem] flex-col justify-end">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="font-display text-2xl font-semibold text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-sm text-base leading-7 text-white/72">
          {description}
        </p>
      </div>
    </motion.article>
  );
}
