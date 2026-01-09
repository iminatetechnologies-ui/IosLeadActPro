import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CardComponentPlaceholder from '../../../components/CardComponentPlaceholder';

// 🔸 3-Card Data Config for Matching Inventory
const matchingInventoryCardData = [
  {
    label: 'Total Matches',
    key: 'totalMatches',
    colors: ['#ffffff', '#ffffff'],
    icon: 'list-alt',
    iconColor: '#0389ca',
  },
  {
    label: 'Exact Budget Match',
    key: 'exactBudgetMatch',
    colors: ['#ffffff', '#ffffff'],
    icon: 'attach-money',
    iconColor: '#4CAF50',
  },
  {
    label: 'High Match Score',
    key: 'highMatchScore',
    colors: ['#ffffff', '#ffffff'],
    icon: 'stars',
    iconColor: '#FF9800',
  },
];

const CardComponent = ({ callData }) => {
  // If callData is not provided, show placeholder
  if (!callData) {
    return <CardComponentPlaceholder />;
  }

  // Map the data with actual counts from callData
  const mappedData = matchingInventoryCardData.map(item => ({
    label: item.label,
    count: callData[item.key] || 0, // Default to 0 if not found
    colors: item.colors,
    icon: item.icon,
    iconColor: item.iconColor,
  }));

  return (
    <View style={styles.container}>
      {mappedData.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.card} 
          activeOpacity={0.8}
          onPress={() => {
            // You can add onPress functionality here
            console.log(`${item.label} pressed`);
          }}
        >
          <LinearGradient 
            colors={item.colors} 
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.label}>{item.label}</Text>
            
            <View style={styles.countRow}>
              <Text style={styles.count}>{item.count}</Text>
              <MaterialIcons
                name={item.icon}
                size={wp('5.2%')}
                color={item.iconColor}
                style={styles.icon}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
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
    width: wp('29%'), // Adjust width to show 2 cards per row (3rd will wrap)
    height: hp('10%'), // Slightly taller for better visibility
    borderRadius: wp('2%'),
    marginBottom: hp('0%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gradient: {
    flex: 1,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    justifyContent: 'space-between',
  },
  label: {
    color: '#000',
    fontWeight: '600',
    fontSize: wp('3.3%'), // Slightly smaller for longer labels
    marginBottom: hp('0.5%'),
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    color: '#0389ca',
    fontSize: wp('4.5%'), // Larger for emphasis
    fontWeight: '700',
  },
  icon: {
    marginLeft: wp('2%'),
  },
});

export default CardComponent;