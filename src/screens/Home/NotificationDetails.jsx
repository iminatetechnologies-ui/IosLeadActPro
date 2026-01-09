import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const NotificationDetails = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );
};

export default NotificationDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#F9F9F9',
  },
 card: {
     backgroundColor: '#fff',
     padding: wp('2%'),
     borderRadius: wp('3%'),
     marginBottom: hp('1.5%'),
   },
   title: {
     fontSize: wp('3.8%'),
     fontWeight: 'bold',
     color: '#2C3E50',
   },
   message: {
     fontSize: wp('3.3%'),
     marginTop: hp('0.8%'),
     color: '#555',
   },
   time: {
     fontSize: wp('3%'),
     marginTop: hp('1%'),
     color: '#888',
     textAlign: 'right',
   },
});
