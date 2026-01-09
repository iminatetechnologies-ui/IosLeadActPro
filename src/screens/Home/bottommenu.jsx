import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();

const BottomMenu = ({navigation, closeSheet}) => {
  const menuItems = [
    {name: 'Analytics', icon: 'analytics-outline', disabled: false},
    {
      name: 'Resale Inventory',
      icon: 'add-circle-outline',
      disabled: false,
    },

    {name: 'Request (Upcoming Soon)', icon: 'chatbox-outline', disabled: true},
    {
      name: 'My Incentive (Upcoming Soon)',
      icon: 'gift-outline',
      disabled: true,
    },
    {name: 'Appraisal (Upcoming Soon)', icon: 'medal-outline', disabled: true},
    {name: 'Booking (Upcoming Soon)', icon: 'calendar-outline', disabled: true},
  ];

  const handlePress = itemName => {
    Keyboard.dismiss();
    closeSheet();

    if (itemName === 'Analytics') {
      navigation.navigate('Analytics');
    } else if (itemName === 'Resale Inventory') {
      navigation.navigate('Resale');
    } else {
      ToastAndroid.show('Coming Soon!', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      {/* Drag Handle */}
      <View style={styles.handleWrapper}>
        <View style={styles.handleLine} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {menuItems.map((item, index) => {
          const disabledStyle = item.disabled ? {opacity: 0.4} : {};

          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, disabledStyle]}
              onPress={() => !item.disabled && handlePress(item.name)}
              disabled={item.disabled}>
              <Text style={styles.text}>{item.name}</Text>
              <Ionicons
                name={item.icon}
                size={isTablet ? wp('3%') : wp('5.5%')}
                color="#333"
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: isTablet ? wp('2%') : wp('3%'),
    elevation: 5,
    width: '100%',
    borderTopLeftRadius: isTablet ? wp('3%') : wp('5%'),
    borderTopRightRadius: isTablet ? wp('3%') : wp('5%'),
  },
  handleWrapper: {
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  handleLine: {
    width: wp('15%'),
    height: hp('0.4%'),
    borderRadius: 10,
    backgroundColor: '#a0a0a0ff',
  },
  scrollContainer: {
    paddingBottom: hp('1%'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isTablet ? hp(1) : hp('0.5%'),
    paddingVertical: isTablet ? hp(1) : hp('1.2%'),
    paddingHorizontal: isTablet ? wp('1.5%') : wp('3%'),
    borderRadius: isTablet ? wp('0.8%') : wp('2%'),
    backgroundColor: '#fff',
    borderWidth: 0.8,
    borderColor: '#ddd',
  },
  text: {
    flex: 1,
    fontSize: isTablet ? wp('2%') : wp('3.5'),
    fontWeight: 'bold',
    color: '#333',
  },
});
