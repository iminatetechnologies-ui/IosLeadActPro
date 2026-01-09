import {
  StyleSheet,
  Text,
  View,
  SectionList,
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

const TotalLeads = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [selectedIds, setSelectedIds] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usertype, setUsertype] = useState(null);
  const [leadcount, setLeadcount] = useState(0);

  // Filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

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

  // SectionList data format
  const [sectionData, setSectionData] = useState([]);

  // Memoize date categories to avoid recreating Date objects
  const dateCategories = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return {
      today: today.getTime(),
      yesterday: yesterday.getTime(),
    };
  }, []);

  const showCustomAlert = useCallback((title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const type = await getUserType();
        if (isMounted) {
          setUsertype(type);
        }
      } catch (error) {
        console.error('Error getting user type:', error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchFilterDropdownData();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (selectedUserType?.value && isMounted) {
      fetchFilterDropdownData(selectedUserType.value);
    }
    return () => {
      isMounted = false;
    };
  }, [selectedUserType]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      
      const loadData = async () => {
        if (!isMounted) return;
        
        try {
          if (isFilterApplied) {
            const params = buildFilterParams();
            await fetchData(params);
          } else {
            await fetchData();
          }
        } catch (error) {
          console.error('Error loading data on focus:', error);
        }
      };
      
      loadData();
      
      return () => {
        isMounted = false;
      };
    }, [isFilterApplied]),
  );

  // Helper function to get date category
  const getDateCategory = useCallback((createdDate) => {
    if (!createdDate || createdDate === '-') return 'older';

    try {
      const createdDateObj = new Date(createdDate);
      if (isNaN(createdDateObj.getTime())) return 'older';
      
      createdDateObj.setHours(0, 0, 0, 0);
      const createdTime = createdDateObj.getTime();

      if (createdTime === dateCategories.today) {
        return 'today';
      } else if (createdTime === dateCategories.yesterday) {
        return 'yesterday';
      } else {
        return 'older';
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'older';
    }
  }, [dateCategories]);

  // Helper function to group data for SectionList
  const groupDataForSectionList = useCallback((dataArray) => {
    try {
      if (!Array.isArray(dataArray)) {
        console.error('Invalid data array:', dataArray);
        return [];
      }

      const grouped = {
        today: [],
        yesterday: [],
        older: [],
      };

      dataArray.forEach(item => {
        if (!item) return;
        const category = getDateCategory(item?.created_date);
        grouped[category].push(item);
      });

      const sections = [];

      if (grouped.today.length > 0) {
        sections.push({
          title: 'Today',
          data: grouped.today,
          totalCount: grouped.today.length,
          key: 'today',
        });
      }

      if (grouped.yesterday.length > 0) {
        sections.push({
          title: 'Yesterday',
          data: grouped.yesterday,
          totalCount: grouped.yesterday.length,
          key: 'yesterday',
        });
      }

      if (grouped.older.length > 0) {
        sections.push({
          title: 'Older',
          data: grouped.older,
          totalCount: grouped.older.length,
          key: 'older',
        });
      }

      return sections;
    } catch (error) {
      console.error('Error grouping data:', error);
      return [];
    }
  }, [getDateCategory]);

  const fetchFilterDropdownData = async (userTypeValue = null) => {
    try {
      setIsLoadingDropdowns(true);
      const res = await _get(
        `/getfiltervalues${userTypeValue ? `?user_type=${userTypeValue}` : ''}`,
      );
      const data = res?.data?.data;

      if (data) {
        setSourcesList(
          Array.isArray(data.sources) 
            ? data.sources.map(i => ({label: i.name, value: i.id}))
            : []
        );
        setProjectList(
          Array.isArray(data.projects)
            ? data.projects.map(i => ({label: i.title, value: i.id}))
            : []
        );
        setFilterUserList(
          Array.isArray(data.users)
            ? data.users.map(i => ({label: i.name, value: i.id}))
            : []
        );
        setPropertyTypeList(
          Array.isArray(data.property_types)
            ? data.property_types.map(i => ({
                label: i.property_type,
                value: i.id,
              }))
            : []
        );
        setBudgetList(
          Array.isArray(data.budgets)
            ? data.budgets.map(i => ({label: i.name, value: i.id}))
            : []
        );
        setCityList(
          Array.isArray(data.cities)
            ? data.cities.map(i => ({label: i.name, value: i.id}))
            : []
        );
        setLeadTypeList(
          Array.isArray(data.lead_type)
            ? data.lead_type.map(i => ({label: i.name, value: i.id}))
            : []
        );
        setCustomerTypeList(
          Array.isArray(data.customer_type)
            ? data.customer_type.map(i => ({label: i.name, value: i.id}))
            : []
        );
      }
    } catch (error) {
      console.error('Failed to load filter data:', error);
      showError('Failed to load filter options');
    } finally {
      setIsLoadingDropdowns(false);
    }
  };

  const buildFilterParams = useCallback(() => {
    try {
      return {
        source_id: Array.isArray(selectedSource)
          ? selectedSource.map(u => u?.value).filter(Boolean).join(',')
          : '',
        project_id: Array.isArray(selectedProject)
          ? selectedProject.map(u => u?.value).filter(Boolean).join(',')
          : '',
        userid: Array.isArray(selectedFilterUser)
          ? selectedFilterUser.map(u => u?.value).filter(Boolean).join(',')
          : '',
        property_type_id: selectedPropertyType?.value || '',
        budget_id: selectedBudget?.value || '',
        city_id: selectedCity?.value || '',
        lead_type_id: selectedLeadType?.value || '',
        customer_type_id: selectedCustomerType?.value || '',
        from_date: fromDate || '',
        to_date: toDate || '',
        utype: selectedUserType?.value || '',
      };
    } catch (error) {
      console.error('Error building filter params:', error);
      return {};
    }
  }, [
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
  ]);

  const fetchData = async (params = {}) => {
    try {
      setIsLoading(true);
      const response = await _post('/getallleads', {params});
      
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      const result = response.data;
      const count = result?.leadcount ?? 0;
      setLeadcount(count);

      if (result && Array.isArray(result.data)) {
        const dataArray = result.data;
        setData(dataArray);
        const sections = groupDataForSectionList(dataArray);
        setSectionData(sections);
        setVisibleCount(100);
      } else {
        setData([]);
        setSectionData([]);
        showError('No data found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMsg = error?.response?.data?.message || 'Something went wrong, please try again.';
      Alert.alert('Error', errorMsg);
      setData([]);
      setSectionData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Limit visible data based on visibleCount
  const getVisibleSectionData = useCallback((sections, limit) => {
    try {
      let count = 0;
      const result = [];

      for (const section of sections) {
        if (count >= limit) break;

        const remaining = limit - count;
        if (section.data.length <= remaining) {
          result.push({
            ...section,
          });
          count += section.data.length;
        } else {
          result.push({
            ...section,
            data: section.data.slice(0, remaining),
          });
          count += remaining;
        }
      }

      return result;
    } catch (error) {
      console.error('Error getting visible sections:', error);
      return sections;
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = isFilterApplied ? buildFilterParams() : {};
      const response = await _post('/getallleads', {params});
      
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      const result = response.data;
      const count = result?.leadcount ?? 0;
      setLeadcount(count);

      if (result && Array.isArray(result.data)) {
        const dataArray = result.data;
        setData(dataArray);
        const sections = groupDataForSectionList(dataArray);
        setSectionData(sections);
        setVisibleCount(100);
      } else {
        setData([]);
        setSectionData([]);
        showError('No data found.');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      showError('Failed to refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [isFilterApplied, buildFilterParams, groupDataForSectionList]);

  const applyFilters = async () => {
    if (isApplyingFilter) {
      console.log('Filter already being applied, ignoring duplicate request');
      return;
    }

    try {
      setIsApplyingFilter(true);
      const params = buildFilterParams();

      // Validate that at least one filter is selected
      const hasFilters = Object.values(params).some(val => val !== '');
      if (!hasFilters) {
        Alert.alert('Error', 'Please select at least one filter');
        return;
      }

      const response = await _post('/getallleads', {params});
      
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      const result = response.data;
      const leadcount = result?.leadcount || 0;

      if (result && Array.isArray(result.data)) {
        const dataArray = result.data;
        setData(dataArray);
        const sections = groupDataForSectionList(dataArray);
        setSectionData(sections);
        setLeadcount(leadcount);
        setVisibleCount(100);
        setIsFilterApplied(true);
        setFilterModalVisible(false);
      } else {
        setData([]);
        setSectionData([]);
        showError('No data found with applied filters.');
      }
    } catch (error) {
      console.error('Failed to apply filters:', error);
      const errorMsg = error?.response?.data?.message || 'Failed to apply filters';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsApplyingFilter(false);
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
    setVisibleCount(100);
    fetchData();
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await _get('/userlist');
      setUserList(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching user list:', error);
      setUserList([]);
    }
  };

  const handleAssign = async assignPayload => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user to assign.');
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert('Error', 'Please select at least one lead.');
      return;
    }

    const payload = {
      userid: selectedUser.id,
      lead_id: selectedIds,
      share_as: assignPayload.leadOrData,
      assign_as_fresh: assignPayload.freshAssign,
      show_history: assignPayload.viewHistory,
    };

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

      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      Alert.alert('Error', errMsg);
    } finally {
      setAssigning(false);
    }
  };

  const toggleSelection = useCallback((id) => {
    if (usertype !== 'company') return;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  }, [usertype]);

  // Get only visible item IDs for selection
  const getAllItemIds = useCallback(() => {
    const visibleSections = getVisibleSectionData(sectionData, visibleCount);
    return visibleSections.flatMap(section =>
      section.data.map(item => item?.id).filter(Boolean),
    );
  }, [sectionData, visibleCount, getVisibleSectionData]);

  const areAllSelected = useCallback(() => {
    const allIds = getAllItemIds();
    return allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
  }, [getAllItemIds, selectedIds]);

  const renderItem = useCallback(({item}) => {
    if (!item) return null;

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
          oncardPress={() => {
            if (usertype === 'company' && selectedIds.length > 0) {
              toggleSelection(item.id);
            } else {
              const statusName = item?.status_name?.toLowerCase();
              if (statusName === 'interested') {
                navigation.navigate('LeadInterested2', {item});
              } else if (statusName === 'call back') {
                navigation.navigate('ContactDetails2', {item});
              } else {
                navigation.navigate('LeadDetailsScreen', {item});
              }
            }
          }}
          onLongPress={() => {
            if (usertype === 'company') toggleSelection(item.id);
          }}
          isSelected={isSelected}
          showCheckbox={showCheckbox}
          onSelect={() => toggleSelection(item.id)}
        />
      </View>
    );
  }, [selectedIds, usertype, toggleSelection, navigation]);

  const renderSectionHeader = useCallback(({section}) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderBadge}>
        <Text style={styles.sectionHeaderText}>
          {section.title} ({section.totalCount})
        </Text>
      </View>
    </View>
  ), []);

  const renderLoadingList = useCallback(() => (
    <SectionList
      sections={[{title: 'Loading', data: Array.from({length: 6})}]}
      keyExtractor={(_, index) => `loading-${index}`}
      renderItem={() => <LeadCardContactPlaceholder />}
      renderSectionHeader={() => null}
      contentContainerStyle={styles.list}
      stickySectionHeadersEnabled={false}
    />
  ), []);

  const visibleSections = useMemo(
    () => getVisibleSectionData(sectionData, visibleCount),
    [sectionData, visibleCount, getVisibleSectionData]
  );

  const totalDataCount = useMemo(
    () => sectionData.reduce((sum, section) => sum + section.data.length, 0),
    [sectionData]
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
        }}
        disabled={isApplyingFilter}>
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
            sections={visibleSections}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item, index) => `${item?.id || index}-${index}`}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.list}
            stickySectionHeadersEnabled={true}
            ListEmptyComponent={
              !isLoading && (
                <Text style={styles.emptyText}>No leads found.</Text>
              )
            }
            ListFooterComponent={
              totalDataCount > visibleCount ? (
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
        isLoading={isApplyingFilter || isLoadingDropdowns}
      />
    </View>
  );
};

export default TotalLeads;

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
  sectionHeader: {
    alignItems: 'center',
    marginVertical: 5,
  },
  sectionHeaderBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
})