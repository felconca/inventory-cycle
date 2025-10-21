import { StatusBar, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { API_URL } from "../../api";
import filterDate from "../../filter-date";

export default function ReceivingModal() {
  const { id } = useLocalSearchParams();
  const [receiving, setReceiving] = useState([]);

  const handleReceivingInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/edit_receiving?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let received = await res.json();
      setReceiving(received);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  useEffect(() => {
    handleReceivingInfo();
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <Text style={styles.headerTitle}>DR#: {receiving.file_no}</Text>
          {handlePoStatus(receiving.DRStatus)}
        </View>
        <Text style={styles.headerInfo}>
          By: {receiving.fname + " " + receiving.lname} - {filterDate(receiving.DREntered, "MMM dd, yyyy")}
        </Text>
      </View>
      <View></View>
      <Text>Modal screen {JSON.stringify(receiving)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: StatusBar.currentHeight || 0,
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#001209",
  },
  headerInfo: {
    fontSize: 14,
    color: "#55615B",
  },
  badge: {
    fontWeight: 500,
    fontSize: 10,
    borderRadius: 100,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
});
