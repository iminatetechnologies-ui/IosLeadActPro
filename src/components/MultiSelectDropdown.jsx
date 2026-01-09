


// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import Icon from "react-native-vector-icons/Feather";

// const MultiSelectDropdown = ({
//   data = [],
//   placeholder = "Select",
//   selectedValues = [],
//   onSelect = () => {},
//   error,
//   errorMessage,
//   searchPlaceholder = "Search...",
//   maxHeight = 280,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [selectedItems, setSelectedItems] = useState(
//     selectedValues && selectedValues.length ? selectedValues : []
//   );
//   const [searchText, setSearchText] = useState("");

//   const filteredData = data.filter(item =>
//     item.label.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const toggleDropdown = () => {
//     setExpanded(!expanded);
//     setSearchText("");
//   };

//   const handleSelect = (item) => {
//     const isSelected = selectedItems.some(i => i.value === item.value);

//     let updated;
//     if (isSelected) {
//       updated = selectedItems.filter(i => i.value !== item.value);
//     } else {
//       updated = [...selectedItems, item];
//     }

//     setSelectedItems(updated);
//     onSelect(updated);
//   };

//   const selectedLabelText =
//     selectedItems.length > 0
//       ? selectedItems.map(i => i.label).join(", ")
//       : placeholder;

//   return (
//     <View style={styles.container}>
//       {/* Selected Box */}
//       <TouchableOpacity
//         activeOpacity={0.7}
//         style={[styles.selectedBox, error ? styles.errorBorder : null]}
//         onPress={toggleDropdown}
//       >
//         <Text style={styles.selectedText} numberOfLines={1}>
//           {selectedLabelText}
//         </Text>

//         <Icon
//           name={expanded ? "chevron-up" : "chevron-down"}
//           size={18}
//           color="#000"
//         />
//       </TouchableOpacity>

//       {expanded && (
//         <View style={[styles.dropdown, { maxHeight }]}>
//           {/* Search */}
//           <View style={styles.searchBoxContainer}>
//             <Icon name="search" size={16} color="#555" style={{ marginRight: 6 }} />
//             <TextInput
//               value={searchText}
//               onChangeText={setSearchText}
//               placeholder={searchPlaceholder}
//               placeholderTextColor="#999"
//               style={styles.searchInput}
//             />
//           </View>

//           <ScrollView nestedScrollEnabled>
//             {filteredData.length > 0 ? (
//               filteredData.map(item => {
//                 const isChecked = selectedItems.some(
//                   i => i.value === item.value
//                 );

//                 return (
//                   <TouchableOpacity
//                     key={item.value}
//                     style={styles.item}
//                     onPress={() => handleSelect(item)}
//                     activeOpacity={0.6}
//                   >
//                     <View style={styles.row}>
//                       {/* ✅ CUSTOM CHECK DESIGN */}
//                       <Icon
//                         name={isChecked ? "check" : "circle"}
//                         size={20}
//                         color="#000"
//                         style={{ marginRight: 10 }}
//                       />

//                       <Text style={styles.itemText}>{item.label}</Text>
//                     </View>
//                   </TouchableOpacity>
//                 );
//               })
//             ) : (
//               <View style={styles.noDataView}>
//                 <Text style={styles.noDataText}>No results found</Text>
//               </View>
//             )}
//           </ScrollView>
//         </View>
//       )}

//       {error && errorMessage && (
//         <Text style={styles.errorText}>{errorMessage}</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 14,
//     zIndex: 99,
//     marginTop: 10,
//   },

//   selectedBox: {
//     backgroundColor: "#ebedf0",
//     height: 55,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   selectedText: {
//     fontSize: 14,
//     color: "#000",
//     flex: 1,
//     marginRight: 8,
//   },

//   dropdown: {
//     backgroundColor: "#fff",
//     marginTop: 5,
//     borderRadius: 10,
//     elevation: 3,
//     borderWidth: 0.6,
//     borderColor: "#d0d0d0",
//     paddingBottom: 8,
//   },

//   searchBoxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     height: 42,
//     margin: 8,
//     borderWidth: 1,
//     borderColor: "#d0d0d0",
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: "#000",
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   item: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },

//   itemText: {
//     fontSize: 15,
//     color: "#000",
//   },

//   noDataView: {
//     padding: 12,
//     alignItems: "center",
//   },

//   noDataText: {
//     fontSize: 13,
//     color: "#999",
//   },

//   errorBorder: {
//     borderWidth: 1,
//     borderColor: "red",
//   },

//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginTop: 5,
//     marginLeft: 4,
//   },
// });

// export default MultiSelectDropdown;


import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const MultiSelectDropdown = ({
  data = [],
  placeholder = "Select",
  selectedValues = [],
  onSelect = () => {},
  error,
  errorMessage,
  searchPlaceholder = "Search...",
  maxHeight = 280,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedItems, setSelectedItems] = useState(
    selectedValues && selectedValues.length ? selectedValues : []
  );
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleDropdown = () => {
    setExpanded(!expanded);
    setSearchText("");
  };

  const handleSelect = (item) => {
    const isSelected = selectedItems.some(i => i.value === item.value);

    let updated;
    if (isSelected) {
      updated = selectedItems.filter(i => i.value !== item.value);
    } else {
      updated = [...selectedItems, item];
    }

    setSelectedItems(updated);
    onSelect(updated);
  };

  const selectedLabelText =
    selectedItems.length > 0
      ? selectedItems.map(i => i.label).join(", ")
      : placeholder;

  return (
    <View style={styles.container}>
      {/* Selected box */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.selectedBox, error ? styles.errorBorder : null]}
        onPress={toggleDropdown}
      >
        <Text style={styles.selectedText} numberOfLines={1}>
          {selectedLabelText}
        </Text>

        <Icon
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#000"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.dropdown, { maxHeight }]}>
          {/* Search */}
          <View style={styles.searchBoxContainer}>
            <Icon name="search" size={16} color="#555" style={{ marginRight: 6 }} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder={searchPlaceholder}
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>

          <ScrollView nestedScrollEnabled>
            {filteredData.length > 0 ? (
              filteredData.map(item => {
                const isChecked = selectedItems.some(
                  i => i.value === item.value
                );

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.item}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.row}>
                      {/* ✅ SQUARE CHECKBOX */}
                      <View style={styles.checkbox}>
                        {isChecked && (
                          <Icon name="check" size={14} color="#000" />
                        )}
                      </View>

                      <Text style={styles.itemText}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
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

  selectedBox: {
    backgroundColor: "#ebedf0",
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedText: {
    fontSize: 14,
    color: "#000",
    flex: 1,
    marginRight: 8,
  },

  dropdown: {
    backgroundColor: "#fff",
    marginTop: 5,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 0.6,
    borderColor: "#d0d0d0",
    paddingBottom: 8,
  },

  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
    margin: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 3, // square with slight curve
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  itemText: {
    fontSize: 15,
    color: "#000",
  },

  noDataView: {
    padding: 12,
    alignItems: "center",
  },

  noDataText: {
    fontSize: 13,
    color: "#999",
  },

  errorBorder: {
    borderWidth: 1,
    borderColor: "red",
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default MultiSelectDropdown;
