const DEEPL_FREE_URL = "https://api-free.deepl.com/v2/translate";
const DEEPL_PRO_URL = "https://api.deepl.com/v2/translate";

export async function translateWithDeepL(
  texts: string[],
  targetLang: "RU" | "UZ" = "RU"
): Promise<string[]> {
  const apiKey = process.env.DEEPL_API_KEY?.trim();
  if (!apiKey || texts.length === 0) return texts;

  const baseUrl = apiKey.endsWith(":fx") ? DEEPL_FREE_URL : DEEPL_PRO_URL;

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      target_lang: targetLang,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(err || "DeepL translate failed");
  }

  const data = (await res.json()) as {
    translations: { text: string }[];
  };

  return data.translations.map((t) => t.text);
}
