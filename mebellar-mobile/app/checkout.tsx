import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../src/components/ui/Screen";
import { Button } from "../src/components/ui/Button";
import { useAuth } from "../src/context/AuthContext";
import { useCart } from "../src/context/CartContext";
import { useThemeColors } from "../src/context/ThemeContext";
import { api } from "../src/api/client";
import { colors } from "../src/theme/colors";
import { t } from "../src/i18n";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const theme = useThemeColors();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("payme");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    router.replace("/auth");
    return null;
  }

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      await api.createOrder({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        paymentMethod: payment,
        total,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          productId: i.productId,
          price: i.price,
        })),
      });
      clearCart();
      router.replace("/buyurtmalar");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen title="Checkout">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={[styles.label, { color: theme.text }]}>Ism</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={[styles.input, inputStyle(theme)]}
        />
        <Text style={[styles.label, { color: theme.text }]}>Telefon</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={[styles.input, inputStyle(theme)]}
        />
        <Text style={[styles.label, { color: theme.text }]}>Manzil</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          multiline
          style={[styles.input, styles.area, inputStyle(theme)]}
        />

        <Text style={[styles.label, { color: theme.text }]}>To'lov</Text>
        {["payme", "click", "uzum"].map((p) => (
          <Text
            key={p}
            onPress={() => setPayment(p)}
            style={[
              styles.pay,
              payment === p && styles.payActive,
              { color: theme.text, borderColor: theme.border },
            ]}
          >
            {p.toUpperCase()}
          </Text>
        ))}

        <Text style={[styles.total, { color: theme.text }]}>
          {t("cart.total")}: {total.toLocaleString("uz-UZ")} so'm
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={t("cart.checkout")} loading={loading} onPress={submit} />
      </ScrollView>
    </Screen>
  );
}

function inputStyle(theme: ReturnType<typeof useThemeColors>) {
  return {
    backgroundColor: theme.card,
    borderColor: theme.border,
    color: theme.text,
  };
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  area: { minHeight: 80, textAlignVertical: "top" },
  pay: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  payActive: { borderColor: colors.accent, color: colors.accent },
  total: { fontSize: 18, fontWeight: "700", marginVertical: 20 },
  error: { color: "#c0392b", marginBottom: 12 },
});
