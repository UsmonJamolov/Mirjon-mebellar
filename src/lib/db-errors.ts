/** MongoDB ulanish xatolarini foydalanuvchiga tushunarli qilish */
export function dbConnectionMessage(err: unknown): string | null {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "object" && err && "message" in err
        ? String((err as { message: unknown }).message)
        : "";

  if (
    msg.includes("ECONNREFUSED") ||
    msg.includes("MongooseServerSelectionError") ||
    msg.includes("connect ETIMEDOUT")
  ) {
    return "MongoDB ishlamayapti. start-mongodb.bat ni ishga tushiring (port 27017).";
  }

  return null;
}
