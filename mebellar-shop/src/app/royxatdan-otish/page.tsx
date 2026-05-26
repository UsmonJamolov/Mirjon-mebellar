"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Phone, Lock, UserPlus, ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { loginIdentifierFromPhone, normalizePhone } from "@/lib/phone-auth";
import { parseAuthResponse, signInWithSession } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const normalizedPhone = normalizePhone(phone);
    const loginId = loginIdentifierFromPhone(phone);

    if (!normalizedPhone || !loginId) {
      setError("Telefon raqam noto'g'ri");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: normalizedPhone, password }),
      });
      const { ok, data } = await parseAuthResponse(res);

      if (!ok) {
        setError(data.error ?? "Xato yuz berdi");
        setLoading(false);
        return;
      }

      const login = await signInWithSession(loginId, password, "/profil");

      if (!login.ok) {
        setSuccess("Hisob yaratildi. Telefon va parolingiz bilan kiring.");
        setLoading(false);
        router.push("/kirish?registered=1");
        return;
      }
    } catch {
      setError("Server bilan bog'lanib bo'lmadi. MongoDB ishlayotganini tekshiring.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Yangi a'zo"
      title="Hisob yarating"
      footer={
        <>
          Hisobingiz bormi?{" "}
          <Link
            href="/kirish"
            className="inline-flex items-center gap-1 font-semibold text-[#c97b3f] hover:text-[#e88b4a]"
          >
            Kirish
            <ArrowRight size={12} />
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-2.5 lg:space-y-4">
        {error && <AuthAlert message={error} variant="error" />}
        {success && <AuthAlert message={success} variant="success" />}

        <AuthField
          id="reg-name"
          label="Ism familiya"
          icon={User}
          value={name}
          onChange={setName}
          placeholder="Dilshod Akbarov"
          required
          delay={40}
        />

        <AuthField
          id="reg-phone"
          label="Telefon"
          type="tel"
          icon={Phone}
          value={phone}
          onChange={setPhone}
          placeholder="+998 90 123 45 67"
          required
          autoComplete="tel"
          delay={80}
        />

        <AuthField
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
          delay={120}
        />

        <AuthSubmitButton
          loading={loading}
          label="Ro'yxatdan o'tish"
          loadingLabel="Yaratilmoqda..."
          icon={UserPlus}
        />
      </form>
    </AuthShell>
  );
}
