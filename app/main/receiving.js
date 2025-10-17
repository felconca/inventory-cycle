import React, { useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, TextInput } from "react-native";
import { API_URL, APP_URL } from "../../api";
import AnimatedTabs from "../../components/AnimatedTabs";
import Header from "../../components/Header";
import { FlashList } from "@shopify/flash-list";
import Feather from "@expo/vector-icons/Feather";
import DatePicker from "react-native-neat-date-picker";

const { width } = Dimensions.get("window");

export default function Home() {
  const formatDate = (date) => date.toISOString().split("T")[0];
  const [search, setSearch] = useState("");
  const [users, setUsers] = React.useState("");
  const [data, setData] = useState([]);
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo)); // e.g. "2025-09-15"
  const [endDate, setEndDate] = useState(formatDate(today));

  const [showDatePickerRange, setShowDatePickerRange] = useState(false);
  const openDatePickerRange = () => setShowDatePickerRange(true);

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

  // const data = [
  //   {
  //     id: "1",
  //     date: "25",
  //     monthYear: "DEC. 2025",
  //     name: "ADVENTIST MEDICAL CENTER-BACOLOD, INC.",
  //     address: "Manila",
  //     contact: "N/A",
  //     email: "N/A",
  //   },
  //   {
  //     id: "2",
  //     date: "26",
  //     monthYear: "DEC. 2025",
  //     name: "ST. LUKE'S MEDICAL CENTER",
  //     address: "Quezon City",
  //     contact: "09123456789",
  //     email: "info@stlukes.com",
  //   },
  //   {
  //     id: "3",
  //     date: "25",
  //     monthYear: "DEC. 2025",
  //     name: "ADVENTIST MEDICAL CENTER-BACOLOD, INC.",
  //     address: "Manila",
  //     contact: "N/A",
  //     email: "N/A",
  //   },
  //   {
  //     id: "4",
  //     date: "26",
  //     monthYear: "DEC. 2025",
  //     name: "ST. LUKE'S MEDICAL CENTER",
  //     address: "Quezon City",
  //     contact: "09123456789",
  //     email: "info@stlukes.com",
  //   },
  //   {
  //     id: "5",
  //     date: "25",
  //     monthYear: "DEC. 2025",
  //     name: "ADVENTIST MEDICAL CENTER-BACOLOD, INC.",
  //     address: "Manila",
  //     contact: "N/A",
  //     email: "N/A",
  //   },
  //   {
  //     id: "6",
  //     date: "26",
  //     monthYear: "DEC. 2025",
  //     name: "ST. LUKE'S MEDICAL CENTER",
  //     address: "Quezon City",
  //     contact: "09123456789",
  //     email: "info@stlukes.com",
  //   },
  //   {
  //     id: "7",
  //     date: "25",
  //     monthYear: "DEC. 2025",
  //     name: "ADVENTIST MEDICAL CENTER-BACOLOD, INC.",
  //     address: "Manila",
  //     contact: "N/A",
  //     email: "N/A",
  //   },
  //   {
  //     id: "8",
  //     date: "26",
  //     monthYear: "DEC. 2025",
  //     name: "ST. LUKE'S MEDICAL CENTER",
  //     address: "Quezon City",
  //     contact: "09123456789",
  //     email: "info@stlukes.com",
  //   },
  //   {
  //     id: "9",
  //     date: "25",
  //     monthYear: "DEC. 2025",
  //     name: "ADVENTIST MEDICAL CENTER-BACOLOD, INC.",
  //     address: "Manila",
  //     contact: "N/A",
  //     email: "N/A",
  //   },
  //   {
  //     id: "10",
  //     date: "26",
  //     monthYear: "DEC. 2025",
  //     name: "ST. LUKE'S MEDICAL CENTER",
  //     address: "Quezon City",
  //     contact: "09123456789",
  //     email: "info@stlukes.com",
  //   },
  // ];
  const handleGetReceiving = async (params) => {
    try {
      const res = await fetch(
        `${API_URL}/gls_v2/api/receiving_list?drstatus=${params.status}&supplier=${params.vendor}&startDate=${params.from}&endDate=${params.to}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let received = await res.json();
      setData(received);
      // console.log(await res.json());
    } catch (err) {
      console.error("API error:", err);
    }
  };
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();

    return data.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(lower)));
  }, [search, data]);

  const onConfirmRange = (output) => {
    setShowDatePickerRange(false);
    setStartDate(output.startDateString ?? "");
    setEndDate(output.endDateString ?? "");
    handleGetReceiving({ status: -1, vendor: -1, from: output.startDateString, to: output.endDateString });
  };
  const onCancelRange = () => {
    setShowDatePickerRange(false);
  };

  const drDate = (dateStr) => {
    if (!dateStr) return { day: "--", monthYear: "--" };

    // Split the date manually since Android fails to parse YYYY-MM-DD
    const [year, month, day] = dateStr.split("-").map(Number);

    if (!year || !month || !day) return { day: "--", monthYear: "--" };

    const date = new Date(year, month - 1, day); // month is 0-based

    const formattedDay = String(day).padStart(2, "0"); // e.g. "03"
    const monthName = date.toLocaleString("en-US", { month: "short" }).toUpperCase(); // "SEP"
    const formattedMonthYear = `${monthName} ${year}`;

    return { day: formattedDay, monthYear: formattedMonthYear };
  };

  React.useEffect(() => {
    handleGetReceiving({
      status: -1,
      vendor: -1,
      from: startDate,
      to: endDate,
    });
    getValueFor("loggedIn");
  }, []);

  const renderItem = ({ item }) => {
    const { day, monthYear } = drDate(item.DRDated);
    return (
      <TouchableOpacity style={styles.tblSheet}>
        <View style={styles.cardDate}>
          <Text style={{ color: "#0F0F0F", fontSize: 22, fontWeight: "700" }}>{day}</Text>
          <Text style={{ color: "#AFAFAF", fontSize: 10, fontWeight: "500" }}>{monthYear}</Text>
        </View>
        <View style={{ justifyContent: "center", paddingHorizontal: 10 }}>
          <Text style={{ width: 215, fontWeight: "700" }} numberOfLines={1} ellipsizeMode="tail">
            {item.vendor ? item.vendor : "---N/A---"}
          </Text>
          <Text style={{ width: 200, fontWeight: "400" }} numberOfLines={1} ellipsizeMode="tail">
            Address: {item.vendoradd} / Contact: {item.vendorphone}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header users={users} />
      <AnimatedTabs tabs={tabs} />
      <View style={{ flexDirection: "row", alignItems: "stretch", marginBottom: 10, gap: 6 }}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color="black" />
          <TextInput
            placeholder="Search"
            style={{ width: "100%", fontSize: 14 }}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={openDatePickerRange}>
          <Feather name="calendar" size={18} color="#001209" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "center",
          paddingHorizontal: 5,
          paddingBottom: 5,
          borderRadius: 100,
        }}
      >
        <Text style={{ color: "#AFAFAF" }}>Date: {startDate && `${startDate} ~ ${endDate}`}</Text>
      </View>
      <FlashList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={80}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30, color: "#999" }}>No matching records found</Text>
        }
      />

      <DatePicker isVisible={showDatePickerRange} mode={"range"} onCancel={onCancelRange} onConfirm={onConfirmRange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: StatusBar.currentHeight || 0,
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: width - 75,
    borderWidth: 1,
    borderColor: "#EDEDED",

    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 8,
  },
  filterBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 12,
    // backgroundColor: "#001209",
    // paddingVertical: 8,
    borderRadius: 8,
    width: "10%",
  },
});
