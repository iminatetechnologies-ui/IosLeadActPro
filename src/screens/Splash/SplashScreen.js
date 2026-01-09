// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   Linking,
//   AppState,
//   Image,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import { getUserData } from './../../components/EncryptedStorageUtil';
// import { getUserType1 } from '../../utils/getUserTypelogin';
// // import {
// //   createNotificationChannel,
// //   notificationListeners,
// //   onMessageListener,
// // } from '../../utils/NotificationService';
// // import {setupBackgroundLocationSender} from '../../utils/backgroundLocationSender';

// const SplashScreen = ({ navigation }) => {
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const appState = useRef(AppState.currentState);
//   const navigatedRef = useRef(false);

//   useEffect(() => {
//     const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//     const startFlow = async () => {
//       await delay(2000);
//       const grantedFlag = await EncryptedStorage.getItem('permissionsGranted');
//       if (grantedFlag === 'true') {
//         initApp();
//       } else {
//         setShowPermissionModal(true);
//       }
//     };

//     startFlow();

//     // Listen to app focus for permission changes
//     const subscription = AppState.addEventListener(
//       'change',
//       async nextState => {
//         if (
//           appState.current.match(/inactive|background/) &&
//           nextState === 'active'
//         ) {
//           // When returning to app from settings, continue with app flow
//           setShowPermissionModal(false);
//           initApp();
//         }
//         appState.current = nextState;
//       },
//     );

//     return () => subscription.remove();
//   }, []);

//   const initApp = async () => {
//     if (navigatedRef.current) return; // Navigation lock

//     try {
//       await EncryptedStorage.setItem('permissionsGranted', 'true');
//       // await setupBackgroundLocationSender(); // Commented out
//       setShowPermissionModal(false);

//       const token = await getUserData('userToken');

//       if (token) {
//         const { userType, plan, requested_plan } = await getUserType1();

//         // Navigation lock (run only once)
//         if (navigatedRef.current) return;
//         navigatedRef.current = true;

//         if (userType === 'company' && Number(plan) === 0) {
//           if (Number(requested_plan) !== 0) {
//             navigation.replace('Home2');
//           } else {
//             navigation.replace('Plans');
//           }
//         } else {
//           navigation.replace('Home2');
//         }
//       } else {
//         if (navigatedRef.current) return;
//         navigatedRef.current = true;
//         navigation.replace('Login');
//       }
//     } catch (error) {
//       console.error('Init error:', error);
//       Alert.alert('Error', 'Initialization failed');
//     }
//   };

//   const handleContinue = () => {
//     setShowPermissionModal(false);
//     initApp();
//   };

//   const handleOpenSettings = () => {
//     Linking.openURL('app-settings:');
//   };

//   // iOS Permission Explanation Modal
//   const IOSPermissionExplanation = () => (
//     <View style={styles.overlay}>
//       <View style={styles.innerModal}>
//         <MaterialIcons name="info" size={60} color="#007BFF" style={{ marginBottom: 10 }} />
//         <Text style={styles.modalTitle}>App Permissions</Text>
//         <Text style={styles.modalText}>
//           This app may request the following permissions when needed:
//         </Text>

//         <View style={styles.permissionItem}>
//           <MaterialIcons name="location-on" size={24} color="#007BFF" />
//           <Text style={styles.permissionText}>Location - For location-based features</Text>
//         </View>

//         <View style={styles.permissionItem}>
//           <MaterialIcons name="mic" size={24} color="#007BFF" />
//           <Text style={styles.permissionText}>Microphone - For audio recording</Text>
//         </View>

//         <Text style={styles.noteText}>
//           iOS will prompt for permissions when you first use these features.
//         </Text>

//         <TouchableOpacity
//           style={styles.enableButton}
//           onPress={handleContinue}>
//           <Text style={styles.enableText}>Continue</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.settingsButton}
//           onPress={handleOpenSettings}>
//           <Text style={styles.settingsText}>Open Settings</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Image
//         style={styles.logo}
//         source={require('./../../assets/images/Splash.gif')}
//       />

