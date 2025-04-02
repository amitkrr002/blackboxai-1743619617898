import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import WallpaperGrid from "./components/WallpaperGrid";
import BottomNavBar from "./components/BottomNavBar";

interface Wallpaper {
  id: string;
  imageUrl: string;
  title: string;
  isFavorite: boolean;
  category?: string;
}

export default function FavoritesScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);

  // Simulate fetching favorites when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchFavorites = async () => {
        setIsLoading(true);
        // In a real app, you would fetch favorites from storage or API
        // For now, we'll use mock data
        const mockFavorites = [
          {
            id: "photo-1516617442634-75371039cb3a",
            imageUrl:
              "https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=400&q=80",
            title: "Minimal Dark",
            isFavorite: true,
            category: "Minimal",
          },
          {
            id: "photo-1614850523296-d8c1af93d400",
            imageUrl:
              "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80",
            title: "Digital Universe",
            isFavorite: true,
            category: "Space",
          },
        ];

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setFavorites(mockFavorites);
        setIsLoading(false);
      };

      fetchFavorites();

      return () => {
        // Cleanup if needed
      };
    }, []),
  );

  const handleRefresh = () => {
    // Simulate refreshing favorites
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleRemoveFavorite = (id: string) => {
    // Remove from favorites
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="w-full h-14 px-4 flex-row items-center justify-between bg-white dark:bg-gray-800">
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          Favorites
        </Text>
      </View>

      <View className="flex-1">
        <WallpaperGrid
          title=""
          wallpapers={favorites}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onFavoriteToggle={handleRemoveFavorite}
        />
      </View>

      <BottomNavBar currentRoute="favorites" />
    </SafeAreaView>
  );
}
