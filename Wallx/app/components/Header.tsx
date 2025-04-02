import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Search, Bell } from "lucide-react-native";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotification?: boolean;
  showSearch?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

const Header = ({
  title,
  showBackButton = false,
  showNotification = false,
  showSearch = false,
  onSearchPress,
  onNotificationPress,
}: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="w-full h-14 px-4 flex-row items-center justify-between bg-white dark:bg-gray-800">
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
            <ChevronLeft size={24} color="#3b82f6" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          {title}
        </Text>
      </View>

      <View className="flex-row">
        {showSearch && (
          <TouchableOpacity onPress={onSearchPress} className="p-2 mr-2">
            <Search size={22} color="#3b82f6" />
          </TouchableOpacity>
        )}
        {showNotification && (
          <TouchableOpacity onPress={onNotificationPress} className="p-2">
            <Bell size={22} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
