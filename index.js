/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

/**
 * 🔔 iOS Background / Quit State FCM Handler
 * This runs when:
 * - App is in background
 * - App is killed (silent / data message)
 */
// if (Platform.OS === 'ios') {
//   messaging().setBackgroundMessageHandler(
//     async remoteMessage => {
//       console.log('📥 iOS Background FCM:', remoteMessage);
//       // ❗ Do NOT navigate here
//       // ❗ Do NOT show UI here
//       // Only lightweight logic (logging, API call if needed)
//     },
//   );
// }

AppRegistry.registerComponent(appName, () => App);
