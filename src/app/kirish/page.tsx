"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { AdminAuthShell } from "@/components/auth/AdminAuthShell";
import { AdminAuthField } from "@/components/auth/AdminAuthField";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlError === "Configuration") {
      setError("Auth sozlamasi yangilandi. Qayta urinib ko'ring.");
      router.replace("/kirish");
    }
  }, [urlError, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email yoki parol noto'g'ri (yoki admin emas)");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <AdminAuthShell
      badge="Admin kirish"
      title="Xush kelibsiz"
      subtitle="Boshqaruv paneliga kiring"
      footer={
        <>
          Hisobingiz yo&apos;qmi?{" "}
          <Link
            href="/royxatdan-otish"
            className="inline-flex items-center gap-1 font-semibold text-[#3b82f6] hover:underline"
          >
            Ro&apos;yxatdan o&apos;tish
            <ArrowRight size={12} />
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-[12px] bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <AdminAuthField
          id="login-email"
          label="Email"
          type="email"
          icon={Mail}
          value={email}
          onChange={setEmail}
          placeholder="admin@mebellar.uz"
          required
          autoComplete="email"
        />

        <AdminAuthField
          id="login-password"
          label="Parol"
          type="password"
          icon={Lock}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60"
        >
          <LogIn size={18} />
          {loading ? "Kirish..." : "Kirish"}
        </button>
      </form>
    </AdminAuthShell>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a2744] to-[#1e1e2f] text-white">
        Yuklanmoqda...
      </main>
    );
  }

  return <LoginForm />;
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a2744] to-[#1e1e2f] text-white">
          Yuklanmoqda...
        </main>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
