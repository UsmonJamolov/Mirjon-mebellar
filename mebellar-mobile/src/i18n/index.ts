import uz from "./uz.json";
import ru from "./ru.json";

export type Locale = "uz" | "ru";

const dict: Record<Locale, typeof uz> = { uz, ru };

let locale: Locale = "uz";

export function setLocale(l: Locale) {
  locale = l;
}

export function getLocale() {
  return locale;
}

function get(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p];
    } else return path;
  }
  return typeof cur === "string" ? cur : path;
}

export function t(key: string, vars?: Record<string, string | number>) {
  let s = get(dict[locale] as unknown as Record<string, unknown>, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}
