import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomRow = ({ title, onPress, backgroundColor = '#ffffff' }) => {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress}>
      {/* Left Icon */}
     <MaterialCommunityIcons name="zigbee" size={24}/>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Arrow Icon */}
      {/* <MaterialCommunityIcons name="arrow-right" size={24}/> */}
      <Text style={{fontWeight:'500'}}>UPCOMING</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    //margin: 12,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft:10
    //textAlign: 'center',
  },
  rightIcon: {
    marginLeft: 16,
  },
});

export default CustomRow;
