import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  const router = useRouter();

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

  const deleteProduct = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `http://localhost:3000/products/${product._id}`,
                {
                  method: "DELETE",
                },
              );

              if (!response.ok) {
                throw new Error("Failed to delete product");
              }

              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Could not delete product. ");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={style.container}>
      <Pressable onPress={() => router.back()} style={style.backButton}>
        <Text style={style.backButtonText}>Back</Text>
      </Pressable>
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
      <Link
        href={{
          pathname: "/edit-product",
          params: { id: product._id },
        }}
        asChild
      >
        <Pressable style={style.button}>
          <Text>Edit Product</Text>
        </Pressable>
      </Link>

      <Pressable style={style.deleteButton} onPress={deleteProduct}>
        <Text>Delete Button</Text>
      </Pressable>
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

  backButton: {
    marginBottom: 20,
  },

  backButtonText: {
    fontSize: 16,
  },

  button: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },

  deleteButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
});
