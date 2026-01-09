import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CardComponent from './CardComponent';
import IncentiveTable from './IncentiveTable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Incentive = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [months, setMonths] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Generate last 12 months dynamically
  const generateLast12Months = () => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const today = new Date();
    const monthsList = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      if (date > today) continue;
      const monthName = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthsList.push({
        label: monthName,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
    }
    return monthsList;
  };

  // ✅ Dummy Data (simulate API response)
  const getDummyData = monthName => {
    switch (monthName) {
      case 'November 2025':
        return {
          total_employees: 12,
          total_business: 240000,
          total_incentives: 15000,
          justification_rate: 82,
        };
      case 'October 2025':
        return {
          total_employees: 10,
          total_business: 200000,
          total_incentives: 12000,
          justification_rate: 75,
        };
      case 'September 2025':
        return {
          total_employees: 9,
          total_business: 180000,
          total_incentives: 10000,
          justification_rate: 69,
        };
      default:
        return {
          total_employees: 0,
          total_business: 0,
          total_incentives: 0,
          justification_rate: 0,
        };
    }
  };

  // ✅ Dummy Table Data
  const dummyTableData = [
    {
      employee: 'Sanjeev',
      role: 'Manager',
      business_target: 825000,
      actual_business: 933000,
      excess_business: 108000,
      incentive_percent: 10,
      incentive_amount: 10800,
      performance_percent: 113.1,
      performance_status: 'Justified',
    },
    {
      employee: 'Ankit',
      business_target: 88000,
      actual_business: 210000,
      excess_business: 122000,
      incentive_percent: 15,
      incentive_amount: 18300,
      performance_percent: 238.6,
      performance_status: 'Justified',
    },
    {
      employee: 'Renu',
      business_target: 100000,
      actual_business: 160000,
      excess_business: 60000,
      incentive_percent: 15,
      incentive_amount: 9000,
      performance_percent: 160,
      performance_status: 'Justified',
    },
    {
      employee: 'Soni',
      business_target: 100000,
      actual_business: 125000,
      excess_business: 25000,
      incentive_percent: 15,
      incentive_amount: 3750,
      performance_percent: 125,
      performance_status: 'Justified',
    },
    {
      employee: 'Shivani Arya',
      business_target: 0,
      actual_business: 123000,
      excess_business: 123000,
      incentive_percent: 15,
      incentive_amount: 18450,
      performance_percent: 100,
      performance_status: 'Justified',
    },
    {
      employee: 'Sulabh Garg',
      business_target: 100000,
      actual_business: 120000,
      excess_business: 20000,
      incentive_percent: 15,
      incentive_amount: 3000,
      performance_percent: 120,
      performance_status: 'Justified',
    },
    {
      employee: 'Simran',
      business_target: 112000,
      actual_business: 90000,
      excess_business: 0,
      incentive_percent: 15,
      incentive_amount: 0,
      performance_percent: 80.4,
      performance_status: 'Not Justified',
    },
    {
      employee: 'Suman',
      business_target: 100000,
      actual_business: 60000,
      excess_business: 0,
      incentive_percent: 15,
      incentive_amount: 0,
      performance_percent: 60,
      performance_status: 'Not Justified',
    },
    {
      employee: 'Dimple',
      business_target: 100000,
      actual_business: 45000,
      excess_business: 0,
      incentive_percent: 15,
      incentive_amount: 0,
      performance_percent: 45,
      performance_status: 'Not Justified',
    },
    {
      employee: 'Vipin Kumar Singh',
      business_target: 100000,
      actual_business: 0,
      excess_business: 0,
      incentive_percent: 15,
      incentive_amount: 0,
      performance_percent: 0,
      performance_status: 'Not Justified',
    },
    
  ];

  // ✅ Load current month
  useEffect(() => {
    const monthsArr = generateLast12Months();
    setMonths(monthsArr);
    if (monthsArr.length > 0) {
      const current = monthsArr[0];
      setSelectedMonth(current.label);
      setLoading(true);
      setTimeout(() => {
        setCardData(getDummyData(current.label));
        setLoading(false);
      }, 600);
    }
  }, []);

  const handleSelect = item => {
    setSelectedMonth(item.label);
    setShowModal(false);
    setLoading(true);
    setTimeout(() => {
      setCardData(getDummyData(item.label));
      setLoading(false);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🔹 Header with Title + Month Selector */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity
          style={styles.monthSelector}
          onPress={() => setShowModal(true)}>
          <Text style={styles.monthText}>
            {selectedMonth || 'Select Month'}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Cards Section */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0389ca"
          style={{marginTop: hp('0%')}}
        />
      ) : (
        cardData && <CardComponent cardData={cardData} />
      )}

      {/* 🔹 Table Section */}

      {!loading && (
        <View style={{flex: 1, marginTop: hp('0%')}}>
          <Text style={styles.title}>Top 10 Performers</Text>
          <IncentiveTable tableData={dummyTableData} />
        </View>
      )}

      {/* 🔹 Month Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <FlatList
              data={months}
              keyExtractor={item => item.label}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.monthOption}
                  onPress={() => handleSelect(item)}>
                  <Text
                    style={[
                      styles.monthOptionText,
                      item.label === selectedMonth && styles.selectedMonth,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  title: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#000',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    backgroundColor: '#fff',
  },
  monthText: {
    fontSize: wp('3.5%'),
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: wp('80%'),
    borderRadius: wp('3%'),
    padding: wp('4%'),
    maxHeight: hp('70%'),
  },
  modalTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
    textAlign: 'center',
    color: '#000',
  },
  monthOption: {
    paddingVertical: hp('1%'),
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  monthOptionText: {
    fontSize: wp('3.8%'),
    textAlign: 'center',
    color: '#000',
  },
  selectedMonth: {
    color: '#0389ca',
    fontWeight: '700',
  },
  closeButton: {
    marginTop: hp('1.5%'),
    backgroundColor: '#0389ca',
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  closeText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});

export default Incentive;
