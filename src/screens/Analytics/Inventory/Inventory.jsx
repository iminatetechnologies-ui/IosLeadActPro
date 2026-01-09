import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CardComponent from './CardComponent';
import StatusTable from './StatusTableInventory';
import {_get} from '../../../api/apiClient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Inventory() {
  const [overallCounts, setOverallCounts] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    if (!refreshing) setLoading(true);
    try {
      const response = await _get('/getresaleanalytics');
      console.log('API Response:', response.data);

      if (response.data.success === 1) {
        const apiData = response.data.data;

        setOverallCounts(apiData.overall_counts || null);
        setUserData(apiData.user_wise_data || []);
      } else {
        Alert.alert('Error', 'Failed to fetch inventory data.');
      }
    } catch (error) {
      console.log('API Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInventoryData();
  }, []);

  // Render Header (cards + total)
  const renderHeader = () => (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.totalText}>
          Total Inventory: <Text style={styles.count}>{overallCounts?.total || 0}</Text>
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          {/* <Icon name="filter" size={wp('6%')} color="#000" /> */}
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#0058aa" style={{marginTop: hp('2%')}} />
      ) : (
        <CardComponent callData={overallCounts} />
      )}
    </>
  );

  return (
    <FlatList
      data={userData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <StatusTable tableData={[item]} loading={false} />}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0058aa" />
      }
      contentContainerStyle={{paddingBottom: hp('5%')}}
    />
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: wp('0%')},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    paddingHorizontal: wp('4%'),
  },
  totalText: {fontSize: wp('4.2%'), fontWeight: '600', color: '#000'},
  count: {color: '#0058aa', fontWeight: 'bold'},
  filterButton: {
    padding: wp('2.5%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
