import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import React from 'react';
import CustomDropDown from '../CustomDropDown2'; // Make sure this is updated
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function RequestModal({
  visible,

  onSubmit,
  requestType,
  setRequestType,
  assignTo,
  setAssignTo,

  description,
  setDescription,
}) {
  const dropdownData = [
    {label: 'Lead', value: 'Lead'},
    {label: 'Data', value: 'Data'},
  ];

  const assignDropdownData = [
    {label: 'Admin', value: 'admin'},
    {label: 'Manager', value: 'manager'},
  ];

  return (
    visible && (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled">
          {/* Request Type Dropdown */}
          {/* <Text style={styles.title}>Request Type</Text> */}
          <CustomDropDown
            data={dropdownData}
            value={dropdownData.find(item => item.value === requestType)}
            setValue={item => setRequestType(item.value)}
            placeholder="Select Request Type"
          />

          {/* Assign To Dropdown */}
          {/* <Text style={styles.title}>Assign To</Text> */}
          <CustomDropDown
            data={assignDropdownData}
            value={assignDropdownData.find(item => item.value === assignTo)}
            setValue={item => setAssignTo(item.value)}
            placeholder="Select Assign"
          />

          {/* Description */}
          {/* <Text style={styles.title}>Description</Text> */}
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={5}
            placeholder="Enter detailed description..."
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: wp('0%'),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: wp('4.5%'),
    marginBottom: hp('1%'),
    fontWeight: '600',
    marginTop: hp('2%'),
    marginLeft: wp('1%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    fontSize: wp('3.5%'),
    height: hp('10%'),
    marginBottom: hp('2%'),
    marginLeft: wp('3%'),
    marginRight: wp('3%'),
    marginTop: hp('1%'),
  },
  submitButton: {
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',

    marginLeft: wp('3%'),
    marginRight: wp('3%'),
    marginTop: hp('1%'),
  },
  submitText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
});
