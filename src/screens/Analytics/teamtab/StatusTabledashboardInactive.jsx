import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {_get} from '../../../api/apiClient';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

const StatusTableInactive = ({activeFilterParams = {}}) => {
  const navigation = useNavigation();
  const [data12, setData12] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevParams, setPrevParams] = useState('');

  const fetchTableData = async () => {
    try {
      const queryParams = new URLSearchParams({
        from_date: activeFilterParams?.from_date || '',
        to_date: activeFilterParams?.to_date || '',
        userid: activeFilterParams?.userid || '',
        project_id: activeFilterParams?.project_id || '',
        source_id: activeFilterParams?.source_id || '',
        property_type_id: activeFilterParams?.property_type_id || '',
        budget_id: activeFilterParams?.budget_id || '',
        city_id: activeFilterParams?.city_id || '',
        lead_type_id: activeFilterParams?.lead_type_id || '',
        customer_type_id: activeFilterParams?.customer_type_id || '',
        utype: activeFilterParams?.utype || '',
        date_type :activeFilterParams?.date_type||'',
      });

      const response = await _get(`/statuswisedata?${queryParams.toString()}`);
      const inactive = response?.data?.data?.inactive_users || [];
      setData12(inactive);
    } catch (error) {
      console.error('❌ API Error:', error?.response || error);
      setData12([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = JSON.stringify(activeFilterParams);
    if (currentParams !== prevParams) {
      setPrevParams(currentParams);
      setLoading(true);
      fetchTableData();
    }
  }, [activeFilterParams]);

  const navigateToScreen = (status, item) => {
    navigation.navigate('Filtered Leads', {
      status,
      userid: item.user_id,
      username: item.user_name,
      filterParams: activeFilterParams,
    });
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.nameColumn, styles.headerText]}>
        Name
      </Text>
      {[
        'Fresh',
        'Interested',
        'Callback',
        'Opportunity',
        'Won',
        'Missed',
        'Not Interested',
        'Total Leads',
      ].map((label, index) => (
        <Text key={index} style={[styles.cell, styles.headerText]}>
          {label}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({item, index}) => {
    const statusKeys = [
      'Fresh',
      'Interested',
      'Callback',
      'Opportunity',
      'Won',
      'Missed',
      'Notinterested',
      'total_leads',
    ];

    return (
      <View
        style={[
          styles.row,
          {backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'},
        ]}>
        <Text style={[styles.cell, styles.nameColumn]}>{item.user_name}</Text>
        {statusKeys.map((key, idx) => {
          const isTotal = key === 'total_leads';
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={isTotal ? 1 : 0.6}
              onPress={() => !isTotal && navigateToScreen(key, item)}>
              <Text
                style={[
                  styles.cell,
                  isTotal && {fontWeight: '700', color: '#000'},
                ]}>
                {item[key] || '0'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      <View style={styles.tableCard}>
        {renderHeader()}
        {data12.length === 0 ? (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>No inactive user data found.</Text>
          </View>
        ) : (
          <FlatList
            data={data12}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            style={{maxHeight: rh(55)}}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default StatusTableInactive;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: rw(3),
    paddingVertical: rh(2),
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: rw(3),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    overflow: 'hidden',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: rh(5),
  },
  noDataView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rh(4),
  },
  noDataText: {
    color: '#777',
    fontSize: rf(1.7),
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderColor: '#eee',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#0389ca',
  },
  cell: {
    minWidth: rw(18),
    maxWidth: rw(22),
    paddingVertical: rh(1.5),
    paddingHorizontal: rw(2),
    fontSize: rf(1.6),
    color: '#333',
    textAlign: 'center',
  },
  nameColumn: {
    minWidth: rw(35),
    maxWidth: rw(40),
    textAlign: 'left',
    fontWeight: '500',
  },
  headerText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: rf(1.5),
  },
});
