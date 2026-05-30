import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../src/components/ui/Screen";
import { Button } from "../../src/components/ui/Button";
import { useAuth } from "../../src/context/AuthContext";
import { useThemeColors } from "../../src/context/ThemeContext";
import { api } from "../../src/api/client";
import { colors } from "../../src/theme/colors";
import { t } from "../../src/i18n";

interface ChatMessage {
  id: string;
  text: string;
  sender: "customer" | "admin";
  createdAt: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useThemeColors();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  const load = async () => {
    try {
      const data = (await api.getChat()) as {
        messages?: ChatMessage[];
      };
      setMessages(data.messages ?? []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) void load();
    else setLoading(false);
  }, [user]);

  const send = async () => {
    const msg = text.trim();
    if (!msg || !user) return;
    setText("");
    try {
      await api.chat({
        action: "message",
        text: msg,
        customerName: user.name,
        customerPhone: user.phone,
      });
      await load();
      listRef.current?.scrollToEnd({ animated: true });
    } catch {
      /* ignore */
    }
  };

  if (!user) {
    return (
      <Screen title={t("nav.chat")}>
        <View style={styles.center}>
          <Text style={{ color: theme.muted, marginBottom: 16 }}>
            Chat uchun kirish kerak
          </Text>
          <Button title={t("profile.login")} onPress={() => router.push("/auth")} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title={t("nav.chat")} noPad>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            !loading ? (
              <Text style={[styles.empty, { color: theme.muted }]}>
                Xabar yozing — sotuvchi javob beradi
              </Text>
            ) : null
          }
          renderItem={({ item }) => {
            const mine = item.sender === "customer";
            return (
              <View
                style={[
                  styles.bubble,
                  mine ? styles.mine : styles.theirs,
                  { backgroundColor: mine ? colors.accent : theme.card },
                ]}
              >
                <Text style={{ color: mine ? "#fff" : theme.text }}>{item.text}</Text>
              </View>
            );
          }}
        />
        <View
          style={[
            styles.inputRow,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Xabar..."
            placeholderTextColor={theme.muted}
            style={[styles.input, { color: theme.text }]}
          />
          <Pressable onPress={send} style={styles.sendBtn}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>→</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  empty: { textAlign: "center", marginTop: 40 },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  mine: { alignSelf: "flex-end", borderBottomRightRadius: 4 },
  theirs: { alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, paddingHorizontal: 12 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
