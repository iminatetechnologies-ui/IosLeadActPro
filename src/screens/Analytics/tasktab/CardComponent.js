// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {useNavigation} from '@react-navigation/native';

// const staticConfig = {

//   Meeting: {
//     icon: 'event-available',
//     iconColor: '#4CAF50',
//     colors: ['#fff', '#ffff'],
//   },
//   Sitevisit: {
//     icon: 'location-on',
//     iconColor: '#2196F3',
//     colors: ['#fff', '#ffff'],
//   },
//   EOI: {
//     icon: 'payments',
//     iconColor: '#9C27B0',
//     colors: ['#fff', '#ffff'],
//   },
//   Booking: {
//     icon: 'bookmark',
//     iconColor: '#FF9800',
//     colors: ['#fff', '#ffff'],
//   },
// };

// const CardComponent = ({cardData = {}, activeFilterParams}) => {
//   const navigation = useNavigation();

//   // Transform the API data to match our staticConfig keys
//   const transformCardData = (data) => {
//     return {
//       ...data,
//       EOI: data.eoi || data.EOI || 0 // Handle both "eoi" from API and "EOI" from config
//     };
//   };

//   const transformedData = transformCardData(cardData);
//   const keys = Object.keys(transformedData);

//   const dataToRender = keys
//     .filter(key => staticConfig[key]) // only include configured types
//     .map(key => ({
//       label: key,
//       count: transformedData[key],
//       ...staticConfig[key],
//     }));

//   const navigateToScreen = label => {
//     navigation.navigate('Filter Data Task', {
//       status: label,
//       filterParams: {
//         ...activeFilterParams,
//       },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {dataToRender.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => {
//             if (parseInt(item.count) > 0) {
//               navigateToScreen(item.label);
//             }
//           }}>
//           <LinearGradient colors={item.colors} style={styles.gradient}>
//             <View>
//               <Text style={styles.label}>{item.label}</Text>
//               <Text style={styles.count}>{item.count}</Text>
//             </View>
//             <MaterialIcons
//               name={item.icon}
//               size={wp('5.2%')}
//               color={item.iconColor}
//               style={styles.icon}
//             />
//           </LinearGradient>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: wp('3%'),
//     paddingBottom: hp('2%'),
//   },
//   card: {
//     width: wp('45%'),
//     height: hp('8%'),
//     borderRadius: wp('2%'),
//     marginBottom: hp('2%'),
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     backgroundColor: '#fff',
//   },
//   gradient: {
//     flex: 1,
//     borderRadius: wp('2%'),
//     padding: wp('3%'),
//     justifyContent: 'space-between',
//   },
//   label: {
//     color: '#000',
//     fontWeight: '600',
//     fontSize: wp('3.5%'),
//     marginBottom: hp('0.5%'),
//   },
//   count: {
//     color: '#0389ca',
//     fontSize: wp('4.2%'),
//     fontWeight: '700',
//   },
//   icon: {
//     position: 'absolute',
//     top: wp('8%'),
//     right: wp('2%'),
//   },
// });

// export default CardComponent;

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const staticConfig = {
  Meeting: {
    icon: 'event-available',
    iconColor: '#4CAF50',
    colors: ['#fff', '#fff'],
  },
  Sitevisit: {
    icon: 'location-on',
    iconColor: '#2196F3',
    colors: ['#fff', '#fff'],
  },
  EOI: {
    icon: 'payments',
    iconColor: '#9C27B0',
    colors: ['#fff', '#fff'],
  },
  Booking: {
    icon: 'bookmark',
    iconColor: '#FF9800',
    colors: ['#fff', '#fff'],
  },
};

const CardComponent = ({cardData = {}, activeFilterParams = {}}) => {
  const navigation = useNavigation();

  // 🧩 Handle both EOI and eoi keys from API
  const transformCardData = data => ({
    ...data,
    EOI: data.eoi || data.EOI || 0,
  });

  const transformedData = transformCardData(cardData);
  const keys = Object.keys(transformedData);

  const dataToRender = keys
    .filter(key => staticConfig[key])
    .map(key => ({
      label: key,
      count: transformedData[key],
      ...staticConfig[key],
    }));

  // 🧭 Navigate with filterParams + userid
  const navigateToScreen = label => {
    navigation.navigate('Filter Data Task', {
      status: label,
      filterParams: activeFilterParams,
    });
  };

  return (
    <View style={styles.container}>
      {dataToRender.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => {
            if (parseInt(item.count) > 0) {
              navigateToScreen(item.label);
            }
          }}>
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
    top: wp('4%'),
    right: wp('4%'),
  },
});
export default CardComponent;
