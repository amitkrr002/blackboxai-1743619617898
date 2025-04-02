import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import {
  ChevronLeft,
  Heart,
  Download,
  Share as ShareIcon,
  Info,
  Search,
} from "lucide-react-native";
import {
  getPhotoById,
  WallpaperItem,
  searchPhotos,
} from "../services/unsplash";
import BottomNavBar from "../components/BottomNavBar";

export default function WallpaperDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [wallpaper, setWallpaper] = useState<WallpaperItem | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id) {
      fetchWallpaper();
      // Extract search query from ID if it contains a search term
      if (typeof id === "string" && id.startsWith("search-")) {
        const query = id.replace(/^search-/, "").replace(/-/g, " ");
        setSearchQuery(query.charAt(0).toUpperCase() + query.slice(1));
      } else {
        // Clear search query if not a search result
        setSearchQuery("");
      }
    }
  }, [id]);

  const fetchWallpaper = async () => {
    setIsLoading(true);
    try {
      // If ID starts with "search-", it's a search result
      if (id && typeof id === "string" && id.startsWith("search-")) {
        const query = id.replace("search-", "").replace(/-/g, " ");
        const { results } = await searchPhotos(query, 1, 1);
        if (results.length > 0) {
          setWallpaper({
            ...results[0],
            title: query.charAt(0).toUpperCase() + query.slice(1),
            category: "Search Result",
          });
          setIsFavorite(results[0].isFavorite);
        }
      } else {
        const data = await getPhotoById(id as string);
        if (data) {
          setWallpaper(data);
          setIsFavorite(data.isFavorite);
        }
      }
    } catch (error) {
      console.error(`Error fetching wallpaper with ID ${id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((err) => {
        console.log("Haptics error:", err);
      });
    }
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to storage or API
  };

  const handleDownload = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        (err) => {
          console.log("Haptics error:", err);
        },
      );
    }
    Alert.alert(
      "Download Started",
      "Your wallpaper is being downloaded. It will be available in your gallery soon.",
    );
    // In a real app, you would implement actual download functionality
  };

  const handleShare = async () => {
    if (!wallpaper) return;

    try {
      await Share.share({
        message: `Check out this amazing wallpaper from WallX: ${wallpaper.title}`,
        url: wallpaper.imageUrl,
      });
    } catch (error) {
      console.error("Error sharing wallpaper:", error);
    }
  };

  const handleSetWallpaper = () => {
    Alert.alert(
      "Set Wallpaper",
      "Where would you like to apply this wallpaper?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Home Screen",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              ).catch((err) => {
                console.log("Haptics error:", err);
              });
            }
            Alert.alert("Success", "Wallpaper set as home screen");
          },
        },
        {
          text: "Lock Screen",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              ).catch((err) => {
                console.log("Haptics error:", err);
              });
            }
            Alert.alert("Success", "Wallpaper set as lock screen");
          },
        },
        {
          text: "Both",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              ).catch((err) => {
                console.log("Haptics error:", err);
              });
            }
            Alert.alert(
              "Success",
              "Wallpaper set as both home and lock screen",
            );
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-white">Loading wallpaper...</Text>
      </SafeAreaView>
    );
  }

  if (!wallpaper) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <Text className="text-white text-lg">Wallpaper not found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Wallpaper Image */}
      <Image
        source={{ uri: wallpaper.imageUrl }}
        className="absolute inset-0 w-full h-full"
        contentFit="cover"
      />

      {/* Top Navigation Bar with Blur */}
      <BlurView
        intensity={30}
        className="absolute top-0 left-0 right-0"
        style={{ paddingTop: insets.top || 12 }}
      >
        <View className="flex-row justify-between items-center px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-black/20"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFavoriteToggle}
            className="p-2 rounded-full bg-black/20"
          >
            <Heart
              size={24}
              color="white"
              fill={isFavorite ? "white" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Bottom Action Bar with Blur */}
      <BlurView
        intensity={50}
        className="absolute bottom-0 left-0 right-0 p-6"
        style={{ paddingBottom: insets.bottom || 24 }}
      >
        <View className="mb-2">
          <Text className="text-white text-xl font-bold">
            {wallpaper.title}
          </Text>
          {searchQuery && (
            <View className="flex-row items-center mt-1">
              <Search size={14} color="#9ca3af" />
              <Text className="text-gray-400 text-sm ml-1">
                Search: {searchQuery}
              </Text>
            </View>
          )}
          {wallpaper.author && (
            <Text className="text-gray-300 text-sm mt-1">
              by {wallpaper.author}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-evenly mt-4">
          <ActionButton
            icon={<Info size={20} color="white" />}
            label="Info"
            onPress={() =>
              Alert.alert(
                "Wallpaper Info",
                `Category: ${wallpaper.category || "Unknown"}\nID: ${wallpaper.id}`,
              )
            }
          />
          <ActionButton
            icon={<ShareIcon size={20} color="white" />}
            label="Share"
            onPress={handleShare}
          />
          <ActionButton
            icon={<Download size={20} color="white" />}
            label="Download"
            onPress={handleDownload}
          />
          <ActionButton
            icon={
              <Heart
                size={20}
                color="white"
                fill={isFavorite ? "white" : "transparent"}
              />
            }
            label="Favorite"
            onPress={handleFavoriteToggle}
          />
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-4 mt-6 shadow-lg"
          onPress={handleSetWallpaper}
          style={{
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Text className="text-white text-center font-bold text-lg">
            Set as Wallpaper
          </Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => (
  <TouchableOpacity
    className="items-center justify-center p-2"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="bg-black/30 backdrop-blur-md p-3 rounded-full mb-1 shadow-sm">
      {icon}
    </View>
    <Text className="text-white text-xs font-medium">{label}</Text>
  </TouchableOpacity>
);
