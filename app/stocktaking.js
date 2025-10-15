import React from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import AnimatedTabs from "../components/AnimatedTabs";
import Header from "../components/Header";
import * as SecureStore from "expo-secure-store";

export default function StockTaking() {
  const [users, setUsers] = React.useState("");
  const tabs = [
    { label: "Receiving", route: "/receiving" },
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
      <Text>Stock taking</Text>
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
});
