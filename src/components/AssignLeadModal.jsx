import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const AssignLeadModal = ({
  visible,
  onClose,
  onAssign,
  selectedIds,
  userList,
  selectedUser,
  setSelectedUser,
  assigning,
  leadDataOptions = [], // New prop for lead data options
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedLeadOption, setSelectedLeadOption] = useState(null);
  const [assignFresh, setAssignFresh] = useState(false);
  const [includeHistory, setIncludeHistory] = useState(false);

  const filteredList =
    searchText.length >= 3
      ? userList?.filter(user =>
          user.name.toLowerCase().includes(searchText.toLowerCase()),
        )
      : [];

  const handleAssign = () => {
    // Convert selections to numeric values
    const leadDataValue = selectedLeadOption?.id === 'lead' ? 2 : 1; // Lead = 2, Data = 1
    const freshAssignValue = assignFresh ? 1 : 0; // Checked = 1, Unchecked = 0
    const viewHistoryValue = includeHistory ? 1 : 0; // Checked = 1, Unchecked = 0

    const payload = {
      userId: selectedUser?.id,
      leadOrData: leadDataValue,
      freshAssign: freshAssignValue,
      viewHistory: viewHistoryValue,
      // optional extra info for parent
    };
    console.log('📦 Assign Payload multipal (Modal):', payload);
    onAssign(payload);
  };

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

  const renderAdditionalOptions = () => {
    if (!selectedUser) return null;

    const defaultLeadDataOptions = [
      {id: 'lead', label: 'Lead'},
      {id: 'data', label: 'Data'},
    ];

    const optionsToShow =
      leadDataOptions.length > 0 ? leadDataOptions : defaultLeadDataOptions;

    return (
      <View style={styles.additionalOptions}>
        <Text style={styles.sectionTitle}>Select Option:</Text>

        {/* Lead Data Options with Radio Buttons - Same Row */}
        <View style={styles.radioButtonRow}>
          {optionsToShow.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioOptionItem}
              onPress={() => setSelectedLeadOption(option)}
              disabled={assigning}>
              {renderRadioButton(selectedLeadOption?.id === option.id)}
              <Text style={styles.radioOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Assign Fresh Checkbox */}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setAssignFresh(!assignFresh)}
          disabled={assigning}>
          {renderCheckbox(assignFresh)}
          <Text style={styles.optionText}>Assign Fresh</Text>
        </TouchableOpacity>

        {/* History Checkbox */}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setIncludeHistory(!includeHistory)}
          disabled={assigning}>
          {renderCheckbox(includeHistory)}
          <Text style={styles.optionText}>Show History</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <View style={styles.modalContainer}>
            <FlatList
              data={filteredList}
              keyExtractor={item => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              ListHeaderComponent={
                <>
                  <Text style={styles.modalTitle}>
                    Assign {selectedIds.length} Lead(s) To:
                  </Text>
                  <TextInput
                    placeholder=" Enter at least 3 letters to search"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                </>
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.userItem,
                    selectedUser?.id === item.id && styles.selectedItem,
                  ]}
                  onPress={() => setSelectedUser(item)}
                  disabled={assigning}>
                  <Text
                    style={[
                      styles.userName,
                      selectedUser?.id === item.id && {color: 'white'},
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <>
                  {renderAdditionalOptions()}
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.assignButton,
                        (assigning || !selectedUser || !selectedLeadOption) && {
                          backgroundColor: '#aaa',
                        },
                      ]}
                      onPress={handleAssign}
                      disabled={
                        assigning || !selectedUser || !selectedLeadOption
                      }>
                      {assigning ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.assignButtonText}>Assign</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} disabled={assigning}>
                      <Text style={styles.closeButton}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AssignLeadModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
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
    marginBottom: rh(1),
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: rw(2),
    paddingHorizontal: rw(3),
    paddingVertical: rh(1),
    fontSize: rf(2),
    marginBottom: rh(1),
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
    marginTop: rh(0),
  },
  assignButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: rf(2),
  },
  closeButton: {
    marginTop: rh(1),
    textAlign: 'center',
    fontSize: rf(1.8),
    color: 'red',
    fontWeight: 'bold',
  },
  hintText: {
    textAlign: 'center',
    color: '#777',
    marginVertical: rh(1),
  },
  modalButtonContainer: {
    marginTop: rh(1),
  },
  // New styles for additional options
  additionalOptions: {
    marginTop: rh(1),
    paddingTop: rh(1),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: rf(2),
    fontWeight: 'bold',
    marginBottom: rh(0),
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: rh(0.5),
    marginVertical: rh(0.3),
  },
  optionText: {
    fontSize: rf(1.9),
    color: '#333',
    marginLeft: rw(3),
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
  // New styles for radio buttons in same row
  radioButtonRow: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    paddingVertical: rh(1),
    marginVertical: rh(0.5),
  },
  radioOptionItem: {
    flexDirection: 'row',
    // alignItems: 'flex-star',
    flex: 1,
    justifyContent: 'flex-start',
  },
  radioOptionText: {
    fontSize: rf(1.9),
    color: '#333',
    marginLeft: rw(2),
  },
});
