import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,

  StatusBar,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Modal,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {_get, _post} from '../../api/apiClient';
import DeviceInfo from 'react-native-device-info';
import InventotyDetailsTab from './InventoryDetailsTab';
import CustomDropdown from '../../components/CustomDropDown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const isTablet = DeviceInfo.isTablet();

export default function InvetoryDetailsScreen({route, navigation}) {
  const {id} = route.params;
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalMessageType, setModalMessageType] = useState('success'); // success | error

  // Status options for dropdown
  const statusOptions = [
    {label: 'Available', value: 'available'},
    {label: 'Sold', value: 'sold'},
    {label: 'Under Negotiation', value: 'under_negotiation'},
    {label: 'Hold', value: 'hold'},
  ];

  useEffect(() => {
    getInventoryDetails();
  }, []);

  const getInventoryDetails = async () => {
    try {
      // console.log('Fetching inventory details for ID:', id);
      const response = await _get(`/getresaleinventorydetails/${id}`);
      console.log('Full API Response:', response);

      if (response.data && response.data.success === '1') {
        // console.log('Inventory Data:', response.data.data);
        setInventoryData(response.data.data);
        // Set current status as default
        setSelectedStatus(
          response.data.data.additional_info?.property_status || '',
        );
      } else {
        console.log('API success flag not 1');
      }
    } catch (error) {
      console.error('Inventory API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setUpdateLoading(true);
      setModalMessage('');

      const formData = new FormData();
      formData.append('property_status', selectedStatus);

      const updateResponse = await _post(`/resalestatus/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (updateResponse?.data?.success == '1') {
        ToastAndroid.show('Status updated successfully!', ToastAndroid.SHORT);
        setModalMessageType('success');
        setModalMessage('Status updated successfully!');

        setTimeout(() => {
          setModalVisible(false);
          setModalMessage('');
          getInventoryDetails(); // ONLY refresh data, no full reload
        }, 800);
      } else {
        const msg = updateResponse?.data?.message || 'Failed to update status';
        setModalMessageType('error');
        setModalMessage(msg);
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      }
    } catch (error) {
      const msg = error?.message || 'Something went wrong';
      setModalMessageType('error');
      setModalMessage(msg);
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#02519F" />
        <Text>Loading Inventory Details...</Text>
      </View>
    );
  }

  if (!inventoryData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data found</Text>
        <TouchableOpacity onPress={getInventoryDetails}>
          <Text style={{color: 'blue', marginTop: 10}}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={require('../../assets/images/loginback.jpeg')}
        style={{flex: 1}}
        resizeMode="contain">
        <View style={styles.container}>
          <LinearGradient
            colors={[
              'rgba(220, 239, 255, 0.0)',
              '#02519F',
              '#02519F',
              '#02519F',
            ]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.header}>
            {/* Back and Menu Icons */}
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons
                  name="chevron-left"
                  size={isTablet ? 30 : 35}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            {/* Profile and Info */}
            <View style={styles.headerContent}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitial}>
                  {inventoryData.owner_info?.owner_name
                    ? inventoryData.owner_info.owner_name
                        .charAt(0)
                        .toUpperCase()
                    : '-'}
                </Text>
              </View>
              <View>
                <Text style={styles.nameText}>
                  {inventoryData.owner_info?.owner_name || 'N/A'}
                </Text>
                <Text style={styles.statusText}>
                  Status :{' '}
                  {inventoryData.additional_info?.property_status || '-'}
                </Text>
                <Text style={styles.dateText}>
                  Property Type :{' '}
                  {inventoryData.basic_details?.property_type || '-'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.callShareContainer}>
              {/* <TouchableOpacity
                style={styles.callButton}
                // onPress={handleCallPress}
              >
                <MaterialIcons
                  name="call"
                  size={isTablet ? 25 : 20}
                  color="#fff"
                />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.shareButton}>
                <FontAwesome
                  name="share-alt"
                  size={isTablet ? 25 : 20}
                  color="green"
                />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <View style={styles.tabContainer}>
                <InventotyDetailsTab inventoryData={inventoryData} />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#0389ca'}]}
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.buttonText}>Update Status</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Property Status</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody}>
              {/* Status Dropdown */}
              <CustomDropdown
                data={statusOptions}
                onSelect={item => setSelectedStatus(item.value)}
                placeholder="Select Status"
                defaultValue={selectedStatus}
              />

              {/* Show Success / Error Message */}
              {modalMessage !== '' && (
                <Text
                  style={{
                    color: modalMessageType === 'success' ? 'green' : 'red',
                    textAlign: 'center',
                    marginTop: 10,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {modalMessage}
                </Text>
              )}

              {/* Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={loading}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.updateButton,
                    (!selectedStatus || loading) && {opacity: 0.5},
                  ]}
                  onPress={handleUpdateStatus}
                  disabled={!selectedStatus || loading}>
                  <Text style={styles.updateButtonText}>
                    {loading ? 'Updating...' : 'Update Status'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: rw(4),
    marginBottom: rh(5),
    marginTop: rh(8),
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isTablet ? rh(0) : rh(1),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: isTablet ? rw(1) : rw(2),
  },
  profileCircle: {
    width: isTablet ? rw(5) : rw(12),
    height: isTablet ? rw(5) : rw(12),
    borderRadius: isTablet ? rw(2.5) : rw(6),
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(2),
  },
  profileInitial: {
    color: '#fff',
    fontSize: isTablet ? rf(2) : rf(3),
    fontWeight: 'bold',
  },
  nameText: {
    color: '#002147',
    fontSize: isTablet ? rf(1.5) : rf(2),
    fontWeight: 'bold',
    marginRight: isTablet ? rw(10) : rw(12),
  },
  statusText: {
    color: '#fff',
    fontSize: isTablet ? rf(1.5) : rf(2),
  },
  dateText: {
    color: '#fff',
    fontSize: isTablet ? rf(1.5) : rf(2),
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#EDE7FF',
    borderTopRightRadius: isTablet ? rw(2) : rw(6),
    borderTopLeftRadius: isTablet ? rw(2) : rw(6),
    padding: isTablet ? rw(1) : rw(3),
    flexGrow: 1,
    paddingBottom: isTablet ? rh(1) : rh(1),
  },
  card: {
    width: '100%',
    borderRadius: rw(0),
    backgroundColor: '#EDE7FF',
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    padding: 0,
    backgroundColor: '#EDE7FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: rh(0),
    backgroundColor: 'white',
    padding: rw(0),
    paddingVertical: rh(0.5),
    borderRadius: isTablet ? rw(1) : rw(2),
    marginBottom: isTablet ? rh(0) : rh(0),
    marginTop: isTablet ? rh(0) : rh(0.7),
  },
  button: {
    flex: 1,
    paddingVertical: rh(1.7),
    borderRadius: isTablet ? rw(1) : rw(2),
    marginHorizontal: rw(1),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: isTablet ? rf(1) : rf(1.5),
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: rw(5),
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: rw(3),
    maxHeight: rh(60),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: rw(4),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: rf(2),
    fontWeight: 'bold',
    color: '#002147',
  },
  closeButton: {
    padding: rw(1),
  },
  modalBody: {
    padding: rw(4),
  },
  dropdownLabel: {
    marginTop: rh(1),
    marginLeft: rw(1),
    fontSize: rf(1.8),
    fontWeight: '600',
    color: '#002147',
    marginBottom: rh(1),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rh(3),
  },
  modalButton: {
    flex: 1,
    paddingVertical: rh(1.5),
    borderRadius: rw(2),
    marginHorizontal: rw(1),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  updateButton: {
    backgroundColor: '#0389ca',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontWeight: 'bold',
    fontSize: rf(1.6),
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: rf(1.6),
  },
  callShareContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: isTablet ? rw(2) : rw(5),
    marginBottom: rh(1.5),
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: isTablet ? rh(1) : rh(1),
    paddingHorizontal: isTablet ? rw(2) : rw(3),
    borderRadius: isTablet ? rw(0.5) : rw(2),
    marginRight: rw(2),
  },
  callButtonText: {
    color: '#fff',
    marginLeft: rw(2),
    fontWeight: 'bold',
    fontSize: isTablet ? rf(1.5) : rf(1.8),
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'green',
    paddingVertical: isTablet ? rh(1) : rh(1),
    paddingHorizontal: isTablet ? rw(2) : rw(3),
    borderRadius: isTablet ? rw(0.5) : rw(2),
  },
  shareButtonText: {
    color: 'green',
    marginLeft: rw(2),
    fontWeight: 'bold',
    fontSize: isTablet ? rf(1.5) : rf(1.8),
  },
});
