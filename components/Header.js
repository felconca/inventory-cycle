import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from "react-native";
import { APP_URL } from "../api";
import { router } from "expo-router";
export default function Header({ users }) {
  return (
    <View style={styles.header}>
      <StatusBar animated={true} backgroundColor="#61dafb" barStyle={"dark-content"} />
      <View style={styles.title}>
        <Image source={require("../logo.png")} style={{ width: 30, height: 30 }} />
        <View>
          <Text style={styles.titleText}>GMMRGLS | SC</Text>
          <Text style={styles.titleSm}>General Ledger System Scanner</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.profile} onPress={() => router.navigate("/main/profile")}>
        {users && users.user_img ? (
          <Image source={{ uri: `${APP_URL}/dump_px/${users.user_img}` }} style={styles.profileImg} />
        ) : (
          <Image source={require("../user.png")} style={styles.profileImg} />
        )}
      </TouchableOpacity>
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
});
