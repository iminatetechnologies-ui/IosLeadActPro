import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CustomDropDown = ({
  data,
  value,
  onSelect,
  placeholder,
  error,
  errorMessage,
  searchPlaceholder = 'Search...',
  maxHeight = 250,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value || null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setSelectedItem(value || null);
  }, [value]);

  const handlePress = () => {
    setExpanded(!expanded);
    setSearchText('');
  };

  const handleSelect = item => {
    setSelectedItem(item);
    setExpanded(false);
    if (onSelect) onSelect(item);
  };

  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.accordion, error && styles.errorBorder]}
        onPress={handlePress}>
        <Text style={styles.titleText}>
          {selectedItem
            ? selectedItem.label
            : placeholder || 'Select an option'}
        </Text>

        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="black"
        />
      </TouchableOpacity>

      {/* Dropdown Area */}
      {expanded && (
        <View style={[styles.dropdown, {maxHeight}]}>
          {/* Show Search only if items > 8 */}
          {data.length > 8 && (
            <View style={styles.searchBoxContainer}>
              <Icon
                name="search"
                size={16}
                color="#555"
                style={{marginRight: 6}}
              />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder={searchPlaceholder}
                placeholderTextColor="#999"
                style={styles.searchInput}
              />
            </View>
          )}

          <ScrollView nestedScrollEnabled>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.listItem}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.itemTitle}>{item.label}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noDataView}>
                <Text style={styles.noDataText}>No results found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
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

  accordion: {
    backgroundColor: '#ebedf0',
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleText: {
    fontSize: 14,
    color: '#000',
  },

  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 0.7,
    borderColor: '#d0d0d0',
    elevation: 3,
    overflow: 'hidden',
  },

  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
    margin: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },

  listItem: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  itemTitle: {
    fontSize: 14,
    color: '#000',
  },

  noDataView: {
    alignItems: 'center',
    padding: 12,
  },

  noDataText: {
    color: '#999',
    fontSize: 13,
  },

  errorBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomDropDown;
