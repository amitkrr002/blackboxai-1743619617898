import { DefaultTheme, ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../src/contexts/ThemeContext";
import { useFonts } from "expo-font";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform, View, Text, Image } from "react-native";
import RNSplashScreen from "react-native-splash-screen";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Protected route component
function ProtectedRouteLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Check if the user is authenticated
      const inAuthGroup = segments[0] === "auth";

      if (!user && !inAuthGroup) {
        // Redirect to the sign-in page if not authenticated
        router.replace("/auth");
      } else if (user && inAuthGroup) {
        // Redirect to the home page if authenticated and on an auth page
        router.replace("/");
      }
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    // Show a loading screen while checking authentication
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#3b82f6",
        }}
      >
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={{ width: 150, height: 150, resizeMode: "contain" }}
        />
        <Text
          style={{
            marginTop: 20,
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
          }}
        >
          WallX
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: !route.name.startsWith("tempobook"),
      })}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="categories" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="wallpaper/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}


function ThemeAwareStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  useEffect(() => {
    // Hide the splash screen after assets are loaded
    if (loaded) {
      // Hide Expo's splash screen
      SplashScreen.hideAsync();

      // Hide the native splash screen if not on web and if it's available
      if (
        Platform.OS !== "web" &&
        RNSplashScreen &&
        typeof RNSplashScreen.hide === "function"
      ) {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          RNSplashScreen.hide();
        }, 500);
      }
    }
  }, [loaded]);

  if (!loaded) {
    // Show a loading screen while fonts are loading
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#3b82f6",
        }}
      >
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={{ width: 150, height: 150, resizeMode: "contain" }}
        />
        <Text
          style={{
            marginTop: 20,
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
          }}
        >
          WallX
        </Text>
      </View>
    );
  }

  return (
    <NavThemeProvider value={DefaultTheme}>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRouteLayout />
        </AuthProvider>
        <ThemeAwareStatusBar />
      </ThemeProvider>
    </NavThemeProvider>
  );
}
