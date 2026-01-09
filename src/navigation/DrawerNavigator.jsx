import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, Linking} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DeviceInfo from 'react-native-device-info';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';

import {useUser} from '../screens/contaxt/UserContext';
import {getUserType, clearUserTypeCache} from '../utils/getUserType';
import {clearStorage} from '../components/EncryptedStorageUtil';
import {clearUserTypeCache1} from '../utils/getUserTypelogin';
import CustomAlert from '../components/CustomAlert';
import {_get} from '../api/apiClient'; // 🔹 IMPORTANT: API client add karo

// Screens / Stacks
import Home2 from '../screens/Home/Home2';
import {
  TeamStack,
  TodaySiteStack,
  ReportStack,
  ExpensesStack,
  ProfileStack,
  SettingsStack,
  AddLeadstack,
  Attendance,
} from './Drawerstack/Stack';

const Drawer = createDrawerNavigator();
const isTablet = DeviceInfo.isTablet();
const {width, height} = Dimensions.get('window');
const isLandscape = width > height;

const CustomDrawerContent = props => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showSupportItems, setShowSupportItems] = useState(false);
  const {user, setUser} = useUser();

  const handleLogout = () => setShowLogoutAlert(true);

  const confirmLogout = async () => {
    try {
      const permissionFlag = await EncryptedStorage.getItem(
        'permissionsGranted',
      );
      await clearStorage();
      await clearUserTypeCache();
      await clearUserTypeCache1();
      if (permissionFlag)
        await EncryptedStorage.setItem('permissionsGranted', permissionFlag);
      setUser({name: null, avatar: null});
      props.navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'Login'}]}),
      );
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri:
              user?.avatar?.trim?.() ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.profilePic}
        />
        <Text style={styles.userName}>{user.name || 'Guest User'}</Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        label="Support"
        icon={({color, size}) => (
          <Ionicons
            name={showSupportItems ? 'chevron-down' : 'chevron-forward'}
            size={size}
            color={color}
          />
        )}
        onPress={() => setShowSupportItems(p => !p)}
      />

      {showSupportItems && (
        <View style={{paddingLeft: 30}}>
          {/* CALL */}
          <DrawerItem
            label="Call"
            icon={({color, size}) => (
              <Ionicons name="call-outline" size={size} color={color} />
            )}
            onPress={() => {
              const phoneNumber = 'tel:9450350978'; // <-- YOUR NUMBER
              Linking.openURL(phoneNumber);
            }}
          />

          {/* CHAT */}
          <DrawerItem
            label="Chat"
            icon={({color, size}) => (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={size}
                color={color}
              />
            )}
            onPress={() => {
              const whatsapp = 'https://wa.me/9450350978'; // <-- YOUR NUMBER (without +91)
              Linking.openURL(whatsapp);
            }}
          />
        </View>
      )}

      <DrawerItem
        label="Logout"
        icon={({color, size}) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
        onPress={handleLogout}
      />

      <CustomAlert
        visible={showLogoutAlert}
        title="Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setShowLogoutAlert(false)}
        onConfirm={confirmLogout}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const [usertype, setUsertype] = useState(null);
  const navigation = useNavigation();

  // 🔹 Attendance condition check function
  const checkAttendanceCondition = async () => {
    try {
      const userType = await getUserType();

      // If user is manager/team_owner/company
      if (userType === 'team_owner' || userType === 'company') {
        return 'Manager DashBoard';
      }

      // For other users, check attendance status
      const response = await _get('/attendance/today-summary');
      console.log('------------------drawer responce------', response);

      const data = response?.data;

      if (!data?.checked_in) {
        return 'CheckIn';
      } else if (data?.checked_in && !data?.checked_out) {
        return 'Checkout';
      } else if (data?.checked_in && data?.checked_out) {
        return 'End Day-Check Out';
      }

      return 'CheckIn'; // Default fallback
    } catch (error) {
      console.error('Attendance check error:', error);
      return 'CheckIn'; // Fallback on error
    }
  };

  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: rw(isTablet ? (isLandscape ? 30 : 50) : 55),
        },
        drawerLabelStyle: {
          fontSize: isTablet ? rf(1.3) : rf(1.5),
          fontWeight: 'bold',
          color: '#333',
        },
        drawerActiveTintColor: '#0389ca',
        drawerInactiveTintColor: '#666',
      }}>
      <Drawer.Screen
        name="DashBoard"
        component={Home2}
        options={{
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {['company', 'team_owner'].includes(usertype) && (
        <Drawer.Screen
          name="My Team"
          component={TeamStack}
          options={{
            headerShown: false,
            drawerIcon: ({color, size}) => (
              <Ionicons
                name="people-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="Today Site Visits"
        component={TodaySiteStack}
        options={{
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Ionicons name="locate-outline" size={size} color={color} />
          ),
        }}
      />

      {['employee'].includes(usertype) && (
        <Drawer.Screen
          name="Add Tele Lead"
          component={AddLeadstack}
          options={{
            headerShown: false,
            drawerIcon: ({color, size}) => (
              <Ionicons name="person-add-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="My Report"
        component={ReportStack}
        options={{
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          drawerItemPress: async e => {
            e.preventDefault(); // 🔥 Prevent default navigation

            try {
              // Check condition and get target route
              const targetRoute = await checkAttendanceCondition();

              // Navigate to Attendance screen with params
              navigation.navigate('Attendance', {
                initialRoute: targetRoute,
              });
            } catch (error) {
              // Fallback
              navigation.navigate('Attendance', {
                initialRoute: 'CheckIn',
              });
            }
          },
        })}
      />

      {/* <Drawer.Screen name="My Expenses" component={ExpensesStack} options={{
        headerShown: false, drawerIcon: ({color, size}) => <MaterialIcons name="money" size={size} color={color} />,
      }} /> */}

      <Drawer.Screen
        name="User Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: rh(1),
    marginBottom: rh(1),
  },
  profilePic: {
    width: rw(20),
    height: rw(20),
    borderRadius: rw(10),
    marginBottom: rh(2),
  },
  userName: {fontSize: rf(2), fontWeight: 'bold', color: '#333'},
});
