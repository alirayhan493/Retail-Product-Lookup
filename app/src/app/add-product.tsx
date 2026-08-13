import { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddProductSreen() {
  const [name, setName] = useState("");
  const [upc, setUpc] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const addProduct = async () => {
    if (!name || !upc || !brand || !category || !price) {
      Alert.alert(
        "Missing Information,",
        "Please fill in all required fields.",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          upc,
          brand,
          category,
          price: Number(price),
          description,
        }),
      });

      Alert.alert("Success", "Product added successfully");

      setName("");
      setUpc("");
      setBrand("");
      setCategory("");
      setPrice("");
      setDescription("");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not add product.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Product Name"
      />

      <Text style={styles.label}>SKU</Text>
      <TextInput
        style={styles.input}
        value={upc}
        onChangeText={setUpc}
        placeholder="SKU"
      />

      <Text style={styles.label}>Brand</Text>
      <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
        placeholder="Brand"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Price"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.description]}
        value={description}
        onChangeText={setDescription}
        placeholder="Product Description"
        multiline
      />

      <Button title="Add Product" onPress={addProduct} />
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
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },

  description: {
    height: 100,
    textAlignVertical: "top",
  },
});
