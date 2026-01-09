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

// 🔸 Static card UI config
const staticCallCardData = [
  {
    label: 'Outgoing',
    key: 'outgoingCalls',
    colors: ['#fff', '#fff'],
    icon: 'call-made',
    iconColor: '#4CAF50',
  },
  {
    label: 'Incoming',
    key: 'incomingCalls',
    colors: ['#fff', '#fff'],
    icon: 'call-received',
    iconColor: '#2196F3',
  },
  {
    label: 'Missed',
    key: 'missedCalls',
    colors: ['#fff', '#fff'],
    icon: 'call-missed',
    iconColor: '#F44336',
  },
  {
    label: 'Connected',
    key: 'connectedCalls',
    colors: ['#fff', '#fff'],
    icon: 'call',
    iconColor: '#FF9800',
  },
];

const CardComponent = ({ callData }) => {
  if (!callData) {
    return <CardComponentPlaceholder />;
  }

  const mappedData = staticCallCardData.map(item => ({
    label: item.label,
    count: callData[item.key] || 0,
    colors: item.colors,
    icon: item.icon,
    iconColor: item.iconColor,
  }));

  return (
    <View style={styles.container}>
      {mappedData.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card} activeOpacity={0.8}>
          <LinearGradient colors={item.colors} style={styles.gradient}>
            <View>
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
    width: wp('45%'),
    height: hp('7%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
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
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
     color: '#0389ca',
    fontSize: wp('3%'),
    fontWeight: '700',
  },
  icon: {
    position: 'absolute',
    top: wp('0%'),
    right: wp('4%'),
  },
});

export default CardComponent;
