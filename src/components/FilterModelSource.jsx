import React from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import DatePicker from './DatePicker';
import CustomDropDown from './CustomDropDown';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FilterModal = ({
  visible,
  onClose,
  onApply,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  sourcesList,
  selectedSource,
  setSelectedSource,
  projectList,
  selectedProject,
  setSelectedProject,
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Apply Filters</Text>

        <Text style={styles.dropdownLabel}>From Date</Text>
        <DatePicker label={null} onDateChange={setFromDate} />

        <Text style={styles.dropdownLabel}>To Date</Text>
        <DatePicker label={null} onDateChange={setToDate} />

        <Text style={styles.dropdownLabel}>Filter by Source</Text>
        <CustomDropDown
          data={sourcesList}
          selectedValue={selectedSource}
          onSelect={setSelectedSource}
        />

        <Text style={styles.dropdownLabel}>Filter by Project</Text>
        <CustomDropDown
          data={projectList}
          selectedValue={selectedProject}
          onSelect={setSelectedProject}
        />

        <TouchableOpacity style={styles.applyButton} onPress={onApply}>
          <Text style={styles.applyText}>Apply Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: wp('5%'),
    backgroundColor: 'white',
    flex: 1,
  },
  modalTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign:'center'
  },
  dropdownLabel: {
    marginTop: hp('1.5%'),
    fontSize: wp('4.2%'),
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#0058aa',
    paddingVertical: hp('1.6%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  applyText: {
    color: '#fff',
    fontSize: wp('4.3%'),
    textAlign: 'center',
  },
  cancelText: {
    color: 'red',
    marginTop: hp('2%'),
    textAlign: 'center',
    fontSize: wp('4%'),
  },
});

export default FilterModal;