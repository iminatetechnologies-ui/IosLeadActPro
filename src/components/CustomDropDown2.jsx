import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CustomDropDown = ({data = [], value, setValue, placeholder}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value || null);

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  const handleSelect = item => {
    setValue(item);
    setSelectedItem(item);
    setExpanded(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.selectedBox}
        onPress={toggleDropdown}>
        <Text style={styles.selectedText}>
          {selectedItem ? selectedItem.label : placeholder || 'Select an item'}
        </Text>

        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="black"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.dropdown]}>
          <ScrollView nestedScrollEnabled>
            {data.map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.item}
                onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    zIndex: 99,
    marginTop: 10,
  },

  selectedBox: {
    backgroundColor: '#ebedf0',
    height: 51,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    fontSize: 14,
    color: '#000',
  },

  dropdown: {
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 0.6,
    borderColor: '#d0d0d0',
    paddingBottom: 8,
    maxHeight: 240,
  },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  itemText: {
    fontSize: 14,
    color: '#000',
  },
});

export default CustomDropDown;
