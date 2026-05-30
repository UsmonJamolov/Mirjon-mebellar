import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { api, resolveMediaUrl } from "../../src/api/client";
import { useCart } from "../../src/context/CartContext";
import { useThemeColors } from "../../src/context/ThemeContext";
import type { Product } from "../../src/types";
import { colors } from "../../src/theme/colors";

const { width } = Dimensions.get("window");

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useThemeColors();
  const { addItem, likedIds, toggleLike } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text }}>Mahsulot topilmadi</Text>
      </View>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.image];
  const liked = likedIds.includes(product.id);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={styles.gallery}>
        <Image
          source={{ uri: resolveMediaUrl(images[imgIdx]) }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <Pressable style={styles.like} onPress={() => toggleLike(product.id)}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? colors.accent : "#fff"}
          />
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbs}>
          {images.map((img, i) => (
            <Pressable key={i} onPress={() => setImgIdx(i)}>
              <Image
                source={{ uri: resolveMediaUrl(img) }}
                style={[styles.thumb, imgIdx === i && styles.thumbActive]}
                contentFit="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.body, { backgroundColor: theme.card }]}>
        <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
        <Text style={styles.price}>
          {product.price.toLocaleString("uz-UZ")} so'm
        </Text>
        <Text style={[styles.meta, { color: theme.muted }]}>
          {product.category} · {product.material}
        </Text>
        {(product.width || product.height) && (
          <Text style={[styles.meta, { color: theme.muted }]}>
            O'lcham: {product.width}×{product.depth}×{product.height} sm
          </Text>
        )}
        <Text style={[styles.desc, { color: theme.text }]}>
          {product.description}
        </Text>
        <View style={styles.actions}>
          <Button
            title="Savatchaga qo'shish"
            onPress={() => addItem(product)}
          />
          <Button
            title="Hoziroq sotib olish"
            variant="outline"
            onPress={() => {
              addItem(product);
              router.push("/checkout");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  gallery: { position: "relative" },
  heroImage: { width, height: width * 0.85 },
  like: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbs: { position: "absolute", bottom: 12, left: 12, right: 12 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: { borderColor: colors.accent },
  body: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  price: { fontSize: 24, fontWeight: "800", color: colors.accent, marginBottom: 8 },
  meta: { fontSize: 13, marginBottom: 4 },
  desc: { fontSize: 14, lineHeight: 22, marginTop: 16, marginBottom: 24 },
  actions: { gap: 12 },
});
