// import React from 'react';
// import {View, Text, TouchableOpacity, Image} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// // Responsive imports
// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';

// // Screens
// import MyTeam from '../../screens/Drawer/MyTeam';
// import TodaySiteVisit from '../../screens/Drawer/TodaySiteVisit';
// import TodayReport from '../../screens/Drawer/TodayReport';
// import Myexpenses from '../../screens/Drawer/Myexpenses';
// import userProfile from '../../screens/Profile/userProfile';
// import Settings from '../../screens/Drawer/Settings';
// import AddLead from '../../screens/Drawer/AddLead';
// import AttendanceGuard from '../../screens/Attendance/AttendanceGuard';

// const Stack = createStackNavigator();

// const defaultHeaderOptions = (navigation, title) => ({
//   headerLeft: () => (
//     <TouchableOpacity
//       style={{paddingLeft: rw(4)}} // Responsive
//       onPress={() => navigation.goBack()}>
//       <Ionicons name="arrow-back" size={rf(2.7)} color="#fff" />
//     </TouchableOpacity>
//   ),

//   headerTitle: () => (
//     <View style={{flexDirection: 'row', alignItems: 'center'}}>
//       <Text
//         style={{
//           color: '#fff',
//           fontSize: rf(2.2), // Responsive font
//           fontWeight: 'bold',
//           paddingLeft: rw(2),
//         }}>
//         {title}
//       </Text>
//     </View>
//   ),

//   headerRight: () => (
//     <Image
//       source={require('../../assets/images/pendinglead.png')}
//       style={{
//         width: rw(25), // Responsive width
//         height: rh(10), // Responsive height
//       }}
//       resizeMode="contain"
//     />
//   ),

//   headerStyle: {backgroundColor: '#2D87DB'},
//   headerTintColor: '#fff',
//   headerTitleAlign: 'left',
// });

// // ======================= STACKS =======================

// // Team Stack
// export const TeamStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="TeamDetails"
//       component={MyTeam}
//       options={defaultHeaderOptions(navigation, 'My Team')}
//     />
//   </Stack.Navigator>
// );

// // Site Visit Stack
// export const TodaySiteStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="TodaySiteVisit"
//       component={TodaySiteVisit}
//       options={defaultHeaderOptions(navigation, 'Site Visit')}
//     />
//   </Stack.Navigator>
// );

// // Report Stack
// export const ReportStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="TodayReport"
//       component={TodayReport}
//       options={defaultHeaderOptions(navigation, 'My Report')}
//     />
//   </Stack.Navigator>
// );

// // Expenses Stack
// export const ExpensesStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="MyExpenses"
//       component={Myexpenses}
//       options={defaultHeaderOptions(navigation, 'Expenses')}
//     />
//   </Stack.Navigator>
// );

// // Profile Stack
// export const ProfileStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="UserProfile"
//       component={userProfile}
//       options={defaultHeaderOptions(navigation, 'Profile')}
//     />
//   </Stack.Navigator>
// );

// // Settings Stack
// export const SettingsStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="SettingsPage"
//       component={Settings}
//       options={defaultHeaderOptions(navigation, 'Settings')}
//     />
//   </Stack.Navigator>
// );

// // Add Lead Stack
// export const AddLeadstack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="Add Leads"
//       component={AddLead}
//       options={defaultHeaderOptions(navigation, 'Add Tele Lead')}
//     />
//   </Stack.Navigator>
// );

// // export const Attendance = ({navigation}) => (
// //   <Stack.Navigator>
// //     <Stack.Screen
// //       name="Attendance"
// //       component={CheckIn}
// //       options={defaultHeaderOptions(navigation, 'Attendance')}
// //     />
// //   </Stack.Navigator>
// // );
// export const Attendance =AttendanceGuard;



//--------below this code update acoring the drawer navigation attendance code---------

import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Responsive imports
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

// Screens
import MyTeam from '../../screens/Drawer/MyTeam';
import TodaySiteVisit from '../../screens/Drawer/TodaySiteVisit';
import TodayReport from '../../screens/Drawer/TodayReport';
import Myexpenses from '../../screens/Drawer/Myexpenses';
import userProfile from '../../screens/Profile/userProfile';
import Settings from '../../screens/Drawer/Settings';
import AddLead from '../../screens/Drawer/AddLead';
import AttendanceGuard from '../../screens/Attendance/AttendanceGuard';

const Stack = createStackNavigator();

const defaultHeaderOptions = (navigation, title) => ({
  headerLeft: () => (
    <TouchableOpacity
      style={{paddingLeft: rw(4)}} // Responsive
      onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={rf(2.7)} color="#fff" />
    </TouchableOpacity>
  ),

  headerTitle: () => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text
        style={{
          color: '#fff',
          fontSize: rf(2.2), // Responsive font
          fontWeight: 'bold',
          paddingLeft: rw(2),
        }}>
        {title}
      </Text>
    </View>
  ),

  headerRight: () => (
    <Image
      source={require('../../assets/images/pendinglead.png')}
      style={{
        width: rw(25), // Responsive width
        height: rh(10), // Responsive height
      }}
      resizeMode="contain"
    />
  ),

  headerStyle: {backgroundColor: '#2D87DB'},
  headerTintColor: '#fff',
  headerTitleAlign: 'left',
});

// ======================= STACKS =======================

// Team Stack
export const TeamStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="TeamDetails"
      component={MyTeam}
      options={defaultHeaderOptions(navigation, 'My Team')}
    />
  </Stack.Navigator>
);

// Site Visit Stack
export const TodaySiteStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="TodaySiteVisit"
      component={TodaySiteVisit}
      options={defaultHeaderOptions(navigation, 'Site Visit')}
    />
  </Stack.Navigator>
);

// Report Stack
export const ReportStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="TodayReport"
      component={TodayReport}
      options={defaultHeaderOptions(navigation, 'My Report')}
    />
  </Stack.Navigator>
);

// Expenses Stack
export const ExpensesStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="MyExpenses"
      component={Myexpenses}
      options={defaultHeaderOptions(navigation, 'Expenses')}
    />
  </Stack.Navigator>
);

// Profile Stack
export const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="UserProfile"
      component={userProfile}
      options={defaultHeaderOptions(navigation, 'Profile')}
    />
  </Stack.Navigator>
);

// Settings Stack
export const SettingsStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsPage"
      component={Settings}
      options={defaultHeaderOptions(navigation, 'Settings')}
    />
  </Stack.Navigator>
);

// Add Lead Stack
export const AddLeadstack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Add Leads"
      component={AddLead}
      options={defaultHeaderOptions(navigation, 'Add Tele Lead')}
    />
  </Stack.Navigator>
);

// 🔹 MODIFIED: Attendance Wrapper Component
export const Attendance = ({route, navigation}) => {
  return <AttendanceGuard route={route} navigation={navigation} />;
};