//       {/* iOS Permission Explanation Modal */}
//       {showPermissionModal && <IOSPermissionExplanation />}
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//   logo: {
//     width: '100%',
//     margin: 'auto'
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerModal: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#222',
//     marginBottom: 8,
//   },
//   modalText: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 8,
//     width: '100%',
//   },
//   permissionText: {
//     fontSize: 14,
//     color: '#333',
//     marginLeft: 10,
//     flex: 1,
//   },
//   noteText: {
//     fontSize: 12,
//     color: '#777',
//     textAlign: 'center',
//     marginTop: 15,
//     marginBottom: 20,
//     fontStyle: 'italic',
//   },
//   enableButton: {
//     backgroundColor: '#007BFF',
//     paddingHorizontal: 30,
//     paddingVertical: 10,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   enableText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   settingsButton: {
//     backgroundColor: 'transparent',
//     paddingHorizontal: 30,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   settingsText: {
//     color: '#007BFF',
//     fontWeight: '600',
//     fontSize: 14,
//   },
// });

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
  AppState,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import { getUserData } from './../../components/EncryptedStorageUtil';
import { getUserType1 } from '../../utils/getUserTypelogin';
// import {
//   createNotificationChannel,
//   notificationListeners,
//   onMessageListener,
// } from '../../utils/NotificationService';
// import {setupBackgroundLocationSender} from '../../utils/backgroundLocationSender';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const appState = useRef(AppState.currentState);
  const navigatedRef = useRef(false);

  useEffect(() => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const startFlow = async () => {
      await delay(2000);
      const grantedFlag = await EncryptedStorage.getItem('permissionsGranted');
      if (grantedFlag === 'true') {
        initApp();
      } else {
        setShowPermissionModal(true);
      }
    };

    startFlow();

    // Listen to app focus for permission changes
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
        ) {
          // When returning to app from settings, continue with app flow
          setShowPermissionModal(false);
          initApp();
        }
        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, []);

  const initApp = async () => {
    if (navigatedRef.current) return; // Navigation lock

    try {
      await EncryptedStorage.setItem('permissionsGranted', 'true');
      // await setupBackgroundLocationSender(); // Commented out
      setShowPermissionModal(false);

      const token = await getUserData('userToken');

      if (token) {
        const { userType, plan, requested_plan } = await getUserType1();

        // Navigation lock (run only once)
        if (navigatedRef.current) return;
        navigatedRef.current = true;

        if (userType === 'company' && Number(plan) === 0) {
          if (Number(requested_plan) !== 0) {
            navigation.replace('Home');
          } else {
            navigation.replace('Plans');
          }
        } else {
          navigation.replace('Home');
        }
      } else {
        if (navigatedRef.current) return;
        navigatedRef.current = true;
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Init error:', error);
      Alert.alert('Error', 'Initialization failed');
    }
  };

  const handleContinue = () => {
    setShowPermissionModal(false);
    initApp();
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // iOS Permission Explanation Modal
  const IOSPermissionExplanation = () => (
    <View style={styles.overlay}>
      <View style={styles.innerModal}>
        <MaterialIcons name="info" size={60} color="#007BFF" style={{ marginBottom: 10 }} />
        <Text style={styles.modalTitle}>App Permissions</Text>
        <Text style={styles.modalText}>
          This app may request the following permissions when needed:
        </Text>

        <View style={styles.permissionItem}>
          <MaterialIcons name="location-on" size={24} color="#007BFF" />
          <Text style={styles.permissionText}>Location - For location-based features</Text>
        </View>

        <View style={styles.permissionItem}>
          <MaterialIcons name="mic" size={24} color="#007BFF" />
          <Text style={styles.permissionText}>Microphone - For audio recording</Text>
        </View>

        <Text style={styles.noteText}>
          iOS will prompt for permissions when you first use these features.
        </Text>

        <TouchableOpacity
          style={styles.enableButton}
          onPress={handleContinue}>
          <Text style={styles.enableText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleOpenSettings}>
          <Text style={styles.settingsText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('./../../assets/images/Splash.gif')}
        resizeMode="cover"
      />

      {/* iOS Permission Explanation Modal */}
      {showPermissionModal && <IOSPermissionExplanation />}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff', // Add background color
  },
  logo: {
    width: width, // Full screen width
    height: height, // Full screen height
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerModal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  permissionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  noteText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  enableButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  enableText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  settingsButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  settingsText: {
    color: '#007BFF',
    fontWeight: '600',
    fontSize: 14,
  },
});