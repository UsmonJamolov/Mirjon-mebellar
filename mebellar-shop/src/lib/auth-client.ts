import { getSession, signIn } from "next-auth/react";

/** Ro'yxatdan o'tish / kirish — API javobini xavfsiz o'qish */
export async function parseAuthResponse(res: Response): Promise<{
  ok: boolean;
  data: { error?: string; ok?: boolean };
}> {
  const text = await res.text();
  if (!text) {
    return { ok: res.ok, data: {} };
  }
  try {
    return { ok: res.ok, data: JSON.parse(text) as { error?: string; ok?: boolean } };
  } catch {
    return {
      ok: false,
      data: { error: res.ok ? undefined : "Server javobi noto'g'ri" },
    };
  }
}

/** Sessiya cookie qo'llanishi uchun to'liq sahifa yo'naltirish */
export function redirectAfterAuth(path: string): void {
  window.location.href = path;
}

async function fetchSessionUser() {
  try {
    const res = await fetch("/api/auth/session", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: { id?: string } };
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** signIn dan keyin JWT cookie tayyor bo'lguncha kutadi */
export async function signInWithSession(
  email: string,
  password: string,
  callbackUrl: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (res?.error) {
    return { ok: false, error: res.error };
  }

  for (let i = 0; i < 25; i++) {
    const user = (await fetchSessionUser()) ?? (await getSession())?.user;
    if (user) {
      redirectAfterAuth(callbackUrl);
      return { ok: true };
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  return { ok: false, error: "Sessiya o'rnatilmadi. Qayta kiring." };
}
