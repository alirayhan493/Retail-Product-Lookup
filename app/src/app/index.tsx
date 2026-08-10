import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

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

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retail Product Lookup</Text>

      <Text style={styles.title}>Search for product information</Text>

      {products.map((product) => (
        <View key={product._id} style={styles.product}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text>UPC: {product.upc}</Text>
          <Text>Brand: {product.brand}</Text>
          <Text>Category: {product.category}</Text>
          <Text>Price ${product.price.toFixed(2)}</Text>
          <Text>Description: {product.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  product: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
  },

  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
});
