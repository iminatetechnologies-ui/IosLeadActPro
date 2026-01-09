import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DateRangePicker from './DatePicker';
import CustomDropDown from './CustomDropDown';
import MultiSelectDropdown from './MultiSelectDropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getUserType} from '../utils/getUserType';

const FilterCalldata = ({
  visible,
  onClose,
  onApply,
  onDateRangeChange,
  userList,
  selectedUser,
  setSelectedUser,
  userTypeOptions,
  selectedUserType,
  setSelectedUserType,
}) => {
  const [usertype, setUsertype] = useState(null);
  const [loading, setLoading] = useState(false); // 🔥 apply filter loader

  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  const handleApply = async () => {
    setLoading(true);
    try {
      await onApply();
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching usertype
  if (usertype === null) {
    return (
      <Modal visible={visible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.loaderBox]}>
            <ActivityIndicator size="large" color="#0058aa" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType={usertype === 'company' ? 'slide' : 'fade'}
      transparent>
      <View
        style={[
          styles.modalOverlay,
          usertype !== 'company' && styles.centerOverlay,
        ]}>
        <View
          style={[
            styles.modalContainer,
            usertype === 'company' ? styles.companyModal : styles.centerModal,
          ]}>
          {/* Drag handle (company bottom-sheet style) */}

          <View style={styles.handleWrapper}>
            <View style={styles.handleLine}/>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Apply Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.dropdownLabel}>Select Date Range</Text>
            <DateRangePicker onRangeChange={onDateRangeChange} />

            {(usertype === 'company' || usertype === 'team_owner') && (
              <>
                <Text style={styles.dropdownLabel}>Filter by User Type</Text>
                <CustomDropDown
                  data={userTypeOptions}
                  selectedValue={selectedUserType}
                  onSelect={setSelectedUserType}
                />

                <Text style={styles.dropdownLabel}>Filter by User</Text>
                <MultiSelectDropdown
                  data={userList}
                  selectedValues={selectedUser}
                  onSelect={setSelectedUser}
                  placeholder="Select Users"
                />
              </>
            )}
          </ScrollView>

          {/* Footer Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton, loading && {opacity: 0.7}]}
              onPress={handleApply}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.applyText}>Apply Filters</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000050',
    justifyContent: 'flex-end',
  },
  centerOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    overflow: 'hidden',
  },
  companyModal: {
    height: hp('65%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignSelf: 'stretch',
  },
  centerModal: {
    height: hp('40%'),
    width: wp('90%'),
    alignSelf: 'center',
  },
  header: {
    padding: wp('3%'),
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    right: wp('2%'),
    padding: wp('1%'),
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: wp('5%'),
    paddingBottom: hp('4%'),
  },
  dropdownLabel: {
    marginTop: hp('1.5%'),
    fontSize: wp('4.2%'),
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.6%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontSize: wp('4.3%'),
    fontWeight: '600',
  },
  loaderBox: {
    height: hp('30%'),
    width: wp('80%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleWrapper: {
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  handleLine: {
    width: wp('15%'),
    height: hp('0.4%'),
    borderRadius: 10,
    backgroundColor: '#a0a0a0',
  },
});

export default FilterCalldata;
