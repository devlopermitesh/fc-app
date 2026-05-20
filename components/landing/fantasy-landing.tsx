"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { FeatureCard } from "@/components/landing/feature-card";
import { HeroOrb } from "@/components/landing/hero-orb";
import { SiteHeader } from "@/components/landing/site-header";
import { useModel } from "@/hooks/use-model";
import { useToast } from "@/components/Providers/toast-provider";
import orb from "@/assets/Symbolic Illustration.png";
import { registerSchema, type RegisterInput } from "@/utils/validSchema";

const featureCards = [
  {
    title: "The Crystal Spire",
    description:
      "Explore the collective dream of a civilization powered by pure imagination.",
    eyebrow: "Shared worlds",
    image: orb,
    align: "top" as const,
  },
  {
    title: "Psychic Match",
    description:
      "Our AI oracle deciphers your deepest desires to find your true ethereal counterpart.",
    eyebrow: "Private matching",
  },
  {
    title: "Ethereal Items",
    description:
      "Trade artifacts of thought, save dream prompts, and keep your best story sparks alive.",
    eyebrow: "Creative vault",
    image: orb,
  },
];

const fieldClassName =
  "w-full rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/26 focus:border-gold/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(246,196,0,0.08)]";

const fantasyPrompts = [
  "A moonlit archive where masked strangers trade forbidden prophecies beside a silver fire...",
  "Neon dragons circle a floating city while two anonymous souls decode a portal hidden in the rain...",
  "Inside a velvet forest, time rewinds each time our fingertips brush the same enchanted map...",
];

const getRandomPromptIndex = (currentIndex?: number) => {
  if (fantasyPrompts.length < 2) {
    return 0;
  }

  let nextIndex = currentIndex ?? 0;

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * fantasyPrompts.length);
  }

  return nextIndex;
};

