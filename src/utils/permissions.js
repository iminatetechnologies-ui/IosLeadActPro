
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

