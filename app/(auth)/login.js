import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { API_URL } from "../../api";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useAuth } from "../../context/auth";

export default function Login() {
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (form.username === "" || form.password === "") {
      ToastAndroid.show("Invalid username or password", ToastAndroid.SHORT);
    } else {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/mobile-api/api_login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!data || data.status == "error") {
          ToastAndroid.show("Invalid credentials", ToastAndroid.SHORT);
        } else {
          await SecureStore.setItemAsync("loggedIn", JSON.stringify(data));
          let result = SecureStore.getItemAsync("loginIn");
          let users = JSON.stringify(result);

          ToastAndroid.show(`Welcome ${data.user_alias || ""}`, ToastAndroid.SHORT);
          signIn(users);
        }
      } catch (error) {
        console.error("POST error:", error);
        ToastAndroid.show("Error connecting to server", ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        // Background Linear Gradient
        colors={["#001209", "#212529", "#55615B"]}
        style={styles.header}
      ></LinearGradient>
      <View style={styles.headerTextContainer}>
        <Image source={require("../../logo.png")} style={{ width: 80, height: 80 }} />
        <Text style={styles.headerTitle}>GMMRGLS | SC</Text>
        <Text style={styles.headerText}>General Ledger System Scanner</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.cardLogin}>
          <View style={styles.inputGrp}>
            <View style={styles.loginInput}>
              <AntDesign name="user" size={20} color="#001209" />
              <TextInput
                style={{ width: "100%" }}
                placeholder="Enter username"
                value={form.username}
                onChangeText={(text) => handleChange("username", text)}
              />
            </View>
            <View style={{ width: "100%", borderBottomWidth: 1, borderColor: "#ededed" }}></View>
            <View style={styles.loginInput}>
              <AntDesign name="lock" size={20} color="#001209" />
              <TextInput
                style={{ width: "100%" }}
                placeholder="Enter password"
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry={true}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
            {loading ? <ActivityIndicator color={"#fff"} /> : <Text style={styles.loginBtnText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
  },
  bodyContainer: {
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
    width: "100%",
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  headerTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardLogin: {
    marginTop: 10,
    top: 0,
    width: "100%",
    marginHorizontal: 20,
    borderRadius: 12,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
  },

  headerTitle: {
    fontSize: 40,
    fontWeight: 700,
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
  },
  inputGrp: {
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  loginInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  loginBtn: {
    position: "relative",
    backgroundColor: "#001209",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  loginBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: 500,
  },
  btnGradient: {},
});
