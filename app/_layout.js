import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await SecureStore.getItemAsync("loggedIn");
        setIsLoggedIn(!!session);
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "login";

    if (!isLoggedIn && !inAuthGroup) {
      // not logged in → go to login
      router.replace("/login");
    } else if (isLoggedIn && inAuthGroup) {
      // already logged in → go to home (receiving)
      router.replace("/receiving");
    }
  }, [isReady, isLoggedIn, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#001209" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
}
