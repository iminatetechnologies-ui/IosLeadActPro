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
import DeviceInfo from 'react-native-device-info';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getUserType} from '../utils/getUserType';

const FilterModal = ({
  visible,
  onClose,
  onApply,
  onDateRangeChange,

  sourcesList,
  selectedSource,
  setSelectedSource,

  projectList,
  selectedProject,
  setSelectedProject,

  userList,
  selectedUser,
  setSelectedUser,

  propertyTypeList,
  selectedPropertyType,
  setSelectedPropertyType,

  leadTypeList,
  selectedLeadType,
  setSelectedLeadType,

  budgetList,
  selectedBudget,
  setSelectedBudget,

  customerTypeList,
  selectedCustomerType,
  setSelectedCustomerType,

  cityList,
  selectedCity,
  setSelectedCity,

  userTypeOptions,
  selectedUserType,
  setSelectedUserType,

  selectedDateType,
  setSelectedDateType, // 🆕 new
}) => {
  const [usertype, setUsertype] = useState(null);
  const isTablet = DeviceInfo.isTablet();

  // Loader for Apply Filters button
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  // Error state
  const [userError, setUserError] = useState(false);

  // Jab Modal open hoga → Error ON
  useEffect(() => {
    if (visible) {
      setUserError(true);
    }
  }, [visible]);

  // Jab UserType select hoga → Error OFF
  useEffect(() => {
    if (selectedUserType) {
      setUserError(false);
    }
  }, [selectedUserType]);

  // Apply filter handler
  const handleApply = async () => {
    try {
      setLoading(true);
      await onApply(); // parent API call
    } finally {
      setLoading(false);
    }
  };

  if (usertype === null) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0058aa" />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.handleWrapper}>
            <View style={styles.handleLine} />
          </View>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>Apply Filters</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                <Ionicons name="close" size={30} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              isTablet && styles.scrollContentTablet,
            ]}
            showsVerticalScrollIndicator={false}>
            <View style={isTablet ? styles.twoColumnWrap : null}>
              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>Select Activity Type</Text>
                <CustomDropDown
                  data={[
                    {label: 'Created Date', value: 'created'},
                    {label: 'Updated Date', value: 'updated'},
                    {label: 'Reminder Date', value: 'reminder'},
                  ]}
                  selectedValue={selectedDateType}
                  onSelect={setSelectedDateType}
                />
              </View>
              <View style={isTablet ? styles.columnItem : null}>
                <Text
                  style={{
                    marginTop: hp('1%'),
                    fontWeight: '600',
                    fontSize: isTablet ? wp('2%') : wp('3.5%'),
                    marginBottom: isTablet ? hp('1%') : hp('-1%'),
                  }}>
                  Select Date Range
                </Text>

                <DateRangePicker onRangeChange={onDateRangeChange} />
              </View>

              {(usertype === 'company' || usertype === 'team_owner') && (
                <>
                  <View style={isTablet ? styles.columnItem : null}>
                    <Text style={styles.dropdownLabel}>
                      Filter by User Type
                    </Text>
                    <CustomDropDown
                      data={userTypeOptions}
                      selectedValue={selectedUserType}
                      onSelect={setSelectedUserType}
                    />
                  </View>

                  <View style={isTablet ? styles.columnItem : null}>
                    <Text style={styles.dropdownLabel}>Filter by User</Text>
                    <MultiSelectDropdown
                      data={selectedUserType ? userList : []}
                      selectedValues={selectedUser}
                      onSelect={setSelectedUser}
                      placeholder="Select Users"
                      disabled={!selectedUserType}
                    />
                    {userError && !selectedUserType && (
                      <Text style={styles.helperText}>
                        Please select User Type first
                      </Text>
                    )}
                  </View>
                </>
              )}

              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>Filter by Source</Text>
                <MultiSelectDropdown
                  data={sourcesList} // API/state list
                  selectedValues={selectedSource} // selected array
                  onSelect={setSelectedSource} // setSelectedSource updates array
                  placeholder="Select Sources"
                />
              </View>

              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>Filter by Project</Text>
                <MultiSelectDropdown
                  data={projectList} // API/state list
                  selectedValues={selectedProject} // selected array
                  onSelect={setSelectedProject} // setSelectedProject updates array
                  placeholder="Select Projects"
                />
              </View>

              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>
                  Filter by Property Type
                </Text>
                <CustomDropDown
                  data={propertyTypeList}
                  selectedValue={selectedPropertyType}
                  onSelect={setSelectedPropertyType}
                />
              </View>

              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>Filter by Lead Type</Text>
                <CustomDropDown
                  data={leadTypeList}
                  selectedValue={selectedLeadType}
                  onSelect={setSelectedLeadType}
                />
              </View>

              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>Filter by Budget</Text>
                <CustomDropDown
                  data={budgetList}
                  selectedValue={selectedBudget}
                  onSelect={setSelectedBudget}
                />
              </View>

              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>
                  Filter by Customer Type
                </Text>
                <CustomDropDown
                  data={customerTypeList}
                  selectedValue={selectedCustomerType}
                  onSelect={setSelectedCustomerType}
                />
              </View>

              <View style={isTablet ? styles.columnItem : null}>
                <Text style={styles.dropdownLabel}>Filter by City</Text>
                <CustomDropDown
                  data={cityList}
                  selectedValue={selectedCity}
                  onSelect={setSelectedCity}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton, loading && {opacity: 0.7}]}
              onPress={handleApply}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
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

const isTablet = DeviceInfo.isTablet(); // 🔁 Reusable constant

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000050',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    height: hp('85%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    overflow: 'hidden',
  },
  header: {
    padding: wp('2%'),
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: isTablet ? wp('2%') : wp('4.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    padding: wp('1%'),
  },
  scrollContent: {
    padding: wp('4%'),
    paddingBottom: hp('2%'),
    paddingTop: hp('0%'),
  },
  scrollContentTablet: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('5%'),
  },
  dropdownLabel: {
    marginTop: hp('0.5%'),
    fontWeight: '600',
    fontSize: isTablet ? wp('2%') : wp('3.5%'),
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: isTablet ? hp('1%') : wp('5%'),
    paddingTop: isTablet ? hp('1%') : wp('3.5%'),
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#0389ca',
    paddingVertical: isTablet ? hp('1.8%') : hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    width: '100%',
  },
  applyText: {
    color: '#fff',
    fontSize: isTablet ? wp('1.5%') : wp('4.3%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleWrapper: {
    alignItems: 'center',
    paddingVertical: hp('0%'),
    marginTop: hp('1%'),
  },
  handleLine: {
    width: wp('15%'),
    height: hp('0.4%'),
    borderRadius: 10,
    backgroundColor: '#a0a0a0ff',
  },

  // 📱 Tablet-specific layout
  twoColumnWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  columnItem: {
    width: '48%',
    marginBottom: hp('2%'),
  },
  helperText: {
    color: 'red',
    fontSize: isTablet ? wp('1.5%') : wp('3%'),
    marginTop: hp('0%'),
    textAlign: 'left',
    marginLeft: wp('4%'),
  },
});

export default FilterModal;
