import { Text, View, StyleSheet, StatusBar, Image, TouchableOpacity, ToastAndroid, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { APP_URL } from "../../api";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useAuth } from "../../context/auth";

export default function Profile() {
  const { signOut } = useAuth();
  const [users, setUsers] = React.useState("");
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setUsers(JSON.parse(result));
    }
  }
  getValueFor("loggedIn");

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await SecureStore.deleteItemAsync("loggedIn");
            ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
            signOut();
          },
        },
      ],
      { cancelable: false } // Prevents dismissal by tapping outside
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={{ uri: `${APP_URL}/dump_px/${users.user_img}` }} style={styles.profileImg} />
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.userName}>{users.user_name}</Text>
        <Text style={styles.userType}>
          {users.user_type == "ADMIN" || users.user_type == "admin" || users.user_type == "Admin"
            ? "Administrator"
            : users.user_type}
        </Text>
      </View>
      <View style={styles.listBox}>
        <View
          style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingVertical: 20, alignItems: "center" }}
        >
          <AntDesign name="info-circle" size={14} color="black" />
          <Text style={{ color: "#001209" }}>Version 1.0</Text>
        </View>
        <View style={{ borderBottomWidth: 1, borderColor: "#e4e4e4" }}></View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingVertical: 20, alignItems: "center" }}
        >
          <AntDesign name="logout" size={14} color="#dc4c64" />
          <Text style={{ color: "#dc4c64" }}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    textAlign: "center",
  },
  listBox: {
    borderWidth: 1,
    borderColor: "#e4e4e4",
    width: "100%",
    borderRadius: 8,
  },
});
