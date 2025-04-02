import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react-native";

enum AuthMode {
  SIGN_IN = "sign_in",
  SIGN_UP = "sign_up",
  FORGOT_PASSWORD = "forgot_password",
}

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, resetPassword, isLoading, error, clearError } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);

  const handleSubmit = async () => {
    clearError();

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (mode === AuthMode.FORGOT_PASSWORD) {
      await resetPassword(email);
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    if (mode === AuthMode.SIGN_UP) {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  const toggleMode = () => {
    clearError();
    if (mode === AuthMode.SIGN_IN) {
      setMode(AuthMode.SIGN_UP);
    } else if (mode === AuthMode.SIGN_UP) {
      setMode(AuthMode.SIGN_IN);
    } else {
      setMode(AuthMode.SIGN_IN);
    }
  };

  const toggleForgotPassword = () => {
    clearError();
    if (mode === AuthMode.FORGOT_PASSWORD) {
      setMode(AuthMode.SIGN_IN);
    } else {
      setMode(AuthMode.FORGOT_PASSWORD);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-12">
            {/* Logo and App Name */}
            <View className="items-center mb-10">
              <Image
                source={require("../assets/images/splash-icon.png")}
                style={{ width: 100, height: 100, resizeMode: "contain" }}
              />
              <Text className="text-3xl font-bold text-gray-800 dark:text-white mt-4">
                WallX
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center mt-2">
                {mode === AuthMode.SIGN_IN
                  ? "Sign in to access your favorite wallpapers"
                  : mode === AuthMode.SIGN_UP
                    ? "Create an account to save and sync your wallpapers"
                    : "Enter your email to reset your password"}
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-red-100 p-3 rounded-lg mb-4">
                <Text className="text-red-500">{error}</Text>
              </View>
            )}

            {/* Form Fields */}
            <View className="space-y-4">
              {/* Email Field */}
              <View>
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Email
                </Text>
                <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg px-3 border border-gray-300 dark:border-gray-700">
                  <Mail size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 py-3 px-2 text-gray-800 dark:text-white"
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Field - Only show for Sign In and Sign Up */}
              {mode !== AuthMode.FORGOT_PASSWORD && (
                <View>
                  <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Password
                  </Text>
                  <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg px-3 border border-gray-300 dark:border-gray-700">
                    <Lock size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 py-3 px-2 text-gray-800 dark:text-white"
                      placeholder="Enter your password"
                      placeholderTextColor="#9ca3af"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#9ca3af" />
                      ) : (
                        <Eye size={20} color="#9ca3af" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Confirm Password Field - Only show for Sign Up */}
              {mode === AuthMode.SIGN_UP && (
                <View>
                  <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Confirm Password
                  </Text>
                  <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg px-3 border border-gray-300 dark:border-gray-700">
                    <Lock size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 py-3 px-2 text-gray-800 dark:text-white"
                      placeholder="Confirm your password"
                      placeholderTextColor="#9ca3af"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>
              )}

              {/* Forgot Password Link - Only show for Sign In */}
              {mode === AuthMode.SIGN_IN && (
                <TouchableOpacity
                  onPress={toggleForgotPassword}
                  className="self-end"
                >
                  <Text className="text-blue-500 dark:text-blue-400">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-3 px-4 items-center mt-4"
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white font-bold text-lg mr-2">
                      {mode === AuthMode.SIGN_IN
                        ? "Sign In"
                        : mode === AuthMode.SIGN_UP
                          ? "Sign Up"
                          : "Reset Password"}
                    </Text>
                    <ArrowRight size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              {/* Toggle between Sign In and Sign Up */}
              {mode !== AuthMode.FORGOT_PASSWORD ? (
                <TouchableOpacity
                  onPress={toggleMode}
                  className="mt-6 self-center"
                >
                  <Text className="text-blue-500 dark:text-blue-400">
                    {mode === AuthMode.SIGN_IN
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Sign In"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={toggleForgotPassword}
                  className="mt-6 self-center"
                >
                  <Text className="text-blue-500 dark:text-blue-400">
                    Back to Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
