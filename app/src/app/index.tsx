import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { Link } from "expo-router";

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
  const [search, setSearch] = useState("");
  const [selectedCateogry, setSelectedCategory] = useState("All");

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

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.upc.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCateogry === "All" || product.category === selectedCateogry;

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retail Product Lookup</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by product name or UPC"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryButton,
              selectedCateogry === category && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text>{category}</Text>
          </Pressable>
        ))}
      </View>

      <Link href="/add-product" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </Pressable>
      </Link>

      <Text style={styles.title}>Product Information</Text>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/product",
              params: { id: item._id },
            }}
            asChild
          >
            <Pressable style={styles.product}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text>UPC: {item.upc}</Text>
              <Text>Brand: {item.brand}</Text>
              <Text>Category: {item.category}</Text>
              <Text>Price ${item.price.toFixed(2)}</Text>
              <Text>Description: {item.description}</Text>
            </Pressable>
          </Link>
        )}
      />
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

  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 20,
  },

  categoryButtonSelected: {
    backgroundColor: "#ddd",
  },

  addButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
