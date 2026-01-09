import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CardComponent = ({cardData = {}}) => {
  const finalData = [
    {
      label: 'TOTAL EMPLOYEES',
      value: cardData.total_employees || 0,
      icon: 'groups',
      colors: ['#007bff', '#007bff'],
    },
    {
      label: 'TOTAL BUSINESS',
      value: cardData.total_business
        ? `₹${cardData.total_business.toLocaleString()}`
        : '₹0',
      icon: 'show-chart',
      colors: ['#4CAF50', '#4CAF50'],
    },
    {
      label: 'TOTAL INCENTIVES',
      value: cardData.total_incentives
        ? `₹${cardData.total_incentives.toLocaleString()}`
        : '₹0',
      icon: 'currency-rupee',
      colors: ['#FFA726', '#FFA726'],
    },
    {
      label: 'JUSTIFICATION RATE',
      value: cardData.justification_rate
        ? `${cardData.justification_rate}%`
        : '0%',
      icon: 'percent',
      colors: ['#26C6DA', '#26C6DA'],
    },
  ];

  return (
    <View style={styles.container}>
      {finalData.map((item, index) => (
        <View key={index} style={styles.card}>
          <LinearGradient colors={item.colors} style={styles.gradient}>
            <View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
            <MaterialIcons
              name={item.icon}
              size={wp('5.5%')}
              color="#fff"
              style={styles.icon}
            />
          </LinearGradient>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('2%'),
  },
  card: {
    width: wp('45%'),
    height: hp('9%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
    backgroundColor: '#fff',
    // elevation: 3,
  },
  gradient: {
    flex: 1,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    justifyContent: 'space-between',
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp('3%'),
    textTransform: 'uppercase',
  },
  value: {
    color: '#fff',
    fontSize: wp('4.2%'),
    fontWeight: '800',
    marginTop: hp('0.3%'),
  },
  icon: {
    position: 'absolute',
    top: wp('6%'),
    right: wp('2.5%'),
    opacity: 0.9,
  },
});

export default CardComponent;
