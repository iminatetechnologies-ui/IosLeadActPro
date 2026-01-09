import React from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import MaterialIcons for icons
import { clearStorage, clearUserData } from "./EncryptedStorageUtil";

const CustomHeader = ({navigation}) => {
  // Handle Logout Button
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => {
        clearStorage()
        navigation.navigate("Login");
      },
    }
    ]);
  };

  // Handle Notification Button
  const handleNotification = () => {
    Alert.alert("Notification", "You clicked the notification icon!");
  };

  return (
    <View style={styles.headerContainer}>
      {/* Logout Icon */}
      <TouchableOpacity onPress={handleLogout} style={styles.iconContainer}>
        <Icon name="logout" size={24} color="white" />
      </TouchableOpacity>

      {/* Header Title */}
      {/* <Text style={styles.headerTitle}>Custom Header</Text> */}

      {/* Notification Icon */}
      <TouchableOpacity
        onPress={handleNotification}
        style={styles.iconContainer}
      >
        <Icon name="notifications" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0389ca", // Light green background
    paddingHorizontal: 10,
    height: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  iconContainer: {
    padding: 5,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomHeader;
