import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavBar from "./components/BottomNavBar";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "abstract",
    name: "Abstract",
    imageUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
  },
  {
    id: "nature",
    name: "Nature",
    imageUrl:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80",
  },
  {
    id: "minimal",
    name: "Minimal",
    imageUrl:
      "https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=400&q=80",
  },
  {
    id: "urban",
    name: "Urban",
    imageUrl:
      "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&q=80",
  },
  {
    id: "space",
    name: "Space",
    imageUrl:
      "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80",
  },
  {
    id: "neon",
    name: "Neon",
    imageUrl:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
  },
  {
    id: "geometric",
    name: "Geometric",
    imageUrl:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80",
  },
  {
    id: "gradient",
    name: "Gradient",
    imageUrl:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
  },
];

const STORAGE_KEY = "wallx_categories";

export default function CategoriesScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from AsyncStorage
  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedCategories = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // If no stored categories, use defaults and save them
        setCategories(DEFAULT_CATEGORIES);
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(DEFAULT_CATEGORIES),
        );
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Failed to load categories");
      // Fallback to default categories if there's an error
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const handleCategoryPress = (categoryId: string) => {
    // Navigate to a category-specific page
    router.push(`/category/${categoryId}`);
  };

  const handleError = (error: Error) => {
    console.error("Error in CategoriesScreen:", error);
    Alert.alert("Error", "Something went wrong. Please try again later.", [
      { text: "OK" },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="w-full h-14 px-4 flex-row items-center justify-between bg-white dark:bg-gray-800">
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          Categories
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 dark:text-gray-400">
            Loading categories...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 p-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3b82f6"]}
              tintColor="#3b82f6"
            />
          }
        >
          {error ? (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-red-500 text-center mb-2">{error}</Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Pull down to refresh
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeInDown.delay(index * 100).springify()}
                  className="w-[48%] mb-4 rounded-xl overflow-hidden"
                >
                  <TouchableOpacity
                    className="w-full aspect-[3/2] relative"
                    onPress={() => handleCategoryPress(category.id)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: category.imageUrl }}
                      className="w-full h-full"
                      style={{ borderRadius: 12 }}
                    />
                    <View className="absolute inset-0 bg-black/30 rounded-xl justify-end p-3">
                      <Text className="text-white font-bold text-lg">
                        {category.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <BottomNavBar currentRoute="categories" />
    </SafeAreaView>
  );
}
