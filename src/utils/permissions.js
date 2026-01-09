// import {PermissionsAndroid, Alert, Platform,Linking} from 'react-native';

// // ✅ Modular Firebase imports
// import {getApp} from '@react-native-firebase/app';
// import {
//   getMessaging,
//   requestPermission,
//   AuthorizationStatus,
// } from '@react-native-firebase/messaging';

// // 2. Location Permission
// export const requestLocationPermission = async () => {
//   if (Platform.OS !== 'android') return true;
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     {
//       title: 'Location Permission',
//       message: 'App needs access to your location',
//       buttonNeutral: 'Ask Me Later',
//       buttonNegative: 'Cancel',
//       buttonPositive: 'OK',
//     },
//   );
//   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//     // Alert.alert('Permission Denied', 'Location access was denied');
//     return false;
//   }
//   return true;
// };

// // 3. Notification Permission (with Firebase Modular API)
// export const requestNotificationPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         Alert.alert(
//           'Permission Denied',
//           'Notification permission was not granted',
//         );
//         return false;
//       }
//     } catch (err) {
//       console.error('Error requesting POST_NOTIFICATIONS:', err);
//       return false;
//     }
//   }

//   try {
//     const app = getApp(); // ✅ get firebase app
//     const messagingInstance = getMessaging(app); // ✅ get messaging instance
//     const authStatus = await requestPermission(messagingInstance); // ✅ modular method
//     const enabled =
//       authStatus === AuthorizationStatus.AUTHORIZED ||
//       authStatus === AuthorizationStatus.PROVISIONAL;
//     if (!enabled) {
//       Alert.alert('Permission Denied', 'Firebase permission not granted');
//       return false;
//     }
//     return true;
//   } catch (err) {
//     console.error('Error requesting Firebase permission:', err);
//     return false;
//   }
// };

// export const requestMicrophonePermission = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       const result = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//       );

//       // ❌ User selected "Don't Allow"
//       if (result === PermissionsAndroid.RESULTS.DENIED) {
//         Alert.alert(
//           'Microphone Permission Needed',
//           'Please allow microphone permission to start recording.',
//         );
//         return false;
//       }

//       // ❌ User selected "Don't Allow" + "Don't Ask Again"
//       if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
//         Alert.alert(
//           'Permission Blocked',
//           'You have blocked microphone permission. Allow it from Settings.',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {text: 'Open Settings', onPress: () => Linking.openSettings()},
//           ],
//         );
//         return false;
//       }

//       // ✔ Allowed
//       return true;
//     }

//     // For iOS (optional)
//     return true;
//   } catch (error) {
//     return false;
//   }
// };
import {Alert, Platform, Linking} from 'react-native';

// iOS Permission Functions
export const requestLocationPermission = async () => {
  if (Platform.OS !== 'ios') return true;
  
  // For iOS, location permissions are handled through Info.plist
  // NSLocationWhenInUseUsageDescription and NSLocationAlwaysAndWhenInUseUsageDescription
  // iOS will show system prompt automatically when location is requested
  console.log('iOS location permission handled via Info.plist');
  return true;
};

export const requestNotificationPermission = async () => {
  if (Platform.OS !== 'ios') return true;
  
  // TODO: Implement iOS notification permissions when needed
  // iOS uses UserNotifications framework
  console.log('iOS notification permission - implement UserNotifications framework');
  return true;
};

export const requestMicrophonePermission = async () => {
  if (Platform.OS !== 'ios') return true;
  
  try {
    // iOS handles microphone permissions automatically when first accessing audio
    // Make sure NSMicrophoneUsageDescription is in Info.plist
    console.log('iOS microphone permission handled via Info.plist');
    return true;
  } catch (error) {
    console.error('Error with iOS microphone permission:', error);
    return false;
  }
};

export const requestCameraPermission = async () => {
  if (Platform.OS !== 'ios') return true;
  
  // iOS camera permission is handled through Info.plist (NSCameraUsageDescription)
  // iOS will show system prompt automatically when camera is accessed
  console.log('iOS camera permission handled via Info.plist');
  return true;
};

export const requestPhotoLibraryPermission = async () => {
  if (Platform.OS !== 'ios') return true;
  
  // iOS photo library permission is handled through Info.plist
  // (NSPhotoLibraryUsageDescription and NSPhotoLibraryAddUsageDescription)
  console.log('iOS photo library permission handled via Info.plist');
  return true;
};

// Optional: If you want to use react-native-permissions for more control
export const requestMicrophonePermissionWithLibrary = async () => {
  if (Platform.OS !== 'ios') return true;
  
  try {
    // First install: npm install react-native-permissions
    // Then uncomment below:
    /*
    import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
    
    const result = await check(PERMISSIONS.IOS.MICROPHONE);
    if (result === RESULTS.DENIED) {
      const permissionResult = await request(PERMISSIONS.IOS.MICROPHONE);
      return permissionResult === RESULTS.GRANTED;
    }
    return result === RESULTS.GRANTED;
    */
    
    console.log('Using Info.plist for iOS microphone permission');
    return true;
  } catch (error) {
    console.error('Error checking iOS microphone permission:', error);
    return false;
  }
};

// Check all iOS permissions
export const checkAllIOSPermissions = async () => {
  if (Platform.OS !== 'ios') return {};
  
  const permissions = {
    location: await requestLocationPermission(),
    microphone: await requestMicrophonePermission(),
    camera: await requestCameraPermission(),
    photoLibrary: await requestPhotoLibraryPermission(),
    notifications: await requestNotificationPermission(),
  };
  
  console.log('iOS Permission status:', permissions);
  return permissions;
};