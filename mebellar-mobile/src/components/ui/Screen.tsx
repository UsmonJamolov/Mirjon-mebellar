import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../../context/ThemeContext";

interface Props {
  title?: string;
  children: React.ReactNode;
  noPad?: boolean;
}

export function Screen({ title, children, noPad }: Props) {
  const theme = useThemeColors();
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={["top"]}
    >
      {title ? (
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      ) : null}
      <View style={[styles.body, noPad && styles.noPad]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  body: { flex: 1, paddingHorizontal: 16 },
  noPad: { paddingHorizontal: 0 },
});
