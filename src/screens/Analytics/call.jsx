

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CardComponent from './call/CardComponent';
import {_get} from '../../api/apiClient';
import Icon from 'react-native-vector-icons/Feather';
import FilterCalldata from '../../components/FilterCalldata';
import StatusTable from './call/StatusTabledashboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Call() {
  const [callData, setCallData] = useState(null);
  const [totalCalls, setTotalCalls] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [userTypeOptions] = useState([
    {label: 'User Wise', value: 1},
    {label: 'Team Wise', value: 2},
  ]);
  const [selectedUserType, setSelectedUserType] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedUserType?.value) {
      fetchUserList(selectedUserType.value);
    }
  }, [selectedUserType]);

  const fetchUserList = async userTypeValue => {
    try {
      const res = await _get(`/getfiltervalues?user_type=${userTypeValue}`);
      const data = res?.data?.data;
      if (data?.users) {
        setUserList(data.users.map(i => ({label: i.name, value: i.id})));
      }
    } catch (err) {
      console.error('User list fetch error:', err);
    }
  };

  const fetchAnalytics = async (params = {}) => {
    try {
      const res = await _get('/callanalytics', {params});
      const data = res?.data?.data;
      if (data) {
        setTotalCalls(data.totalCalls || 0);
        setCallData(data);
      }
    } catch (error) {
      console.error('Fetch call analytics error:', error);
    }
  };

  const buildFilterParams = () => ({
    from_date: fromDate || '',
    to_date: toDate || '',
    utype: selectedUserType?.value || '',
    // user_id: selectedUser?.value || '',
    user_id: selectedUser?.map(u => u.value).join(',') || '',
  });

  const applyFilters = async () => {
    try {
      const params = buildFilterParams();
      await fetchAnalytics(params);
      setIsFilterApplied(true);
      setFilterModalVisible(false);
    } catch (err) {
      console.error('Filter apply failed:', err);
    }
  };

  const resetFilters = () => {
    setSelectedUser(null);
    setSelectedUserType(null);
    setFromDate(null);
    setToDate(null);
    setIsFilterApplied(false);
    fetchAnalytics();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.totalText}>
          Total Calls: <Text style={styles.count}>{totalCalls}</Text>
        </Text>

        <TouchableOpacity
          onPress={
            isFilterApplied ? resetFilters : () => setFilterModalVisible(true)
          }
          style={styles.filterButton}>
          <Icon
            name={isFilterApplied ? 'x' : 'filter'}
            size={wp('6%')}
            color={isFilterApplied ? 'black' : '#000'}
          />
        </TouchableOpacity>
      </View>

      <CardComponent callData={callData} />
      <StatusTable filters={buildFilterParams()} />

      <FilterCalldata
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={applyFilters}
        onDateRangeChange={({date_from, date_to}) => {
          setFromDate(date_from);
          setToDate(date_to);
        }}
        userList={userList}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('0%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    paddingHorizontal: wp('4%'),
  },
  totalText: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#000',
  },
  count: {
    color: '#0058aa',
    fontWeight: 'bold',
  },
  filterButton: {
    padding: wp('2.5%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});