export default function FantasyLanding() {
  const { showToast } = useToast();
  const { onOpen } = useModel();
  const [isFantasyFocused, setIsFantasyFocused] = useState(false);
  const [animatedPrompt, setAnimatedPrompt] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pauseUntil, setPauseUntil] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    defaultValues: {
      username: "",
      fantasy: "",
    },
  });

  const fantasyValue = useWatch({
    control,
    name: "fantasy",
    defaultValue: "",
  });
  const usernameField = register("username", {
    required: "Username must be at least 2 characters long",
    minLength: {
      value: 2,
      message: "Username must be at least 2 characters long",
    },
    maxLength: {
      value: 30,
      message: "Username must be not longer then 30 characters",
    },
  });
  const fantasyField = register("fantasy", {
    required: "Fantasy must be at least 10 characters long",
    minLength: {
      value: 10,
      message: "Fantasy must be at least 10 characters long",
    },
    maxLength: {
      value: 500,
      message: "Fantasy must be at most 500 characters long",
    },
  });
  const shouldShowAnimatedPrompt = !isFantasyFocused && !fantasyValue.trim();
  const sparkleOffsets = useMemo(
    () => [
      { left: "10%", top: "20%", delay: 0.2, duration: 3.2 },
      { left: "84%", top: "24%", delay: 0.8, duration: 2.8 },
      { left: "72%", top: "78%", delay: 0.35, duration: 3.6 },
    ],
    [],
  );

  const advancePrompt = useEffectEvent(() => {
    if (!shouldShowAnimatedPrompt) {
      return;
    }

    const now = Date.now();

    if (pauseUntil && now < pauseUntil) {
      return;
    }

    if (pauseUntil && now >= pauseUntil) {
      setPauseUntil(null);
    }

    const currentPrompt = fantasyPrompts[promptIndex];

    if (!isDeleting) {
      if (animatedPrompt.length < currentPrompt.length) {
        setAnimatedPrompt(currentPrompt.slice(0, animatedPrompt.length + 1));
        return;
      }

      setPauseUntil(now + 1350);
      setIsDeleting(true);
      return;
    }

    if (animatedPrompt.length > 0) {
      setAnimatedPrompt(currentPrompt.slice(0, animatedPrompt.length - 1));
      return;
    }

    setPromptIndex(getRandomPromptIndex(promptIndex));
    setIsDeleting(false);
  });

  useEffect(() => {
    if (!shouldShowAnimatedPrompt) {
      return;
    }

    const timer = window.setTimeout(
      advancePrompt,
      pauseUntil
        ? 90
        : isDeleting
          ? 24 + Math.floor(Math.random() * 28)
          : 38 + Math.floor(Math.random() * 44),
    );

    return () => window.clearTimeout(timer);
  }, [
    animatedPrompt,
    isDeleting,
    pauseUntil,
    promptIndex,
    shouldShowAnimatedPrompt,
  ]);

  const onInvalid = () => {
    const firstError =
      errors.username?.message ||
      errors.fantasy?.message ||
      "Please check the form and try again.";

    showToast({
      title: "Unable to begin matching",
      description: firstError,
      variant: "error",
    });
  };

  const onSubmit = async (values: RegisterInput) => {
    const result = registerSchema.safeParse(values);

    if (!result.success) {
      showToast({
        title: "Unable to begin matching",
        description:
          result.error.issues[0]?.message ??
          "Please check the form and try again.",
        variant: "error",
      });
      return;
    }

    try {
      const response = await fetch("/api/v1/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          payload?.message ||
          payload?.error ||
          "Something went wrong while creating your session.";

        showToast({
          title: "Unable to begin matching",
          description: message,
          variant: "error",
        });
        return;
      }

      reset();
      setAnimatedPrompt("");
      setIsDeleting(false);
      setPauseUntil(null);
      setPromptIndex(getRandomPromptIndex(promptIndex));
      onOpen("matchModel", {
        username: result.data.username,
        fantasy: result.data.fantasy,
      });
      showToast({
        title: "Your fantasy has been sent",
        description:
          "We opened your anonymous session and saved your story spark.",
        variant: "success",
      });
    } catch {
      showToast({
        title: "Connection lost",
        description: "Please try again in a moment.",
        variant: "error",
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,196,0,0.12),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(246,196,0,0.07),transparent_18%),linear-gradient(180deg,#121212_0%,#090909_30%,#090909_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-20 h-96 bg-[radial-gradient(circle,rgba(246,196,0,0.14),transparent_45%)] blur-3xl" />

      <SiteHeader />

      <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-16 px-5 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="order-2 max-w-2xl lg:order-1"
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.45em] text-gold">
            Anonymous fantasy matching
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Match Your
            <span className="block text-[#f2eee7]">Fantasy.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            Describe your dream world and get matched anonymously with people
            who crave the same story, mood, and mystery.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="mt-10 rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-5"
          >
            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="grid gap-4"
            >
              <label className="block">
                <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.34em] text-gold">
                  Your pseudonym
                </span>
                <input
                  className={fieldClassName}
                  placeholder="The Lone Wanderer"
                  aria-label="Your pseudonym"
                  {...usernameField}
                />
              </label>

              <label className="relative block">
                <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.34em] text-gold">
                  Describe your fantasy
                </span>
                <textarea
                  className={`${fieldClassName} min-h-36 resize-none`}
                  placeholder=""
                  aria-label="Describe your fantasy"
                  {...fantasyField}
                  onFocus={() => {
                    setIsFantasyFocused(true);
                    setAnimatedPrompt("");
                    setIsDeleting(false);
                    setPauseUntil(null);
                  }}
                  onBlur={(event) => {
                    fantasyField.onBlur(event);
                    setIsFantasyFocused(false);
                  }}
                />
                <motion.div
                  initial={false}
                  animate={{
                    opacity: shouldShowAnimatedPrompt ? 1 : 0,
                    y: shouldShowAnimatedPrompt ? 0 : 10,
                  }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-x-5 top-[2.7rem]"
                >
                  <div className="relative min-h-24 overflow-hidden rounded-[1.1rem] border border-white/6 bg-[linear-gradient(180deg,rgba(246,196,0,0.04),rgba(255,255,255,0.01))] px-4 py-3">
                    {shouldShowAnimatedPrompt
                      ? sparkleOffsets.map((sparkle, index) => (
                          <motion.span
                            key={index}
                            className="absolute h-1.5 w-1.5 rounded-full bg-gold/75 shadow-[0_0_14px_rgba(246,196,0,0.65)]"
                            style={{ left: sparkle.left, top: sparkle.top }}
                            animate={{
                              opacity: [0.25, 1, 0.2],
                              scale: [0.8, 1.5, 0.9],
                              y: [0, -6, 0],
                            }}
                            transition={{
                              duration: sparkle.duration,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: sparkle.delay,
                              ease: "easeInOut",
                            }}
                          />
                        ))
                      : null}
                    <p className="pr-3 text-[0.96rem] leading-7 text-white/42">
                      {animatedPrompt}
                      <motion.span
                        className="ml-0.5 inline-block h-5 w-px bg-gold align-middle"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </p>
                  </div>
                </motion.div>
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isSubmitting}
                  className="inline-flex min-h-16 items-center justify-center rounded-full bg-[linear-gradient(90deg,#f6c400_0%,#ff9f0a_100%)] px-8 text-lg font-semibold text-[#17120a] shadow-[0_18px_60px_rgba(246,196,0,0.35)] transition hover:shadow-[0_24px_80px_rgba(246,196,0,0.42)]"
                >
                  {isSubmitting ? "Summoning..." : "Find My Match"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <HeroOrb />
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-gold">
              Signature experiences
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              Designed like a cinematic invitation.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-white/60">
            The page stays faithful to your black-and-gold reference while
            scaling into a richer desktop layout with modular sections and
            motion.
          </p>
        </motion.div>

        <div
          id="experiences"
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {featureCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <footer
        id="footer"
        className="relative mx-auto mt-20 flex max-w-7xl flex-col gap-6 border-t border-white/6 px-5 py-10 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-3xl font-semibold tracking-[0.2em] text-gold">
              Fantasy Chat
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.35em] text-white/42">
              2026 mysterious fantasy. Bound by the ethereal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {["Twitter", "GitHub"].map((label) => (
              <button
                key={label}
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm text-white/70 transition hover:border-gold/40 hover:text-gold"
                aria-label={label}
              >
                {label === "Twitter" ? "X" : "GH"}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
