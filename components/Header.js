import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from "react-native";
import { APP_URL } from "../api";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Header({ users }) {
  const [imageUri, setImageUri] = React.useState(`${APP_URL}/dump_px/${users.user_img}`);
  const defaultImage = require("../user.png"); // Local default image

  const handleImageError = () => {
    setImageUri(Image.resolveAssetSource(defaultImage).uri); // Update to default image URI
  };
  return (
    <View style={styles.header}>
      <View style={styles.title}>
        <Image source={require("../logo.png")} style={{ width: 30, height: 30 }} />
        <View>
          <Text style={styles.titleText}>GMMRGLS | SC</Text>
          <Text style={styles.titleSm}>General Ledger System Scanner</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={styles.scanBtn} onPress={() => router.navigate("/main/scanner")}>
          <AntDesign name="scan" size={24} color="#001209" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profile} onPress={() => router.navigate("/main/profile")}>
          {users && users.user_img ? (
            <Image source={{ uri: imageUri }} onError={handleImageError} style={styles.profileImg} />
          ) : (
            <Image source={require("../user.png")} style={styles.profileImg} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 0,
  },
  titleSm: {
    fontSize: 10,
  },
  profile: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    width: 35,
    height: 35,
    backgroundColor: "#f1f1f1",
    borderRadius: "100%",
    overflow: "hidden",
  },
  profileImg: {
    width: 30,
    height: 30,
  },
  scanBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#e4e4e4",
    width: 35,
    height: 35,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    overflow: "hidden",
  },
});
