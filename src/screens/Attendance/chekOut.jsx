import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from '../../utils/permissions';
import {_get, _post} from '../../api/apiClient';

const CheckOut = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [summary, setSummary] = useState({
    userid: null,
    calls: 0,
    site_visits: 0,
    meetings: 0,
  });

  const [successMessage, setSuccessMessage] = useState('');

  const showToast = message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // 📍 Location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      pos => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      err => console.log('Location error:', err),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // 📊 Today Summary API
  const fetchTodaySummary = async () => {
    try {
      const response = await _get('/attendance/today-summary');
      const data = response?.data;

      setSummary({
        userid: data?.userid ?? null,
        calls: Number(data?.calls ?? 0),
        site_visits: Number(data?.visits ?? 0),
        meetings: Number(data?.meetings ?? 0),
      });
    } catch (error) {
      console.log('Today summary error:', error);
    }
  };

  // 🔄 Pull Down Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodaySummary();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getCurrentLocation();
    fetchTodaySummary();
  }, []);

  // 🚀 Checkout
  const handleCheckOut = async () => {
    if (!latitude || !longitude) {
      showToast('Location not available');
      return;
    }

    if (!summary.userid) {
      showToast('User ID not found');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      };

      const response = await _post('/attendance/check-out', payload);

      if (response?.data?.success) {
        showToast('Day checked out successfully');

        navigation.navigate('End Day-Check Out');
      } else {
        showToast('Something went wrong');
      }
    } catch (error) {
      console.log('Check-out error:', error);
      showToast('Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2D87DB']}
            tintColor="#2D87DB"
          />
        }>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="phone" size={28} color="#22C55E" />
            <Text style={styles.countText}>{summary.calls} Calls</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="location" size={28} color="#3B82F6" />
            <Text style={styles.countText}>
              {summary.site_visits} Site Visits
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <MaterialCommunityIcons
              name="file-document"
              size={28}
              color="#F97316"
            />
            <Text style={styles.countText}>{summary.meetings} Meetings</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckOut}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>END DAY - CHECK OUT</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckOut;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    margin: responsiveWidth(4),
    paddingVertical: responsiveHeight(2.5),
    borderRadius: 12,
    elevation: 3,
  },

  summaryItem: {
    alignItems: 'center',
    width: '33%',
  },

  countText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.7),
    color: '#374151',
    fontWeight: '500',
  },

  successMessageContainer: {
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
    padding: responsiveWidth(3),
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    alignItems: 'center',
  },

  successMessageText: {
    color: '#065F46',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },

  checkoutButton: {
    marginTop: responsiveHeight(4),
    marginHorizontal: responsiveWidth(6),
    backgroundColor: '#0389ca',
    paddingVertical: responsiveHeight(2),
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },

  checkoutText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },
});
