import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { API_URL, APP_URL } from "../../api";
import AnimatedTabs from "../../components/AnimatedTabs";
import Header from "../../components/Header";

const { width } = Dimensions.get("window");

export default function Home() {
  const [users, setUsers] = React.useState("");
  const [data, setData] = useState([]);
  const tabs = [
    { label: "Receiving", route: "/main/receiving" },
    { label: "Stocktaking", route: "/main/stocktaking" },
  ];

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setUsers(JSON.parse(result));
    }
  }

  React.useEffect(() => {
    setData([
      {
        id: "1",
        date: "25",
        monthYear: "DEC. 2025",
        name: "ADVENTIST MEDICAL CENTER-BACOLOD, INC.",
        address: "Manila",
        contact: "N/A",
        email: "N/A",
      },
      {
        id: "2",
        date: "26",
        monthYear: "DEC. 2025",
        name: "ST. LUKE'S MEDICAL CENTER",
        address: "Quezon City",
        contact: "09123456789",
        email: "info@stlukes.com",
      },
    ]);
    getValueFor("loggedIn");
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tblSheet}>
      <View style={styles.cardDate}>
        <Text style={{ color: "#0F0F0F", fontSize: 22, fontWeight: "700" }}>{item.date}</Text>
        <Text style={{ color: "#AFAFAF", fontSize: 10, fontWeight: "500" }}>{item.monthYear}</Text>
      </View>
      <View style={{ justifyContent: "center", paddingHorizontal: 10 }}>
        <Text style={{ width: 215, fontWeight: "700" }} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={{ width: 200, fontWeight: "400" }} numberOfLines={1} ellipsizeMode="tail">
          Address: {item.address} / Contact: {item.contact} / Email: {item.email}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header users={users} />
      <AnimatedTabs tabs={tabs} />
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} estimatedItemSize={80} />
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
  body: {
    flex: 1,
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
  tblSheet: {
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 8,
    gap: 5,
    width: width - 35,
    borderWidth: 1,
    borderColor: "#EDEDED",
    marginBottom: 10,
  },
  cardDate: {
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});
