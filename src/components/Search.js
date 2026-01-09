import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Search = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {/* <MaterialCommunityIcons name="search" size={40}/> */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or number"
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    //marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    //marginBottom: 16,
    backgroundColor: '#fff',
  },
});

export default Search;