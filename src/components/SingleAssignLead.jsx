// import React from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';

// const SingleAssignLead = ({
//   visible,
//   userList,
//   selectedUser,
//   setSelectedUser,
//   onAssign,
//   onClose,
// }) => {
//   return (
//     <Modal
//       transparent
//       visible={visible}
//       animationType="fade"
//       onRequestClose={onClose}>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Assign Lead To:</Text>

//           <FlatList
//             data={userList}
//             keyExtractor={item => item.id.toString()}
//             style={styles.flatList}
//             contentContainerStyle={{paddingBottom: rh(1)}}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 style={[
//                   styles.userItem,
//                   selectedUser?.id === item.id && styles.selectedItem,
//                 ]}
//                 onPress={() => setSelectedUser(item)}>
//                 <Text
//                   style={[
//                     styles.userName,
//                     selectedUser?.id === item.id && {color: '#fff'},
//                   ]}>
//                   {item.name}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           />

//           <TouchableOpacity style={styles.assignButton} onPress={onAssign}>
//             <Text style={styles.assignButtonText}>Assign</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={onClose}>
//             <Text style={styles.closeButton}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default SingleAssignLead;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: rw(85),
//     backgroundColor: '#fff',
//     borderRadius: rw(3),
//     padding: rw(5),
//     maxHeight: rh(80),
//   },
//   modalTitle: {
//     fontSize: rf(2.2),
//     fontWeight: 'bold',
//     marginBottom: rh(1.5),
//     textAlign: 'center',
//   },
//   flatList: {
//     maxHeight: rh(40),
//   },
//   userItem: {
//     paddingVertical: rh(1.2),
//     paddingHorizontal: rw(4),
//     borderRadius: rw(2),
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginVertical: rh(0.5),
//   },
//   selectedItem: {
//     backgroundColor: '#02519F',
//     borderColor: '#02519F',
//   },
//   userName: {
//     fontSize: rf(2),
//     color: '#333',
//     textAlign: 'center',
//   },
//   assignButton: {
//     backgroundColor: '#2D87DB',
//     paddingVertical: rh(1.5),
//     borderRadius: rw(2),
//     marginTop: rh(2),
//   },
//   assignButtonText: {
//     textAlign: 'center',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: rf(2),
//   },
//   closeButton: {
//     marginTop: rh(1.5),
//     textAlign: 'center',
//     fontSize: rf(1.8),
//     color: 'red',
//   },
// });

// import React, {useState} from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
// } from 'react-native';
// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';

// const SingleAssignLead = ({
//   visible,
//   userList,
//   selectedUser,
//   setSelectedUser,
//   onAssign,
//   onClose,
// }) => {
//   const [searchText, setSearchText] = useState('');

//   const filteredList =
//     searchText.length >= 3
//       ? userList.filter(user =>
//           user.name.toLowerCase().includes(searchText.toLowerCase()),
//         )
//       : [];

//   return (
//     <Modal
//       transparent
//       visible={visible}
//       animationType="fade"
//       onRequestClose={onClose}>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Assign Lead To:</Text>

//           <TextInput
//             placeholder="Enter at least 3 letters to search"
//             value={searchText}
//             onChangeText={setSearchText}
//             style={styles.searchInput}
//           />

//           {searchText.length >= 3 && (
//             <FlatList
//               data={filteredList}
//               keyExtractor={item => item.id.toString()}
//               style={styles.flatList}
//               contentContainerStyle={{paddingBottom: rh(1)}}
//               keyboardShouldPersistTaps="handled"
//               renderItem={({item}) => (
//                 <TouchableOpacity
//                   style={[
//                     styles.userItem,
//                     selectedUser?.id === item.id && styles.selectedItem,
//                   ]}
//                   onPress={() => setSelectedUser(item)}>
//                   <Text
//                     style={[
//                       styles.userName,
//                       selectedUser?.id === item.id && {color: '#fff'},
//                     ]}>
//                     {item.name}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           )}

//           <TouchableOpacity style={styles.assignButton} onPress={onAssign}>
//             <Text style={styles.assignButtonText}>Assign</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={onClose}>
//             <Text style={styles.closeButton}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default SingleAssignLead;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: rw(85),
//     backgroundColor: '#fff',
//     borderRadius: rw(3),
//     padding: rw(5),
//     maxHeight: rh(80),
//   },
//   modalTitle: {
//     fontSize: rf(2.2),
//     fontWeight: 'bold',
//     marginBottom: rh(1.5),
//     textAlign: 'center',
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: rw(2),
//     paddingHorizontal: rw(3),
//     paddingVertical: rh(1),
//     marginBottom: rh(1),
//     fontSize: rf(2),
//   },
//   flatList: {
//     maxHeight: rh(40),
//   },
//   userItem: {
//     paddingVertical: rh(1.2),
//     paddingHorizontal: rw(4),
//     borderRadius: rw(2),
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginVertical: rh(0.5),
//   },
//   selectedItem: {
//     backgroundColor: '#02519F',
//     borderColor: '#02519F',
//   },
//   userName: {
//     fontSize: rf(2),
//     color: '#333',
//     textAlign: 'center',
//   },
//   assignButton: {
//     backgroundColor: '#2D87DB',
//     paddingVertical: rh(1.5),
//     borderRadius: rw(2),
//     marginTop: rh(2),
//   },
//   assignButtonText: {
//     textAlign: 'center',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: rf(2),
//   },
//   closeButton: {
//     marginTop: rh(1.5),
//     textAlign: 'center',
//     fontSize: rf(1.8),
//     color: 'red',
//   },
//   hintText: {
//     textAlign: 'center',
//     color: '#999',
//     marginVertical: rh(1),
//     fontSize: rf(1.8),
//   },
// });

