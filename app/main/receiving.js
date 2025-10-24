import React, { useCallback, useMemo, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  RefreshControl,
  Animated,
  Modal,
} from "react-native";
import { API_URL, APP_URL } from "../../api";
import AnimatedTabs from "../../components/AnimatedTabs";
import Header from "../../components/Header";
import { FlashList } from "@shopify/flash-list";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DatePicker from "react-native-neat-date-picker";
import { router } from "expo-router";
import RBSheet from "react-native-raw-bottom-sheet";
import filterDate from "../../filter-date";

const { width } = Dimensions.get("window");

export default function Home() {
  const formatDate = (date) => date.toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [users, setUsers] = React.useState("");
  const [data, setData] = useState([]);
  const today = new Date();
  const refRBSheet = useRef([]);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo)); // e.g. "2025-09-15"
  const [endDate, setEndDate] = useState(formatDate(today));
  const [refreshing, setRefreshing] = useState(false);

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
        `${API_URL}/api/receiving_list?drstatus=${params.status}&supplier=${params.vendor}&startDate=${params.from}&endDate=${params.to}`,
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
      setData([]);
      // console.error("API error:", err);
    }
  };
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();

    return data.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(lower)));
  }, [search, data]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    handleGetReceiving({
      status: -1, // current status state
      vendor: -1, // current vendor/supplier
      from: startDate, // current start date state
      to: endDate, // current end date state
    }).finally(() => setRefreshing(false));
  }, [startDate, endDate]);

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

  const colorOptions = {
    headerColor: "#001209",
    dateTextColor: "#001209",
    backgroundColor: "#fff",
    weekDaysColor: "#02AA53",
    selectedDateBackgroundColor: "#02AA53",
    confirmButtonColor: "#02AA53",
  };

  const handleCreateReceiving = async () => {
    let url = `${API_URL}/api/add_receiving`;
    let receiving_obj = {
      location: 3,
      supplier: 0,
      poid: 0,
      userid: users.user_id,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receiving_obj),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        handleGetReceiving({
          status: -1,
          vendor: -1,
          from: startDate,
          to: endDate,
        });
        router.push({ pathname: "/main/receiving-modal", params: { id: data.receiving_id } });
      })
      .catch((error) => {
        console.error("Error:", error); // Handle any errors
      });
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

  const handlePoStatus = async (key) => {
    let poStatus = "";
    switch (key) {
      case 0:
        poStatus = <Text style={[styles.badge, { backgroundColor: "#0dcaf0" }]}>NEW DR</Text>;
        break;
      case 1:
        poStatus = <Text style={[styles.badge, { backgroundColor: "#ffc107", color: "#001209" }]}>PENDING</Text>;
        break;
      case 3:
        poStatus = <Text style={[styles.badge, { backgroundColor: "#001209" }]}>RECEIVED</Text>;
        break;
      case 8:
        poStatus = <Text style={[styles.badge, { backgroundColor: "#dc4c64" }]}>CANCELLED</Text>;
        break;
      case 9:
        poStatus = <Text style={[styles.badge, { backgroundColor: "#02AA53" }]}>CLOSED</Text>;
        break;
      case 10:
        poStatus = <Text style={[styles.badge, { backgroundColor: "#02AA53" }]}>CLOSED</Text>;
        break;

      default:
        break;
    }
    return poStatus;
  };

  // list rendered
  const renderItem = ({ item, index }) => {
    const { day, monthYear } = drDate(item.DRDated);
    return (
      <View>
        <TouchableOpacity
          style={styles.tblSheet}
          onPress={() => refRBSheet.current[index].open()}
          // onPress={() => router.push({ pathname: "/main/receiving-modal", params: { id: item.RecRID } })}
        >
          <View style={styles.cardDate}>
            <Text style={{ color: "#0F0F0F", fontSize: 22, fontWeight: "700" }}>{day}</Text>
            <Text style={{ color: "#AFAFAF", fontSize: 10, fontWeight: "500" }}>{monthYear}</Text>
          </View>
          <View style={{ justifyContent: "center", paddingHorizontal: 10 }}>
            <Text style={{ width: 215, fontWeight: "700" }} numberOfLines={1} ellipsizeMode="tail">
              DR #{item.fileno}: {item.vendor ? item.vendor : "---N/A---"}
            </Text>
            <Text style={{ width: 200, fontWeight: "400" }} numberOfLines={1} ellipsizeMode="tail">
              Address: {item.vendoradd} / Contact: {item.vendorphone}
            </Text>
          </View>
        </TouchableOpacity>

        <RBSheet
          ref={(ref) => (refRBSheet.current[index] = ref)}
          height={"auto"}
          draggable={true}
          dragOnContent={true}
          customStyles={{
            container: {
              backgroundColor: "#fff",
              borderTopRightRadius: 32,
              borderTopLeftRadius: 32,
            },
            draggableIcon: {
              backgroundColor: "#001209",
            },
          }}
        >
          <View style={styles.bottomSheetContainer}>
            <View
              style={{ flexDirection: "row", alignItems: "end", justifyContent: "space-between", marginBottom: 10 }}
            >
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                <Text style={{ fontWeight: "700", fontSize: 22 }}>DR #{item.fileno}</Text>
                {handlePoStatus(item.DRStatus)}
              </View>
              <View>
                <Text style={{ fontWeight: "600", fontSize: 12 }}>{filterDate(item.DREntered, "MMM dd, yyyy")}</Text>
                <Text style={{ fontWeight: "400", fontSize: 12 }}>By: {item.userby_sname}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontWeight: "600", fontSize: 12 }}>{item.vendor ? item.vendor : "---N/A---"}</Text>
              <Text style={{ fontWeight: "400", fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">
                {item.vendoradd} | {item.vendorphone}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "stretch",
                justifyContent: "center",
                marginBottom: 10,
                gap: 6,
              }}
            >
              <TouchableOpacity
                style={[styles.btnBottomSheet, { backgroundColor: "#02AA53", gap: 6, paddingHorizontal: 16 }]}
                onPress={() => {
                  router.push({
                    pathname: "/main/receiving-modal",
                    params: { id: item.RecRID, token: users.user_token },
                  });
                  refRBSheet.current[index].close();
                }}
              >
                <FontAwesome6 name="edit" size={16} color="#fff" />
                <Text style={{ color: "#fff", textAlign: "center" }}>Edit Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnBottomSheet, { gap: 6, paddingHorizontal: 16 }]}>
                <FontAwesome6 name="check-circle" size={16} color="#fff" />
                <Text style={{ color: "#fff", textAlign: "center" }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnBottomSheet, { gap: 6, paddingHorizontal: 16 }]}>
                <FontAwesome6 name="xmark-circle" size={16} color="#fff" />
                <Text style={{ color: "#fff", textAlign: "center" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.btnBottomSheet, { backgroundColor: "#dc4c64", gap: 6, paddingHorizontal: 16 }]}
            >
              <FontAwesome6 name="trash-alt" size={16} color="#fff" />
              <Text style={{ color: "#fff", textAlign: "center" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
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
      {/* <View
        style={{
          justifyContent: "center",
          paddingHorizontal: 5,
          paddingBottom: 5,
          borderRadius: 100,
        }}
      >
        <Text style={{ color: "#AFAFAF" }}>Date: {startDate && `${startDate} ~ ${endDate}`}</Text>
      </View> */}
      {/* list */}
      <FlashList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={80}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#001209"]} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30, color: "#999" }}>No matching records found</Text>
        }
      />
      <TouchableOpacity style={styles.floatingButton} onPress={handleCreateReceiving}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* date-picker */}
      <DatePicker
        isVisible={showDatePickerRange}
        mode={"range"}
        onCancel={onCancelRange}
        onConfirm={onConfirmRange}
        colorOptions={colorOptions}
      />
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
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    backgroundColor: "#02AA53", // Example color
    borderRadius: 30,
    elevation: 8, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSheetContainer: {
    padding: 20,
  },
  badge: {
    fontWeight: 500,
    fontSize: 10,
    borderRadius: 100,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  btnBottomSheet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#001209",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
  },
});
