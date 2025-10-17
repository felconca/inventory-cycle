import React from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import AnimatedTabs from "../../components/AnimatedTabs";
import Header from "../../components/Header";
import * as SecureStore from "expo-secure-store";

export default function ItemsList() {
  const [users, setUsers] = React.useState("");
  const tabs = [
    { label: "Receiving", route: "/main/receiving" },
    { label: "Stocktaking", route: "/main/stocktaking" },
    { label: "Items List", route: "/main/itemlist" },
  ];

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setUsers(JSON.parse(result));
    }
  }
  getValueFor("loggedIn");
  return (
    <View style={styles.container}>
      <Header users={users} />
      <AnimatedTabs tabs={tabs} />
      <Text>Items List</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
