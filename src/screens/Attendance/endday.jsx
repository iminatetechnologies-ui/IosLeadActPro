import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  BackHandler,
  StatusBar,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {_get} from '../../api/apiClient';

const Endday = ({navigation}) => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const DUMMY_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  /* 🔙 Reset to Dashboard */
  const goToDashboard = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home2'}],
      }),
    );
  };

  /* 🔙 Hardware Back */
  useEffect(() => {
    const backAction = () => {
      goToDashboard();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  /* 📡 Attendance API */
  useEffect(() => {
    getTodayAttendance();
  }, []);

  const getTodayAttendance = async () => {
    try {
      setLoading(true);

      // ✅ Fetch attendance and user_id from API
      const response = await _get('/attendance/mytodayreports');
      // console.log('API Response:99999', response);

      // Aapka API response sahi hai - response.data.data object hai
      if (response?.data?.success && response?.data?.data) {
        const attendanceData = response.data.data;

        setAttendance(attendanceData);
        setUserId(attendanceData.user_id);
      } else {
        setAttendance(null);
      }
    } catch (error) {
      console.log('Attendance API Error:', error);
      setAttendance(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2D87DB" />
      </View>
    );
  }

  if (!attendance) {
    return (
      <View style={styles.loader}>
        <Text>No attendance data found</Text>
      </View>
    );
  }

  const imageUri = attendance.photo
    ? `https://leadactpro.in/api/public/uploads/${attendance.photo}`
    : DUMMY_IMAGE;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToDashboard}
          style={styles.backBtn}
          activeOpacity={0.7}>
          <MaterialIcons
            name="arrow-back"
            size={responsiveFontSize(2.8)}
            color="#fff"
          />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.headerTitle}>
          End Day Summary
        </Text>
        <View style={styles.rightSpace} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* IMAGE + NAME */}
        <View style={styles.profileSection}>
          <Image source={{uri: imageUri}} style={styles.bigAvatar} />
          <Text style={styles.userName}>{attendance.name}</Text>
        </View>

        {/* WORK DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.status}>{attendance.status}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Work Type</Text>
            <Text style={styles.value}>
              {attendance.work_type?.toUpperCase() || '--'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Check In</Text>
            <Text style={styles.value}>{attendance.check_in_time || '--'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Check Out</Text>
            <Text style={styles.value}>
              {attendance.check_out_time || '--'}
            </Text>
          </View>
          <View style={styles.divider} />

          {/* YEH LINE CHANGE KARNA HAI: leads_worked_today se calls_today */}
          <View style={styles.row}>
            <Text style={styles.label}>Total Calls</Text>
            <Text style={styles.value}>
              {attendance.calls_today || '0'} {/* CHANGED HERE */}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Total Talktime</Text>
            <Text style={styles.value}>{attendance.call_duration || '0'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Visits</Text>
            <Text style={styles.value}>{attendance.visits_today || '0'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Meetings</Text>
            <Text style={styles.value}>{attendance.meetings_today || '0'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Endday;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EEF2F5',
  },

  header: {
    height: responsiveHeight(12),
    minHeight: 26,
    backgroundColor: '#2D87DB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },

  backBtn: {
    width: responsiveWidth(10),
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: responsiveWidth(1),
    marginBottom: responsiveHeight(-4),
  },

  rightSpace: {
    width: responsiveWidth(10),
  },

  headerTitle: {
    flex: 1,
    textAlign: 'left',
    fontSize: responsiveFontSize(2.1),
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: '#fff',
    marginBottom: responsiveHeight(-4),
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: responsiveWidth(4),
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },

  bigAvatar: {
    width: responsiveWidth(36),
    height: responsiveWidth(36),
    borderRadius: responsiveWidth(18),
    borderWidth: 2,
    borderColor: '#0389ca',
    marginBottom: responsiveHeight(1),
  },

  userName: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '600',
    color: '#000',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveWidth(3),
    padding: responsiveWidth(4),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: responsiveHeight(2),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(0.8),
  },

  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#4A4A4A',
    fontWeight: '500',
  },

  value: {
    fontSize: responsiveFontSize(1.8),
    color: '#000',
    fontWeight: '600',
  },

  highlight: {
    color: '#E85D04',
  },

  status: {
    color: '#2ECC71',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: responsiveHeight(0.5),
  },
});
