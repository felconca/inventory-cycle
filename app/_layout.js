import { useState, useEffect } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { Provider } from "../context/auth";
import * as SecureStore from "expo-secure-store";

export default function AuthLayout() {
  const [isReady, setIsReady] = useState(false);
  const [loadedUser, setLoadedUser] = useState(null);

  const getUserFromStorage = async () => {
    const user = await SecureStore.getItemAsync("loggedIn");
    if (user) {
      setLoadedUser(JSON.parse(user));
    }
    setIsReady(true);
  };

  useEffect(() => {
    getUserFromStorage();
  }, []);

  if (!isReady)
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <Provider userCredentials={loadedUser}>
      <StatusBar animated={true} backgroundColor="#61dafb" barStyle={"dark-content"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      >
        <Stack.Screen
          name="receiving-modal"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
