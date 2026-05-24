"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User, Mail, Lock, KeyRound, UserPlus, ArrowRight } from "lucide-react";
import { AdminAuthShell } from "@/components/auth/AdminAuthShell";
import { AdminAuthField } from "@/components/auth/AdminAuthField";
import { parseAuthResponse, redirectAfterAuth } from "@/lib/auth-client";

export default function AdminRegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
          adminSecret,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Xato yuz berdi");
        setLoading(false);
        return;
      }

      const login = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      setLoading(false);

      if (login?.error) {
        router.push("/kirish");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
      setLoading(false);
    }
  };

  return (
    <AdminAuthShell
      badge="Yangi admin"
      title="Admin hisob yarating"
      subtitle="Admin kaliti (.env ADMIN_SECRET) talab qilinadi"
      footer={
        <>
          Hisobingiz bormi?{" "}
          <Link
            href="/kirish"
            className="inline-flex items-center gap-1 font-semibold text-[#3b82f6] hover:underline"
          >
            Kirish
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
        {success && (
          <p className="rounded-[12px] bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
            {success}
          </p>
        )}

        <AdminAuthField
          id="reg-name"
          label="Ism familiya"
          icon={User}
          value={name}
          onChange={setName}
          placeholder="Abdullah Saidov"
          required
          autoComplete="name"
        />

        <AdminAuthField
          id="reg-email"
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
          id="reg-password"
          label="Parol"
          type="password"
          icon={Lock}
          value={password}
          onChange={setPassword}
          placeholder="Kamida 6 belgi"
          required
          minLength={6}
          autoComplete="new-password"
        />

        <AdminAuthField
          id="reg-secret"
          label="Admin kaliti"
          type="password"
          icon={KeyRound}
          value={adminSecret}
          onChange={setAdminSecret}
          placeholder="ADMIN_SECRET"
          required
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60"
        >
          <UserPlus size={18} />
          {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
        </button>
      </form>
    </AdminAuthShell>
  );
}
