import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../src/context/AuthContext";
import { api, BOT_USERNAME } from "../src/api/client";
import { colors } from "../src/theme/colors";

const OTP_LEN = 6;
const TOKEN_KEY = "mebellar_otp_token";

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const [token, setToken] = useState("");
  const [botUrl, setBotUrl] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [tgLinked, setTgLinked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (user) router.replace("/(tabs)/profil");
  }, [user, router]);

  const start = useCallback(async (resume?: string) => {
    setLoading(true);
    setError("");
    try {
      const data = resume
        ? await api.otpResume(resume)
        : await api.otpStart();
      setToken(data.token);
      setBotUrl(data.botUrl);
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      if (data.state === "delivered" || data.hasTelegram) {
        setTgLinked(data.state === "delivered");
      }
    } catch {
      setError("Sessiya ochib bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((t) => start(t ?? undefined));
  }, [start]);

  useEffect(() => {
    if (!token || tgLinked) return;
    const id = setInterval(async () => {
      try {
        const st = await api.otpStatus(token);
        if (st.state === "delivered") setTgLinked(true);
      } catch {
        /* ignore */
      }
    }, 2500);
    return () => clearInterval(id);
  }, [token, tgLinked]);

  const openBot = () => {
    if (botUrl) void WebBrowser.openBrowserAsync(botUrl);
    else void WebBrowser.openBrowserAsync(`https://t.me/${BOT_USERNAME}`);
  };

  const submit = async (code: string) => {
    if (!token || code.length !== OTP_LEN) return;
    setSubmitting(true);
    setError("");
    try {
      await signIn(token, code);
      await AsyncStorage.removeItem(TOKEN_KEY);
      router.replace("/(tabs)/profil");
    } catch {
      setError(
        tgLinked
          ? "Kod noto'g'ri yoki muddati o'tgan"
          : "Avval Telegram botga o'tib kontaktingizni ulashing"
      );
      setDigits(Array(OTP_LEN).fill(""));
    } finally {
      setSubmitting(false);
    }
  };

  const onDigit = (idx: number, val: string) => {
    const n = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = n;
    setDigits(next);
    if (n && idx < OTP_LEN - 1) inputs.current[idx + 1]?.focus();
    const joined = next.join("");
    if (joined.length === OTP_LEN) void submit(joined);
  };

  return (
    <ImageBackground
      source={require("../assets/splash-icon.png")}
      style={styles.bg}
      blurRadius={8}
    >
      <LinearGradient colors={["rgba(12,8,5,0.85)", "rgba(12,8,5,0.95)"]} style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.brand}>MMEBEL</Text>
          <Text style={styles.title}>Telegram orqali kirish</Text>
          <Text style={styles.sub}>
            Botga o'ting, kontakt ulashing, kodni kiriting
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.accent} size="large" />
          ) : (
            <>
              <Pressable style={styles.botBtn} onPress={openBot}>
                <Text style={styles.botBtnText}>Telegram botga o'tish</Text>
              </Pressable>

              {tgLinked && (
                <Text style={styles.ok}>✓ Kod Telegramga yuborildi</Text>
              )}

              <View style={styles.otpRow}>
                {digits.map((d, i) => (
                  <TextInput
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={d}
                    onChangeText={(v) => onDigit(i, v)}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={styles.otpBox}
                  />
                ))}
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
              {submitting && <ActivityIndicator color={colors.accent} />}

              <Pressable onPress={() => router.back()} style={styles.back}>
                <Text style={styles.backText}>Orqaga</Text>
              </Pressable>
            </>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: "rgba(42,34,28,0.92)",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  brand: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 8 },
  sub: {
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  botBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  botBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  ok: { color: "#6ee7a0", marginBottom: 16, fontSize: 13 },
  otpRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(244,162,97,0.5)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  error: { color: "#ff8a80", textAlign: "center", marginBottom: 8 },
  back: { marginTop: 16 },
  backText: { color: "rgba(255,255,255,0.5)", fontSize: 14 },
});
