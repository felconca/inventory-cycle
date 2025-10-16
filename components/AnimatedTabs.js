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
  const TAB_WIDTH = (width - 30) / tabs.length;
  const TABS_WIDTH = (width - 35) / tabs.length;

  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: safeIndex * TABS_WIDTH,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, [safeIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Animated.View style={[styles.slider, { width: TABS_WIDTH, transform: [{ translateX }] }]} />
        {tabs.map((tab, index) => (
          <Pressable key={index} style={[styles.tab, { width: TABS_WIDTH }]} onPress={() => router.push(tab.route)}>
            <Text style={[styles.tabText, index === activeIndex && styles.activeText]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 8,
    width: width - 35,
  },
  tab: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 6,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#000",
    borderWidth: 2,
    borderColor: "#EDEDED",
  },
  tabText: {
    color: "#555",
    fontWeight: "400",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 20,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f1f2f4",
//     borderRadius: 5,
//     paddingHorizontal: 2,
//     paddingVertical: 15,
//   },
//   slider: {
//     position: "absolute",
//     height: "100%",
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     shadowColor: "#000",
//     paddingVertical: 20,

//     // shadowOpacity: 0.05,
//     // shadowRadius: 3,
//     // elevation: 2,
//   },
//   tab: {
//     alignItems: "center",
//     justifyContent: "center",
//     // paddingVertical: 5,
//     zIndex: 1,
//   },
//   tabText: {
//     color: "#555",
//     fontWeight: "400",
//   },
//   activeText: {
//     color: "#000",
//     fontWeight: "600",
//   },
// });
