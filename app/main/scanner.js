import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, ToastAndroid } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [scannedData, setScannedData] = useState(null);
  const [cornerColor, setCornerColor] = useState("#FFFFFF"); // white default
  const [cardAnim] = useState(new Animated.Value(0));

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera permission</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={{ color: "white" }}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data, type }) => {
    if (scannedData) return;

    // Green if valid (has numbers), red otherwise
    const isValid = /\d/.test(data);
    setCornerColor(isValid ? "#00C853" : "#D50000"); // green or red

    setScannedData({ content: data, type });

    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Reset color after 2 seconds
    setTimeout(() => setCornerColor("#FFFFFF"), 2000);
  };

  const toggleCameraFacing = () => {
    setFacing((cur) => (cur === "back" ? "front" : "back"));
  };

  const closeCard = () => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setScannedData(null));
  };

  const translateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  const handleAdd = async () => {
    const existing = await AsyncStorage.getItem("scannedItems");
    const list = existing ? JSON.parse(existing) : [];
    list.push(scannedData);
    await AsyncStorage.setItem("scannedItems", JSON.stringify(list));
    closeCard();
    ToastAndroid.show("Items added successfully!", ToastAndroid.SHORT, ToastAndroid.TOP);
    // router.replace("/"); // go back home
  };
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
      >
        {/* Scanner overlay (no full border, only corners) */}
        <View style={styles.overlay}>
          <View style={styles.frame}>
            <View style={[styles.cornerTL, { borderColor: cornerColor }]} />
            <View style={[styles.cornerTR, { borderColor: cornerColor }]} />
            <View style={[styles.cornerBL, { borderColor: cornerColor }]} />
            <View style={[styles.cornerBR, { borderColor: cornerColor }]} />
          </View>
        </View>
      </CameraView>

      {/* Flip Camera Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Info Card */}
      {scannedData && (
        <Animated.View style={[styles.infoCard, { transform: [{ translateY }], opacity: cardAnim }]}>
          <Text style={styles.itemTitle}>Scanned Code</Text>
          <Text style={styles.itemType}>Type: {scannedData.type}</Text>
          <Text style={styles.itemContent}>{scannedData.content}</Text>

          <View style={styles.qrContainer}>
            <QRCode value={scannedData.content || " "} size={100} backgroundColor="white" />
          </View>

          <View style={styles.btnGrp}>
            <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Code</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeCard} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnGrp: {
    flexDirection: "row",
    gap: 6,
  },

  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Scanner frame (no border)
  frame: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  // Corners only
  cornerTL: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },

  // Flip button
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  text: { fontSize: 18, color: "white" },

  // Floating info card
  infoCard: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    alignItems: "center",
  },
  itemTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  itemType: { fontSize: 14, color: "#555", marginBottom: 6 },
  itemContent: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: { color: "#333", fontWeight: "500" },
  addButtonText: { color: "#f0f0f0", fontWeight: "500" },
  addButton: {
    backgroundColor: "#0F0F0F",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
