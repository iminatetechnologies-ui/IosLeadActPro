// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Linking,
//   Alert,
//   TouchableOpacity,
//   StatusBar,
//   BackHandler,
// } from 'react-native';
// import React, {useEffect, useState, useCallback} from 'react';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';

// import {_get} from '../../api/apiClient';
// import {showError} from './../../components/FlashMessage';
// import LeadCardContactCallBack from '../../components/LeadCardCallBack';
// import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';
// import {getUserType} from '../../utils/getUserType';

// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';

// const OverDueLead = ({navigation}) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(100);
//   const [usertype, setUsertype] = useState(null);
//   const [leadcount, setLeadcount] = useState(0);

//   const nav = useNavigation();

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await _get('/getoverdue');
//       const result = response?.data;
//       const count = result?.leadcount ?? 0;
//       setLeadcount(count);
//       if (result) {
//         setData(result?.data || []);
//       } else {
//         showError('No data found.');
//       }
//     } catch (error) {
//       console.log('Fetch Overdue Error:', error);
//       showError(
//         error?.message ||
//           error?.response?.data?.message ||
//           'Something went wrong.',
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       const response = await _get('/getoverdue');
//       const result = response?.data;
//       const count = result?.leadcount ?? 0;
//       setLeadcount(count);
//       if (result) {
//         setData(result?.data || []);
//       } else {
//         showError('No data found.');
//       }
//     } catch (error) {
//       console.log('Refresh Overdue Error:', error);
//       showError(
//         error?.message ||
//           error?.response?.data?.message ||
//           'Failed to refresh data.',
//       );
//     } finally {
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (leadcount > 0) {
//       navigation.setOptions({
//         headerLeft: () => null,
//         gestureEnabled: false,
//       });
//     } else {
//       navigation.setOptions({
//         headerLeft: undefined,
//         gestureEnabled: true,
//       });
//     }
//   }, [leadcount, navigation]);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         if (leadcount > 0) {
//           Alert.alert(
//             'Back Disabled',
//             'You cannot go back until all overdue leads are cleared.',
//           );
//           return true;
//         }
//         return false;
//       };

//       const backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         onBackPress,
//       );

//       return () => backHandler.remove();
//     }, [leadcount]),
//   );

//   useEffect(() => {
//     (async () => {
//       const type = await getUserType();
//       setUsertype(type);
//     })();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, []),
//   );

//   const handleSmsPress = item => {
//     const url = `sms:${item?.mobile}`;
//     Linking.openURL(url).catch(() =>
//       Alert.alert('Error', 'Unable to open the messaging app.'),
//     );
//   };

//   const handleWhatsappPress = item => {
//     const url = `https://wa.me/${item?.mobile}`;
//     Linking.openURL(url).catch(() =>
//       Alert.alert('Error', 'WhatsApp is not installed on your device.'),
//     );
//   };

//   const handleCallPress = item => {
//     const url = `tel:${item?.mobile}`;
//     Linking.openURL(url).catch(() =>
//       Alert.alert('Error', 'Phone number is not available'),
//     );
//   };

//   const visibleItems = data.slice(0, visibleCount);

//   const renderItem = ({item}) => {
//     const handleCardPress = () => {
//       if (item?.status_id === '1' || item?.status_id === 1) {
//         navigation.navigate('LeadInterested2', {item});
//       } else if (item?.status_id === '3' || item?.status_id === 3) {
//         navigation.navigate('ContactDetails2', {item});
//       } else {
//         Alert.alert('Info', 'No action defined for this lead status.');
//       }
//     };

//     return (
//       <View style={{flex: 1}}>
//         <LeadCardContactCallBack
//           follow_up={item?.reminder_date || '-'}
//           title={item?.name || 'Unknown'}
//           subtitle={item?.email || '-'}
//           lead_id={item.id}
//           project={item?.project}
//           mobile={item?.mobile}
//           item={item}
//           leadtype={item?.lead_type}
//           source={item?.source || '-'}
//           team_owner={
//             usertype === 'company' || usertype === 'team_owner'
//               ? item?.lead_owner || 'Unknown'
//               : null
//           }
//           substatus_name={item?.substatus_name || '-'}
//           oncardPress={handleCardPress}
//           onCallPress={() => handleCallPress(item)}
//           onSmsPress={() => handleSmsPress(item)}
//           onWhatsappPress={() => handleWhatsappPress(item)}
//           isSelected={false}
//           showCheckbox={false}
//         />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.countContainer}>
//         <Text style={styles.countText}>{leadcount} total records</Text>
//         {leadcount > 0 && (
//           <Text style={styles.warningText}>
//             ⚠️ Clear all overdue leads to navigate back
//           </Text>
//         )}
//       </View>

//       {isLoading ? (
//         <FlatList
//           data={Array.from({length: 6})}
//           keyExtractor={(_, index) => index.toString()}
//           renderItem={() => <LeadCardContactCallBackPlaceholder />}
//           contentContainerStyle={styles.list}
//         />
//       ) : (
//         <FlatList
//           data={visibleItems}
//           refreshing={refreshing}
//           onRefresh={onRefresh}
//           keyExtractor={(item, index) => item.id || index.toString()}
//           renderItem={renderItem}
//           contentContainerStyle={styles.list}
//           ListEmptyComponent={
//             !isLoading && (
//               <Text style={styles.emptyText}>No Overdue leads found.</Text>
//             )
//           }
//           ListFooterComponent={
//             data.length > visibleCount ? (
//               <TouchableOpacity
//                 onPress={() => setVisibleCount(prev => prev + 100)}
//                 style={styles.seeMoreButton}>
//                 <Text style={styles.seeMoreText}>See More</Text>
//               </TouchableOpacity>
//             ) : null
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default OverDueLead;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   list: {
//     padding: rw(3),
//   },
//   seeMoreButton: {
//     paddingVertical: rh(2),
//     borderRadius: rw(2),
//     marginHorizontal: rw(4),
//     marginBottom: rh(3),
//     alignItems: 'center',
//   },
//   seeMoreText: {
//     color: '#000',
//     fontSize: rf(2),
//     fontWeight: '600',
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: rf(2),
//     color: '#777',
//     padding: rh(2),
//   },
//   countContainer: {
//     paddingHorizontal: rw(5),
//     paddingVertical: rh(1.5),
//     alignItems: 'center',
//   },
//   countText: {
//     color: '#555',
//     fontSize: rf(1.7),
//     fontWeight: '500',
//   },
//   warningText: {
//     color: '#ff6b6b',
//     fontSize: rf(1.5),
//     fontWeight: '600',
//     marginTop: rh(0.5),
//     textAlign: 'center',
//   },
// });


import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {_get} from '../../api/apiClient';
import {showError, showSuccess} from './../../components/FlashMessage';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';
import {getUserType} from '../../utils/getUserType';

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const OverDueLead = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [usertype, setUsertype] = useState(null);
  const [leadcount, setLeadcount] = useState(0);

  const nav = useNavigation();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await _get('/getoverdue');
      const result = response?.data;
      const count = result?.leadcount ?? 0;
      setLeadcount(count);
      if (result) {
        setData(result?.data || []);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.log('Fetch Overdue Error:', error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to fetch overdue leads. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await _get('/getoverdue');
      const result = response?.data;
      const count = result?.leadcount ?? 0;
      setLeadcount(count);
      if (result) {
        setData(result?.data || []);
        showSuccess('Data refreshed successfully');
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.log('Refresh Overdue Error:', error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to refresh data. Please check your network.',
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (leadcount > 0) {
      navigation.setOptions({
        headerLeft: () => null,
        gestureEnabled: false,
      });
    } else {
      navigation.setOptions({
        headerLeft: undefined,
        gestureEnabled: true,
      });
    }
  }, [leadcount, navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (leadcount > 0) {
          Alert.alert(
            '⚠️ Action Required',
            'You currently have overdue leads pending. Please clear all overdue leads before navigating back.',
            [{text: 'OK', style: 'cancel'}],
          );
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [leadcount]),
  );

  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const handleSmsPress = item => {
    const url = `sms:${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      showError('Unable to open the messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    const url = `https://wa.me/${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      showError('WhatsApp is not installed on your device.'),
    );
  };

  const handleCallPress = item => {
    const url = `tel:${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      showError('Unable to make the call. Please try again later.'),
    );
  };

  const visibleItems = data.slice(0, visibleCount);

  const renderItem = ({item}) => {
    const handleCardPress = () => {
      if (item?.status_id === '1' || item?.status_id === 1) {
        navigation.navigate('LeadInterested2', {item});
      } else if (item?.status_id === '3' || item?.status_id === 3) {
        navigation.navigate('ContactDetails2', {item});
      } else {
        showError('No action defined for this lead status.');
      }
    };

    return (
      <View style={{flex: 1}}>
        <LeadCardContactCallBack
          follow_up={item?.reminder_date || '-'}
          title={item?.name || 'Unknown'}
          subtitle={item?.email || '-'}
          lead_id={item.id}
          project={item?.project}
          mobile={item?.mobile}
          item={item}
          leadtype={item?.lead_type}
          source={item?.source || '-'}
          team_owner={
            usertype === 'company' || usertype === 'team_owner'
              ? item?.lead_owner || 'Unknown'
              : null
          }
          substatus_name={item?.substatus_name || '-'}
          oncardPress={handleCardPress}
          onCallPress={() => handleCallPress(item)}
          onSmsPress={() => handleSmsPress(item)}
          onWhatsappPress={() => handleWhatsappPress(item)}
          isSelected={false}
          showCheckbox={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{leadcount} total records</Text>
        {leadcount > 0 && (
          <Text style={styles.warningText}>
            ⚠️ Please clear all overdue leads before going back
          </Text>
        )}
      </View>

      {isLoading ? (
        <FlatList
          data={Array.from({length: 6})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactCallBackPlaceholder />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={visibleItems}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>No Overdue leads found.</Text>
            )
          }
          ListFooterComponent={
            data.length > visibleCount ? (
              <TouchableOpacity
                onPress={() => setVisibleCount(prev => prev + 100)}
                style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>See More</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default OverDueLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: rw(3),
  },
  seeMoreButton: {
    paddingVertical: rh(2),
    borderRadius: rw(2),
    marginHorizontal: rw(4),
    marginBottom: rh(3),
    alignItems: 'center',
  },
  seeMoreText: {
    color: '#000',
    fontSize: rf(2),
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: rf(2),
    color: '#777',
    padding: rh(2),
  },
  countContainer: {
    paddingHorizontal: rw(5),
    paddingVertical: rh(1.5),
    alignItems: 'center',
  },
  countText: {
    color: '#555',
    fontSize: rf(1.7),
    fontWeight: '500',
  },
  warningText: {
    color: '#ff6b6b',
    fontSize: rf(1.5),
    fontWeight: '600',
    marginTop: rh(0.5),
    textAlign: 'center',
  },
});
