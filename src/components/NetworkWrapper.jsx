import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkWrapper = ({ children, onRetry }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const checkNow = async () => {
      const net = await NetInfo.fetch();
      setIsConnected(net.isConnected);
      setIsChecking(false);
    };

    checkNow();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleRetry = async () => {
    setRetrying(true);

    const net = await NetInfo.fetch();
    if (net.isConnected) {
      setIsConnected(true);
      setRetrying(false);
      onRetry?.(); // ✅ Call only if connected
    } else {
      console.warn('⚠️ Still no internet, skipping API retry.');
      setIsConnected(false);
      setRetrying(false);
    }
  };

  if (isChecking || retrying) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text>{retrying ? 'Rechecking connection...' : 'Checking connection...'}</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>📡 No Internet Connection</Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
});

export default NetworkWrapper;
