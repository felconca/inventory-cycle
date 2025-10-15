import { Text, View, StyleSheet, StatusBar, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { APP_URL } from "../api";

export default function Profile() {
  const [users, setUsers] = React.useState("");
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
      <View style={styles.profile}>
        <Image source={{ uri: `${APP_URL}/dump_px/${users.user_img}` }} style={styles.profileImg} />
      </View>
      <Text style={styles.userName}>{users.user_name}</Text>
      <Text style={styles.userType}>{users.user_type == "Admin" ? "Administrator" : users.user_type}</Text>
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
  },
  profile: {
    width: 105,
    height: 105,
    overflow: "hidden",
    borderRadius: "100%",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    backgroundColor: "#e4e4e4",
  },
  profileImg: {
    width: 100,
    height: 100,
  },
  userName: {
    fontSize: 18,
    fontWeight: 700,
  },
  userType: {
    fontSize: 12,
  },
});
