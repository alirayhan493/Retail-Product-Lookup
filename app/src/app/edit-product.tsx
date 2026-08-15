import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Product = {
  _id: string;
  upc: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description?: string;
  //imageUrl?: string;
};

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [upc, setUpc] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setName(data.name);
        setUpc(data.upc);
        setBrand(data.brand);
        setCategory(data.category);
        setPrice(String(data.price));
        setDescription(data.description || "");
      })
      .catch((error) => console.error(error));
  }, [id]);

  const updateProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          upc,
          brand,
          category,
          price,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      Alert.alert("Success", "Product updated");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Could not update product. ");
    }
  };

  if (!product) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Edit Product</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Product Name"
      />

      <TextInput
        style={styles.input}
        value={upc}
        onChangeText={setUpc}
        placeholder="UPC"
      />

      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
      />

      <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
        placeholder="Brand"
      />

      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Price"
        keyboardType="decimal-pad"
      />

      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder=""
      />

      <Button title="Save Changes" onPress={updateProduct}></Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  description: {
    height: 100,
    textAlignVertical: "top",
  },

  backButton: {
    marginBottom: 20,
  },

  backButtonText: {
    fontSize: 16,
  },
});
