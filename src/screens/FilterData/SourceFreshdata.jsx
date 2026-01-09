import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LeadCardContact from '../../components/LeadCardContact';
import LeadCardContactPlaceholder from '../../components/LeadCardContactPlaceholder';
import {
  FAB,
  Provider as PaperProvider,
} from 'react-native-paper';
import {_get, _post} from '../../api/apiClient';
import {showError} from '../../components/FlashMessage';
import AssignLeadModal from '../../components/AssignLeadModal';
import FilterModal from '../../components/FilterModal';
import {getUserType} from '../../utils/getUserType';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import CustomAlert from '../../components/CustomAlert';

export default function SourceFreshdata({navigation, route}) {
  const statusParam = route?.params?.status;
  const filterParams = route?.params?.filterParams || {};
  // const sourceid = route?.params?.userid;
  const sourceid = route?.params?.source_id || filterParams?.source_id;
  console.log('statusParam--', statusParam, sourceid);
  // console.log('active filter params filter list page ',filterParams)

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);

  // Multi-selection states
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

  const fetchData = useCallback(
  async (status, filters = {}, userid = null) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Add status (default: Fresh if not passed)
      const finalStatus = status || 'Fresh';
      queryParams.append('status', finalStatus);

      // Add userid (from param or fallback)
      const actualUserId = userid || sourceid;
      if (actualUserId) queryParams.append('source_id', actualUserId);

      // Add other filters (avoid duplicate userid)
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'source_id') {
          queryParams.append(key, value);
        }
      });

      console.log(
        'API URL:',
        `/getSourceAnalyticsLeads?${queryParams.toString()}`,
      );

      const response = await _get(
        `/getSourceAnalyticsLeads?${queryParams.toString()}`,
      );

      const result = response?.data;
      console.log('API Response:---------', result);

      const count = result?.totalCount || result?.data?.length || 0;
      setLeadcount(count);

      if (result?.data) {
        setData(result.data);
      } else {
        console.warn('No data found.');
        setData([]);
      }
    } catch (error) {
      console.error('API Error:', error);

      let errorMessage = 'Something went wrong, please try again.';

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          'No response from server. Please check your internet connection.';
      } else {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  },
  [sourceid],
);


  // Updated useFocusEffect to prevent multiple calls
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const params = isFilterApplied ? buildFilterParams() : filterParams;
        await fetchData(statusParam, params, sourceid);
      };
      loadData();
    }, [statusParam, isFilterApplied, sourceid, fetchData]),
  );

  const fetchFilterDropdownData = async (userTypeValue = null) => {
    try {
      const res = await _get(
        `/getfiltervalues${userTypeValue ? `?user_type=${userTypeValue}` : ''}`,
      );
      const dataRes = res?.data?.data;

      if (dataRes) {
        setSourcesList(
          (dataRes.sources || []).map(i => ({label: i.name, value: i.id})),
        );
        setProjectList(
          (dataRes.projects || []).map(i => ({label: i.title, value: i.id})),
        );
        setFilterUserList(
          (dataRes.users || []).map(i => ({label: i.name, value: i.id})),
        );
        setPropertyTypeList(
          (dataRes.property_types || []).map(i => ({
            label: i.property_type,
            value: i.id,
          })),
        );
        setBudgetList(
          (dataRes.budgets || []).map(i => ({label: i.name, value: i.id})),
        );
        setCityList(
          (dataRes.cities || []).map(i => ({label: i.name, value: i.id})),
        );
        setLeadTypeList(
          (dataRes.lead_type || []).map(i => ({label: i.name, value: i.id})),
        );
        setCustomerTypeList(
          (dataRes.customer_type || []).map(i => ({
            label: i.name,
            value: i.id,
          })),
        );
      }
    } catch (error) {
      console.error('Failed to load filter data:', error);
    }
  };

  const buildFilterParams = () => {
    const baseFilters = isFilterApplied
      ? {
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
        }
      : {};

    return {
      status: statusParam,
      from_date: baseFilters.from_date || filterParams.from_date || '',
      to_date: baseFilters.to_date || filterParams.to_date || '',
      user_id: baseFilters.userid || filterParams.user_id || '',
      project_id: baseFilters.project_id || filterParams.project_id || '',
      source_id: baseFilters.source_id || filterParams.source_id || '',
      ...baseFilters,
    };
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = buildFilterParams();
      await fetchData(statusParam, params, sourceid);
    } catch (error) {
      showError('Failed to refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [statusParam, isFilterApplied, sourceid, fetchData]);

  const applyFilters = async () => {
    try {
      const params = buildFilterParams();
      setActiveFilterParams(params);

      await fetchData(statusParam, params, sourceid);
      setFilterModalVisible(false);
      setIsFilterApplied(true);
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
    fetchData(statusParam, filterParams, sourceid);
  };

  const fetchUserList = async () => {
    try {
      const response = await _get('/userlist');
      setUserList(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
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

  const visibleItems = data.slice(0, visibleCount);
  const visibleIds = visibleItems.map(item => item.id);
  const areAllVisibleSelected = visibleIds.every(id =>
    selectedIds.includes(id),
  );

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

  const handleCallPress = item => {
    Linking.openURL(`tel:${item?.mobile}`).catch(() =>
      Alert.alert('Error', 'Phone number is not available'),
    );
  };

  const renderItem = ({item}) => {
    const isSelected = selectedIds.includes(item.id);
    const showCheckbox = selectedIds.length > 0;

    const handleCardPress = () => {
      if (usertype === 'company' && selectedIds.length > 0) {
        toggleSelection(item.id);
      } else {
        const statusName = item?.status_name?.toLowerCase();
        console.log('---',statusName)
        if (statusName === 'interested') {
          navigation.navigate('LeadInterested2', {item});
        } else if(statusName ==='fresh'){
          navigation.navigate('LeadDetailsScreen', {item});
        }else if(statusName ==='call back'){
          navigation.navigate('ContactDetails2', {item});
        }
        else{
           navigation.navigate('LeadDetailsScreen', {item});
        }
      }
    };

    return (
      <View style={{flex: 1}}>
        <LeadCardContact
          title={item?.name || 'Unknown'}
          subtitle={item?.email || '-'}
          mobile={item?.mobile}
          project={item?.project || '-'}
          lead_id={item?.id}
          status_name={item?.status_name || 'Fresh'}
          created_date={item?.created_date || '-'}
          team_owner={
            usertype === 'company' || usertype === 'team_owner'
              ? item?.team_owner || 'Unknown'
              : null
          }
          source={item?.source || '-'}
          leadtype={item?.lead_type || '-'}
          item={item}
          oncardPress={handleCardPress}
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
        <FlatList
          data={Array.from({length: 8})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactPlaceholder />}
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
              item.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No {statusParam} leads found.
              </Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },

  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 0,
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
});
