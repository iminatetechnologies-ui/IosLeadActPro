import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Linking,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {_get, _post} from '../../api/apiClient';
import {showError} from './../../components/FlashMessage';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';
import AssignLeadModal from '../../components/AssignLeadModal';
import FilterModal from '../../components/FilterModal';
import {getUserType} from '../../utils/getUserType';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import CustomAlert from '../../components/CustomAlert';

const All = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [selectedIds, setSelectedIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usertype, setUsertype] = useState(null);
  const [leadcount, setLeadcount] = useState();

  // Filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [activeFilterParams, setActiveFilterParams] = useState({});

  // Filter dropdown lists
  const [sourcesList, setSourcesList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [filterUserList, setFilterUserList] = useState([]);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [leadTypeList, setLeadTypeList] = useState([]);
  const [customerTypeList, setCustomerTypeList] = useState([]);

  // Selected filter values
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFilterUser, setSelectedFilterUser] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLeadType, setSelectedLeadType] = useState(null);
  const [selectedCustomerType, setSelectedCustomerType] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [userTypeOptions] = useState([
    {label: 'User Wise', value: 1},
    {label: 'Team Wise', value: 2},
  ]);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Memoized helper function to format dates and group data
  const getDateCategory = useCallback(dateString => {
    if (!dateString || dateString === '-') return 'Older';

    const today = new Date();
    const yesterday = new Date(today);
    const tomorrow = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reminderDate = new Date(dateString);

    // Reset time for accurate comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    reminderDate.setHours(0, 0, 0, 0);

    if (reminderDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (reminderDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else if (reminderDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (reminderDate.getTime() > tomorrow.getTime()) {
      return 'Later';
    } else {
      return 'Older';
    }
  }, []);

  // Memoized grouping function
  const groupDataByDate = useCallback(
    data => {
      const grouped = {
        Today: [],
        Yesterday: [],
        Tomorrow: [],
        Later: [],
        Older: [],
      };

      data.forEach(item => {
        const category = getDateCategory(item.reminder_date);
        grouped[category].push(item);
      });

      // Sort each group by reminder_date (most recent first)
      Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => {
          const dateA = new Date(a.reminder_date || '1970-01-01');
          const dateB = new Date(b.reminder_date || '1970-01-01');
          return dateB - dateA;
        });
      });

      // Convert to sections array for SectionList
      const sections = [];
      const sectionOrder = ['Today', 'Yesterday', 'Tomorrow', 'Later', 'Older'];

      sectionOrder.forEach(key => {
        if (grouped[key].length > 0) {
          sections.push({
            title: key,
            count: grouped[key].length,
            data: grouped[key],
          });
        }
      });

      return sections;
    },
    [getDateCategory],
  );

  // Memoized grouped data
  const groupedData = useMemo(() => {
    return data.length > 0 ? groupDataByDate(data) : [];
  }, [data, groupDataByDate]);

  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  useEffect(() => {
    fetchFilterDropdownData();
  }, []);

  useEffect(() => {
    if (selectedUserType?.value) {
      fetchFilterDropdownData(selectedUserType.value);
    }
  }, [selectedUserType]);

  useFocusEffect(
    useCallback(() => {
      if (isFilterApplied) {
        const params = buildFilterParams();
        fetchData(params);
      } else {
        fetchData();
      }
    }, [isFilterApplied]),
  );

  const fetchFilterDropdownData = async (userTypeValue = null) => {
    try {
      const res = await _get(
        `/getfiltervalues${userTypeValue ? `?user_type=${userTypeValue}` : ''}`,
      );
      const data = res?.data?.data;

      if (data) {
        setSourcesList(
          (data.sources || []).map(i => ({label: i.name, value: i.id})),
        );
        setProjectList(
          (data.projects || []).map(i => ({label: i.title, value: i.id})),
        );
        setFilterUserList(
          (data.users || []).map(i => ({label: i.name, value: i.id})),
        );
        setPropertyTypeList(
          (data.property_types || []).map(i => ({
            label: i.property_type,
            value: i.id,
          })),
        );
        setBudgetList(
          (data.budgets || []).map(i => ({label: i.name, value: i.id})),
        );
        setCityList(
          (data.cities || []).map(i => ({label: i.name, value: i.id})),
        );
        setLeadTypeList(
          (data.lead_type || []).map(i => ({label: i.name, value: i.id})),
        );
        setCustomerTypeList(
          (data.customer_type || []).map(i => ({label: i.name, value: i.id})),
        );
      }
    } catch (error) {
      console.error('Failed to load filter data:', error);
    }
  };

  const buildFilterParams = useCallback(
    () => ({
      source_id: selectedSource?.map(u => u.value).join(',') || '',
      project_id: selectedProject?.map(u => u.value).join(',') || '',
      userid: selectedFilterUser?.map(u => u.value).join(',') || '',
      property_type_id: selectedPropertyType?.value || '',
      budget_id: selectedBudget?.value || '',
      city_id: selectedCity?.value || '',
      lead_type_id: selectedLeadType?.value || '',
      customer_type_id: selectedCustomerType?.value || '',
      from_date: fromDate || '',
      to_date: toDate || '',
      utype: selectedUserType?.value || '',
    }),
    [
      selectedSource,
      selectedProject,
      selectedFilterUser,
      selectedPropertyType,
      selectedBudget,
      selectedCity,
      selectedLeadType,
      selectedCustomerType,
      fromDate,
      toDate,
      selectedUserType,
    ],
  );

  const fetchData = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await _get('/getinterested', {params});
      const result = response?.data;
      const count = response?.data?.leadcount ?? 0;
      setLeadcount(count);
      if (result) {
        setData(result?.data || []);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = isFilterApplied ? buildFilterParams() : {};
      const response = await _get('/getinterested', {params});
      const result = response?.data;
      const count = response?.data?.leadcount ?? 0;
      setLeadcount(count);
      if (result) {
        setData(result?.data || []);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      showError('Failed to refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [isFilterApplied, buildFilterParams]);

  const applyFilters = async () => {
    try {
      const params = buildFilterParams();
      setActiveFilterParams(params);

      const response = await _get('/getinterested', {params});
      const result = response?.data;
      const leadcount = response?.data?.leadcount || 'No';

      if (result) {
        setData(result?.data || []);
        setFilterModalVisible(false);
        setIsFilterApplied(true);
        setLeadcount(leadcount);
      } else {
        showError('No data found with applied filters.');
      }
    } catch (error) {
      console.error('Failed to apply filters:', error);
      Alert.alert('Error', 'Failed to apply filters');
    }
  };

  const resetFilters = useCallback(() => {
    setSelectedSource(null);
    setSelectedProject(null);
    setSelectedFilterUser(null);
    setSelectedPropertyType(null);
    setSelectedBudget(null);
    setSelectedCity(null);
    setSelectedLeadType(null);
    setSelectedCustomerType(null);
    setFromDate(null);
    setToDate(null);
    setSelectedUserType(null);
    setIsFilterApplied(false);
    setActiveFilterParams({});
    fetchData();
  }, []);

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
  //     showCustomAlert('Success', 'Leads assigned successfully!');
  //     setSelectedIds([]);
  //     setSelectedUser(null);
  //     setIsAssignModalVisible(false);

  //     if (isFilterApplied) {
  //       const params = buildFilterParams();
  //       fetchData(params);
  //     } else {
  //       fetchData();
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to assign leads.');
  //   } finally {
  //     setAssigning(false);
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

  const toggleSelection = useCallback(
    id => {
      if (usertype !== 'company') return;
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
      );
    },
    [usertype],
  );

  const handleSmsPress = useCallback(item => {
    const mobile = item?.mobile;
    const url = `sms:${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  }, []);

  const handleWhatsappPress = useCallback(item => {
    const mobile = item?.mobile;
    const url = `https://wa.me/${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed on your device.'),
    );
  }, []);

  // Memoized section header component
  const renderSectionHeader = useCallback(
    ({section}) => (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderBadge}>
          <Text style={styles.sectionHeaderText}>
            {section.title} ({section.count})
          </Text>
        </View>
      </View>
    ),
    [],
  );

  // Memoized render item function
  const renderLeadItem = useCallback(
    ({item}) => {
      const isSelected = selectedIds.includes(item.id);
      const showCheckbox = selectedIds.length > 0;

      return (
        <View style={{flex: 1}}>
          <LeadCardContactCallBack
            follow_up={item?.reminder_date || '-'}
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
            // oncardPress={() => {
            //   if (usertype === 'company' && selectedIds.length > 0) {
            //     toggleSelection(item.id);
            //   } else {
            //     navigation.navigate('LeadInterested2', {item});
            //   }
            // }}
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
            onSmsPress={() => handleSmsPress(item)}
            onWhatsappPress={() => handleWhatsappPress(item)}
            onLongPress={() => {
              if (usertype === 'company') toggleSelection(item.id);
            }}
            isSelected={isSelected}
            showCheckbox={showCheckbox}
            onSelect={() => toggleSelection(item.id)}
          />
        </View>
      );
    },
    [
      selectedIds,
      usertype,
      toggleSelection,
      handleSmsPress,
      handleWhatsappPress,
      navigation,
    ],
  );

  // Memoized calculations for selection logic
  const selectionData = useMemo(() => {
    let allItems = [];
    let currentCount = 0;

    for (const section of groupedData) {
      for (const item of section.data) {
        if (currentCount >= visibleCount) break;
        allItems.push(item);
        currentCount++;
      }
      if (currentCount >= visibleCount) break;
    }

    const visibleIds = allItems.map(item => item.id);
    const areAllVisibleSelected =
      visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

    return {
      visibleLeadItems: allItems,
      visibleIds,
      areAllVisibleSelected,
    };
  }, [groupedData, visibleCount, selectedIds]);

  // Memoized limited sections for pagination
  const limitedSections = useMemo(() => {
    let currentCount = 0;
    const sections = [];

    for (const section of groupedData) {
      const remainingSlots = visibleCount - currentCount;
      if (remainingSlots <= 0) break;

      const limitedData = section.data.slice(0, remainingSlots);
      if (limitedData.length > 0) {
        sections.push({
          ...section,
          data: limitedData,
        });
        currentCount += limitedData.length;
      }
    }

    return sections;
  }, [groupedData, visibleCount]);

  const hasMoreData = useMemo(() => {
    return (
      groupedData.reduce((acc, section) => acc + section.data.length, 0) >
      visibleCount
    );
  }, [groupedData, visibleCount]);

  // Memoized key extractor
  const keyExtractor = useCallback((item, index) => {
    return item?.id?.toString() || index.toString();
  }, []);

  // Memoized get item layout for better performance
  const getItemLayout = useCallback(
    (data, index) => ({
      length: 120, // Approximate height of your card
      offset: 120 * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          if (isFilterApplied) {
            resetFilters();
          } else {
            setFilterModalVisible(true);
          }
        }}>
        <View style={styles.filterContent}>
          <Text style={styles.leftText}>Filter</Text>
          <Text style={styles.centerText}>
            {isFilterApplied
              ? `${leadcount} records found`
              : `${leadcount} total records`}
          </Text>
          <Icon
            name={isFilterApplied ? 'x' : 'filter'}
            size={24}
            color="#333"
          />
        </View>
      </TouchableOpacity>

      {isLoading ? (
        <SectionList
          sections={[{title: 'Loading', data: Array.from({length: 6})}]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactCallBackPlaceholder />}
          renderSectionHeader={() => null}
          contentContainerStyle={styles.list}
        />
      ) : (
        <>
          {selectedIds.length > 0 && (
            <View style={styles.selectAllContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (selectionData.areAllVisibleSelected) {
                    setSelectedIds(prev =>
                      prev.filter(id => !selectionData.visibleIds.includes(id)),
                    );
                  } else {
                    setSelectedIds(prev => {
                      const newIds = selectionData.visibleIds.filter(
                        id => !prev.includes(id),
                      );
                      return [...prev, ...newIds];
                    });
                  }
                }}>
                <Text style={styles.selectAllText}>
                  {selectionData.areAllVisibleSelected
                    ? 'Unselect All'
                    : 'Select All'}
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
            sections={limitedSections}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={keyExtractor}
            renderItem={renderLeadItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={styles.list}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={10}
            windowSize={10}
            // getItemLayout={getItemLayout} // Only enable if all items have same height
            ListEmptyComponent={
              !isLoading && (
                <Text style={styles.emptyText}>No Interested leads found.</Text>
              )
            }
            ListFooterComponent={
              hasMoreData ? (
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
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={applyFilters}
        onDateRangeChange={({date_from, date_to}) => {
          setFromDate(date_from);
          setToDate(date_to);
        }}
        sourcesList={sourcesList}
        projectList={projectList}
        userList={filterUserList}
        propertyTypeList={propertyTypeList}
        budgetList={budgetList}
        cityList={cityList}
        leadTypeList={leadTypeList}
        customerTypeList={customerTypeList}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedUser={selectedFilterUser}
        setSelectedUser={setSelectedFilterUser}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedLeadType={selectedLeadType}
        setSelectedLeadType={setSelectedLeadType}
        selectedCustomerType={selectedCustomerType}
        setSelectedCustomerType={setSelectedCustomerType}
        userTypeOptions={userTypeOptions}
        selectedUserType={selectedUserType}
        setSelectedUserType={setSelectedUserType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
    paddingTop: 0,
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    padding: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 0,
    backgroundColor: '#e8e8e8',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  centerText: {
    flex: 1,
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  // sectionHeader: {
  //    backgroundColor: '#f5f5f5', // Added background for better visibility
  //   paddingRight:0,
  //   paddingVertical: 10,
  //   marginTop: 0,
  //   marginBottom: 0,
  //   marginHorizontal: 0,
  // },
  // sectionHeaderText: {
  //   fontSize: 12,
  //   fontWeight: '600',
  //   color: '#2c5282',
  //   textAlign: 'center',
  // },
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

export default All;
