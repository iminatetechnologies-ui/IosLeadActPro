// import {StyleSheet} from 'react-native';
// import DeviceInfo from 'react-native-device-info';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const isTablet = DeviceInfo.isTablet(); // Used to scale styles conditionally

// export default StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   keyboardAvoidView: {
//     flex: 1,
//   },
//   imageBackground: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   gradient: {
//     flex: 1,
//   },
//   contentWrapper: {
//     flex: 1,
//   },
//   upperSection: {
//     flex: 1,
//     padding: wp('2%'),
//     marginBottom: hp('0%'),
//   },

//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: hp('2%'),
//   },
//   logo: {
//     width: isTablet ? wp('20%') : wp('44%'),
//     height: hp('14%'),
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: wp('2%'),
//   },
//   icon: {
//     marginRight: wp('4%'),
//   },
//   dashboardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: hp('1.5%'),
//   },
//   dashboardIcon: {
//     marginRight: isTablet ? wp('1%') : wp('3%'),
//   },
//   dashboardText: {
//     color: '#fff',
//     fontSize: isTablet ? wp('2.2%') : wp('5.5%'),
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: isTablet ? wp('1%') : wp('2.5%'),
//     paddingHorizontal: isTablet ? wp('1%') : wp('3%'),
//     height: isTablet ? hp('8%') : hp('5.5%'),
//     marginBottom: hp('1.5%'),
//   },
//   searchInput: {
//     flex: 1,
//     paddingHorizontal: wp('1%'),
//     fontSize: isTablet ? wp('1.8%') : wp('3.8%'),
//     color: '#000',
//   },
//   searchIcon: {
//     padding: isTablet ? wp('1%') : wp('2%'),
//   },
//   totalLeadsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: hp('1.5%'),
//   },
//   totalLeadsText: {
//     color: '#fff',
//     fontSize: isTablet ? wp('2%') : wp('4.5%'),
//     fontWeight: 'bold',
//     marginRight: wp('2%'),
//   },
//   totalLeadsValue: {
//     color: '#fff',
//     fontSize: isTablet ? wp('2%') : wp('4.5%'),
//     fontWeight: 'bold',
//     textDecorationLine: 'underline',
//   },
//   cardWrapper: {
//     flexGrow: 1,
//     justifyContent: 'flex-start',
//   },
//   openButton: {
//     // backgroundColor: '#02519F',
//     backgroundColor: '#2D87DB',
//     paddingVertical: isTablet ? hp('0%') : hp('0%'),
//     paddingHorizontal: isTablet ? wp('6%') : wp('10.5%'),
//     borderTopLeftRadius: isTablet ? wp('1%') : wp('3%'),
//     borderTopRightRadius: isTablet ? wp('1%') : wp('3%'),

//     alignSelf: 'center',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   bottomSheet: {
//     backgroundColor: 'red',
//     borderTopLeftRadius: wp('5%'),
//     borderTopRightRadius: wp('5%'),
//     paddingBottom: 0,
//     maxHeight: hp('70%'),
//   },
//   badge: {
//     position: 'absolute',
//     top: -4,
//     right: -6,
//     backgroundColor: 'red',
//     borderRadius: wp('2.5%'),
//     minWidth: wp('4.5%'),
//     height: wp('4.5%'),
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 2,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: isTablet ? wp('2%') : wp('2.5%'),
//     fontWeight: 'bold',
//   },
// });
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isTablet} from '../../utils/device';

const tablet = isTablet();

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  keyboardAvoidView: {
    flex: 1,
  },

  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  gradient: {
    flex: 1,
  },

  contentWrapper: {
    flex: 1,
  },

  upperSection: {
    flex: 1,
    padding: wp('2%'),
    marginBottom: hp('0%'),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('5%'),
  },

  logo: {
    width: wp(tablet ? '22%' : '44%'),
    height: hp(tablet ? '12%' : '14%'),
    resizeMode: 'contain',
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('2%'),
  },

  icon: {
    marginRight: wp('4%'),
  },

  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },

  dashboardIcon: {
    marginRight: wp(tablet ? '1%' : '3%'),
  },

  dashboardText: {
    color: '#fff',
    fontSize: wp(tablet ? '2.5%' : '5.5%'),
    fontWeight: 'bold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(tablet ? '1.5%' : '2.5%'),
    paddingHorizontal: wp(tablet ? '2%' : '3%'),
    height: hp(tablet ? '7%' : '5.5%'),
    marginBottom: hp('1.5%'),
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: wp('1%'),
    fontSize: wp(tablet ? '1.8%' : '3.8%'),
    color: '#000',
  },

  searchIcon: {
    padding: wp(tablet ? '1%' : '2%'),
  },

  totalLeadsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },

  totalLeadsText: {
    color: '#fff',
    fontSize: wp(tablet ? '2.5%' : '4.5%'),
    fontWeight: 'bold',
    marginRight: wp('2%'),
  },

  totalLeadsValue: {
    color: '#fff',
    fontSize: wp(tablet ? '2.5%' : '4.5%'),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  helloContainer: {
    marginLeft: 'auto', // poora right le jaane ke liye
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: wp('2%'),
    paddingHorizontal: wp('1%'),
    paddingVertical: wp('0.5%'),
  },

  helloText: {
    color: '#fff',
    fontSize: wp(tablet ? '2.5%' : '3.4%'),
    fontWeight: 'bold',
  },

  cardWrapper: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },

  openButton: {
    backgroundColor: '#2D87DB',
    paddingVertical: hp('0%'),
    paddingHorizontal: wp(tablet ? '6%' : '10%'),
    borderTopLeftRadius: wp(tablet ? '1.5%' : '3%'),
    borderTopRightRadius: wp(tablet ? '1.5%' : '3%'),
    alignSelf: 'center',
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    maxHeight: hp('70%'),
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    borderRadius: wp('2.5%'),
    minWidth: wp('4.5%'),
    height: wp('4.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },

  badgeText: {
    color: '#fff',
    fontSize: wp(tablet ? '2%' : '2.5%'),
    fontWeight: 'bold',
  },
});
