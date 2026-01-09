import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import {_get, _post} from '../../api/apiClient';
import {showError} from './../../components/FlashMessage';
import {useFocusEffect} from '@react-navigation/native';
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

import CustomAlert from '../../components/CustomAlert';

const FollowUp = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [usertype, setUsertype] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [leadCount, setLeadCount] = useState();
  const [assigning, setAssigning] = useState(false);
  const [sectionsData, setSectionsData] = useState([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

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

  // Helper function to categorize leads by reminder date
  const categorizeLeadsByDate = leads => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const buckets = {
      today: [],
      tomorrow: [],
      upcoming: [],
      yesterday: [],
      older: [],
    };

    leads.forEach(lead => {
      if (!lead.followup_on) {
        buckets.older.push(lead);
        return;
      }

      const reminderDate = new Date(lead.followup_on);
      reminderDate.setHours(0, 0, 0, 0);

      if (reminderDate.getTime() === today.getTime()) {
        buckets.today.push(lead);
      } else if (reminderDate.getTime() === tomorrow.getTime()) {
        buckets.tomorrow.push(lead);
      } else if (reminderDate.getTime() > tomorrow.getTime()) {
        buckets.upcoming.push(lead);
      } else if (reminderDate.getTime() === yesterday.getTime()) {
        buckets.yesterday.push(lead);
      } else {
        buckets.older.push(lead);
      }
    });

    // define order & titles once
    const order = [
      {key: 'today', title: 'Today'},
      {key: 'tomorrow', title: 'Tomorrow'},
      {key: 'upcoming', title: 'Upcoming'},
      {key: 'yesterday', title: 'Yesterday'},
      {key: 'older', title: 'Older'},
    ];

    const sections = order
      .filter(({key}) => buckets[key].length > 0)
      .map(({key, title}) => ({
        title,
        data: buckets[key],
        count: buckets[key].length,
      }));

    return sections;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await _get('/getfollowup');
      console.log('-----------------------------------------------', response);
      const result = response?.data?.data;
      const count = response?.data?.leadcount ?? 0;
      setLeadCount(count);

      if (Array.isArray(result)) {
        setData(result);
        const sections = categorizeLeadsByDate(result);
        setSectionsData(sections);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      showError('Something went wrong, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await _get('/userlist');
      setUserList(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      setUserList([]);
    }
  };

  // const handleAssign = async () => {
  //   if (!selectedUser) {
  //     Alert.alert('Error', 'Please select a user to assign.');
  //     return;
  //   }
  //   if (selectedIds.length === 0) {
  //     Alert.alert('Error', 'Please select at least one lead.');
  //     return;
  //   }

  //   try {
  //     setAssigning(true);

  //     await _post('/multiassignleads', {
  //       userid: selectedUser.id,
  //       lead_id: selectedIds,
  //     });
  //      showCustomAlert('Success', 'Leads assigned successfully!');

  //     setSelectedIds([]);
  //     setSelectedUser(null);
  //     setIsAssignModalVisible(false);
  //     fetchData();
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to assign leads.');
  //   } finally {
  //     setAssigning(false); // always reset loader
  //   }
  // };

  const handleAssign = async assignPayload => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user to assign.');
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert('Error', 'Please select at least one lead.');
      return;
    }

    // ✅ Naya payload with extra fields
    const payload = {
      userid: selectedUser.id,
      lead_id: selectedIds,
      share_as: assignPayload.leadOrData, // SingleAssignLead se aya
      assign_as_fresh: assignPayload.freshAssign, // SingleAssignLead se aya
      show_history: assignPayload.viewHistory, // SingleAssignLead se aya
    };

    // console.log('📦 Final Multi allcallback page  Assign Payload:', payload);

    try {
      setAssigning(true);
      await _post('/multiassignleads', payload);

      showCustomAlert('Success', 'Leads assigned successfully!');
      setSelectedIds([]);
      setSelectedUser(null);
      setIsAssignModalVisible(false);

      if (isFilterApplied) {
        const params = buildFilterParams();
        fetchData(params);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error(
        '❌ Error assigning lead:',
        error?.response?.data || error.message || error,
      );

      // ⚠️ Handle network or unexpected errors
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      alert(errMsg);
    } finally {
      setAssigning(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const toggleSelection = id => {
    if (usertype !== 'company') return;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const handleCallPress = item => {
    const mobile = item?.mobile;
    if (!mobile) {
      Alert.alert('Error', 'Phone number is not available');
      return;
    }
    Linking.openURL(`tel:${mobile}`)
      .then(() => {
        navigation.navigate('ContactDetails2', {item});
      })
      .catch(err => console.log(err));
  };

  const handleSmsPress = item => {
    const mobile = item?.mobile;
    Linking.openURL(`sms:${mobile}`).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    const mobile = item?.mobile;
    Linking.openURL(`https://wa.me/${mobile}`).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed.'),
    );
  };

  const renderItem = ({item}) => {
    const isSelected = selectedIds.includes(item.id);
    const showCheckbox = selectedIds.length > 0;

    return (
      <LeadCardContactCallBack
        follow_up={item?.followup_on || '-'}
        title={item?.name || 'Unknown'}
        mobile={item?.mobile}
        lead_id={item?.id}
        item={item}
        leadtype={item?.lead_type}
        project={item?.project || 'Unknown'}
        source={item?.source || 'Unknown'}
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
            const statusName = item?.status_name?.toLowerCase();
            if (statusName === 'interested') {
              navigation.navigate('LeadInterested2', {item});
            } else {
              navigation.navigate('ContactDetails2', {item});
            }
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

  const renderSectionHeader = ({section}) => (
    // <View style={[styles.sectionHeader, {backgroundColor: section.color}]}>
    //   <Text style={styles.sectionHeaderText}>
    //     {section.title} ({section.count})
    //   </Text>
    // </View>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderBadge}>
        <Text style={styles.sectionHeaderText}>
          {section.title} ({section.count})
        </Text>
      </View>
    </View>
  );

  // Get all visible items for selection logic
  const getAllVisibleItems = () => {
    let allItems = [];
    sectionsData.forEach(section => {
      allItems = [...allItems, ...section.data];
    });
    return allItems.slice(0, visibleCount);
  };

  const visibleItems = getAllVisibleItems();
  const visibleIds = visibleItems.map(item => item.id);
  const areAllVisibleSelected = visibleIds.every(id =>
    selectedIds.includes(id),
  );

  // Convert sections data for SectionList with visibility limit
  const getSectionsForDisplay = () => {
    let totalShown = 0;
    const sectionsForDisplay = [];

    for (const section of sectionsData) {
      if (totalShown >= visibleCount) break;

      const remainingCount = visibleCount - totalShown;
      const sectionData = section.data.slice(0, remainingCount);

      if (sectionData.length > 0) {
        sectionsForDisplay.push({
          ...section,
          data: sectionData,
        });
      }

      totalShown += sectionData.length;
    }

    return sectionsForDisplay;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.leadCountText}> {leadCount} records Found</Text>

      {isLoading ? (
        <FlatList
          data={Array.from({length: 6})}
          keyExtractor={(_, i) => i.toString()}
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

          <SectionList
            sections={getSectionsForDisplay()}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item, i) => item?.id?.toString() || i.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No follow-up leads found.</Text>
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
            stickySectionHeadersEnabled={true}
          />
        </>
      )}

      {usertype === 'company' && selectedIds.length > 0 && (
        <PaperProvider>
          <FAB
            style={styles.fab}
            icon="share"
            color="#fff"
            onPress={() => {
              fetchUserList();
              setIsAssignModalVisible(true);
            }}
          />
        </PaperProvider>
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
        assigning={assigning}
      />
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        confirmText="OK"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  list: {padding: 10, paddingTop: 0},

  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    padding: 20,
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
    backgroundColor: '#2D87DB',
    borderRadius: 80,
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
    color: '#2D87DB',
    fontWeight: '600',
  },
  selectionCounter: {
    backgroundColor: '#2D87DB',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
    borderRadius: rw(5),
  },
  selectionCounterText: {
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: 'bold',
  },
  clearText: {
    backgroundColor: '#2D87DB',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
    borderRadius: rw(1),
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: '600',
  },
  leadCountText: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#555',
    textAlign: 'right',
    backgroundColor: '#e8e8e8',
  },
  sectionHeader: {
    alignItems: 'center', // center horizontally
    marginVertical: 5, // thoda gap upar-neeche
  },

  sectionHeaderBadge: {
    backgroundColor: '#e0e0e0', // WhatsApp style grey
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8, // capsule shape
  },

  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default FollowUp;
