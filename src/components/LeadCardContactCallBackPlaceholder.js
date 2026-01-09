import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const LeadCardContactCallBackPlaceholder = () => {
  return (
    <View style={styles.card}>
      {/* Status Badge */}
      <View style={styles.statusBadge}>
        <ShimmerPlaceHolder
          style={styles.statusShimmer}
          shimmerStyle={styles.statusShimmer}
          shimmerColors={['#f6f7f8', '#edeef1', '#f6f7f8']}
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <ShimmerPlaceHolder style={styles.titleShimmer} />
        <ShimmerPlaceHolder style={styles.subTextShimmer} />
        <ShimmerPlaceHolder style={styles.subTextShimmer} />
        <ShimmerPlaceHolder style={styles.subTextShimmer} />
      </View>

      {/* Icon Section */}
      <View style={styles.iconContainer}>
        <ShimmerPlaceHolder style={styles.iconShimmer} />
        <View style={styles.divider} />
        <ShimmerPlaceHolder style={styles.iconShimmer} />
        <View style={styles.divider} />
        <ShimmerPlaceHolder style={styles.iconShimmer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: rw(2),
    padding: rw(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: rh(0.5),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: rh(0.3) },
    shadowOpacity: 0.2,
    shadowRadius: rw(2),
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    marginRight: rw(2),
  },
  titleShimmer: {
    height: rh(2.5),
    width: '80%',
    borderRadius: rw(1),
    marginBottom: rh(0.8),
  },
  subTextShimmer: {
    height: rh(2),
    width: '60%',
    borderRadius: rw(1),
    marginBottom: rh(0.5),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconShimmer: {
    height: rh(4),
    width: rh(4),
    borderRadius: rh(2),
  },
  divider: {
    width: 1,
    height: rh(3),
    backgroundColor: '#ccc',
    marginHorizontal: rw(2),
  },
  statusBadge: {
    position: 'absolute',
    top: rh(0),
    right: rw(0),
   // backgroundColor: '#FFBF00',
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.5),
    zIndex: 1,
    flexDirection: 'row',
    borderTopRightRadius: rw(2),
    borderBottomLeftRadius: rw(2),
  },
  statusShimmer: {
    height: rh(2),
    width: rw(20),
    borderRadius: rw(1),
  },
});

export default LeadCardContactCallBackPlaceholder;
