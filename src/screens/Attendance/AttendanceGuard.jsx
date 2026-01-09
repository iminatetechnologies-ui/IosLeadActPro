// import React, {useState, useCallback, useEffect} from 'react';
// import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {useFocusEffect} from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {_get} from '../../api/apiClient';

// // 🔹 User Type Utils
// import {getUserType} from '../../utils/getUserType';

// // Screens
// import CheckIn from './chekIn';
// import Checkout from './chekOut';
// import ManagerDashboard from './managerDashboard';
// import Endday from './endday';

// // Responsive
// import {
//   responsiveWidth as rw,
//   responsiveFontSize as rf,
//   responsiveHeight as rh,
// } from 'react-native-responsive-dimensions';

// const Stack = createStackNavigator();

// const defaultHeader = (navigation, title) => ({
//   headerLeft: () => (
//     <TouchableOpacity
//       style={{flexDirection: 'row', alignItems: 'center', paddingLeft: rw(4)}}
//       onPress={() => navigation.goBack()}>
//       <Ionicons name="arrow-back" size={rf(2.5)} color="#fff" />
//     </TouchableOpacity>
//   ),
//   headerTitle: title,
//   headerStyle: {backgroundColor: '#2D87DB'},
//   headerTintColor: '#fff',
//   headerTitleAlign: 'left',
// });

// const AttendanceGuard = () => {
//   const [route, setRoute] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const checkAttendanceStatus = async () => {
//     try {
//       setLoading(true);

//       const userType = await getUserType();
//       let targetRoute = 'CheckIn';

//       if (userType === 'team_owner' || userType === 'company') {
//         targetRoute = 'Manager DashBoard';
//       } else {
//         const response = await _get('/attendance/today-summary');
//         const data = response?.data;

//         if (!data?.checked_in) {
//           targetRoute = 'CheckIn';
//         } else if (data?.checked_in && !data?.checked_out) {
//           targetRoute = 'Checkout';
//         } else if (data?.checked_in && data?.checked_out) {
//           targetRoute = 'End Day-Check Out';
//         }
//       }

//       setTimeout(() => setRoute(targetRoute), 500);
//     } catch (error) {
//       setTimeout(() => setRoute('CheckIn'), 500);
//     } finally {
//       setTimeout(() => setLoading(false), 500);
//     }
//   };

//   // 🔥 Runs every time drawer/screen focuses
//   useFocusEffect(
//     useCallback(() => {
//       checkAttendanceStatus();
//     }, []),
//   );

//   if (loading || !route) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'flex-start',
//           alignItems: 'center',
//           marginTop: rh(6),
//         }}>
//         <ActivityIndicator size="large" color="#0389ca" />
//       </View>
//     );
//   }

//   return (
//     <Stack.Navigator
//       key={route} // 🔥 reset stack
//       initialRouteName={route}>
//       <Stack.Screen
//         name="CheckIn"
//         component={CheckIn}
//         options={({navigation}) => defaultHeader(navigation, 'Check In')}
//       />

//       <Stack.Screen
//         name="Checkout"
//         component={Checkout}
//         options={({navigation}) => defaultHeader(navigation, 'Check Out')}
//       />

//       <Stack.Screen
//         name="Manager DashBoard"
//         component={ManagerDashboard}
//         options={({navigation}) =>
//           defaultHeader(navigation, 'Manager DashBoard')
//         }
//       />
//       <Stack.Screen
//         name="End Day-Check Out"
//         component={Endday}
//         options={{
//           headerShown: false, // 🔹 hide header
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default AttendanceGuard;



//--------below this code update acoring the drawer navigation attendance code---------

// AttendanceGuard.js (Final Optimized Version)
import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 🔹 User Type Utils
import {getUserType} from '../../utils/getUserType';

// Screens
import CheckIn from './chekIn';
import Checkout from './chekOut';
import ManagerDashboard from './managerDashboard';
import Endday from './endday';

// Responsive
import {
  responsiveWidth as rw,
  responsiveFontSize as rf,
  responsiveHeight as rh,
} from 'react-native-responsive-dimensions';

const Stack = createStackNavigator();

const defaultHeader = (navigation, title) => ({
  headerLeft: () => (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center', paddingLeft: rw(4)}}
      onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={rf(2.5)} color="#fff" />
    </TouchableOpacity>
  ),
  headerTitle: title,
  headerStyle: {backgroundColor: '#2D87DB'},
  headerTintColor: '#fff',
  headerTitleAlign: 'left',
});

const AttendanceGuard = ({route: screenRoute}) => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use both props route and hook route
  const hookRoute = useRoute();
  const routeParams = screenRoute?.params || hookRoute?.params;

  useEffect(() => {
    // 🔹 Priority 1: Check params from drawer
    if (routeParams?.initialRoute) {
      console.log('Using route from drawer:', routeParams.initialRoute);
      setInitialRoute(routeParams.initialRoute);
      setLoading(false);
    } else {
      // 🔹 Priority 2: Check initial status (fallback)
      checkInitialStatus();
    }
  }, [routeParams]);

  const checkInitialStatus = async () => {
    try {
      const userType = await getUserType();
      let targetRoute = 'CheckIn';

      if (userType === 'team_owner' || userType === 'company') {
        targetRoute = 'Manager DashBoard';
      } else {
        const {_get} = require('../../api/apiClient');
        const response = await _get('/attendance/today-summary');
        console.log('------------------attendance gaurd responce------',response)
        const data = response?.data;

        if (!data?.checked_in) {
          targetRoute = 'CheckIn';
        } else if (data?.checked_in && !data?.checked_out) {
          targetRoute = 'Checkout';
        } else if (data?.checked_in && data?.checked_out) {
          targetRoute = 'End Day-Check Out';
        }
      }

      setInitialRoute(targetRoute);
      console.log('Fallback route:', targetRoute);
    } catch (error) {
      setInitialRoute('CheckIn');
      console.log('Error, defaulting to CheckIn');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: rh(6),
        }}>
        <ActivityIndicator size="large" color="#0389ca" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}>
      <Stack.Screen
        name="CheckIn"
        component={CheckIn}
        options={({navigation}) => defaultHeader(navigation, 'Check In')}
      />

      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={({navigation}) => defaultHeader(navigation, 'Check Out')}
      />

      <Stack.Screen
        name="Manager DashBoard"
        component={ManagerDashboard}
        options={({navigation}) =>
          defaultHeader(navigation, 'Manager DashBoard')
        }
      />
      <Stack.Screen
        name="End Day-Check Out"
        component={Endday}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AttendanceGuard;