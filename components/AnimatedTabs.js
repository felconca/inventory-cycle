import React, { useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";

const { width } = Dimensions.get("window");

export default function AnimatedTabs({ tabs = [] }) {
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = tabs.findIndex((tab) => {
    const current = pathname.replace(/\/$/, ""); // remove trailing slash
    const route = tab.route.replace(/\/$/, "");
    return current === route;
  });

  const translateX = useRef(new Animated.Value(0)).current;
  const TAB_WIDTH = (width - 60) / tabs.length;

  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: safeIndex * TAB_WIDTH,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, [safeIndex]);

  return (
    <View style={styles.container}>
      <View style={[styles.tabContainer, { width: TAB_WIDTH * tabs.length }]}>
        {/* Animated slider background */}
        <Animated.View
          style={[
            styles.slider,
            {
              width: TAB_WIDTH,
              transform: [{ translateX }],
            },
          ]}
        />

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <Pressable key={index} style={[styles.tab, { width: TAB_WIDTH }]} onPress={() => router.push(tab.route)}>
            <Text style={[styles.tabText, index === activeIndex && styles.activeText]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f2f4",
    borderRadius: 8,
  },
  slider: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 6,
    zIndex: 1,
  },
  tabText: {
    color: "#555",
    fontWeight: "500",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
});
