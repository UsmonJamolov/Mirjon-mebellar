"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Lock, Send, MessageCircle, Check } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { motion, type Variants } from "framer-motion";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const POLL_INTERVAL_MS = 2500;

interface OtpStartResponse {
  ok: boolean;
  token: string;
  botUsername: string;
  botUrl: string;
  expiresAt: number;
  lastSentAt: number;
  ttlMs: number;
  telegramConfigured: boolean;
}

interface OtpStatusResponse {
  ok: boolean;
  state?: "pending" | "delivered" | "verified" | "expired";
  hasTelegram?: boolean;
  telegramName?: string;
  phone?: string;
  expiresAt?: number;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function formatMmSs(totalSeconds: number): string {
  const s = clamp(Math.floor(totalSeconds), 0, 9999);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

const slotVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.92 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.18 + i * 0.05,
      type: "spring",
      stiffness: 220,
      damping: 18,
    },
  }),
};

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const callbackUrl = useMemo(() => {
    const cb = searchParams.get("callbackUrl");
    return cb && cb.startsWith("/") ? cb : "/profil";
  }, [searchParams]);

  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => "")
  );
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [session, setSession] = useState<OtpStartResponse | null>(null);
  const [starting, setStarting] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [tgLinked, setTgLinked] = useState(false);
  const [tgName, setTgName] = useState("");
  const [tgPhone, setTgPhone] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, callbackUrl, router]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const ph = html.style.overflow;
    const pb = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = ph;
      body.style.overflow = pb;
    };
  }, []);

  const startSession = useCallback(async () => {
    setStarting(true);
    setError("");
    setInfo("");
    setTgLinked(false);
    setTgName("");
    setTgPhone("");
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    try {
      const res = await fetch("/api/auth/otp/start", { method: "POST" });
      const data = (await res.json()) as OtpStartResponse;
      if (!res.ok || !data.ok) throw new Error("start failed");
      setSession(data);
      setResendIn(RESEND_SECONDS);
      window.requestAnimationFrame(() => inputsRef.current[0]?.focus());
    } catch {
      setError("Sessiya ochib bo'lmadi. Internet aloqasini tekshiring.");
    } finally {
      setStarting(false);
    }
  }, []);

  useEffect(() => {
    void startSession();
  }, [startSession]);

  useEffect(() => {
    if (!session) return;
    const id = window.setInterval(() => {
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [session]);

  // Polling: Telegram'dan kontakt kelishini kutadi
  useEffect(() => {
    if (!session) return;
    if (tgLinked) return;
    if (!session.telegramConfigured) return;

    let stopped = false;
    let timeout: number | undefined;

    const tick = async () => {
      if (stopped) return;
      try {
        await fetch("/api/telegram/poll", { method: "POST" });
        const res = await fetch(
          `/api/auth/otp/status?token=${encodeURIComponent(session.token)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = (await res.json()) as OtpStatusResponse;
          if (data.state === "delivered") {
            setTgLinked(true);
            setTgName(data.telegramName ?? "");
            setTgPhone(data.phone ?? "");
            setInfo("Kod Telegram orqali yuborildi.");
            return;
          }
        }
      } catch {
        // ignore
      }
      timeout = window.setTimeout(tick, POLL_INTERVAL_MS);
    };

    timeout = window.setTimeout(tick, 800);
    return () => {
      stopped = true;
      if (timeout) window.clearTimeout(timeout);
    };
  }, [session, tgLinked]);

  const submitOtp = useCallback(
    async (code: string) => {
      if (!session || code.length !== OTP_LENGTH) return;
      setSubmitting(true);
      setError("");
      const res = await signIn("telegram-otp", {
        token: session.token,
        code,
        redirect: false,
      });
      if (!res || res.error) {
        setSubmitting(false);
        setError(
          tgLinked
            ? "Kod noto'g'ri yoki muddati o'tib ketgan. Qayta urinib ko'ring."
            : "Avval Telegram botga o'tib kontaktingizni ulashing."
        );
        setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
        window.requestAnimationFrame(() => inputsRef.current[0]?.focus());
        return;
      }
      setInfo("Kirish muvaffaqiyatli. Yo'naltirilmoqda...");
      window.location.href = callbackUrl;
    },
    [session, callbackUrl, tgLinked]
  );

  const handleDigitChange = (index: number, raw: string) => {
    const onlyNum = raw.replace(/\D/g, "");
    if (!onlyNum) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    if (onlyNum.length > 1) {
      const next = [...digits];
      for (let i = 0; i < onlyNum.length && index + i < OTP_LENGTH; i++) {
        next[index + i] = onlyNum[i];
      }
      setDigits(next);
      const newIndex = clamp(index + onlyNum.length, 0, OTP_LENGTH - 1);
      inputsRef.current[newIndex]?.focus();
      const joined = next.join("");
      if (joined.length === OTP_LENGTH) void submitOtp(joined);
      return;
    }
    const next = [...digits];
    next[index] = onlyNum;
    setDigits(next);
    if (index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
    const joined = next.join("");
    if (joined.length === OTP_LENGTH && joined.replace(/\d/g, "").length === 0) {
      void submitOtp(joined);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        e.preventDefault();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => text[i] ?? "");
    setDigits(next);
    const lastIdx = clamp(text.length, 0, OTP_LENGTH - 1);
    inputsRef.current[lastIdx]?.focus();
    if (text.length === OTP_LENGTH) void submitOtp(text);
  };

  const handleResend = async () => {
    if (!session || resendIn > 0) return;
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.token }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        sentToTelegram?: boolean;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Qayta yuborib bo'lmadi");
        return;
      }
      setResendIn(RESEND_SECONDS);
      setInfo("Yangi kod Telegram orqali yuborildi.");
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    }
  };

  const botHref = session?.botUrl ?? "#";
  const botUsername = session?.botUsername ?? "mmebeluz_bot";

  return (
    <main className="auth-fullscreen fixed inset-0 h-[100dvh] w-screen overflow-hidden text-white">
      <Image
        src="/images/AUBG.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0805]/55 via-[#0c0805]/35 to-[#0c0805]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_80%)]" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#f4a261]/15 blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -25, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#d97a38]/12 blur-3xl"
        animate={{ x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6"
      >
        <Link
          href="/"
          aria-label="Bosh sahifaga o'tish"
          className="group flex items-center gap-2 rounded-[12px] px-1 py-1 transition hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#f4a261] to-[#d97a38] text-base font-extrabold text-white shadow-[0_8px_24px_rgba(244,162,97,0.4)] transition group-hover:shadow-[0_10px_30px_rgba(244,162,97,0.55)]">
            M
          </span>
          <span className="text-sm font-semibold tracking-[0.18em] text-white/90 transition group-hover:text-white">
            MEBEL
          </span>
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-5"
      >
        <div className="flex w-full max-w-lg flex-col items-center text-center">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.06, rotate: -2 }}
            animate={{ y: [0, -4, 0] }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="mb-4"
          >
            <Link
              href="/"
              aria-label="Bosh sahifaga o'tish"
              className="inline-flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#f4a261] via-[#e88b4a] to-[#d97a38] text-2xl font-extrabold shadow-[0_18px_42px_rgba(244,162,97,0.45)] transition hover:shadow-[0_22px_55px_rgba(244,162,97,0.6)]"
            >
              <span className="flex flex-col items-center leading-none">
                <span>M</span>
                <span className="mt-0.5 text-[0.42rem] font-bold tracking-[0.2em]">
                  MEBEL
                </span>
              </span>
            </Link>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Kirish
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-2 max-w-md text-sm text-white/75 sm:text-base"
          >
            <span className="text-[#f4a261]">@{botUsername}</span> botiga o&apos;tib
            telefoningizni <span className="text-white">kontakt</span> sifatida
            ulashing — kod shu yerga keladi.
          </motion.p>

          {/* OTP inputs */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex w-full justify-center gap-2 sm:gap-3"
          >
            {Array.from({ length: OTP_LENGTH }).map((_, idx) => {
              const value = digits[idx] ?? "";
              const isFocusTarget =
                !value && digits.findIndex((d) => !d) === idx;
              return (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={slotVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <input
                    ref={(el) => {
                      inputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={idx === 0 ? "one-time-code" : "off"}
                    maxLength={OTP_LENGTH}
                    value={value}
                    disabled={submitting || !session}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className={[
                      "h-12 w-10 rounded-[14px] border bg-white/[0.06] text-center text-xl font-semibold text-white outline-none backdrop-blur-md transition sm:h-13 sm:w-12 sm:text-2xl",
                      isFocusTarget
                        ? "border-[#f4a261] ring-2 ring-[#f4a261]/40 shadow-[0_8px_28px_rgba(244,162,97,0.25)]"
                        : value
                          ? "border-white/30"
                          : "border-white/15 hover:border-white/30",
                      submitting && "opacity-60",
                    ].join(" ")}
                    aria-label={`Raqam ${idx + 1}`}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Status badges */}
          <div className="mt-3 flex min-h-[28px] flex-col items-center gap-1">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-1.5 text-xs font-medium text-red-200"
              >
                {error}
              </motion.p>
            )}
            {info && !error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1.5 text-xs font-medium text-emerald-200"
              >
                <Check size={12} />
                {info}
              </motion.p>
            )}
            {tgLinked && !error && !info && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1.5 text-xs font-medium text-emerald-200"
              >
                <Check size={12} />
                {tgName ? `${tgName} ulandi` : "Telegram ulandi"}
                {tgPhone ? ` — ${tgPhone}` : ""}
              </motion.p>
            )}
          </div>

          {/* Telegram bot button */}
          <motion.div variants={itemVariants} className="mt-5 w-full max-w-sm">
            <motion.div
              whileHover={{ y: -3, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              animate={
                tgLinked
                  ? {}
                  : {
                      boxShadow: [
                        "0 14px 36px rgba(244,162,97,0.18)",
                        "0 22px 60px rgba(244,162,97,0.36)",
                        "0 14px 36px rgba(244,162,97,0.18)",
                      ],
                    }
              }
              transition={{
                boxShadow: {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="rounded-[18px]"
            >
              <Link
                href={botHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!session}
                className={[
                  "flex w-full items-center gap-3 rounded-[18px] border px-4 py-3 text-left backdrop-blur-xl transition",
                  tgLinked
                    ? "border-emerald-400/40 bg-emerald-500/10 hover:border-emerald-300/60"
                    : "border-white/15 bg-white/[0.08] hover:border-[#f4a261]/60 hover:bg-white/[0.12]",
                ].join(" ")}
              >
                <motion.span
                  animate={{ rotate: [0, -6, 6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-[14px] text-white shadow-[0_8px_22px_rgba(244,162,97,0.45)]",
                    tgLinked
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_8px_22px_rgba(16,185,129,0.45)]"
                      : "bg-gradient-to-br from-[#f4a261] to-[#d97a38]",
                  ].join(" ")}
                >
                  {tgLinked ? <Check size={18} /> : <Send size={18} />}
                </motion.span>
                <span className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-white">
                    {tgLinked
                      ? "Kod yuborildi"
                      : "Telegram botga o'tish"}
                  </span>
                  <span
                    className={[
                      "text-xs",
                      tgLinked ? "text-emerald-300" : "text-[#f4a261]",
                    ].join(" ")}
                  >
                    @{botUsername}
                    {!tgLinked ? " — kontaktni ulashing" : ""}
                  </span>
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-4 text-xs text-white/55 sm:text-sm"
          >
            {tgLinked ? "Kodni olmadingizmi? " : "Botda kontaktni ulashganingizdan keyin "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0 || !session || starting || !tgLinked}
              className="font-semibold text-[#f4a261] transition hover:text-[#ffb274] disabled:cursor-not-allowed disabled:text-white/40"
            >
              {resendIn > 0
                ? `Qayta yuborish (${formatMmSs(resendIn)})`
                : starting
                  ? "Yuborilmoqda..."
                  : "Qayta yuborish"}
            </button>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-8 grid w-full max-w-3xl gap-2.5 sm:grid-cols-3"
        >
          {[
            {
              n: 1,
              icon: <Send size={14} />,
              title: "Telegram botga kiring",
              sub: `@${botUsername}`,
              active: !tgLinked,
            },
            {
              n: 2,
              icon: <MessageCircle size={14} />,
              title: "Kontaktni ulashing",
              sub: "Bot OTP kodni yuboradi",
              active: !tgLinked,
            },
            {
              n: 3,
              icon: <Check size={14} />,
              title: "Kod kiriting",
              sub: "6 xonali kodni kiriting",
              active: tgLinked,
            },
          ].map((step, idx) => (
            <StepCard key={step.n} index={idx} {...step} />
          ))}
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/40"
        >
          <Lock size={12} />
          Xavfsiz ulanish
        </motion.p>
      </motion.div>
    </main>
  );
}

function StepCard({
  n,
  icon,
  title,
  sub,
  active,
  index,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  sub: string;
  active: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={[
        "flex items-center gap-3 rounded-[16px] border px-3.5 py-2.5 backdrop-blur-md transition",
        active
          ? "border-[#f4a261]/55 bg-[#f4a261]/15 shadow-[0_10px_30px_rgba(244,162,97,0.25)]"
          : "border-white/10 bg-white/[0.05]",
      ].join(" ")}
    >
      <motion.span
        animate={{ y: [0, -2, 0] }}
        transition={{
          duration: 2.6 + index * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3,
        }}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4a261] to-[#d97a38] text-sm font-bold text-white shadow-[0_8px_22px_rgba(244,162,97,0.4)]"
      >
        {n}
        <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-[#1a1612] text-[#f4a261]">
          {icon}
        </span>
      </motion.span>
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-xs text-white/55">{sub}</span>
      </div>
    </motion.div>
  );
}
