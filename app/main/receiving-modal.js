import { Dimensions, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { API_URL, APP_URL } from "../../api";
import filterDate from "../../filter-date";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";

export default function ReceivingModal() {
  const { id, token } = useLocalSearchParams();
  const [receiving, setReceiving] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [activeField, setActiveField] = useState(null); // 'DRDated' or 'DRDueDate'

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
  const handleVendorList = async () => {
    try {
      const res = await fetch(`${APP_URL}/mobile-api/api_vendor`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const vendorsList = await res.json();
      // console.log("Vendors API result:", vendorsList);

      // Adjust based on API structure
      setVendors(vendorsList.data);
    } catch (err) {
      console.error("API error:", err);
    }
  };
  const handleDeptList = async () => {
    try {
      const res = await fetch(`${APP_URL}/mobile-api/api_center`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const departmentsList = await res.json();
      console.log("API result:", departmentsList);

      // Adjust based on API structure
      setDepartments(departmentsList.data);
    } catch (err) {
      console.error("API error:", err);
    }
  };
  const onChange = (event, selectedDate) => {
    if (!selectedDate) return;

    setReceiving((prev) => ({
      ...prev,
      [activeField]: selectedDate, // update the field dynamically
    }));

    setActiveField(null); // reset after selection
  };

  const showPicker = (field, currentDate) => {
    setActiveField(field);
    DateTimePickerAndroid.open({
      value: currentDate || new Date(),
      onChange,
      mode: "date",
      display: "spinner",
      is24Hour: true,
    });
  };

  useEffect(() => {
    handleReceivingInfo();
    handleVendorList();
    handleDeptList();
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
      <Text style={styles.pickerText}>Supplier</Text>
      <View style={styles.picker}>
        <Picker
          mode="dropdown"
          selectedValue={receiving.VendorRID}
          onValueChange={(value) => setReceiving({ ...receiving, VendorRID: value })}
        >
          <Picker.Item label="Select Vendor" value={0} color="#999" />
          {(vendors || []).map((item, index) => (
            <Picker.Item key={index} label={item.VendorName} value={item.VendorRID} />
          ))}
        </Picker>
      </View>
      <Text style={styles.pickerText}>Location</Text>
      <View style={styles.picker}>
        <Picker
          mode="dropdown"
          selectedValue={receiving.LocaRID}
          onValueChange={(value) => setReceiving({ ...receiving, LocaRID: value })}
        >
          <Picker.Item label="Select Departments" value={0} color="#999" />
          {(departments || []).map((item, index) => (
            <Picker.Item key={index} label={item.center} value={item.centerRID} />
          ))}
        </Picker>
      </View>
      <View
        style={{
          gap: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* DR DATE */}
        <View style={{ flex: 1 }}>
          <Text style={styles.pickerText}>DR Date</Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
            onPress={() => showPicker("DRDated", new Date(receiving.DRDated))}
            disabled={receiving.DRStatus > 1}
          >
            <TextInput
              style={{ flex: 1 }}
              placeholder="Select date"
              editable={false}
              value={filterDate(receiving.DRDated, "MMM dd, yyyy")}
            />
            <Feather name="calendar" size={16} color="#001209" />
          </Pressable>
        </View>

        {/* DUE DATE */}
        <View style={{ flex: 1 }}>
          <Text style={styles.pickerText}>DR Due Date</Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
            onPress={() => showPicker("DRDueDate", new Date(receiving.DRDueDate))}
            disabled={receiving.DRStatus > 1}
          >
            <TextInput
              style={{ flex: 1 }}
              placeholder="Select date"
              editable={false}
              value={filterDate(receiving.DRDueDate, "MMM dd, yyyy")}
            />
            <Feather name="calendar" size={16} color="#001209" />
          </Pressable>
        </View>
      </View>

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
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#EDEDED",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#EDEDED",
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pickerText: {
    fontWeight: "600",
    color: "#001209",
    marginBottom: 5,
    paddingLeft: 5,
  },
});
