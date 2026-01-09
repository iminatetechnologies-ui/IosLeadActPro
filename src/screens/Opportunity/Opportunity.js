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
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {_get, _post} from '../../api/apiClient';
import {showError} from './../../components/FlashMessage';
import LeadCardContact from '../../components/LeadCardContact';
import LeadCardContactPlaceholder from '../../components/LeadCardContactPlaceholder';
import AssignLeadModal from '../../components/AssignLeadModal';
import FilterModal from '../../components/FilterModal';
import {getUserType} from '../../utils/getUserType';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import CustomAlert from '../../components/CustomAlert';

const Opportunity = ({navigation}) => {
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

  // SectionList data format
  const [sectionData, setSectionData] = useState([]);

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

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchData();
  //   }, []),
  // );
  useFocusEffect(
    useCallback(() => {
      if (isFilterApplied) {
        const params = buildFilterParams();
        fetchData(params);
      } else {
        fetchData();
      }
    }, [isFilterApplied, activeFilterParams]), // dependencies
  );

  // Helper function to get date category
  const getDateCategory = createdDate => {
    if (!createdDate || createdDate === '-') return 'older';

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    const createdDateObj = new Date(createdDate);
    createdDateObj.setHours(0, 0, 0, 0);

    if (createdDateObj.getTime() === today.getTime()) {
      return 'today';
    } else if (createdDateObj.getTime() === yesterday.getTime()) {
      return 'yesterday';
    } else {
      return 'older';
    }
  };

  // Helper function to group data for SectionList
  const groupDataForSectionList = dataArray => {
    const grouped = {
      today: [],
      yesterday: [],
      older: [],
    };

    dataArray.forEach(item => {
      const category = getDateCategory(item?.created_date);
      grouped[category].push(item);
    });

    const sections = [];

    if (grouped.today.length > 0) {
      sections.push({
        title: 'Today',
        data: grouped.today,
        key: 'today',
      });
    }

    if (grouped.yesterday.length > 0) {
      sections.push({
        title: 'Yesterday',
        data: grouped.yesterday,
        key: 'yesterday',
      });
    }

    if (grouped.older.length > 0) {
      sections.push({
        title: 'Older',
        data: grouped.older,
        key: 'older',
      });
    }

    return sections;
  };

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

  const buildFilterParams = () => ({
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
  });

  const fetchData = async (params = {}) => {
    setIsLoading(true);
    try {
      // console.log('---------------------------------',params)
      const response = await _get('/getopportunity', {params});
      const result = response?.data;
      const count = response?.data?.leadcount ?? 0;
      setLeadcount(count);
      if (result) {
        const dataArray = result?.data || [];
        setData(dataArray);
        // Create section data for SectionList
        const sections = groupDataForSectionList(dataArray);
        setSectionData(sections);
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
      const response = await _get('/getopportunity', {params});
      const result = response?.data;
      const count = response?.data?.leadcount ?? 0;
      setLeadcount(count);

      if (result) {
        const dataArray = result?.data || [];
        setData(dataArray);
        // Create section data for SectionList
        const sections = groupDataForSectionList(dataArray);
        setSectionData(sections);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      showError('Failed to refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [isFilterApplied]);

  const applyFilters = async () => {
    try {
      const params = buildFilterParams();
      setActiveFilterParams(params);

      const response = await _get('/getopportunity', {params});
      const result = response?.data;
      const leadcount = response?.data?.leadcount || 'No';

      if (result) {
        const dataArray = result?.data || [];
        setData(dataArray);
        // Create section data for SectionList
        const sections = groupDataForSectionList(dataArray);
        setSectionData(sections);
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

  const resetFilters = () => {
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
  //     showCustomAlert('Success', 'Leads assigned successfully!');
  //     setSelectedIds([]);
  //     setSelectedUser(null);
  //     setIsAssignModalVisible(false);

  //     // Refresh with current filter state
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

  const toggleSelection = id => {
    if (usertype !== 'company') return;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const getAllItemIds = () => {
    return data.map(item => item.id);
  };

  const areAllSelected = () => {
    const allIds = getAllItemIds();
    return allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
  };

  const handleSmsPress = item => {
    const mobile = item?.mobile;
    const url = `sms:${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    const mobile = item?.mobile;
    const url = `https://wa.me/${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed on your device.'),
    );
  };

  const handleCallPress = item => {
    const mobile = item?.mobile;
    const url = `tel:${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Phone number is not available'),
    );
  };

  const renderItem = ({item}) => {
    const isSelected = selectedIds.includes(item.id);
    const showCheckbox = selectedIds.length > 0;

    return (
      <View style={{flex: 1}}>
        <LeadCardContact
          title={item?.name || 'Unknown'}
          subtitle={item?.email || '-'}
          lead_id={item?.id}
          project={item?.project}
          mobile={item?.mobile}
          item={item}
          created_date={item?.created_date || '-'}
          leadtype={item?.lead_type}
          substatus_name={item?.substatus_name}
          source={item?.source || '-'}
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
      </View>
    );
  };

  const renderSectionHeader = ({section}) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderBadge}>
        <Text style={styles.sectionHeaderText}>
          {section.title} ({section.data.length})
        </Text>
      </View>
    </View>
  );

  const renderLoadingList = () => (
    <SectionList
      sections={[{title: 'Loading', data: Array.from({length: 6})}]}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <LeadCardContactPlaceholder />}
      renderSectionHeader={() => null}
      contentContainerStyle={styles.list}
      stickySectionHeadersEnabled={false}
    />
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
        renderLoadingList()
      ) : (
        <>
          {selectedIds.length > 0 && (
            <View style={styles.selectAllContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (areAllSelected()) {
                    setSelectedIds([]);
                  } else {
                    setSelectedIds(getAllItemIds());
                  }
                }}>
                <Text style={styles.selectAllText}>
                  {areAllSelected() ? 'Unselect All' : 'Select All'}
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
            sections={sectionData}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item, index) => `${item.id || index}`}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.list}
            stickySectionHeadersEnabled={true}
            ListEmptyComponent={
              !isLoading && (
                <Text style={styles.emptyText}>
                  No Opportunity leads found.
                </Text>
              )
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

      {/* Assign Lead Modal */}
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

      {/* Filter Modal */}
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

export default Opportunity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
    paddingTop: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2D87DB',
    borderRadius: 80,
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
  // Sticky section header styles
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
