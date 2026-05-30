import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  title: string;
  onPress?: () => void;
  variant?: "accent" | "outline";
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "accent",
  loading,
  disabled,
}: Props) {
  const isAccent = variant === "accent";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isAccent ? styles.accent : styles.outline,
        (pressed || disabled) && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isAccent ? "#fff" : colors.primary} />
      ) : (
        <Text style={[styles.text, isAccent ? styles.textLight : styles.textDark]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  accent: {
    backgroundColor: colors.accent,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  text: { fontSize: 15, fontWeight: "600" },
  textLight: { color: "#fff" },
  textDark: { color: colors.primary },
});
