export const locales = ["uz", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

export const localeNames: Record<Locale, string> = {
  uz: "O'zbek",
  ru: "Русский",
};

export const LOCALE_STORAGE_KEY = "mmebel-locale";
export const LOCALE_COOKIE = "mmebel-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
