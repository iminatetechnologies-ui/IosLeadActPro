import React from 'react';
import {View, StyleSheet} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BirthdayPlaceholder = () => {
  return (
    <View style={styles.container}>
      {/* Birthday Section */}
      <ShimmerPlaceHolder
        style={styles.sectionTitle}
        LinearGradient={LinearGradient}
      />

      <View style={styles.horizontalScroll}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.birthdayCard}>
            <ShimmerPlaceHolder
              style={styles.profileImage}
              LinearGradient={LinearGradient}
            />
            <ShimmerPlaceHolder
              style={styles.namePlaceholder}
              LinearGradient={LinearGradient}
            />
            <ShimmerPlaceHolder
              style={styles.datePlaceholder}
              LinearGradient={LinearGradient}
            />
          </View>
        ))}
      </View>

      {/* Project Section */}
      <ShimmerPlaceHolder
        style={[styles.sectionTitle, {marginTop: hp('2%')}]}
        LinearGradient={LinearGradient}
      />

      <View style={styles.horizontalScroll}>
        {[...Array(2)].map((_, index) => (
          <View key={index} style={styles.projectCard}>
            <ShimmerPlaceHolder
              style={styles.projectImage}
              LinearGradient={LinearGradient}
            />
            <ShimmerPlaceHolder
              style={styles.projectName}
              LinearGradient={LinearGradient}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default BirthdayPlaceholder;

const styles = StyleSheet.create({
  container: {
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    width: wp('50%'),
    height: hp('2.5%'),
    borderRadius: wp('1%'),
    marginLeft: wp('2%'),
    marginBottom: hp('1.5%'),
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingHorizontal: wp('2%'),
  },
  birthdayCard: {
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  profileImage: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
  },
  namePlaceholder: {
    width: wp('10%'),
    height: hp('1.6%'),
    borderRadius: wp('1%'),
    marginTop: hp('0.5%'),
  },
  datePlaceholder: {
    width: wp('8%'),
    height: hp('1.4%'),
    borderRadius: wp('1%'),
    marginTop: hp('0.3%'),
  },
  projectCard: {
    width: wp('40%'),
    height: hp('24%'),
    backgroundColor: '#f0f0f0',
    borderRadius: wp('2%'),
    marginRight: wp('2.5%'),
    padding: wp('2%'),
    alignItems: 'center',
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: hp('14%'),
    borderRadius: wp('2%'),
  },
  projectName: {
    width: wp('30%'),
    height: hp('2%'),
    borderRadius: wp('1%'),
    marginTop: hp('1%'),
  },
});
