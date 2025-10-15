import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator, Image } from "react-native";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // ← null means "not checked yet"
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await SecureStore.getItemAsync("loggedIn");
        setIsLoggedIn(!!session);
      } catch (err) {
        console.error("Auth check error:", err);
        setIsLoggedIn(false);
      } finally {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady || isLoggedIn === null) return;

    const inAuthGroup = segments[0] === "login";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/receiving");
    }
  }, [isReady, isLoggedIn, segments]);

  // ✅ Show loader until auth is fully checked
  if (!isReady || isLoggedIn === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#001209" }}>
        <Image source={require("../logo.png")} style={{ width: 80, height: 80, marginBottom: 20 }} />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
}
