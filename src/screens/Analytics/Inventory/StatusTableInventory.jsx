// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from 'react-native-responsive-dimensions';

// // ----------- Dummy Static Inventory Table Data -------------
// const DUMMY_TABLE_DATA = [
//   {
//     user_name: 'Rohit Sharma',
//     available: 12,
//     sold: 5,
//     hold: 3,
//     total: 20,
//   },
//   {
//     user_name: 'Virat Kohli',
//     available: 9,
//     sold: 7,
//     hold: 2,
//     total: 18,
//   },
//   {
//     user_name: 'KL Rahul',
//     available: 15,
//     sold: 4,
//     hold: 1,
//     total: 20,
//   },
// ];

// const StatusTable = () => {
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Load Dummy Data
//   useEffect(() => {
//     setTimeout(() => {
//       setTableData(DUMMY_TABLE_DATA);
//       setLoading(false);
//     }, 800);
//   }, []);

//   const renderHeader = () => (
//     <View style={[styles.row, styles.headerRow]}>
//       <Text style={[styles.cell, styles.nameColumn, styles.headerText]}>
//         Name
//       </Text>

//       {['Available', 'Sold', 'Hold', 'Total'].map((label, i) => (
//         <Text key={i} style={[styles.cell, styles.headerText]}>
//           {label}
//         </Text>
//       ))}
//     </View>
//   );

//   const renderItem = ({item, index}) => (
//     <View
//       style={[
//         styles.row,
//         {backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'},
//       ]}>
//       <Text style={[styles.cell, styles.nameColumn]}>{item.user_name}</Text>

//       {[item.available, item.sold, item.hold, item.total].map((value, i) => (
//         <Text key={i} style={styles.cell}>
//           {value}
//         </Text>
//       ))}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#666" />
//       </View>
//     );
//   }

//   if (!tableData.length) {
//     return (
//       <View style={styles.noDataView}>
//         <Text style={styles.noDataText}>No data available</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.tableCard}>
//         {renderHeader()}
//         <FlatList
//           data={tableData}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderItem}
//           style={{maxHeight: rh(40)}}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// export default StatusTable;

// const styles = StyleSheet.create({
//   scrollContainer: {
//     paddingHorizontal: rw(3),
//     paddingVertical: rh(5),
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: rh(5),
//   },
//   noDataView: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: rh(4),
//   },
//   noDataText: {
//     color: '#777',
//     fontSize: rf(1.7),
//     fontStyle: 'italic',
//   },
//   tableCard: {
//     backgroundColor: '#fff',
//     borderRadius: rw(2),
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: {width: 0, height: 2},
//     overflow: 'hidden',
//   },
//   row: {
//     flexDirection: 'row',
//     borderBottomWidth: 0.8,
//     borderColor: '#eee',
//     alignItems: 'center',
//   },
//   headerRow: {
//     backgroundColor: '#0389ca',
//   },
//   cell: {
//     minWidth: rw(18),
//     maxWidth: rw(22),
//     paddingVertical: rh(1.5),
//     paddingHorizontal: rw(2),
//     fontSize: rf(1.6),
//     color: '#333',
//     textAlign: 'center',
//   },
//   nameColumn: {
//     minWidth: rw(35),
//     maxWidth: rw(40),
//     textAlign: 'left',
//     fontWeight: '500',
//   },
//   headerText: {
//     fontWeight: '700',
//     color: '#fff',
//     fontSize: rf(1.5),
//   },
// });


import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import {responsiveWidth as rw, responsiveHeight as rh, responsiveFontSize as rf} from 'react-native-responsive-dimensions';

const StatusTable = ({ tableData = [], loading = true }) => {
  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.nameColumn, styles.headerText]}>Name</Text>
      {['Available', 'Sold', 'Hold','Under Negotiation', 'Total'].map((label, i) => (
        <Text key={i} style={[styles.cell, styles.headerText]}>{label}</Text>
      ))}
    </View>
  );

  const renderItem = ({item, index}) => (
    <View style={[styles.row, {backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'}]}>
      <Text style={[styles.cell, styles.nameColumn]}>{item.name}</Text>
      {[item.available, item.sold, item.hold,item.under_negotiation, item.total].map((value, i) => (
        <Text key={i} style={styles.cell}>{value}</Text>
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

  if (!tableData.length) {
    return (
      <View style={styles.noDataView}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      <View style={styles.tableCard}>
        {renderHeader()}
        <FlatList
          data={tableData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={{maxHeight: rh(40)}}
        />
      </View>
    </ScrollView>
  );
};

export default StatusTable;

const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: rw(3), paddingVertical: rh(5) },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: rh(5) },
  noDataView: { alignItems: 'center', justifyContent: 'center', paddingVertical: rh(4) },
  noDataText: { color: '#777', fontSize: rf(1.7), fontStyle: 'italic' },
  tableCard: { backgroundColor: '#fff', borderRadius: rw(2), elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: {width: 0, height: 2}, overflow: 'hidden' },
  row: { flexDirection: 'row', borderBottomWidth: 0.8, borderColor: '#eee', alignItems: 'center' },
  headerRow: { backgroundColor: '#0389ca' },
  cell: { minWidth: rw(18), maxWidth: rw(22), paddingVertical: rh(1.5), paddingHorizontal: rw(2), fontSize: rf(1.6), color: '#333', textAlign: 'center' },
  nameColumn: { minWidth: rw(35), maxWidth: rw(40), textAlign: 'left', fontWeight: '500' },
  headerText: { fontWeight: '700', color: '#fff', fontSize: rf(1.5) },
});
