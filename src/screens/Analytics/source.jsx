import React, {useEffect, useState} from 'react';
import {View, Alert, Dimensions, StyleSheet} from 'react-native';

import {_get, _post} from '../../api/apiClient';
import FilterModal from '../../components/FilterModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import GraphPage from './sourcetab/GraphPage';

const screenWidth = Dimensions.get('window').width;

const chartColors = [
  '#4facfe',
  '#f6d365',
  '#43e97b',
  '#43cea2',
  '#f093fb',
  '#ff758c',
  '#30cfd0',
  '#667eea',
  '#fc5c7d',
  '#3a7bd5',
];

const Source = ({navigation}) => {
  const [cardData, setCardData] = useState([]);

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
  useEffect(() => {
    if (selectedUserType?.value) {
      fetchDropdownData(selectedUserType.value);
    }
  }, [selectedUserType]);

  useEffect(() => {
    fetchChartData();
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

        // ✅ Ye wali line user_type ke hisaab se filtered hogi
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

  const fetchChartData = async (params = {}) => {
    try {
      const response = await _get('/getsourceanalyticsdashboard', {params});
      const finalData = response?.data?.data;
      if (!finalData) return;

      const dataArray = Object.keys(finalData).map((key, index) => ({
        name: key,
        population: finalData[key],
        color: chartColors[index % chartColors.length],
        legendFontColor: '#333',
        legendFontSize: 12,
      }));
      setCardData(dataArray);
    } catch (error) {
      console.error('Chart fetch error:', error);
    }
  };

  const buildFilterParams = () => ({
    source_id: selectedSource?.map(u => u.value).join(',') || '',
    project_id: selectedProject?.map(u => u.value).join(',') || '',
    // userid: selectedUser?.value || '',
    userid: selectedUser?.map(u => u.value).join(',') || '',

    property_type_id: selectedPropertyType?.value || '',
    budget_id: selectedBudget?.value || '',
    city_id: selectedCity?.value || '',
    lead_type_id: selectedLeadType?.value || '',
    customer_type_id: selectedCustomerType?.value || '',
    from_date: fromDate || '',
    to_date: toDate || '',
    utype: selectedUserType?.value || '', // ✅ Fixed here
  });

  const applyFilters = async () => {
    try {
      const params = buildFilterParams();
      setActiveFilterParams(params);
      // console.log('Filter params:--->', params);

      const response = await _get('/getsourceanalyticsdashboard', {params}); // ✅ fixed here
      const finalData = response?.data?.data;

      const defaultLabels = [
        'Fresh',
        'Interested',
        'Callback',
        'Opportunity',
        'Won',
        'Missed',
      ];
      const dataArray = defaultLabels.map((key, index) => ({
        name: key,
        population: finalData?.[key] || 0,
        color: chartColors[index % chartColors.length],
        legendFontColor: '#333',
        legendFontSize: 12,
      }));

      setCardData(dataArray);
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
    setIsFilterApplied(false);
    setActiveFilterParams({});
    fetchChartData();
  };

  return (
    <View style={{flex: 1}}>
      <GraphPage
        navigation={navigation}
        cardData={cardData}
        isFilterApplied={isFilterApplied}
        resetFilters={resetFilters}
        setFilterModalVisible={setFilterModalVisible}
        activeFilterParams={activeFilterParams}
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

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: hp('1.5%'),
  },
  dot: {
    width: wp('1.5%'),
    height: wp('1.5%'),
    borderRadius: wp('0.7%'),
    marginHorizontal: wp('1%'),
  },
});

export default Source;