import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const SingleAssignLead = ({
  visible,
  userList,
  selectedUser,
  setSelectedUser,
  onAssign,
  onClose,
  leadType, // 👈 yaha receive karo
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedLeadOption, setSelectedLeadOption] = useState(null);
  const [assignFresh, setAssignFresh] = useState(false);
  const [includeHistory, setIncludeHistory] = useState(false);

  useEffect(() => {
    if (leadType) {
      setSelectedLeadOption({
        id: leadType.toLowerCase(),
        label: leadType.charAt(0).toUpperCase() + leadType.slice(1), // "lead" → "Lead"
      });
    }
  }, [leadType, visible]);

  const filteredList =
    searchText.length >= 3
      ? userList.filter(user =>
          user.name.toLowerCase().includes(searchText.toLowerCase()),
        )
      : [];

  const renderRadioButton = selected => (
    <View style={styles.radioButton}>
      {selected && <View style={styles.radioButtonSelected} />}
    </View>
  );

  const renderCheckbox = checked => (
    <View style={styles.checkbox}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );

  const handleAssign = () => {
    // Convert selections to numeric values
    const leadDataValue = selectedLeadOption?.label === 'Lead' ? 2 : 1; // Lead = 2, Data = 1
    const freshAssignValue = assignFresh ? 1 : 0; // Checked = 1, Unchecked = 0
    const viewHistoryValue = includeHistory ? 1 : 0; // Checked = 1, Unchecked = 0

    const payload = {
      userId: selectedUser?.id,
      leadOrData: leadDataValue,
      freshAssign: freshAssignValue,
      viewHistory: viewHistoryValue,
    };

    console.log('📦 Assign Payload:---------------------', payload);

    onAssign(payload);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Assign Lead To:</Text>

          <TextInput
            placeholder="Enter at least 3 letters to search"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />

          {searchText.length >= 3 && (
            <FlatList
              data={filteredList}
              keyExtractor={item => item.id.toString()}
              style={styles.flatList}
              contentContainerStyle={{paddingBottom: rh(1)}}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.userItem,
                    selectedUser?.id === item.id && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedUser(item)}>
                  <Text
                    style={[
                      styles.userName,
                      selectedUser?.id === item.id && {color: '#fff'},
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Ye part sirf tab dikhana jab user select ho */}
          {selectedUser && (
            <View style={styles.additionalOptions}>
              <Text style={styles.sectionTitle}>Select Option:</Text>

              <View style={styles.radioButtonRow}>
                {['Lead', 'Data'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOptionItem}
                    onPress={() =>
                      setSelectedLeadOption({
                        id: option.toLowerCase(),
                        label: option,
                      })
                    }>
                    {renderRadioButton(selectedLeadOption?.label === option)}
                    <Text style={styles.radioOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Assign Fresh Checkbox */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setAssignFresh(!assignFresh)}>
                {renderCheckbox(assignFresh)}
                <Text style={styles.optionText}>Assign Fresh</Text>
              </TouchableOpacity>

              {/* Include History Checkbox */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setIncludeHistory(!includeHistory)}>
                {renderCheckbox(includeHistory)}
                <Text style={styles.optionText}>Show History</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.assignButton,
              (!selectedUser || !selectedLeadOption) && {
                backgroundColor: '#aaa',
              },
            ]}
            onPress={handleAssign}
            disabled={!selectedUser || !selectedLeadOption}>
            <Text style={styles.assignButtonText}>Assign</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SingleAssignLead;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: rw(85),
    backgroundColor: '#fff',
    borderRadius: rw(3),
    padding: rw(5),
    maxHeight: rh(80),
  },
  modalTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    marginBottom: rh(1.5),
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: rw(2),
    paddingHorizontal: rw(3),
    paddingVertical: rh(1),
    marginBottom: rh(1),
    fontSize: rf(2),
  },
  flatList: {
    maxHeight: rh(40),
  },
  userItem: {
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(4),
    borderRadius: rw(2),
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: rh(0.5),
  },
  selectedItem: {
    backgroundColor: '#02519F',
    borderColor: '#02519F',
  },
  userName: {
    fontSize: rf(2),
    color: '#333',
    textAlign: 'center',
  },
  assignButton: {
    backgroundColor: '#2D87DB',
    paddingVertical: rh(1.5),
    borderRadius: rw(2),
    marginTop: rh(2),
  },
  assignButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: rf(2),
  },
  closeButton: {
    marginTop: rh(1.5),
    textAlign: 'center',
    fontSize: rf(1.8),
    color: 'red',
  },

  // ✅ New styles
  additionalOptions: {
    marginTop: rh(2),
    paddingTop: rh(1),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: rf(2),
    fontWeight: 'bold',
    marginBottom: rh(1),
    color: '#333',
  },
  radioButtonRow: {
    flexDirection: 'row',
    marginBottom: rh(1),
  },
  radioOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: rw(5),
  },
  radioOptionText: {
    fontSize: rf(1.9),
    marginLeft: rw(2),
    color: '#333',
  },
  radioButton: {
    width: rw(5),
    height: rw(5),
    borderRadius: rw(2.5),
    borderWidth: 2,
    borderColor: '#02519F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: rw(2.5),
    height: rw(2.5),
    borderRadius: rw(1.25),
    backgroundColor: '#02519F',
  },
  checkbox: {
    width: rw(5),
    height: rw(5),
    borderWidth: 2,
    borderColor: '#02519F',
    borderRadius: rw(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#02519F',
    fontSize: rf(1.7),
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: rh(0.5),
  },
  optionText: {
    fontSize: rf(1.9),
    marginLeft: rw(2),
    color: '#333',
  },
});
