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
  window.location.assign(path);
}
