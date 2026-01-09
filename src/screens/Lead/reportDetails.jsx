import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const data = {
  team: 'Diwakar',
  total: 100,
  fresh: 78,
  callBack: 6,
  interested: 3,
  won: 1,
  notInterested: 13,
  siteVisit: 0,
};

const ReportDetails = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0389ca" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Status-Wise Lead Distribution</Text>

      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableWrapper}>
          {/* Header Row */}
          <View style={[styles.row, styles.rowHeader]}>
            <Text style={styles.cellHeader}>TEAM</Text>
            <Text style={styles.cellHeader}>TOTAL</Text>
            <Text style={styles.cellHeader}>FRESH</Text>
            <Text style={styles.cellHeader}>CALL BACK</Text>
            <Text style={styles.cellHeader}>INTERESTED</Text>
            <Text style={styles.cellHeader}>WON</Text>
            <Text style={styles.cellHeader}>NOT INTERESTED</Text>
            <Text style={styles.cellHeader}>SITE VISIT</Text>
          </View>

          {/* Data Row */}
          <View style={styles.row}>
            <Text style={styles.cell}>{data.team}</Text>
           <TouchableOpacity ><Text style={styles.cell}>{data.total}</Text></TouchableOpacity> 
            <Text style={styles.cell}>{data.fresh}</Text>
            <Text style={styles.cell}>{data.callBack}</Text>
            <Text style={styles.cell}>{data.interested}</Text>
            <Text style={styles.cell}>{data.won}</Text>
            <Text style={styles.cell}>{data.notInterested}</Text>
            <Text style={styles.cell}>{data.siteVisit}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(4),
    paddingBottom: rh(1.2),
    paddingTop: rh(1),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#0389ca',
  },
  backButton: {
    padding: rw(1),
    marginRight: rw(2.5),
  },
  headerTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: rf(2),
    fontWeight: 'bold',
    marginBottom: rh(1.5),
    paddingHorizontal: rw(4),
    marginTop: rh(2),
    textAlign: 'center',
  },
  tableWrapper: {
    marginHorizontal: rw(2),
    marginTop: rh(2),
    // borderWidth: 1,
    // borderColor: '#ddd',
    borderRadius: rw(2),
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  rowHeader: {
    backgroundColor: '#f2f2f2',
  },
  cellHeader: {
    width: rw(20),
    paddingVertical: rh(1),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: rf(1.3),
    color: '#000',
  },
  cell: {
    width: rw(20),
    paddingVertical: rh(1.5),
    textAlign: 'center',
    fontSize: rf(1.3),
    color: '#333',
  },
});
