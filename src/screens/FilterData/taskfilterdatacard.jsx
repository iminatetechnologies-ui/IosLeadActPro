// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Linking,
//   Alert,
//   TouchableOpacity,
//   StatusBar,
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

// const Taskfilterdatacard = ({navigation, route}) => {
//   const {userId, userName, status, filterParams = {}} = route.params;

//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(100);
//   const [usertype, setUsertype] = useState(null);

//   const nav = useNavigation();

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();

//     // Basic required params
//     params.append('user_id', userId);
//     params.append('type', status.toLowerCase());

//     // Add filter parameters if they exist
//     if (filterParams.from_date)
//       params.append('from_date', filterParams.from_date);
//     if (filterParams.to_date) params.append('to_date', filterParams.to_date);
//     if (filterParams.project_id)
//       params.append('project_id', filterParams.project_id);
//     if (filterParams.source_id)
//       params.append('source_id', filterParams.source_id);
//     if (filterParams.property_type_id)
//       params.append('property_type_id', filterParams.property_type_id);
//     if (filterParams.budget_id)
//       params.append('budget_id', filterParams.budget_id);
//     if (filterParams.city_id) params.append('city_id', filterParams.city_id);
//     if (filterParams.lead_type_id)
//       params.append('lead_type_id', filterParams.lead_type_id);
//     if (filterParams.customer_type_id)
//       params.append('customer_type_id', filterParams.customer_type_id);
//     if (filterParams.utype) params.append('utype', filterParams.utype);

//     return params.toString();
//   };

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const queryString = buildQueryParams();
//       //   console.log('🔍 Fetching with params:', queryString);

//       const response = await _get(`/gettotaltaskdetails?${queryString}`);
//       const result = response?.data?.data;
//       console.log("🎯 Filtered result:", result);

//       if (Array.isArray(result)) {
//         setData(result);
//       } else {
//         setData([]);
//         showError('No data found for the applied filters.');
//       }
//     } catch (error) {
//       //   console.log('Fetch Task Details Error:', error);
//       showError(
//         error?.message ||
//           error?.response?.data?.message ||
//           'Something went wrong while fetching task details.',
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchData();
//     setRefreshing(false);
//   }, [userId, status, filterParams]);

//   useEffect(() => {
//     (async () => {
//       const type = await getUserType();
//       setUsertype(type);
//     })();
//   }, []);

//   // Set dynamic header title
//   useEffect(() => {
//     const title = userName ? `${status} - ${userName}` : `${status} Tasks`;
//     navigation.setOptions({
//       title: title,
//     });
//   }, [navigation, status, userName]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [userId, status, filterParams]),
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
//       const statusName = item?.status_name?.toLowerCase();

//       if (statusName === 'interested') {
//         navigation.navigate('LeadInterested2', {item});
//       } else {
//         navigation.navigate('ContactDetails2', {item});
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

//   const getFilterSummary = () => {
//     const activeFilters = [];
//     if (filterParams.from_date && filterParams.to_date) {
//       activeFilters.push(
//         `${filterParams.from_date} to ${filterParams.to_date}`,
//       );
//     }
//     if (filterParams.project_id) activeFilters.push('Project Filter');
//     if (filterParams.source_id) activeFilters.push('Source Filter');
//     if (filterParams.property_type_id)
//       activeFilters.push('Property Type Filter');
//     if (filterParams.budget_id) activeFilters.push('Budget Filter');
//     if (filterParams.city_id) activeFilters.push('City Filter');
//     if (filterParams.lead_type_id) activeFilters.push('Lead Type Filter');
//     if (filterParams.customer_type_id)
//       activeFilters.push('Customer Type Filter');

//     return activeFilters.length > 0
//       ? activeFilters.join(', ')
//       : 'No filters applied';
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Header with filter info */}
//       <View style={styles.headerContainer}>
//         <View style={styles.countContainer}>
//           <Text style={styles.countText}>{data.length} total records</Text>
//           <Text style={styles.statusText}>
//             {status} tasks for {userName || 'User'}
//           </Text>
//         </View>

//         {Object.keys(filterParams).some(key => filterParams[key]) && (
//           <View style={styles.filterInfo}>
//             <Text style={styles.filterText}>Filters: {getFilterSummary()}</Text>
//           </View>
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
//               <View style={styles.emptyContainer}>
//                 <Text style={styles.emptyText}>
//                   No {status.toLowerCase()} records found.
//                 </Text>
//                 {Object.keys(filterParams).some(key => filterParams[key]) && (
//                   <Text style={styles.emptySubText}>
//                     Try adjusting your filters to see more results.
//                   </Text>
//                 )}
//               </View>
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

