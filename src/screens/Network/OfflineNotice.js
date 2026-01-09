import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNetwork} from './NetworkProvider';
import Video from 'react-native-video';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const NoInternet = ({onRetry, navigation}) => {
  const {isConnected} = useNetwork();
  const [loading, setLoading] = useState(false);
  const [autoBackLoader, setAutoBackLoader] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isConnected) {
        onRetry?.(); // Refresh API
      }
    }, 5000); // 5 sec loader
  };

  // 🔹 Auto goBack when internet comes
  useEffect(() => {
    let timer;
    if (isConnected) {
      setAutoBackLoader(true); // Show loader
      timer = setTimeout(() => {
        setAutoBackLoader(false);
        navigation.goBack(); // Auto go back
      }, 3000); // 3 sec wait
    }
    return () => clearTimeout(timer);
  }, [isConnected]);

  return (
    <View style={styles.container}>
      {/* Offline Illustration */}
      <Video
        source={require('../../assets/offline/offline.mp4')}
        style={styles.video}
        resizeMode="contain"
        repeat
        muted
        paused={false}
      />

      <Text style={styles.title}>
        {isConnected
          ? 'Connected Successfully! 🎉'
          : '🌐 No Internet Connection 😞'}
      </Text>
      <Text style={styles.subtitle}>
        {isConnected
          ? 'You are back online. Redirecting...'
          : 'Please check your internet connection and try again.'}
      </Text>

      {/* Retry button only when offline */}
      {!isConnected && (
        <View style={styles.actionArea}>
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Auto loader jab internet aaye */}
      {isConnected && autoBackLoader && (
        <ActivityIndicator size="large" color="#2196F3" style={{marginTop: 10}} />
      )}
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
  },
  video: {
    width: wp('90%'),
    height: hp('40%'),
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  subtitle: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    color: '#666',
    marginBottom: hp('3%'),
  },
  actionArea: {
    marginVertical: hp('2%'),
  },
  retryBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('35%'),
    borderRadius: wp('10%'),
  },
  retryText: {
    fontSize: wp('4%'),
    color: '#fff',
    fontWeight: '600',
  },
});
