import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

type Product = {
  _id: string;
  upc: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
};

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product: ", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={style.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={style.container}>
        <Text> Product not found</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <Text style={style.title}>{product.name}</Text>

      {product.imageUrl && (
        <Image source={{ uri: product.imageUrl }} style={style.productImage} />
      )}

      <Text style={style.info}>SKU: {product.upc}</Text>

      <Text style={style.info}>Category: {product.category}</Text>

      <Text style={style.price}>${product.price.toFixed(2)}</Text>

      <Text style={style.description}>
        {product.description || "No description available."}
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  info: {
    fontSize: 17,
    marginBottom: 10,
  },

  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
  },

  description: {
    fontSize: 16,
  },

  productImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
});
