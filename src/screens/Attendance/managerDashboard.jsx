import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {_get} from '../../api/apiClient';

const ManagerDashboard = () => {
  const navigation = useNavigation();

  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    late: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teamList, setTeamList] = useState([]);

  const handleCardPress = item => {
    navigation.navigate('End Day-Check Out ', {member: item});
  };

  const fetchAttendanceOverview = async () => {
    const response = await _get('/attendance/dashboard');
    const resData = response?.data;

    if (resData?.success) {
      setAttendance({
        present: resData?.data?.present ?? 0,
        absent: resData?.data?.absent ?? 0,
        late: resData?.data?.half_day ?? 0,
      });
    }
  };

  const fetchTodayAttendanceList = async () => {
    const response = await _get('/attendance/todayAttendanceList');
    console.log('-------------', response);
    const resData = response?.data;

    if (resData?.success && Array.isArray(resData?.data)) {
      setTeamList(resData.data);
    }
  };

  const fetchAllData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      await Promise.all([
        fetchAttendanceOverview(),
        fetchTodayAttendanceList(),
      ]);
    } catch (e) {
      console.log('Dashboard error:', e);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const onRefresh = useCallback(() => {
    fetchAllData(true);
  }, []);

  const renderItem = ({item}) => {
    const profileImage = item?.photo
      ? `https://leadactpro.in/api/public/uploads/${item.photo}`
      : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleCardPress(item)}>
        <View style={styles.teamCard}>
          <Image source={{uri: profileImage}} style={styles.avatar} />

          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.name}>
              {item.name}
              {item.work_type ? ` (${item.work_type})` : ''}
            </Text>

            <Text style={styles.statusText}>
              {item.status}
              {item.check_in_time ? ` • ${item.check_in_time}` : ''}
            </Text>
          </View>

          <View
            style={[
              styles.statusCircle,
              {
                backgroundColor:
                  item.status === 'Present'
                    ? '#4CAF50'
                    : item.status === 'Half Day'
                    ? '#2196F3'
                    : '#F44336',
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2D87DB"
          style={{marginTop: 30}}
        />
      ) : (
        <>
          {/* Attendance Overview */}
          <View style={styles.attendanceContainer}>
            <Text style={styles.subHeader}>Attendance Overview</Text>

            <View style={styles.attendanceBoxes}>
              <View
                style={[styles.attendanceBox, {backgroundColor: '#4CAF50'}]}>
                <Text style={styles.attendanceText}>
                  Present: {attendance.present}
                </Text>
              </View>

              <View
                style={[styles.attendanceBox, {backgroundColor: '#F44336'}]}>
                <Text style={styles.attendanceText}>
                  Absent: {attendance.absent}
                </Text>
              </View>

              <View
                style={[styles.attendanceBox, {backgroundColor: '#2196F3'}]}>
                <Text style={styles.attendanceText}>
                  Late: {attendance.late}
                </Text>
              </View>
            </View>
          </View>

          {/* Live Location Map */}
          <View style={styles.mapContainer}>
            <Text style={styles.subHeader}>Live Location Map</Text>

            <Image
              source={{
                uri: 'https://tse4.mm.bing.net/th/id/OIP.VQx1OlhclezJzH7Ya73-TAHaFF?pid=Api&P=0&h=180',
              }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>

          {/* Team Activity */}
          <View style={styles.teamContainer}>
            <Text style={styles.subHeader}>Team Activity</Text>
            <FlatList
              data={teamList}
              keyExtractor={item => item.user_id.toString()}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#2D87DB']}
                />
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ManagerDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(3),
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
  },
  subHeader: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    marginBottom: responsiveHeight(1),
  },
  attendanceContainer: {
    marginBottom: responsiveHeight(2),
  },
  attendanceBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceBox: {
    flex: 1,
    padding: responsiveWidth(2),
    marginHorizontal: responsiveWidth(1.25),
    borderRadius: 8,
    minHeight: responsiveHeight(5),
    justifyContent: 'center',
  },
  attendanceText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
  },
  mapContainer: {
    marginBottom: responsiveHeight(2.5),
  },
  mapImage: {
    width: '100%',
    height: responsiveHeight(20),
    borderRadius: 8,
  },
  teamContainer: {
    flex: 1,
    marginBottom: responsiveHeight(2.5),
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: responsiveWidth(2.5),
    marginVertical: responsiveHeight(0.6),
    borderRadius: 8,
    minHeight: responsiveHeight(7.5),
  },
  avatar: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
  },
  name: {
    fontWeight: '600',
    fontSize: responsiveFontSize(1.9),
  },
  statusText: {
    color: 'gray',
    fontSize: responsiveFontSize(1.6),
    marginTop: responsiveHeight(0.4),
  },
  statusCircle: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: responsiveWidth(2.5),
  },
});
