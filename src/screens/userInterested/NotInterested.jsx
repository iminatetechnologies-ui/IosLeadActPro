import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LeadCardContact from './../../components/LeadCardContact';
import {FAB, Provider as PaperProvider, Checkbox} from 'react-native-paper';
import LeadCardContactPlaceholder from '../../components/LeadCardContactPlaceholder';
import {_get, _post} from './../../api/apiClient';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const NotInterestedLead = ({navigation, route}) => {
  const {userId} = route.params;

  const [data, setData] = useState({data: []});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visibleCount, setVisibleCount] = useState(100);

  const openAssignModal = () => {
    fetchUserList();
    setIsAssignModalVisible(true);
  };
  const closeAssignModal = () => {
    setIsAssignModalVisible(false);
    setSelectedUser(null); // 🔁 Reset selected user when modal closes
  };

  useEffect(() => {
    fetchData();
  }, []);

  // or get it from props or route.params

  const onRefreshh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await _get(`/notinterestedleadbyuser/${userId}`);
      const result = response?.data;
      if (result) {
        setData(result);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const response = await _get(`/notinterestedleadbyuser/${userId}`);
      const result = response?.data;
      if (result) {
        setData(result);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCallPress = item => {
    const mobile = item?.mobile;
    Linking.openURL(`tel:${mobile}`)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          Linking.openURL(`tel:${mobile}`);
          navigation.replace('ContactDetails2', {item});
        }
      })
      .catch(err => console.log(err));
  };

  const handleSmsPress = item => {
    const mobile = item?.mobile;
    const url = `sms:${mobile}`;
    Linking.openURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'Unable to open the messaging app.');
        }
      })
      .catch(err => console.error('Error opening messaging app:', err));
  };

  const handleWhatsappPress = item => {
    const mobile = item?.mobile;
    const url = `https://wa.me/${mobile}`;
    Linking.openURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'WhatsApp is not installed on your device.');
        }
      })
      .catch(err => console.error('Error opening WhatsApp:', err));
  };

  // Toggle selection of item ID in the selectedIds array
  const toggleSelection = id => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Toggle Select All / Deselect All
  // const toggleSelectAll = () => {
  //   if (selectedIds.length === data?.data.length) {
  //     // All selected, so clear all
  //     setSelectedIds([]);
  //   } else {
  //     // Select all
  //     const allIds = data?.data.map(item => item.id) || [];
  //     setSelectedIds(allIds);
  //   }
  // };
  const toggleSelectAll = () => {
    const visibleItems = data?.data.slice(0, visibleCount) || [];
    const visibleIds = visibleItems.map(item => item.id);

    const isAllVisibleSelected = visibleIds.every(id =>
      selectedIds.includes(id),
    );

    if (isAllVisibleSelected) {
      // Deselect only visible ones
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Add visible ones (avoid duplicates)
      setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await _get('/userlist');

      console.log('User List Response-->:', response.data);

      if (Array.isArray(response.data.data)) {
        setUserList(response.data.data);
      } else {
        setUserList([]);
      }

      setIsAssignModalVisible(true);
    } catch (error) {
      console.error('Error fetching user list:', error);
      setUserList([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) {
      alert('Please select a user to assign.');
      return;
    }

    const payload = {
      userid: selectedUser.id,
      lead_id: selectedIds, // or 'selectedIds' depending on backend key
    };

    //console.log('📦 Payload being sent:', payload);

    try {
      const response = await _post('/multiassignleads', payload);
      console.log('✅ Lead assigned successfully:', response.data);
      alert('Lead assigned successfully!');
      closeAssignModal();
    } catch (error) {
      console.error(
        '❌ Error assigning lead:',
        error?.response?.data || error.message || error,
      );
      alert('Failed to assign lead. Please try again.');
    }
  };

  // Check select all / partial state
  // const isAllSelected =
  //   selectedIds.length === data?.data.length && data?.data.length > 0;
  // const isPartialSelected =
  //   selectedIds.length > 0 && selectedIds.length < data?.data.length;
  const visibleItems = data?.data.slice(0, visibleCount) || [];
  const visibleIds = visibleItems.map(item => item.id);

  const isAllSelected = visibleIds.every(id => selectedIds.includes(id));
  const isPartialSelected =
    selectedIds.some(id => visibleIds.includes(id)) && !isAllSelected;

  const renderItem = ({item}) => {
    const isSelected = selectedIds.includes(item.id);
    const showCheckbox = selectedIds.length > 0; // Show checkboxes only if some item selected

    return (
      <View style={{flex: 1}}>
        <LeadCardContact
          title={item?.name || 'Unknown'}
          email={item?.email || '-'}
          mobile={item?.mobile}
          lead_id={item?.id}
          item={item}
          source={item?.source || '-'}
          created_date={item?.created_date || '-'}
          project={item?.project || '-'}
          oncardPress={() => {
            if (selectedIds.length > 0) {
              toggleSelection(item.id);
            } else {
              navigation.replace('LeadDetailsScreen', {item});
            }
          }}
          onCallPress={() => {
            if (selectedIds.length === 0) handleCallPress(item);
          }}
          onSmsPress={() => {
            if (selectedIds.length === 0) handleSmsPress(item);
          }}
          onWhatsappPress={() => {
            if (selectedIds.length === 0) handleWhatsappPress(item);
          }}
          onLongPress={() => toggleSelection(item.id)}
          isSelected={isSelected}
          showCheckbox={showCheckbox}
          onSelect={() => toggleSelection(item.id)}
          disableActions={selectedIds.length > 0} // 👈 Pass disable flag
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <FlatList
          data={Array.from({length: 8})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactPlaceholder />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <>
          {/* Show Select All checkbox only if some item is selected */}
          {selectedIds.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}>
              <Text style={{fontSize: 16}}>Select All</Text>
              <Checkbox
                status={
                  isAllSelected
                    ? 'checked'
                    : isPartialSelected
                    ? 'unchecked'
                    : 'unchecked'
                }
                onPress={toggleSelectAll}
                color="#239999"
              />
              {/* <Text style={{ fontSize: 16 }}>Select All</Text> */}
            </View>
          )}

        
          <FlatList
            data={data?.data.slice(0, visibleCount)} // Show only 'visibleCount' items
            refreshing={refreshing}
            onRefresh={onRefreshh}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              !isLoading && (
                <Text style={styles.emptyText}>No Notinterested leads found.</Text>
              )
            }
            ListFooterComponent={
              data?.data.length > visibleCount ? (
                <TouchableOpacity
                  onPress={() => setVisibleCount(prev => prev + 100)}
                  style={styles.seeMoreButton}>
                  <Text style={styles.seeMoreText}>See More</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </>
      )}

      <Modal
        transparent={true}
        visible={isAssignModalVisible}
        animationType="fade"
        onRequestClose={closeAssignModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Assign Lead To:</Text>

            <FlatList
              data={userList}
              keyExtractor={item => item.id.toString()}
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
                      selectedUser?.id === item.id && {color: 'white'},
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.assignButton}
              onPress={handleAssign}>
              <Text style={styles.assignButtonText}>Assign</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeAssignModal}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PaperProvider>
        <FAB
          style={styles.fab}
          icon="share"
          color="#ffffff"
          onPress={() => {
            if (selectedIds.length === 0) {
              Alert.alert('No selection', 'Please select at least one item.');
            } else {
              openAssignModal();
            }
          }}
        />
      </PaperProvider>
    </View>
  );
};

export default NotInterestedLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7FF',
  },
  list: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  loader: {
    flex: 1,
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: rw(85),
    backgroundColor: '#fff',
    borderRadius: rw(3),
    padding: rw(5),
  },
  modalTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    marginBottom: rh(1.5),
    textAlign: 'center',
  },
  userItem: {
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(4),
    borderRadius: rw(2),
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: rh(0.8),
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
    backgroundColor: '#2ecc71',
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
  seeMoreButton: {
    paddingVertical: 12,
    //backgroundColor: '#239999',
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  seeMoreText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