// export default Taskfilterdatacard;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   headerContainer: {
//     backgroundColor: '#fff',
//     paddingHorizontal: rw(5),
//     paddingVertical: rh(1.5),
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   countContainer: {
//     alignItems: 'flex-end',
//   },
//   countText: {
//     color: '#555',
//     fontSize: rf(1.7),
//     fontWeight: '500',
//   },
//   statusText: {
//     color: '#007AFF',
//     fontSize: rf(1.5),
//     fontWeight: '600',
//     marginTop: rh(0.5),
//   },
//   filterInfo: {
//     marginTop: rh(1),
//     paddingTop: rh(1),
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   filterText: {
//     color: '#666',
//     fontSize: rf(1.3),
//     fontStyle: 'italic',
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
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: rh(5),
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: rf(2),
//     color: '#777',
//     padding: rh(2),
//   },
//   emptySubText: {
//     textAlign: 'center',
//     fontSize: rf(1.6),
//     color: '#999',
//     marginTop: rh(1),
//   },
// });

import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {_get} from '../../api/apiClient';
import {showError} from '../../components/FlashMessage';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';
import {getUserType} from '../../utils/getUserType';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const Taskfilterdatacard = ({navigation, route}) => {
  const {userName, status, filterParams = {}} = route.params;
  const userId = route.params?.userId || filterParams?.userid || 'null';
  console.log('staus', status, userId);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const [usertype, setUsertype] = useState(null);
  const nav = useNavigation();

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('userid', userId);
    params.append('type', status.toLowerCase());

    const filterKeys = [
      'from_date',
      'to_date',
      'project_id',
      'source_id',
      'property_type_id',
      'budget_id',
      'city_id',
      'lead_type_id',
      'customer_type_id',
      'utype',
    ];

    filterKeys.forEach(key => {
      if (filterParams[key]) params.append(key, filterParams[key]);
    });

    return params.toString();
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const queryString = buildQueryParams();
      console.log('API URL:', `/gettotaltaskdetails?${queryString.toString()}`);

      const response = await _get(`/gettotaltaskdetails?${queryString}`);
      const result = response?.data?.data;

      if (Array.isArray(result)) setData(result);
      else {
        setData([]);
        // showError('No data found for the applied filters.');
      }
    } catch (error) {
      console.log('❌ API Error Details:', error); // ✅ full error object
      console.log('❌ API Error Response:', error?.response); // ✅ backend se aaya error (agar ho)
      console.log('❌ API Error Data:', error?.response?.data); // ✅ backend message body
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [userId, status, filterParams]);

  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  useEffect(() => {
    const title = userName ? `${status} - ${userName}` : `${status} Tasks`;
    navigation.setOptions({title});
  }, [navigation, status, userName]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId, status, filterParams]),
  );

  const handleSmsPress = item => {
    const url = `sms:${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  };

  const visibleItems = data.slice(0, visibleCount);

  const renderItem = ({item}) => {
    const handleCardPress = () => {
      const statusName = item?.status_name?.toLowerCase();
      navigation.navigate(
        statusName === 'interested' ? 'LeadInterested2' : 'ContactDetails2',
        {item},
      );
    };

    return (
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
        onSmsPress={() => handleSmsPress(item)}
        isSelected={false}
        showCheckbox={false}
      />
    );
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filterParams.from_date && filterParams.to_date)
      activeFilters.push(
        `${filterParams.from_date} to ${filterParams.to_date}`,
      );
    if (filterParams.project_id) activeFilters.push('Project Filter');
    if (filterParams.source_id) activeFilters.push('Source Filter');
    if (filterParams.property_type_id)
      activeFilters.push('Property Type Filter');
    if (filterParams.budget_id) activeFilters.push('Budget Filter');
    if (filterParams.city_id) activeFilters.push('City Filter');
    if (filterParams.lead_type_id) activeFilters.push('Lead Type Filter');
    if (filterParams.customer_type_id)
      activeFilters.push('Customer Type Filter');

    return activeFilters.length
      ? activeFilters.join(', ')
      : 'No filters applied';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerContainer}>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{data.length} total records</Text>
          <Text style={styles.statusText}>
            {status} tasks for {userName || 'User'}
          </Text>
        </View>

        {Object.keys(filterParams).some(key => filterParams[key]) && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterText}>Filters: {getFilterSummary()}</Text>
          </View>
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
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {status.toLowerCase()} records found.
              </Text>
              {Object.keys(filterParams).some(key => filterParams[key]) && (
                <Text style={styles.emptySubText}>
                  Try adjusting your filters to see more results.
                </Text>
              )}
            </View>
          }
          ListFooterComponent={
            data.length > visibleCount && (
              <TouchableOpacity
                onPress={() => setVisibleCount(prev => prev + 100)}
                style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>See More</Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </View>
  );
};

export default Taskfilterdatacard;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: rw(5),
    paddingVertical: rh(1.5),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  countContainer: {alignItems: 'flex-end'},
  countText: {color: '#555', fontSize: rf(1.7), fontWeight: '500'},
  statusText: {
    color: '#007AFF',
    fontSize: rf(1.5),
    fontWeight: '600',
    marginTop: rh(0.5),
  },
  filterInfo: {
    marginTop: rh(1),
    paddingTop: rh(1),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  filterText: {color: '#666', fontSize: rf(1.3), fontStyle: 'italic'},
  list: {padding: rw(3)},
  seeMoreButton: {
    paddingVertical: rh(2),
    borderRadius: rw(2),
    marginHorizontal: rw(4),
    marginBottom: rh(3),
    alignItems: 'center',
  },
  seeMoreText: {color: '#000', fontSize: rf(2), fontWeight: '600'},
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rh(5),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: rf(2),
    color: '#777',
    padding: rh(2),
  },
  emptySubText: {
    textAlign: 'center',
    fontSize: rf(1.6),
    color: '#999',
    marginTop: rh(1),
  },
});
