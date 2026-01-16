import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
  Alert,
  Modal,
  ActivityIndicator,
  AppState,
  SafeAreaView,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import { _get, _post } from './../../api/apiClient';
import { useFocusEffect } from '@react-navigation/native';
import CardComponent from '../Home/CardComponent';
import BottomMenu from '../Home/bottommenu';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import Birthday from './bitrhday';
import NoticeModal from '../../components/NoticeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles.js';
import { useUser } from '../contaxt/UserContext.jsx';
import { getUserType } from '../../utils/getUserType';
import { getUserType1 } from '../../utils/getUserTypelogin.js';
import { useIsFocused } from '@react-navigation/native';
import HideHomeModal from '../Plans/hidehomemodal.jsx';
import Geolocation from 'react-native-geolocation-service';

export default function Home2({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMaxLength, setInputMaxLength] = useState(undefined);
  const [totalLeads, setTotalLeads] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const backPressCount = useRef(0);
  const backHandlerRef = useRef(null);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [usertype, setUsertype] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isTablet = DeviceInfo.isTablet();
  const isFocused = useIsFocused();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const appState = useRef(AppState.currentState);
  const countRef = useRef(0);
  const [showNotice, setShowNotice] = useState(false);
  const noticeAllowed = useRef(false);
  const [loading, setLoading] = useState(false);
  const [isCardReady, setIsCardReady] = useState(false);
  const [isDeviceInfoReady, setIsDeviceInfoReady] = useState(false);
  const [deviceName, setDeviceName] = useState(null);

  const MAX_COUNT = 3;

  // iOS-compatible toast function
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      const { ToastAndroid } = require('react-native');
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('', message, [{ text: 'OK' }]);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
  };

  const checkPlanStatus = async () => {
    try {
      const { userType, plan } = await getUserType1();

      if (userType === 'company' && Number(plan) === 0) {
        setShowPendingModal(true);
        return { success: true, message: 'Still Pending...' };
      } else {
        setShowPendingModal(false);
        return { success: false, message: 'Account Approved!' };
      }
    } catch (err) {
      console.log('Plan check error:', err);
      setShowPendingModal(true);
    }
  };

  useEffect(() => {
    checkPlanStatus();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setRefreshTrigger(prev => prev + 1);
      // Add small delay to ensure CardComponent is ready
      setTimeout(() => {
        setIsCardReady(true);
      }, 100);
    }
  }, [isFocused]);

  useEffect(() => {
    const checkOverdueLeads = async () => {
      setIsLoading(true);
      try {
        const response = await _get('/getoverdue');
        const result = response?.data;
        const count = result?.leadcount ?? 0;

        if (count > 0) {
          navigation.navigate('OverDueLead');
        }
      } catch (error) {
        console.log('❌ Overdue API error:', error);
        if (error.response) {
          showToast(
            `Error ${error.response.status}: ${error.response.data?.message ||
            JSON.stringify(error.response.data)
            }`,
          );
        } else if (error.request) {
          showToast('No response from server. Check your internet.');
        } else {
          showToast(error.message || 'Something went wrong.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const init = async () => {
      const type = await getUserType();
      setUsertype(type);

      if (type !== 'company' && type !== 'team_owner') {
        checkOverdueLeads();
      }
    };

    init();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const name = await DeviceInfo.getDeviceName();
        setDeviceName(name);
        setIsDeviceInfoReady(true);
      } catch (error) {
        console.error('Error getting device name:', error);
        setDeviceName('Unknown Device');
        setIsDeviceInfoReady(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    let intervalId = null;

    // ✅ Helper function for timestamp
    const getFormattedTimestamp = () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(now.getDate()).padStart(2, '0')} ${String(
        now.getHours(),
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds(),
      ).padStart(2, '0')}`;
    };

    const requestLocationPermission = async () => {
      try {
        // iOS ke liye permission status check karein
        const authorizationStatus = await Geolocation.requestAuthorization('whenInUse');
  
        if (authorizationStatus === 'granted') {
          getCurrentLocation();
        } else {
          console.log('❌ Location permission denied on iOS');
        }
      } catch (error) {
        console.error('❌ Error requesting location permission:', error);
      }
    };

    const startLocationUpdates = () => {
      if (!deviceName || !isDeviceInfoReady) {
        console.log('⏳ Waiting for device info...');
        return;
      }

      // console.log('🚀 Starting location updates...');

      // ✅ First fetch immediately
      getCurrentLocation('Initial Fetch');

      // ✅ Repeat every 30 seconds
      intervalId = setInterval(() => {
        getCurrentLocation('Interval Fetch');
      }, 300000);
    };

    const getCurrentLocation = (source = 'Manual') => {
      // console.log(`📍 [${source}] Getting current location...`);
      Geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // console.log(`✅ [${source}] Location fetched:`, lat, lon);
          postLocation(lat, lon);
        },
        error => {
          console.error(`❌ [${source}] Geolocation error:`, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    const postLocation = async (lat, lon) => {
      if (!deviceName || !isDeviceInfoReady) {
        console.log('🚫 Device info not ready yet, skipping location post');
        return;
      }

      const timestamp = getFormattedTimestamp();

      const data = {
        latitude: lat,
        longitude: lon,
        device_name: deviceName,
        u_time: timestamp,
      };

      // console.log('📤 Posting Location Data:', data);

      try {
        const response = await _post('/user-location', data);
        if (response.status === 200) {
          // console.log(`✅ [${timestamp}] Location posted successfully from home`,response);
        } else {
          console.log(
            `❌ [${timestamp}] Location post failed:`,
            response?.data?.message,
          );
        }
      } catch (error) {
        if (error.response) {
          console.error(
            `🔥 [${timestamp}] Server Error:`,
            error.response.status,
            error.response.data,
          );
        } else if (error.request) {
          console.error(
            `🚨 [${timestamp}] No response received`,
            error.request,
          );
        } else {
          console.error(
            `⚠️ [${timestamp}] Error setting up request:`,
            error.message,
          );
        }
      }
    };

    if (isDeviceInfoReady && deviceName) {
      requestLocationPermission();
    }

    // ✅ Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('🛑 Location updates stopped');
      }
    };
  }, [isDeviceInfoReady, deviceName]);

  useEffect(() => {
    getTotalLeads();
  }, []);

  useEffect(() => {
    // Force initial render after component mounts
    const timer = setTimeout(() => {
      setIsCardReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getTotalLeads = async () => {
    try {
      const response = await _get('/gettotalleads');
      setTotalLeads(response?.data?.data?.TotalLead || 0);
    } catch (error) {
      console.log('Error fetching total leads:', error);
    }
  };

  const searchLeadByMobile = async () => {
    if (!searchQuery) {
      return showToast('Enter a number or Name');
    }

    const isNumber = /^\d+$/.test(searchQuery);
    const isValidMobile = /^[0-9]{10}$/.test(searchQuery);

    if (isNumber && !isValidMobile) {
      return showToast('Number must be exactly 10 digits');
    }

    try {
      setLoading(true);
      const res = await _get(`/searchleads?query=${searchQuery}`);
      setLoading(false);
      const leads = res?.data?.leads;
      const message = res?.data?.message;
      const success = res?.data?.success;

      if (
        success === true &&
        message ===
        'Lead exists in the company. Please contact your manager for access.'
      ) {
        const leadId = leads?.[0]?.id;

        return Alert.alert(
          'Lead Exists',
          message,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Send Request',
              onPress: async () => {
                console.log('Send Request pressed', { leadId });
                try {
                  const url = `/requestleads/${leadId}`;
                  const forwardRes = await _get(url);

                  const forwardMessage =
                    forwardRes?.data?.message || 'No message';
                  const forwardSuccess = forwardRes?.data?.success;

                  Alert.alert(
                    forwardSuccess ? 'Success' : 'Failed',
                    forwardMessage,
                  );
                } catch (err) {
                  console.error('Forward API error:', err);

                  const serverMessage =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Internal Server Error';
                  Alert.alert('Failed', serverMessage);
                }
              },
            },
          ],
          { cancelable: false },
        );
      }

      if (leads?.length > 0) {
        navigation.navigate('LeadDetails', { leads });
        setSearchQuery('');
      } else {
        Alert.alert(
          'No Data Found',
          'Do you want to add this number as a new lead?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add to Lead',
              onPress: () => {
                navigation.navigate('AddContact', {
                  mobile: isValidMobile ? searchQuery : '',
                  name: !isNumber ? searchQuery : '',
                });
                setSearchQuery('');
              },
            },
          ],
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Search failed', 'Please try again');
    }
  };

  // iOS-compatible back handler
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        const backAction = () => {
          if (backPressCount.current === 0) {
            showToast('Press back again to exit');
            backPressCount.current += 1;
            setTimeout(() => (backPressCount.current = 0), 2000);
            return true;
          }
          BackHandler.exitApp();
          return true;
        };
        backHandlerRef.current = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandlerRef.current?.remove();
      }
    }, []),
  );

  const fetchUnreadCount = async () => {
    try {
      const res = await _get('/getnotifications');
      const notifList = res?.data?.data || [];
      const unread = notifList.filter(n => n.is_read === '0');
      setUnreadCount(unread.length);
    } catch (error) {
      console.log('Error fetching notifications:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, []),
  );

  useEffect(() => {
    setShowNotice(true);
  }, []);

  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const today = getCurrentDate();
        const stored = await AsyncStorage.getItem('noticeDate');

        if (stored !== today) {
          await AsyncStorage.setItem('noticeDate', today);
          noticeAllowed.current = true;
          countRef.current = 1;
          setShowNotice(true);
        } else if (noticeAllowed.current && countRef.current < MAX_COUNT) {
          countRef.current += 1;
          setShowNotice(true);
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    (async () => {
      const today = getCurrentDate();
      const stored = await AsyncStorage.getItem('noticeDate');

      if (stored !== today) {
        await AsyncStorage.setItem('noticeDate', today);
        noticeAllowed.current = true;
        countRef.current = 1;
        setShowNotice(true);
      }
    })();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleChange = text => {
    const isNumber = /^\d+$/.test(text);
    if (isNumber) {
      setInputMaxLength(10);
    } else {
      setInputMaxLength(undefined);
    }
    setSearchQuery(text);
  };

  // Add this handler to force re-render when layout changes
  const handleContainerLayout = useCallback(() => {
    // Force re-render of CardComponent
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Use SafeAreaView for iOS
  const Container = Platform.OS === 'ios' ? SafeAreaView : View;

  return (
    <View style={styles.safeArea} onLayout={handleContainerLayout}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ImageBackground
          source={require('../../assets/images/loginback.jpeg')}
          style={styles.imageBackground}>
          <LinearGradient
            colors={[
              'rgba(220,239,255,0.0)',
              'rgba(2,81,159,0.9)',
              'rgba(220,239,255,0.0)',
            ]}
            style={styles.gradient}>
            {/* Use ScrollView to ensure proper rendering */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onLayout={handleContainerLayout}
            >
              {/* Upper Section */}
              <View style={styles.upperSection} onLayout={handleContainerLayout}>
                {/* Header */}
                <View style={styles.headerContainer}>
                  {/* Left Logo */}
                  <Image
                    source={require('../../assets/images/mainlogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />

                  {/* Right Icons */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Notification */}
                    <View style={{ marginRight: wp('4%') }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Notifications');
                          setUnreadCount(0);
                        }}
                        activeOpacity={0.7}>
                        <Ionicons
                          name="notifications-outline"
                          size={isTablet ? wp('2.8%') : wp('7%')}
                          color="#000"
                        />
                        {unreadCount > 0 && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* Drawer Menu */}
                    <TouchableOpacity
                      onPress={() => navigation.openDrawer()}
                      activeOpacity={0.7}>
                      <Ionicons
                        name="menu"
                        size={isTablet ? wp('2.8%') : wp('7%')}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <HideHomeModal
                  visible={showPendingModal}
                  onCheckStatus={checkPlanStatus}
                />

                {/* Welcome Message */}
                <View
                  style={{
                    alignItems: 'flex-end',
                    paddingRight: isTablet ? wp('0%') : wp('2%'),
                  }}>
                  <Text
                    style={{
                      fontSize: isTablet ? wp('1.8%') : wp('4%'),
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                    numberOfLines={2}>
                    Hi, {user.name}
                  </Text>
                </View>

                {/* Dashboard Title */}
                <View style={styles.dashboardHeader}>
                  <Ionicons
                    name="grid-outline"
                    size={isTablet ? wp('2.8%') : wp('8%')}
                    color="#fff"
                    style={styles.dashboardIcon}
                  />
                  <Text style={styles.dashboardText}>Dashboard</Text>
                </View>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                  <TextInput
                    placeholder="Search By Name and Number"
                    placeholderTextColor="#7F7F7F"
                    style={styles.searchInput}
                    value={searchQuery}
                    maxLength={inputMaxLength}
                    onChangeText={handleChange}
                    onSubmitEditing={searchLeadByMobile}
                    keyboardType="default"
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    style={styles.searchIcon}
                    onPress={searchLeadByMobile}
                    disabled={loading}
                    activeOpacity={0.7}>
                    {loading ? (
                      <ActivityIndicator
                        size={isTablet ? wp('2.5%') : wp('5%')}
                        color="#7F7F7F"
                      />
                    ) : (
                      <Icon
                        name="search"
                        size={isTablet ? wp('2.5%') : wp('5%')}
                        color="#7F7F7F"
                      />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Total Leads */}
                <View style={styles.totalLeadsContainer}>
                  <Text style={styles.totalLeadsText}>Total Leads -</Text>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('Total Leads')}
                    activeOpacity={0.7}>
                    <Text style={styles.totalLeadsValue}>
                      {String(totalLeads)}
                    </Text>
                  </TouchableOpacity>

                  {/* Analytics Button */}
                  <TouchableOpacity
                    style={styles.helloContainer}
                    onPress={() => navigation.navigate('Analytics')}
                    activeOpacity={0.7}>
                    <Text style={styles.helloText}>Analytics</Text>
                  </TouchableOpacity>
                </View>

                {/* Card Component - Add minHeight to prevent layout shift */}
                <View style={styles.cardContainer}>
                  <CardComponent
                    navigation={navigation}
                    refreshTrigger={refreshTrigger}
                  />
                </View>

                {/* Birthdays */}
                <View style={{ maxHeight: hp('50%'), marginTop: hp('1%') }}>
                  <Birthday navigation={navigation} />
                </View>
              </View>
            </ScrollView>

            {/* Bottom Section - Fixed outside ScrollView */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.openButton}
                onPress={() => setShowMenu(true)}
                activeOpacity={0.7}>
                <Ionicons
                  name="chevron-up-sharp"
                  size={isTablet ? wp('2.8%') : wp('7%')}
                  color="#fff"
                />
              </TouchableOpacity>

              {/* Bottom Sheet Menu */}
              <Modal
                visible={showMenu}
                animationType="slide"
                transparent
                onRequestClose={() => setShowMenu(false)}
                presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'none'}>
                <TouchableOpacity
                  style={styles.overlay}
                  activeOpacity={1}
                  onPressOut={() => setShowMenu(false)}>
                  <View style={styles.bottomSheet}>
                    <BottomMenu
                      navigation={navigation}
                      closeSheet={() => setShowMenu(false)}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          </LinearGradient>
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
}


