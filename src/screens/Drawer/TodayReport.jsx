import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {_get} from '../../api/apiClient';
import DateRangePicker from '../../components/DatePicker';
import Icon from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

export default function TodayReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const fetchTodayReport = async (customParams = null) => {
    try {
      const params =
        customParams !== null
          ? customParams
          : {
              ...(fromDate && {start_date: fromDate}),
              ...(toDate && {end_date: toDate}),
            };

      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const res = await _get(`today-reports?${queryString}`);
      console.log('------------', res);
      setReportData(res?.data?.data || []);
    } catch (error) {
      console.log('❌ Error fetching today reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodayReport();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTodayReport();
  }, [fromDate, toDate]);

  const applyFilters = () => {
    setFilterVisible(false);
    setLoading(true);
    fetchTodayReport();
  };

  const isFilterApplied = !!(fromDate || toDate);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🔍 Filter Button */}
      <TouchableOpacity
        onPress={() => {
          if (isFilterApplied) {
            setFromDate(null);
            setToDate(null);
            setLoading(true);
            fetchTodayReport({});
          } else {
            setFilterVisible(true);
          }
        }}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={styles.iconTouchable}>
        <Icon
          name={isFilterApplied ? 'x' : 'filter'}
          size={isTablet ? wp('4%') : wp('6%')}
          color="#333"
        />
      </TouchableOpacity>

      {/* 🧭 Table Section */}
      {loading ? (
        <ActivityIndicator size="large" color="#0389ca" style={{marginTop: hp('30%')}} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.tableWrapper}>
            <View style={styles.tableContainer}>
              {/* Header */}
              <View style={styles.headerRow}>
                {[
                  'Name',
                  'Productivity',
                  'Calls',
                  'Duration',
                  'Visit',
                  'Meeting',
                  'EOI',
                  'Booking',
                  'Revenue',
                  'Incentive',
                  'Target Calls',
                  'Target Talk Time',
                  'Target Visit',
                  'Target Meeting',
                  'Target Booking',
                ].map((header, i) => (
                  <Text key={i} style={styles.headerCell}>
                    {header}
                  </Text>
                ))}
              </View>

              {/* Data Rows */}
              <ScrollView
                style={{maxHeight: hp('70%')}}
                showsVerticalScrollIndicator={false}>
                {reportData.length > 0 ? (
                  reportData.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.row,
                        index % 2 === 0 ? styles.evenRow : styles.oddRow,
                      ]}>
                      <Text style={styles.cell}>{item.username || '-'}</Text>
                      <Text style={styles.cell}>
                        {item.productivity ? `${item.productivity}%` : '-'}
                      </Text>
                      <Text style={styles.cell}>{item.today_calls || 0}</Text>
                      <Text style={styles.cell}>{item.talktime || '-'}</Text>
                      <Text style={styles.cell}>{item.visits || 0}</Text>
                      <Text style={styles.cell}>{item.meeting || 0}</Text>
                      <Text style={styles.cell}>{item.eoi || 0}</Text>
                      <Text style={styles.cell}>{item.bookings || 0}</Text>
                      <Text style={styles.cell}>{item.revenue || 0}</Text>
                      <Text style={styles.cell}>{item.incentive || 0}</Text>
                      <Text style={styles.cell}>{item.target_calls || 0}</Text>
                      <Text style={styles.cell}>{item.target_talk_min || 0}</Text>
                      <Text style={styles.cell}>{item.target_visits || 0}</Text>
                      <Text style={styles.cell}>{item.target_meetings || 0}</Text>
                      <Text style={styles.cell}>{item.target_bookings || 0}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.noDataRow}>
                    <Text style={styles.noDataText}>No data available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      )}

      {/* 🧾 Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {
                width: isTablet ? '60%' : '90%',
                padding: isTablet ? wp('3%') : wp('5%'),
              },
            ]}>
            <Text style={styles.modalTitle}>Apply Filters</Text>

            <Text style={styles.label}>Select Date Range</Text>
            <DateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              onRangeChange={({date_from, date_to}) => {
                setFromDate(date_from);
                setToDate(date_to);
              }}
            />

            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f1f6fa',
    paddingTop: hp('1.5%'),
  },
  iconTouchable: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    alignItems: 'flex-end',
  },
  tableWrapper: {
    flex: 1,
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('2%'),
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('1%'),
    overflow: 'hidden',
    // elevation:2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.5%'),
  },
  headerCell: {
    width: wp('18%'),
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: wp('2.8%'),
    paddingHorizontal: wp('1%'),
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  evenRow: {
    backgroundColor: '#f9fcff',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  cell: {
    width: wp('18%'),
    textAlign: 'left',
    fontSize: wp('2.6%'),
    paddingHorizontal: wp('1%'),
    color: '#333',
  },
  noDataRow: {
    paddingVertical: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#777',
    fontSize: wp('3.5%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: wp('3%'),
  },
  modalTitle: {
    fontSize: isTablet ? wp('4%') : wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
    color: '#0389ca',
  },
  label: {
    fontWeight: '600',
    marginTop: hp('1.5%'),
    marginBottom: hp('-2%'),
    fontSize: isTablet ? wp('2.5%') : wp('3.5%'),
  },
  applyButton: {
    backgroundColor: '#0389ca',
    paddingVertical: isTablet ? hp('1%') : hp('1.5%'),
    borderRadius: isTablet ? wp('1%') : wp('2%'),
    marginTop: isTablet ? hp('1.5%') : hp('2%'),
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: isTablet ? wp('2.8%') : wp('4%'),
  },
  cancelText: {
    color: '#0066cc',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: isTablet ? hp('1%') : hp('1.5%'),
    fontSize: isTablet ? wp('2.5%') : wp('3.5%'),
  },
});
