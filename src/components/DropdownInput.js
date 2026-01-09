import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Install if needed

const DropdownTextInput = ({ value, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <TextInput
        style={styles.input}
        value={value} // Non-editable value
        editable={false} // Prevents text input
        pointerEvents="none" // Ensures no keyboard opens
      />
      <Icon name="arrow-drop-down" size={24} color="gray" style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light grey background
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginVertical: 5,
    marginHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginLeft: 10,
  },
});

export default DropdownTextInput;