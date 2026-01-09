import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {_get, _post} from '../../api/apiClient';
import {showError} from './../../components/FlashMessage';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';
import AssignLeadModal from '../../components/AssignLeadModal';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {getUserType} from '../../utils/getUserType';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const TodayScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [selectedIds, setSelectedIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usertype, setUsertype] = useState(null);
  const [leadCount, setLeadCount] = useState();

  // console.log('---------------', leadCount);

  useEffect(() => {
    fetchData();
    //fetchUsertype();
  }, []);
  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await _get('/gettodaycallback');
      const result = response?.data?.data;
      const count = response?.data?.leadcount ?? 0;
      setLeadCount(count);
      if (Array.isArray(result)) {
        setData(result);
      } else {
        showError('No data found.');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await _get('/gettodaycallback');
      const result = response?.data?.data;
      const count = response?.data?.leadcount ?? 0;
      setLeadCount(count);
      if (Array.isArray(result)) {
        setData(result);
      } else {
        showError('No data found.');
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  const toggleSelection = id => {
    if (usertype !== 'company') return;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const fetchUserList = async () => {
    try {
      const response = await _get('/userlist');
      setUserList(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      setUserList([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user to assign.');
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert('Error', 'Please select at least one lead.');
      return;
    }

    try {
      await _post('/multiassignleads', {
        userid: selectedUser.id,
        lead_id: selectedIds,
      });
      Alert.alert('Success', 'Leads assigned successfully!');
      setSelectedIds([]);
      setSelectedUser(null);
      setIsAssignModalVisible(false);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to assign leads.');
    }
  };

  const handleCallPress = item => {
    const mobile = item?.mobile;
    if (!mobile) {
      Alert.alert('Error', 'Phone number is not available');
      return;
    }
    Linking.openURL(`tel:${mobile}`).catch(() =>
      Alert.alert('Error', 'Unable to open the dialer.'),
    );
    navigation.navigate('ContactDetails2', {item});
  };

  const handleSmsPress = item => {
    Linking.openURL(`sms:${item?.mobile}`).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    Linking.openURL(`https://wa.me/${item?.mobile}`).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed on your device.'),
    );
  };

  const renderItem = ({item}) => {
    const isSelected = selectedIds.includes(item.id);
    const showCheckbox = selectedIds.length > 0;

    return (
      <LeadCardContactCallBack
        follow_up={item?.reminder_date || '-'}
        title={item?.name || 'Unknown'}
        subtitle={item?.email || '-'}
        mobile={item?.mobile}
        lead_id={item?.id}
        item={item}
        leadtype={item?.lead_type}
        source={item?.source || '-'}
        substatus_name={item?.substatus_name || '-'}
        team_owner={
          usertype === 'company' || usertype === 'team_owner'
            ? item?.lead_owner || 'Unknown'
            : null
        }
        oncardPress={() => {
          if (usertype === 'company' && selectedIds.length > 0) {
            toggleSelection(item.id);
          } else {
            navigation.navigate('ContactDetails2', {item});
          }
        }}
        onCallPress={() => handleCallPress(item)}
        onSmsPress={() => handleSmsPress(item)}
        onWhatsappPress={() => handleWhatsappPress(item)}
        onLongPress={() => {
          if (usertype === 'company') toggleSelection(item.id);
        }}
        isSelected={isSelected}
        showCheckbox={showCheckbox}
        onSelect={() => toggleSelection(item.id)}
      />
    );
  };

  const visibleItems = data.slice(0, visibleCount);
  const visibleIds = visibleItems.map(item => item.id);
  const areAllVisibleSelected = visibleIds.every(id =>
    selectedIds.includes(id),
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.leadCountText}> {leadCount} records Found</Text>

        {isLoading ? (
          <FlatList
            data={Array.from({length: 8})}
            keyExtractor={(_, index) => index.toString()}
            renderItem={() => <LeadCardContactCallBackPlaceholder />}
            contentContainerStyle={styles.list}
          />
        ) : (
          <>
            {selectedIds.length > 0 && (
              <View style={styles.selectAllContainer}>
                <TouchableOpacity
                  onPress={() => {
                    if (areAllVisibleSelected) {
                      setSelectedIds(prev =>
                        prev.filter(id => !visibleIds.includes(id)),
                      );
                    } else {
                      setSelectedIds(prev => {
                        const newIds = visibleIds.filter(
                          id => !prev.includes(id),
                        );
                        return [...prev, ...newIds];
                      });
                    }
                  }}>
                  <Text style={styles.selectAllText}>
                    {areAllVisibleSelected ? 'Unselect All' : 'Select All'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.selectionCounter}>
                  <Text style={styles.selectionCounterText}>
                    {selectedIds.length} Selected
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setSelectedIds([])}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              data={visibleItems}
              refreshing={refreshing}
              onRefresh={onRefresh}
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No Callback leads found.</Text>
              }
              ListFooterComponent={
                data.length > visibleCount ? (
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

        {/* <FAB
          style={styles.fab}
          icon={
            usertype === 'company'
              ? selectedIds.length > 0
                ? 'share'
                : 'plus'
              : 'plus'
          }
          color="#fff"
          onPress={() => {
            if (usertype === 'company') {
              if (selectedIds.length === 0) {
                navigation.navigate('AddContact');
              } else {
                fetchUserList();
                setIsAssignModalVisible(true);
              }
            } else {
              navigation.navigate('AddContact');
            }
          }}
        /> */}
        {usertype === 'company' && selectedIds.length > 0 && (
          // <PaperProvider>
            <FAB
              style={styles.fab}
              icon="share"
              color="#fff"
              onPress={() => {
                fetchUserList();
                setIsAssignModalVisible(true);
              }}
            />
          // </PaperProvider>
        )}

        <AssignLeadModal
          visible={isAssignModalVisible}
          onClose={() => {
            setIsAssignModalVisible(false);
            setSelectedUser(null);
          }}
          onAssign={handleAssign}
          selectedIds={selectedIds}
          userList={userList}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  list: {padding: 10},
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  },
  seeMoreButton: {
    paddingVertical: 12,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 50,
  },

  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    paddingVertical: rh(1),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  selectAllText: {
    fontSize: rf(1.6),
    color: '#007aff',
    fontWeight: '600',
  },

  selectionCounter: {
    backgroundColor: '#239999',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
    borderRadius: rw(4),
  },

  selectionCounterText: {
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: 'bold',
  },

  clearText: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.8),
    borderRadius: rw(2),
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: '600',
  },

  leadCountText: {
    fontSize: 14,
    // fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#555',
    textAlign: 'right',
  },
});

export default TodayScreen;
