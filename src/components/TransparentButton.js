import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const TransparentButton = ({ 
  text, 
  onPress, 
  borderColor = "#000", 
  textColor = "#000", 
  borderWidth = 2, 
  style = {}, 
  textStyle = {} 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { borderColor: borderColor, borderWidth: borderWidth },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    //paddingLeft: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransparentButton;
