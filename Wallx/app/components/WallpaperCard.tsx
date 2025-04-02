import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { Heart, AlertCircle } from "lucide-react-native";
import { useRouter } from "expo-router";

interface WallpaperCardProps {
  id?: string;
  imageUrl?: string;
  title?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

const WallpaperCard = ({
  id = "wallpaper-1",
  imageUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
  title = "Abstract Wave",
  isFavorite = false,
  onFavoriteToggle = () => {},
}: WallpaperCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(imageUrl);

  // Process image URL for mobile compatibility
  React.useEffect(() => {
    const prepareImage = async () => {
      if (Platform.OS === "web") {
        // Web works fine with direct URLs
        setProcessedImageUrl(imageUrl);
        return;
      }

      try {
        // For mobile, ensure URL has proper protocol and parameters
        let url = imageUrl;

        // Ensure URL has https protocol
        if (!url.startsWith("https://")) {
          url = url.replace("http://", "https://");
        }

        // Add quality and width parameters if not present
        if (!url.includes("q=")) {
          url = url.includes("?") ? `${url}&q=80` : `${url}?q=80`;
        }

        if (!url.includes("w=")) {
          url = `${url}&w=400`;
        }

        // Add a cache-busting parameter for Expo Go
        if (!url.includes("t=")) {
          url = `${url}&t=${Date.now()}`;
        }

        setProcessedImageUrl(url);
      } catch (error) {
        console.error("Error processing image URL:", error);
        setHasError(true);
      }
    };

    prepareImage();
  }, [imageUrl]);

  const handlePress = () => {
    // Navigate to wallpaper detail/set screen
    if (!hasError) {
      router.push(`/wallpaper/${id}`);
    }
  };

  const handleFavoritePress = (e: React.TouchableEvent) => {
    e.stopPropagation();
    onFavoriteToggle(id);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden m-1 shadow-md"
      style={{
        width: 180,
        height: 320,
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 3,
          },
        }),
      }}
    >
      <View className="relative w-full h-full">
        {isLoading && (
          <View className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 z-10">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}

        {hasError ? (
          <View className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <AlertCircle size={32} color="#ef4444" />
            <Text className="text-gray-600 dark:text-gray-400 mt-2 text-center px-2">
              Failed to load image
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: processedImageUrl }}
            className="w-full h-full"
            contentFit="cover"
            transition={300}
            onLoad={handleImageLoad}
            onError={handleImageError}
            cachePolicy="memory-disk"
          />
        )}

        {!hasError && (
          <>
            <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur-sm">
              <Text className="text-white font-medium text-sm">{title}</Text>
            </View>
            <TouchableOpacity
              onPress={handleFavoritePress}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/20 backdrop-blur-sm"
            >
              <Heart
                size={20}
                color="white"
                fill={isFavorite ? "white" : "transparent"}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default WallpaperCard;
