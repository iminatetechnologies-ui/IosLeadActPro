import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: hp('0%'),
    marginBottom: hp('2%'),
  },
  scrollContent: {
    padding: wp('5%'),
    paddingBottom: hp('3%'),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    paddingTop: hp('3%'),
    paddingHorizontal: wp('6%'),
    paddingBottom: wp('6%'),
    marginBottom: hp('3%'),
    alignItems: 'center',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: hp('3%'),
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#0389ca',
    borderWidth: 1,
  },
  badge: {
    backgroundColor: '#0389ca',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('1%'),
    position: 'absolute',
    top: -hp('2%'),
    alignSelf: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  price: {
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#000',
    marginTop: hp('1%'),
  },
  lifetime: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('2%'),
  },
  trialText: {
    fontSize: wp('4%'),
    color: '#333',
    marginBottom: hp('3%'),
  },
  featuresContainer: {
    width: '100%',
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  checkIcon: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: '#0389ca',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  checkText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: wp('3.5%'),
    color: '#333',
  },
  editButton: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('1%'),
    backgroundColor: '#0389ca',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  editIcon: {
    color: '#fff',
    fontSize: wp('4%'),
  },
  radioButtonWrapper: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },

  radioOuterSelected: {
    borderColor: '#0389ca',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0389ca',
  },
  submitButton: {
    backgroundColor: '#0389ca',
    paddingVertical: 12,
    paddingHorizontal:20,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
