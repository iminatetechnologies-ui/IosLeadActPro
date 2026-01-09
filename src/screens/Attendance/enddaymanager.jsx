import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import {_get} from '../../api/apiClient';

const Endday = ({route}) => {
  const {member} = route.params;
  const userId = member.user_id;

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const DUMMY_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  useEffect(() => {
    getTodayAttendance();
  }, []);

  const getTodayAttendance = async () => {
    try {
      setLoading(true);

      const response = await _get(
        `/attendance/gettodayuserattendance/${userId}`,
      );
      // console.log('------------', response);

      if (response?.data?.success && response?.data?.data?.length > 0) {
        setAttendance(response.data.data[0]);
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

          <View style={styles.row}>
            <Text style={styles.label}>Total Calls</Text>
            <Text style={styles.value}>
              {attendance.leads_worked_today || '0'}
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

          <View style={styles.divider} />
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
