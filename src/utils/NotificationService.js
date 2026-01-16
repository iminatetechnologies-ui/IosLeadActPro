// import {getApp} from '@react-native-firebase/app';
// import {
//   getMessaging,
//   getToken,
//   onMessage,
//   requestPermission,
//   AuthorizationStatus,
//   onNotificationOpenedApp,
//   getInitialNotification,
// } from '@react-native-firebase/messaging';

// import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
// import NavigationService from '../navigation/NavigationService';
// import {storeUserData} from '../components/EncryptedStorageUtil';

// // ------------------
// // 1. Ask for notification permission
// // ------------------
// export async function requestUserPermission() {
//   try {
//     const app = getApp();
//     const messagingInstance = getMessaging(app);

//     const authStatus = await requestPermission(messagingInstance);
//     const enabled =
//       authStatus === AuthorizationStatus.AUTHORIZED ||
//       authStatus === AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       await getFcmToken();
//     }
//   } catch (error) {
//     console.error('❌ Error requesting user permission:', error);
//   }
// }

// // ------------------
// // 2. Get FCM token and store
// // ------------------
// const getFcmToken = async () => {
//   try {
//     const app = getApp();
//     const messagingInstance = getMessaging(app);

//     const fcmToken = await getToken(messagingInstance);
//     if (fcmToken) {
//       storeUserData('fcmToken', fcmToken);
//     }
//   } catch (error) {
//     console.log('❌ Error getting FCM token:', error);
//   }
// };

// // ------------------
// // 3. Create notification channel for Android
// // ------------------
// export const createNotificationChannel = async () => {
//   await notifee.createChannel({
//     id: 'default_v2',
//     name: 'Default Channel',
//     sound: 'notification_tone',
//     importance: AndroidImportance.HIGH,
//   });
// };

// // ------------------
// // 4. Show custom notification (for foreground)
// // ------------------
// export const displayNotification = async (title, body, data) => {
//   await notifee.displayNotification({
//     title,
//     body,
//     data,
//     android: {
//       channelId: 'default_v2',
//       pressAction: {id: 'default'},
//     },
//   });
// };

// // ------------------
// // 5. Foreground message + press handling
// // ------------------
// export const onMessageListener = () => {
//   const app = getApp();
//   const messagingInstance = getMessaging(app);

//   onMessage(messagingInstance, async remoteMessage => {
//     console.log('📲 Foreground FCM:', remoteMessage);

//     await displayNotification(
//       remoteMessage.notification?.title || 'New Notification',
//       remoteMessage.notification?.body || '',
//       remoteMessage.data,
//     );
//   });

//   // Handle notification press in foreground
//   notifee.onForegroundEvent(({type, detail}) => {
//     if (type === EventType.PRESS) {
//       const {screen, id} = detail.notification?.data || {};
//       const item = {id};
//       NavigationService.navigate(screen || 'LeadDetailsScreen', {item});
//     }
//   });
// };

// // ------------------
// // 6. Background / killed notification handling
// // ------------------
// export const notificationListeners = async () => {
//   const app = getApp();
//   const messagingInstance = getMessaging(app);

//   // Background: User taps notification
//   onNotificationOpenedApp(messagingInstance, remoteMessage => {
//     const {screen, id} = remoteMessage?.data || {};
//     const item = {id};
//     NavigationService.navigate(screen || 'LeadDetailsScreen', {item});
//   });

//   // Killed: App opened by notification tap
//   const initialMessage = await getInitialNotification(messagingInstance);
//   if (initialMessage) {
//     const {screen, id} = initialMessage.data || {};
//     const item = {id};
//     setTimeout(() => {
//       NavigationService.navigate(screen || 'LeadDetailsScreen', {item});
//     }, 1000);
//   }

//   // Background message logging (optional)
//   return onMessage(messagingInstance, async remoteMessage => {
//     console.log('📥 Background FCM:', remoteMessage);
//   });
// };


import {Platform} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  requestPermission,
  AuthorizationStatus,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

import notifee, {EventType} from '@notifee/react-native';
import NavigationService from '../navigation/NavigationService';
import {storeUserData} from '../components/EncryptedStorageUtil';
import DeviceInfo from 'react-native-device-info';

/* ----------------------------------
  Utils
----------------------------------- */
const isSimulator = Platform.OS === 'ios' && DeviceInfo.isEmulatorSync();

/* ----------------------------------
  1. Request Notification Permission (iOS)
----------------------------------- */
export async function requestUserPermission() {
  try {
    const app = getApp();
    const messaging = getMessaging(app);

    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ iOS notification permission granted');

      if (isSimulator) {
        console.log(
          '⚠️ iOS Simulator detected – skipping FCM token fetch (APNs not available)',
        );
      } else {
        await getFcmToken();
      }
    } else {
      console.log('❌ iOS notification permission denied');
    }
  } catch (error) {
    console.error('❌ Permission error:', error);
  }
}

/* ----------------------------------
  2. Get & store FCM Token
----------------------------------- */
const getFcmToken = async () => {
  try {
    if (isSimulator) {
      console.log('⚠️ Skipped FCM token on iOS Simulator');
      return;
    }

    const app = getApp();
    const messaging = getMessaging(app);

    const fcmToken = await getToken(messaging);

    if (fcmToken) {
      console.log('📱 iOS FCM Token:', fcmToken);
      storeUserData('fcmToken', fcmToken);
    } else {
      console.log('⚠️ FCM token is empty');
    }
  } catch (error) {
    console.log('❌ FCM token error:', error.message);
  }
};

/* ----------------------------------
  3. Display notification (Foreground – iOS)
----------------------------------- */
export const displayNotification = async (title, body, data = {}) => {
  await notifee.displayNotification({
    title,
    body,
    data,
    ios: {
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    },
  });
};

/* ----------------------------------
  4. Foreground FCM listener
----------------------------------- */
export const onMessageListener = () => {
  const app = getApp();
  const messaging = getMessaging(app);

  // Foreground message
  onMessage(messaging, async remoteMessage => {
    console.log('📲 Foreground iOS FCM:', remoteMessage);

    await displayNotification(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || '',
      remoteMessage.data,
    );
  });

  // Foreground notification press
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS) {
      const {screen, id} = detail.notification?.data || {};
      NavigationService.navigate(
        screen || 'LeadDetailsScreen',
        {item: {id}},
      );
    }
  });
};

/* ----------------------------------
  5. Background & Quit State Handling (iOS)
----------------------------------- */
export const notificationListeners = async () => {
  const app = getApp();
  const messaging = getMessaging(app);

  // App opened from background
  onNotificationOpenedApp(messaging, remoteMessage => {
    console.log('📥 Opened from background:', remoteMessage);
    const {screen, id} = remoteMessage?.data || {};
    NavigationService.navigate(
      screen || 'LeadDetailsScreen',
      {item: {id}},
    );
  });

  // App opened from killed state
  const initialMessage = await getInitialNotification(messaging);
  if (initialMessage) {
    console.log('📥 Opened from killed state:', initialMessage);
    const {screen, id} = initialMessage.data || {};
    setTimeout(() => {
      NavigationService.navigate(
        screen || 'LeadDetailsScreen',
        {item: {id}},
      );
    }, 800);
  }
};
