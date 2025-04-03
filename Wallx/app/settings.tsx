import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  ChevronRight,
  Moon,
  Sun,
  Bell,
  Download,
  Trash,
  Info,
  LogOut,
  User,
  Mail,
} from "lucide-react-native";
import { useAuth } from "../src/contexts/AuthContext";
import { useTheme } from "../src/contexts/ThemeContext";
import BottomNavBar from "./components/BottomNavBar";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <View className="mb-6">
    <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-4">
      {title}
    </Text>
    <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      {children}
    </View>
  </View>
);

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  value?: string;
  isSwitch?: boolean;
  isSwitchOn?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  value,
  isSwitch = false,
  isSwitchOn = false,
  onSwitchChange,
  onPress,
  showChevron = true,
  isDestructive = false,
}: SettingsItemProps) => (
  <TouchableOpacity
    className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100 dark:border-gray-700"
    onPress={onPress}
    disabled={isSwitch}
  >
    <View className="flex-row items-center">
      <View className="mr-3">{icon}</View>
      <Text
        className={`${isDestructive ? "text-red-500" : "text-gray-800 dark:text-white"} font-medium`}
      >
        {title}
      </Text>
    </View>
    <View className="flex-row items-center">
      {value && !isSwitch && (
        <Text className="text-gray-500 dark:text-gray-400 mr-2">{value}</Text>
      )}
      {isSwitch ? (
        <Switch
          value={isSwitchOn}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
          thumbColor={"#ffffff"}
        />
      ) : (
        showChevron && <ChevronRight size={20} color="#9ca3af" />
      )}
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { user, signOut, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isAutoDownloadEnabled, setIsAutoDownloadEnabled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    } else {
      setUserEmail(null);
    }
  }, [user]);

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the app cache? This will remove all downloaded wallpapers.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // Clear cache logic would go here
            Alert.alert("Success", "Cache cleared successfully");
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="w-full h-14 px-4 flex-row items-center justify-between bg-white dark:bg-gray-800">
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* User Profile Section */}
        {user ? (
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6">
            <View className="p-4 items-center">
              <View className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-3">
                <User size={40} color="#3b82f6" />
              </View>
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                {userEmail?.split("@")[0] || "User"}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 mt-1">
                {userEmail || "Loading..."}
              </Text>
            </View>
          </View>
        ) : isLoading ? (
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6 p-4 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 dark:text-gray-400 mt-2">
              Loading profile...
            </Text>
          </View>
        ) : (
          <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6 p-4 items-center">
            <Text className="text-gray-800 dark:text-white text-lg font-medium">
              Not signed in
            </Text>
          </View>
        )}
        <SettingsSection title="APPEARANCE">
          <SettingsItem
            icon={
              isDark ? (
                <Moon size={22} color="#3b82f6" />
              ) : (
                <Sun size={22} color="#f59e0b" />
              )
            }
            title="Dark Mode"
            isSwitch={true}
            isSwitchOn={isDark}
            onSwitchChange={toggleTheme}
          />
        </SettingsSection>

        <SettingsSection title="NOTIFICATIONS">
          <SettingsItem
            icon={<Bell size={22} color="#3b82f6" />}
            title="Push Notifications"
            isSwitch={true}
            isSwitchOn={isNotificationsEnabled}
            onSwitchChange={setIsNotificationsEnabled}
          />
        </SettingsSection>

        <SettingsSection title="DOWNLOADS">
          <SettingsItem
            icon={<Download size={22} color="#3b82f6" />}
            title="Auto-Download HD Quality"
            isSwitch={true}
            isSwitchOn={isAutoDownloadEnabled}
            onSwitchChange={setIsAutoDownloadEnabled}
          />
          <SettingsItem
            icon={<Trash size={22} color="#ef4444" />}
            title="Clear Cache"
            onPress={handleClearCache}
            isDestructive={true}
          />
        </SettingsSection>

        <SettingsSection title="ABOUT">
          <SettingsItem
            icon={<Info size={22} color="#3b82f6" />}
            title="App Version"
            value="1.0.0"
            showChevron={false}
          />
        </SettingsSection>

        <SettingsSection title="ACCOUNT">
          <SettingsItem
            icon={<LogOut size={22} color="#ef4444" />}
            title="Log Out"
            onPress={handleLogout}
            isDestructive={true}
          />
        </SettingsSection>
      </ScrollView>

      <BottomNavBar currentRoute="settings" />
    </SafeAreaView>
  );
}
