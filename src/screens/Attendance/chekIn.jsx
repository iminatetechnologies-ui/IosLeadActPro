import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {CommonActions} from '@react-navigation/native';

import {requestLocationPermission} from '../../utils/permissions';
import {_post} from '../../api/apiClient';
import {useUser} from '../contaxt/UserContext';

const CheckIn = ({navigation}) => {

  const {user} =useUser();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [workType, setWorkType] = useState('Office');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationText, setLocationText] = useState('Fetching location...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );

      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      setLocationText('Location permission denied');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setLocationText(
          `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        );
      },
      error => {
        console.log('Location error:', error);
        setLocationText('Unable to fetch location');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };
  

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const showToast = message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const handleCheckIn = async () => {
    if (!latitude || !longitude) {
      showToast('Location not available');
      return;
    }

    const payload = {
      work_type: workType.toLowerCase(),
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    };

    try {
      setLoading(true);
      const response = await _post('/attendance/check-in', payload);

      if (response?.data?.success) {
        showToast('Check-in successful');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Checkout'}],
          }),
        );
      } else {
        showToast('Something went wrong');
      }
    } catch (error) {
      console.log('Check-in error:', error);
      showToast('Failed to check-in');
    } finally {
      setLoading(false);
    }
  };

  const getWorkTypeIcon = type => {
    switch (type) {
      case 'Office':
        return <Icon name="office-building" size={20} color="#374151" />;
      case 'Field':
        return <Icon name="car" size={20} color="#374151" />;
      case 'WFH':
        return <Icon name="home" size={20} color="#374151" />;
      default:
        return <Icon name="office-building" size={20} color="#374151" />;
    }
  };

  const getActiveWorkTypeIcon = type => {
    switch (type) {
      case 'Office':
        return <Icon name="office-building" size={20} color="#FFFFFF" />;
      case 'Field':
        return <Icon name="car" size={20} color="#FFFFFF" />;
      case 'WFH':
        return <Icon name="home" size={20} color="#FFFFFF" />;
      default:
        return <Icon name="office-building" size={20} color="#FFFFFF" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Check-In</Text>
            <Text style={styles.headerSubtitle}>Start Your Day</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.timeText}>{currentTime}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.locationText}>
                <Icon name="map-marker" size={20} color="#6B7280" />{' '}
                {locationText}
              </Text>
            </View>
          </View>

          <View style={styles.tabSection}>
            <Text style={styles.sectionLabel}>Select Work Type</Text>
            <View style={styles.tabContainer}>
              {['Office', 'Field', 'WFH'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.tab, workType === type && styles.activeTab]}
                  onPress={() => setWorkType(type)}>
                  <View style={styles.tabContent}>
                    {workType === type
                      ? getActiveWorkTypeIcon(type)
                      : getWorkTypeIcon(type)}
                    <Text
                      style={
                        workType === type
                          ? styles.activeTabText
                          : styles.tabText
                      }>
                      {type}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={{
            uri:
              user?.avatar?.trim?.() ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
              style={styles.profileImage}
            />
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Ready</Text>
            </View>
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.checkInButton}
              activeOpacity={0.8}
              onPress={handleCheckIn}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="fingerprint" size={30} color="#fff" />
                  <Text style={styles.checkInButtonText}>
                     CHECK IN
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: responsiveHeight(2),
  },

  mainCard: {
    backgroundColor: '#FFFFFF',
    margin: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // elevation: 8,
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    color: '#0389ca',
  },

  headerSubtitle: {
    fontSize: responsiveFontSize(1.8),
    color: '#6B7280',
    marginTop: responsiveHeight(0.5),
  },

  infoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: responsiveWidth(3),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1.5),
    justifyContent: 'center', // Center content in each row
    width: '100%',
  },

  dateText: {
    fontSize: responsiveFontSize(1.8),
    color: '#374151',
    marginLeft: responsiveWidth(3),
    textAlign: 'center',
    flex: 1,
  },

  timeText: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: '700',
    color: '#111827',
    marginLeft: responsiveWidth(3),
    textAlign: 'center',
    flex: 1,
  },

  locationText: {
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    marginLeft: responsiveWidth(3),
    textAlign: 'center',
    flex: 1,
  },

  tabSection: {
    marginBottom: responsiveHeight(2),
  },

  sectionLabel: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: '#374151',
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: responsiveWidth(2.5),
    padding: responsiveWidth(1),
  },

  tab: {
    flex: 1,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#0389ca',
    shadowColor: '#0389ca',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },

  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tabText: {
    fontSize: responsiveFontSize(1.4),
    color: '#374151',
    marginLeft: responsiveWidth(1),
  },

  activeTabText: {
    fontSize: responsiveFontSize(1.4),
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
  },

  imageWrapper: {
    alignItems: 'center',
    marginVertical: responsiveHeight(2),
    position: 'relative',
  },

  profileImage: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(15),
    borderWidth: 4,
    borderColor: '#0389ca',
  },

  profileBadge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#10B981',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveWidth(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  profileBadgeText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
  },

  buttonSection: {
    marginTop: responsiveHeight(1),
  },

  checkInButton: {
    flexDirection: 'row',
    backgroundColor: '#0389ca',
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(6),
    borderRadius: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0389ca',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  checkInButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    marginLeft: responsiveWidth(2),
  },

  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.5),
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2.5),
    marginHorizontal: responsiveWidth(1),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#374151',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
  },
});
