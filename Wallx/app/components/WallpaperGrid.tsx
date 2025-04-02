import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
// import { MasonryFlashList } from "@shopify/flash-list";
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import WallpaperCard from "./WallpaperCard";
import {
  WallpaperItem,
  getRandomPhotos,
  getPhotosByCategory,
} from "../services/unsplash";

interface WallpaperGridProps {
  title?: string;
  wallpapers?: WallpaperItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  category?: string;
  onFavoriteToggle?: (id: string) => void;
}

const WallpaperGrid = ({
  title = "Trending Wallpapers",
  wallpapers,
  isLoading = false,
  onRefresh = () => {},
  onEndReached = () => {},
  category = "",
  onFavoriteToggle,
}: WallpaperGridProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [localWallpapers, setLocalWallpapers] = useState<WallpaperItem[]>([]);
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState<string | null>(null);

  // Initialize favorites from wallpapers prop
  useEffect(() => {
    if (wallpapers) {
      // Ensure we have unique wallpapers by filtering out duplicates by ID
      const uniqueWallpapers = wallpapers.filter(
        (wallpaper, index, self) =>
          index === self.findIndex((w) => w.id === wallpaper.id),
      );

      setLocalWallpapers(uniqueWallpapers);
      const initialFavorites: Record<string, boolean> = {};
      uniqueWallpapers.forEach((wallpaper) => {
        if (wallpaper.isFavorite) {
          initialFavorites[wallpaper.id] = true;
        }
      });
      setFavorites(initialFavorites);
    } else {
      // If no wallpapers provided, fetch from Unsplash
      fetchWallpapers();
    }
  }, [wallpapers]);

  const fetchWallpapers = async () => {
    setLoading(true);
    setError(null);
    try {
      let photos;
      if (category) {
        photos = await getPhotosByCategory(category);
      } else {
        photos = await getRandomPhotos(20);
      }
      setLocalWallpapers(photos);
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      setError("Failed to load wallpapers. Pull down to try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      if (onRefresh) {
        await Promise.resolve(onRefresh());
      } else {
        await fetchWallpapers();
      }
    } catch (error) {
      console.error("Error refreshing wallpapers:", error);
      setError("Failed to refresh. Please try again later.");
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const handleFavoriteToggle = (id: string) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    } else {
      setFavorites((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));

      // Update the local wallpapers list
      setLocalWallpapers((prev) =>
        prev.map((wallpaper) =>
          wallpaper.id === id
            ? { ...wallpaper, isFavorite: !favorites[id] }
            : wallpaper,
        ),
      );
    }
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    // Can be used for parallax effects or hiding/showing elements on scroll
  });

  // Render a grid item
  const renderItem = ({
    item,
    index,
  }: {
    item: WallpaperItem;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="flex-1"
    >
      <WallpaperCard
        id={item.id}
        imageUrl={item.imageUrl}
        title={item.title}
        isFavorite={favorites[item.id] || item.isFavorite || false}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {title && (
        <View className="px-4 py-2">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {title}
          </Text>
        </View>
      )}

      {(loading || isLoading) && localWallpapers.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 dark:text-gray-400">
            Loading wallpapers...
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={localWallpapers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3b82f6"]}
              tintColor="#3b82f6"
              title="Pull to refresh..."
              titleColor="#6b7280"
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              {error ? (
                <>
                  <Text className="text-red-500 text-center mb-2">{error}</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-center">
                    Pull down to refresh
                  </Text>
                </>
              ) : (
                <Text className="text-gray-600 dark:text-gray-400 text-center">
                  {category
                    ? `No wallpapers found in ${category}`
                    : "No wallpapers found"}
                </Text>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

export default WallpaperGrid;
