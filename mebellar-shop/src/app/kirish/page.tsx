"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Phone, Lock, LogIn, ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { loginIdentifierFromPhone } from "@/lib/phone-auth";
import { signInWithSession } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/profil";
  const urlError = searchParams.get("error");
  const registered = searchParams.get("registered");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlError === "Configuration") {
      setError("Auth sozlamasi yangilandi. Qayta urinib ko'ring.");
      router.replace("/kirish");
      return;
    }
    if (registered === "1") {
      setInfo("Hisob yaratildi. Telefon va parolingiz bilan kiring.");
      router.replace("/kirish");
    }
  }, [urlError, registered, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const loginId = loginIdentifierFromPhone(phone);
    if (!loginId) {
      setError("Telefon raqam noto'g'ri");
      setLoading(false);
      return;
    }

    const res = await signInWithSession(loginId, password, callbackUrl);

    setLoading(false);

    if (!res.ok) {
      setError(res.error === "CredentialsSignin" ? "Telefon yoki parol noto'g'ri" : "Kirish amalga oshmadi");
      return;
    }
  };

  return (
    <AuthShell
      badge="Kirish"
      title="Xush kelibsiz"
      footer={
        <>
          Hisobingiz yo&apos;qmi?{" "}
          <Link
            href="/royxatdan-otish"
            className="inline-flex items-center gap-1 font-semibold text-[#c97b3f] hover:text-[#e88b4a]"
          >
            Ro&apos;yxatdan o&apos;tish
            <ArrowRight size={12} />
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-2.5 lg:space-y-4">
        {info && <AuthAlert message={info} variant="success" />}
        {error && <AuthAlert message={error} variant="error" />}

        <AuthField
          id="login-phone"
          label="Telefon"
          type="tel"
          icon={Phone}
          value={phone}
          onChange={setPhone}
          placeholder="+998 90 123 45 67"
          required
          autoComplete="tel"
          delay={40}
        />

        <AuthField
          id="login-password"
          label="Parol"
          type="password"
          icon={Lock}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          delay={80}
        />

        <AuthSubmitButton
          loading={loading}
          label="Kirish"
          loadingLabel="Kirish..."
          icon={LogIn}
        />
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page flex h-[calc(100dvh-3.5rem)] items-center justify-center text-[#6b5f52]">
          Yuklanmoqda...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
