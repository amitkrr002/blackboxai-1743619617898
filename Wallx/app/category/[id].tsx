import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import WallpaperGrid from "../components/WallpaperGrid";
import BottomNavBar from "../components/BottomNavBar";
import { getPhotosByCategory, WallpaperItem } from "../services/unsplash";
import { ChevronLeft } from "lucide-react-native";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (id) {
      fetchCategoryWallpapers();
      // Format category name for display (capitalize first letter)
      setCategoryName(id.charAt(0).toUpperCase() + id.slice(1));
    }
  }, [id]);

  const fetchCategoryWallpapers = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const photos = await getPhotosByCategory(id);
      setWallpapers(photos);
    } catch (error) {
      console.error(`Error fetching wallpapers for category ${id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCategoryWallpapers();
  };

  const handleLoadMore = async () => {
    // In a real app, you would implement pagination here
    console.log("Loading more wallpapers for category...");
  };

  const handleFavoriteToggle = (wallpaperId: string) => {
    setWallpapers((prev) =>
      prev.map((wallpaper) =>
        wallpaper.id === wallpaperId
          ? { ...wallpaper, isFavorite: !wallpaper.isFavorite }
          : wallpaper,
      ),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="w-full h-14 px-4 flex-row items-center justify-between bg-white dark:bg-gray-800">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
            <ChevronLeft size={24} color="#3b82f6" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 dark:text-white">
            {categoryName}
          </Text>
        </View>
      </View>

      <View className="flex-1">
        <WallpaperGrid
          title=""
          wallpapers={wallpapers}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          category={id}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </View>

      <BottomNavBar currentRoute="categories" />
    </SafeAreaView>
  );
}
