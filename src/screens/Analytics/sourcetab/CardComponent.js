import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CardComponentPlaceholder from '../../../components/CardComponentPlaceholder';

const staticCardData = [
  {
    label: 'Fresh',
    colors: ['#fff', '#fff'],
    icon: 'bar-chart',
    iconColor: '#2196F3',
  }, // Blue
  {
    label: 'Interested',
    colors: ['#fff', '#fff'],
    icon: 'thumb-up',
    iconColor: '#4CAF50',
  }, // Green
  {
    label: 'Callback',
    colors: ['#fff', '#fff'],
    icon: 'call',
    iconColor: '#FF9800',
  }, // Orange
  {
    label: 'Missed',
    colors: ['#fff', '#fff'],
    icon: 'do-not-disturb',
    iconColor: '#F44336',
  }, // Red
  {
    label: 'Opportunity',
    colors: ['#fff', '#fff'],
    icon: 'star-outline',
    iconColor: '#9C27B0',
  }, // Purple
  {
    label: 'Won',
    colors: ['#fff', '#fff'],
    icon: 'emoji-events',
    iconColor: '#FFD700',
  }, // Gold
];

const CardComponent = ({navigation, cardData = [], activeFilterParams}) => {
 
  const navigateToScreen = label => {
    // ✅ Send filter params also on navigation
    navigation.navigate('Source Leads', {
      status: label,
      filterParams: activeFilterParams, // ✅ pass this
    });
  };

  const labelOrder = [
    'Fresh',
    'Interested',
    'Callback',
    'Missed',
    'Opportunity',
    'Won',
  ];

  const mergedCardData = cardData
    .map(item => {
      const match = staticCardData.find(
        staticItem => staticItem.label === item.name,
      );
      return {
        label: item.name,
        count: item.population,
        colors: match?.colors || ['#231f20', '#333'],
        icon: match?.icon || 'help-circle-outline',
        iconColor: match?.iconColor || '#000',
      };
    })
    .sort((a, b) => labelOrder.indexOf(a.label) - labelOrder.indexOf(b.label));

  console.log('✅ activeFilterParams in CardComponent:', activeFilterParams);

  return (
    <View style={styles.container}>
      {cardData.length === 0 ? (
        <CardComponentPlaceholder />
      ) : (
        mergedCardData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigateToScreen(item.label)}
            >
            <LinearGradient colors={item.colors} style={styles.gradient}>
              <View>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.count}>{item.count}</Text>
              </View>
              <MaterialIcons
                name={item.icon}
                size={wp('5.2%')}
                color={item.iconColor}
                style={styles.icon}
              />
            </LinearGradient>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('2%'),
  },

  card: {
    width: wp('30%'), // Adjusted width for 3 cards per row with spacing
    height: hp('6.5%'), // Slightly increased for better spacing
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff', // Optional: fallback if gradient doesn't load
  },

  gradient: {
    flex: 1,
    borderRadius: wp('2%'),
    padding: wp('1%'),
    justifyContent: 'space-between',
  },

  label: {
    color: '#000',
    fontWeight: '600',
    fontSize: wp('3%'),
    marginBottom: hp('0.5%'),
  },

  count: {
    color: '#0389ca',
    fontSize: wp('3%'),
    fontWeight: '700',
  },

  icon: {
    position: 'absolute',
    top: wp('4%'),
    right: wp('4%'),
    //color: '#0389ca',
  },
});

export default CardComponent;
