import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CardComponent from './tasktab/CardComponent';
import UserWiseStatusTable from './tasktab/StatusTabledashboard';
import FilterModal from '../../components/FilterModal';
import {_get} from '../../api/apiClient';

const TaskTab = () => {
  const [cardData, setCardData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [activeFilterParams, setActiveFilterParams] = useState({});

  // Filter dropdown lists
  const [sourcesList, setSourcesList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [leadTypeList, setLeadTypeList] = useState([]);
  const [customerTypeList, setCustomerTypeList] = useState([]);

  // Selected filter values
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
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

  // console.log("-----111----", tableData);

  useEffect(() => {
    if (selectedUserType?.value) {
      fetchDropdownData(selectedUserType.value);
    }
  }, [selectedUserType]);

  useEffect(() => {
    fetchTaskData();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async (userTypeValue = null) => {
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
        setUserList(
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

  const fetchTaskData = async (params = {}) => {
    try {
      setLoading(true);
      const res = await _get('/gettaskdashboard', {params});
      // console.log("task res-->", res);
      if (res?.data?.success) {
        const {totalStatusCounts, userWise} = res.data?.data;
        setCardData(totalStatusCounts || {});
        setTableData(userWise || []);
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildFilterParams = () => ({
    source_id: selectedSource?.map(u => u.value).join(',') || '',
    project_id: selectedProject?.map(u => u.value).join(',') || '',
    userid: selectedUser?.map(u => u.value).join(',') || '',
    property_type_id: selectedPropertyType?.value || '',
    budget_id: selectedBudget?.value || '',
    city_id: selectedCity?.value || '',
    lead_type_id: selectedLeadType?.value || '',
    customer_type_id: selectedCustomerType?.value || '',
    from_date: fromDate || '',
    to_date: toDate || '',
    utype: selectedUserType?.value || '',
  });

  const applyFilters = async () => {
    try {
      const params = buildFilterParams();
      setActiveFilterParams(params);
      console.log('-------', params);
      const res = await _get('/gettaskdashboard', {params});
      if (res?.data?.success) {
        const {totalStatusCounts, userWise} = res.data.data;
        setCardData(totalStatusCounts || {});
        setTableData(userWise || []);
      }

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
    setSelectedUser(null);
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
    fetchTaskData();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Task Dashboard</Text>
          <TouchableOpacity
            onPress={() =>
              isFilterApplied ? resetFilters() : setFilterModalVisible(true)
            }>
            <Icon
              name={isFilterApplied ? 'x' : 'filter'}
              size={wp('6%')}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* Card Component */}
        <CardComponent
          cardData={cardData}
          activeFilterParams={activeFilterParams}
        />

        {/* Table Component */}
        <UserWiseStatusTable
          tableData={tableData}
          activeFilterParams={activeFilterParams}
        />
      </ScrollView>

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
        userList={userList}
        propertyTypeList={propertyTypeList}
        budgetList={budgetList}
        cityList={cityList}
        leadTypeList={leadTypeList}
        customerTypeList={customerTypeList}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
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
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        userTypeOptions={userTypeOptions}
        selectedUserType={selectedUserType}
        setSelectedUserType={setSelectedUserType}
      />
    </View>
  );
};

export default TaskTab;

const styles = StyleSheet.create({
  container: {
    padding: wp('1%'),
    backgroundColor: '#fff',
    minHeight: hp('100%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
    padding: 10,
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
