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

const StatusTable = ({activeFilterParams = {}}) => {
  const navigation = useNavigation();
  const [tableData, setTableData] = useState([]);
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
      const active = response?.data?.data?.active_users || [];
      setTableData(active);
    } catch (error) {
      console.error('❌ API Error:', error?.response || error);
      setTableData([]);
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
    const navigateToScreen = status => {
      navigation.navigate('Filtered Leads', {
        status,
        userid: item.user_id,
        filterParams: activeFilterParams,
      });
    };

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
          index % 2 === 0 ? styles.evenRow : styles.oddRow,
          index === tableData.length - 1 && {borderBottomWidth: 0}, // remove border for last row
        ]}>
        <Text style={[styles.cell, styles.nameColumn, styles.nameText]}>
          {item.user_name}
        </Text>

        {statusKeys.map((key, i) => {
          const isTotal = key === 'total_leads';
          return (
            <TouchableOpacity
              key={i}
              onPress={() => !isTotal && navigateToScreen(key)}
              activeOpacity={isTotal ? 1 : 0.6}>
              <Text
                style={[
                  styles.cell,
                  isTotal
                    ? styles.totalCell
                    : {color: '#333', fontWeight: '500'},
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
        <ActivityIndicator size="large" color="#0389ca" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {renderHeader()}
          {tableData.length === 0 ? (
            <Text style={styles.noDataText}>No active user data found.</Text>
          ) : (
            <FlatList
              data={tableData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              style={{maxHeight: rh(60)}}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: rw(2),
    marginVertical: rh(2),
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  scrollContainer: {
    paddingBottom: rh(2),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: rh(5),
  },
  noDataText: {
    padding: rh(3),
    color: '#777',
    fontSize: rf(1.6),
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderColor: '#e1e1e1',
  },
  headerRow: {
    backgroundColor: '#0389ca',
  },
  headerText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: rf(1.5),
    textAlign: 'center',
  },
  cell: {
    minWidth: rw(18),
    maxWidth: rw(22),
    paddingVertical: rh(1.4),
    paddingHorizontal: rw(1.5),
    fontSize: rf(1.5),
    textAlign: 'center',
  },
  nameColumn: {
    minWidth: rw(35),
    maxWidth: rw(40),
    textAlign: 'left',
    paddingLeft: rw(2),
  },
  evenRow: {
    backgroundColor: '#f9fcff',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  totalCell: {
    color: '#000',
    fontWeight: '700',
  },
  nameText: {
    fontWeight: '600',
    color: '#000',
  },
});

export default StatusTable;
