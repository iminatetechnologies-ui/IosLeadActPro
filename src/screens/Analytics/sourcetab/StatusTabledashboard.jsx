// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import {_get, _post} from '../../../api/apiClient';
// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';

// const StatusTable = ({activeFilterParams = {}}) => {
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [prevParams, setPrevParams] = useState('');

//   const fetchTableData = async () => {
//     try {
//       const queryParams = new URLSearchParams({
//         from_date: activeFilterParams?.from_date || '',
//         to_date: activeFilterParams?.to_date || '',
//         userid: activeFilterParams?.userid || '',
//         project_id: activeFilterParams?.project_id || '',
//         source_id: activeFilterParams?.source_id || '',
//         property_type_id: activeFilterParams?.property_type_id || '',
//         budget_id: activeFilterParams?.budget_id || '',
//         city_id: activeFilterParams?.city_id || '',
//         lead_type_id: activeFilterParams?.lead_type_id || '',
//         customer_type_id: activeFilterParams?.customer_type_id || '',
//         utype: activeFilterParams?.utype || '',
//         // date_type :activeFilterParams?.date_type||'',
//       });


//       const response = await _get(`/sourcestatuswisedata?${queryParams.toString()}`);
//       const data = response?.data?.data;

//       if (Array.isArray(data)) {
//         setTableData(data);
//       } else {
//         setTableData([]);
//       }
//     } catch (error) {
//       console.error('❌ API Error:', error?.response || error);
//       setTableData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const currentParams = JSON.stringify(activeFilterParams);
//     if (currentParams !== prevParams) {
//       setPrevParams(currentParams);
//       setLoading(true);
//       fetchTableData();
//     }
//   }, [activeFilterParams]);

//   const renderHeader = () => (
//     <View style={[styles.row, styles.headerRow]}>
//       <Text style={[styles.cell, styles.nameColumn, styles.header]}>Name</Text>
//       {['Fresh', 'Interested', 'Callback', 'Opportunity', 'Won', 'Missed'].map(
//         (label, index) => (
//           <Text key={index} style={[styles.cell, styles.header]}>
//             {label}
//           </Text>
//         ),
//       )}
//     </View>
//   );

//   const renderItem = ({item, index}) => {
//     const isEvenRow = index % 2 === 0;

//     return (
//       <View
//         style={[
//           styles.row,
//           {backgroundColor: isEvenRow ? '#ffffff' : '#f9f9f9'},
//         ]}>
//         <Text style={[styles.cell, styles.nameColumn]}>{item.source_name}</Text>
//         {[item.Fresh, item.Interested, item.Callback, item.Opportunity, item.Won, item.Missed].map(
//           (value, idx) => (
//             <Text key={idx} style={styles.cell}>
//               {value}
//             </Text>
//           ),
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#666" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.tableWrapper}>
//         {renderHeader()}
//         <FlatList
//           data={tableData}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderItem}
//           style={{maxHeight: rh(60)}}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     paddingHorizontal: rw(3),
//     paddingVertical: rh(2),
//   },
//   tableWrapper: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     shadowOffset: {width: 0, height: 2},
//     // elevation: 2,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: rh(5),
//   },
//   noDataText: {
//     padding: 20,
//     color: 'gray',
//     fontSize: rf(1.6),
//   },
//   row: {
//     flexDirection: 'row',
//     borderBottomWidth: 0.6,
//     borderColor: '#ddd',
//     alignItems: 'center',
//   },
//   headerRow: {
//     backgroundColor: '#0389ca',
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   cell: {
//     minWidth: rw(18),
//     maxWidth: rw(22),
//     paddingVertical: rh(1.5),
//     paddingHorizontal: rw(1.5),
//     fontSize: rf(1.5),
//     color: '#333',
//     textAlign: 'center',
//     flexWrap: 'wrap',
//   },
//   nameColumn: {
//     minWidth: rw(35),
//     maxWidth: rw(40),
//     textAlign: 'left',
//     fontWeight: '400',
//   },
//   header: {
//     fontWeight: 'bold',
//     color: 'white',
//     fontSize: rf(1.4),
//   },
// });

// export default StatusTable;


import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {_get} from '../../../api/apiClient';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';   // ⭐ ADDED

const StatusTable = ({activeFilterParams = {}}) => {
  const navigation = useNavigation();  // ⭐ ADDED

  const navigateToScreen = (status, source_id) => {   // ⭐ ADDED
    navigation.navigate('Source Leads', {
      status,
      source_id,
      filterParams: activeFilterParams,
    });
  };

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevParams, setPrevParams] = useState('');

  const fetchTableData = async () => {
    try {
      const queryParams = new URLSearchParams({
        from_date: activeFilterParams?.from_date || '',
        to_date: activeFilterParams?.to_date || '',
        userid: activeFilterParams?.userid || '',
        project_id: activeFilterParams?.project_id || '',
        source_id: activeFilterParams?.source_id || '',
        property_type_id: activeFilterParams?.property_type_id || '',
        budget_id: activeFilterParams?.budget_id || '',
        city_id: activeFilterParams?.city_id || '',
        lead_type_id: activeFilterParams?.lead_type_id || '',
        customer_type_id: activeFilterParams?.customer_type_id || '',
        utype: activeFilterParams?.utype || '',
      });

      const response = await _get(
        `/sourcestatuswisedata?${queryParams.toString()}`,
      );
      const data = response?.data?.data;

      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('❌ API Error:', error?.response || error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = JSON.stringify(activeFilterParams);
    if (currentParams !== prevParams) {
      setPrevParams(currentParams);
      setLoading(true);
      fetchTableData();
    }
  }, [activeFilterParams]);

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.nameColumn, styles.header]}>Name</Text>
      {['Fresh', 'Interested', 'Callback', 'Opportunity', 'Won', 'Missed'].map(
        (label, index) => (
          <Text key={index} style={[styles.cell, styles.header]}>
            {label}
          </Text>
        ),
      )}
    </View>
  );

  const renderItem = ({item, index}) => (
    <View
      style={[
        styles.row,
        {backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9'},
      ]}>
      <Text style={[styles.cell, styles.nameColumn]}>{item.source_name}</Text>

      {[
        {key: 'Fresh', value: item.Fresh},
        {key: 'Interested', value: item.Interested},
        {key: 'Callback', value: item.Callback},
        {key: 'Opportunity', value: item.Opportunity},
        {key: 'Won', value: item.Won},
        {key: 'Missed', value: item.Missed},
      ].map((col, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => navigateToScreen(col.key, item.source_id)}
          activeOpacity={0.7}>
          <Text style={styles.cell}>{col.value || '0'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      <View style={styles.tableWrapper}>
        {renderHeader()}
        <FlatList
          data={tableData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={{maxHeight: rh(60)}}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: rw(3),
    paddingVertical: rh(2),
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: rh(5),
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.6,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#0389ca',
  },
  cell: {
    minWidth: rw(18),
    maxWidth: rw(22),
    paddingVertical: rh(1.5),
    paddingHorizontal: rw(1.5),
    fontSize: rf(1.5),
    color: '#333',
    textAlign: 'center',
  },
  nameColumn: {
    minWidth: rw(35),
    maxWidth: rw(40),
    textAlign: 'left',
    fontWeight: '400',
  },
  header: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: rf(1.4),
  },
});

export default StatusTable;
