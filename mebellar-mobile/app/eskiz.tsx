import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../src/components/ui/Screen";
import { Button } from "../src/components/ui/Button";
import { useAuth } from "../src/context/AuthContext";
import { useThemeColors } from "../src/context/ThemeContext";
import { colors } from "../src/theme/colors";
import { t } from "../src/i18n";

export default function SketchScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useThemeColors();
  const [width, setWidth] = useState("200");
  const [height, setHeight] = useState("80");
  const [depth, setDepth] = useState("60");
  const [material, setMaterial] = useState("MDF");

  if (!user) {
    router.replace("/auth");
    return null;
  }

  return (
    <Screen title={t("profile.createSketch")}>
      <ScrollView>
        <Text style={[styles.hint, { color: theme.muted }]}>
          O'lchamlarni kiriting — chat orqali kelishuv qilishingiz mumkin
        </Text>
        <View style={[styles.preview, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View
            style={[
              styles.box,
              {
                width: Math.min(Number(width) || 200, 280),
                height: Math.min(Number(height) || 80, 120),
              },
            ]}
          />
          <Text style={{ color: theme.muted, marginTop: 12, fontSize: 12 }}>
            {width}×{depth}×{height} sm · {material}
          </Text>
        </View>

        {[
          { label: "Eni (sm)", val: width, set: setWidth },
          { label: "Chuqurligi (sm)", val: depth, set: setDepth },
          { label: "Balandligi (sm)", val: height, set: setHeight },
        ].map((f) => (
          <View key={f.label}>
            <Text style={[styles.label, { color: theme.text }]}>{f.label}</Text>
            <TextInput
              value={f.val}
              onChangeText={f.set}
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />
          </View>
        ))}

        <Text style={[styles.label, { color: theme.text }]}>Material</Text>
        <TextInput
          value={material}
          onChangeText={setMaterial}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
        />

        <Button
          title="Chatga yuborish"
          onPress={() => router.push("/chat")}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, marginBottom: 16, lineHeight: 20 },
  preview: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    minHeight: 180,
    justifyContent: "center",
  },
  box: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    opacity: 0.85,
  },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 8,
  },
});
