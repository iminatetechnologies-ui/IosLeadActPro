// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,

// } from 'react-native';
// import {_get} from '../../api/apiClient';
// import AssignLeads from './AssignLeads';
// import UnAssignLeads from './UnAssignLeads';
// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';
// import DeviceInfo from 'react-native-device-info';
// const isTablet = DeviceInfo.isTablet();

// const PendingLead2 = ({navigation}) => {
//   const [activeTab, setActiveTab] = useState('assign');
//   const [unassignedCount, setUnassignedCount] = useState(0);
//   const [assignedCount, setAssignedCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const fetchLeadCounts = async () => {
//     try {
//       const unassignedRes = await _get('/unassignedleads');
//       const assignedRes = await _get('/assignedleads');

//       setUnassignedCount(unassignedRes?.data?.total_leads || 0);
//       setAssignedCount(assignedRes?.data?.total_leads || 0);
//     } catch (err) {
//       console.error('Error fetching lead counts:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeadCounts();
//   }, []);

//   const updateAssignedCount = count => {
//     setAssignedCount(count);
//   };

//   const updateUnassignedCount = count => {
//     setUnassignedCount(count);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Tabs */}
//       <View style={styles.tabs}>
//         <TouchableOpacity
//           style={[styles.tabButton, activeTab === 'assign' && styles.activeTab]}
//           onPress={() => setActiveTab('assign')}>
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'assign' && styles.activeTabText,
//             ]}>
//             Assign Leads ({assignedCount})
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'unassign' && styles.activeTab,
//           ]}
//           onPress={() => setActiveTab('unassign')}>
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'unassign' && styles.activeTabText,
//             ]}>
//             Unassign Leads ({unassignedCount})
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Tab Content */}
//       <View style={{flex: 1}}>
//         {activeTab === 'unassign' ? (
//           <UnAssignLeads
//             navigation={navigation}
//             refreshData={fetchLeadCounts}
//             updateUnassignedCount={updateUnassignedCount} // 👈 yaha bhej rahe hai
//           />
//         ) : (
//           <AssignLeads
//             navigation={navigation}
//             refreshData={fetchLeadCounts}
//             updateAssignedCount={updateAssignedCount} // 👈 already tha
//           />
//         )}
//       </View>
//     </View>
//   );
// };


// export default PendingLead2;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: rw(1), // ~16px
//   },
//   tabs: {
//     flexDirection: 'row',
//     marginVertical: rh(1.5),
//   },
//   tabButton: {
//     flex: 1,
//     backgroundColor: '#e0e0e0',
//     paddingVertical: rh(1.2),
//     marginHorizontal: rw(1),
//     borderRadius: isTablet ? rw(0.5) : rw(2),
//     alignItems: 'center',
//   },
//   activeTab: {
//     backgroundColor: '#2D87DB',
//   },
//   tabText: {
//     fontSize: isTablet ? rf(1) : rf(1.5),
//     color: 'gray',
//     fontWeight: '600',
//   },
//   activeTabText: {
//     color: 'white',
//     fontWeight: '700',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {_get} from '../../api/apiClient';
import AssignLeads from './AssignLeads';
import UnAssignLeads from './UnAssignLeads';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import DeviceInfo from 'react-native-device-info';
import {getUserType} from '../../utils/getUserType';

const isTablet = DeviceInfo.isTablet();

const PendingLead2 = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('assign');
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  // Load user type
  useEffect(() => {
    const loadType = async () => {
      const type = await getUserType(); // "company" | "team_owner" | "employee"
      setUserType(type);
    };
    loadType();
  }, []);

  // Fetch counts based on userType
  const fetchLeadCounts = async () => {
    if (!userType) return;

    try {
      let unassignedAPI = '/freshdata';
      let assignedAPI = '/freshlead';

      if (userType === 'employee') {
        unassignedAPI = '/getfreshdata';
        assignedAPI = '/getfreshlead';
      }

      const unassignedRes = await _get(unassignedAPI);
      const assignedRes = await _get(assignedAPI);

      setUnassignedCount(unassignedRes?.data?.total_leads || 0);
      setAssignedCount(assignedRes?.data?.total_leads || 0);
    } catch (err) {
      console.error('Error fetching lead counts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userType !== null) {
      fetchLeadCounts();
    }
  }, [userType]);

  const updateAssignedCount = count => setAssignedCount(count);
  const updateUnassignedCount = count => setUnassignedCount(count);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'assign' && styles.activeTab]}
          onPress={() => setActiveTab('assign')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'assign' && styles.activeTabText,
            ]}>
            Leads ({assignedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'unassign' && styles.activeTab]}
          onPress={() => setActiveTab('unassign')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'unassign' && styles.activeTabText,
            ]}>
            Data ({unassignedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={{flex: 1}}>
        {activeTab === 'unassign' ? (
          <UnAssignLeads
            navigation={navigation}
            refreshData={fetchLeadCounts}
            updateUnassignedCount={updateUnassignedCount}
            userType={userType} // pass userType
          />
        ) : (
          <AssignLeads
            navigation={navigation}
            refreshData={fetchLeadCounts}
            updateAssignedCount={updateAssignedCount}
            userType={userType} // pass userType
          />
        )}
      </View>
    </View>
  );
};

export default PendingLead2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: rw(1),
  },
  tabs: {
    flexDirection: 'row',
    marginVertical: rh(1.5),
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    paddingVertical: rh(1.2),
    marginHorizontal: rw(1),
    borderRadius: isTablet ? rw(0.5) : rw(2),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#2D87DB',
  },
  tabText: {
    fontSize: isTablet ? rf(1) : rf(1.5),
    color: 'gray',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
