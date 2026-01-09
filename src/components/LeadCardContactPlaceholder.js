import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const LeadCardContactPlaceholder = () => {
  return (
    <View style={styles.card}>
      {/* Badge Placeholder */}
      <View style={styles.statusBadge} />

      {/* Text Section */}
      <View style={styles.textContainer}>
        <ShimmerPlaceHolder
          style={styles.title}
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          style={styles.line}
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          style={styles.line}
          LinearGradient={LinearGradient}
        />
         <ShimmerPlaceHolder
          style={styles.line}
          LinearGradient={LinearGradient}
        />
      </View>

      {/* Icon Actions */}
      <View style={styles.iconContainer}>
        {[1, 2, 3].map(index => (
          <ShimmerPlaceHolder
            key={index}
            style={styles.icon}
            LinearGradient={LinearGradient}
          />
        ))}
      </View>
    </View>
  );
};

export default LeadCardContactPlaceholder;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: rw(2),
    padding: rw(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: rh(0.5),
    elevation: 3,
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: rh(0),
    right: rw(0),
    width: rw(20),
    height: rh(2.8),
    backgroundColor: '#eee',
    borderTopRightRadius: rw(2),
    borderBottomLeftRadius: rw(2),
  },
  textContainer: {
    flex: 1,
    marginRight: rw(2),
  },
  title: {
    width: rw(40),
    height: rh(2.2),
    borderRadius: 4,
    marginBottom: rh(0.8),
  },
  line: {
    width: rw(30),
    height: rh(1.8),
    borderRadius: 4,
    marginBottom: rh(0.5),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(2),
  },
  icon: {
    width: rw(6),
    height: rw(6),
    borderRadius: rw(3),
    marginHorizontal: rw(1),
  },
});
