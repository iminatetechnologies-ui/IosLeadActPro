


import React from 'react';
import {View, StyleSheet} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CardComponentPlaceholder = () => {
  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={styles.card}>
          <LinearGradient colors={['#e0e0e0', '#cfcfcf']} style={styles.gradient}>
            <View>
              <ShimmerPlaceHolder
                style={styles.labelPlaceholder}
                LinearGradient={LinearGradient}
                autoRun
              />
              <View style={styles.countRow}>
                <ShimmerPlaceHolder
                  style={styles.countPlaceholder}
                  LinearGradient={LinearGradient}
                  autoRun
                />
                <ShimmerPlaceHolder
                  style={styles.iconPlaceholder}
                  LinearGradient={LinearGradient}
                  autoRun
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      ))}
    </View>
  );
};

export default CardComponentPlaceholder;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp('0%'),
    paddingBottom: hp('2%'),
  },
  card: {
    width: wp('29%'),
    height: hp('8%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
  },
  gradient: {
    flex: 1,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    justifyContent: 'space-between',
  },
  labelPlaceholder: {
    width: wp('16%'),
    height: hp('1.8%'),
    borderRadius: wp('1%'),
    marginBottom: hp('1%'),
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countPlaceholder: {
    width: wp('8%'),
    height: hp('2%'),
    borderRadius: wp('1%'),
  },
  iconPlaceholder: {
    width: wp('5.2%'),
    height: wp('5.2%'),
    borderRadius: wp('2.6%'),
  },
});
