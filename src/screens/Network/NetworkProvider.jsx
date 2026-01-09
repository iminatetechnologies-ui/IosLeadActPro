import React, { useEffect, useState, createContext, useContext } from "react";
import NetInfo from "@react-native-community/netinfo";
import { ToastAndroid } from "react-native";

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [wasDisconnected, setWasDisconnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setIsConnected(true);

        if (wasDisconnected) {
          ToastAndroid.show("✅ Reconnected Successfully!", ToastAndroid.SHORT);
          setWasDisconnected(false);
        }
      } else {
        setIsConnected(false);
        setWasDisconnected(true);
      }
    });

    return () => unsubscribe();
  }, [wasDisconnected]);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
