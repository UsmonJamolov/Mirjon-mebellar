import { View, Text, Pressable, StyleSheet, Switch, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../src/components/ui/Screen";
import { Button } from "../../src/components/ui/Button";
import { useAuth } from "../../src/context/AuthContext";
import { useThemeMode, useThemeColors } from "../../src/context/ThemeContext";
import { setLocale, t } from "../../src/i18n";
import { colors } from "../../src/theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isDark, toggle } = useThemeMode();
  const theme = useThemeColors();

  if (!user) {
    return (
      <Screen title={t("nav.profile")}>
        <View style={styles.center}>
          <Ionicons name="person-circle-outline" size={80} color={theme.muted} />
          <Text style={[styles.guest, { color: theme.text }]}>
            {t("profile.login")}
          </Text>
          <Button title={t("profile.login")} onPress={() => router.push("/auth")} />
        </View>
      </Screen>
    );
  }

  const menu = [
    { icon: "receipt-outline" as const, label: t("profile.orders"), href: "/buyurtmalar" },
    { icon: "heart-outline" as const, label: t("profile.favorites"), href: "/sevimlilar" },
    { icon: "brush-outline" as const, label: t("profile.createSketch"), href: "/eskiz" },
    { icon: "chatbubble-outline" as const, label: t("profile.chat"), href: "/chat" },
  ];

  return (
    <Screen title={t("nav.profile")}>
      <ScrollView>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0)?.toUpperCase() ?? "M"}
            </Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
          <Text style={{ color: theme.muted }}>{user.phone || user.email}</Text>
          <Text style={styles.premium}>{t("profile.premiumMember")}</Text>
        </View>

        {menu.map((item) => (
          <Pressable
            key={item.href}
            style={[styles.menuItem, { borderColor: theme.border }]}
            onPress={() => router.push(item.href as never)}
          >
            <Ionicons name={item.icon} size={22} color={colors.accent} />
            <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </Pressable>
        ))}

        <View style={[styles.menuItem, { borderColor: theme.border }]}>
          <Ionicons name="moon-outline" size={22} color={colors.accent} />
          <Text style={[styles.menuLabel, { color: theme.text, flex: 1 }]}>
            {t("profile.darkMode")}
          </Text>
          <Switch value={isDark} onValueChange={toggle} trackColor={{ true: colors.accent }} />
        </View>

        <View style={[styles.menuItem, { borderColor: theme.border }]}>
          <Ionicons name="language-outline" size={22} color={colors.accent} />
          <Text style={[styles.menuLabel, { color: theme.text, flex: 1 }]}>
            {t("profile.language")}
          </Text>
          <Pressable onPress={() => setLocale("uz")}>
            <Text style={styles.lang}>UZ</Text>
          </Pressable>
          <Pressable onPress={() => setLocale("ru")} style={{ marginLeft: 8 }}>
            <Text style={styles.lang}>RU</Text>
          </Pressable>
        </View>

        <Button title={t("profile.signOut")} variant="outline" onPress={() => signOut()} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  guest: { fontSize: 18, fontWeight: "600" },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "800" },
  name: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  premium: {
    marginTop: 8,
    fontSize: 11,
    color: colors.accent,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
  lang: { color: colors.accent, fontWeight: "700" },
});
