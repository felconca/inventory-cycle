import React from "react";
import * as SecureStore from "expo-secure-store";
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity } from "react-native";
import { API_URL, APP_URL } from "../api";
import AnimatedTabs from "../components/AnimatedTabs";
import Header from "../components/Header";

export default function Home() {
  const [users, setUsers] = React.useState("");
  const tabs = [
    { label: "Receiving", route: "/" },
    { label: "Stocktaking", route: "/stocktaking" },
  ];

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setUsers(JSON.parse(result));
    } else {
      alert("No values stored under that key.");
    }
  }
  getValueFor("loggedIn");
  return (
    <View style={styles.container}>
      <Header users={users} />
      <AnimatedTabs tabs={tabs} />
      <View style={styles.body}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    // justifyContent: "center",
  },
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
    justifyContent: "space-between",
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
