import React, { useState, useEffect, useCallback } from "react";
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
  const [error, setError] = useState<{message: string; retry: () => void} | null>(null);

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
      setError(null);
    } catch (err) {
      setError({
        message: `Failed to load wallpapers: ${err instanceof Error ? err.message : String(err)}`,
        retry: fetchCategoryWallpapers
      });
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

  const handleFavoriteToggle = useCallback((wallpaperId: string) => {
    setWallpapers((prev) =>
      prev.map((wallpaper) =>
        wallpaper.id === wallpaperId
          ? { ...wallpaper, isFavorite: !wallpaper.isFavorite }
          : wallpaper
      )
    );
  }, []);

  const handleNewWallpapers = useCallback((newWallpapers: WallpaperItem[]) => {
    setWallpapers(newWallpapers);
  }, []);

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
        {error && (
          <View className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
            <Text className="text-red-800">{error.message}</Text>
            <TouchableOpacity 
              onPress={error.retry}
              className="mt-2 bg-red-500 px-4 py-2 rounded self-start"
            >
              <Text className="text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        <WallpaperGrid
          title=""
          wallpapers={wallpapers}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          category={id}
          onFavoriteToggle={handleFavoriteToggle}
          onNewWallpapers={handleNewWallpapers}
        />
      </View>

      <BottomNavBar currentRoute="categories" />
    </SafeAreaView>
  );
}
