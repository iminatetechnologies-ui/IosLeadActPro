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



// // import { getApp } from '@react-native-firebase/app';
// // import {
// //   getMessaging,
// //   getToken,
// //   onMessage,
// //   requestPermission,
// //   AuthorizationStatus,
// //   onNotificationOpenedApp,
// //   getInitialNotification,
// // } from '@react-native-firebase/messaging';

// // import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// // import NavigationService from '../navigation/NavigationService';
// // import { storeUserData } from '../components/EncryptedStorageUtil';

// // // ------------------
// // // 1. Notification permission
// // // ------------------
// // export async function requestUserPermission() {
// //   try {
// //     const app = getApp();
// //     const messagingInstance = getMessaging(app);

// //     const authStatus = await requestPermission(messagingInstance);
// //     const enabled =
// //       authStatus === AuthorizationStatus.AUTHORIZED ||
// //       authStatus === AuthorizationStatus.PROVISIONAL;

// //     if (enabled) {
// //       await getFcmToken();
// //     }
// //   } catch (error) {
// //     console.error('❌ Error requesting user permission:', error);
// //   }
// // }

// // // ------------------
// // // 2. FCM token
// // // ------------------
// // const getFcmToken = async () => {
// //   try {
// //     const app = getApp();
// //     const messagingInstance = getMessaging(app);

// //     const fcmToken = await getToken(messagingInstance);
// //     if (fcmToken) {
// //       storeUserData('fcmToken', fcmToken);
// //       console.log('✅ FCM Token:', fcmToken);
// //     }
// //   } catch (error) {
// //     console.log('❌ Error getting FCM token:', error);
// //   }
// // };

// // // ------------------
// // // 3. Notification channel
// // // ------------------
// // export const createNotificationChannel = async () => {
// //   await notifee.createChannel({
// //     id: 'default_v2',
// //     name: 'Default Channel',
// //     sound: 'notification_tone',
// //     importance: AndroidImportance.HIGH,
// //   });
// // };

// // // ------------------
// // // 4. Display notification
// // // ------------------
// // export const displayNotification = async (title, body, data) => {
// //   await notifee.displayNotification({
// //     title,
// //     body,
// //     data,
// //     android: {
// //       channelId: 'default_v2',
// //       pressAction: { id: 'default' },
// //     },
// //   });
// // };

// // // ------------------
// // // 5. Foreground listener
// // // ------------------
// // export const onMessageListener = () => {
// //   const app = getApp();
// //   const messagingInstance = getMessaging(app);

// //   onMessage(messagingInstance, async remoteMessage => {
// //     console.log('📲 Foreground FCM:----------------', remoteMessage);

// //     // ✅ Only show notification if it is data-only message
// //     if (remoteMessage.data && !remoteMessage.notification) {
// //       await displayNotification(
// //         remoteMessage.data?.title || 'New Notification',
// //         remoteMessage.data?.body || '',
// //         remoteMessage.data
// //       );
// //     }
// //   });

// //   // Notification press in foreground
// //   notifee.onForegroundEvent(({ type, detail }) => {
// //     if (type === EventType.PRESS) {
// //       const { screen, id } = detail.notification?.data || {};
// //       if (screen) {
// //         const item = { id };
// //         console.log('📦 Foreground notification pressed:', item);
// //         NavigationService.navigate(screen, { item });
// //       } else {
// //         console.warn('Notification me screen ka naam missing hai!');
// //       }
// //     }
// //   });
// // };

// // // ------------------
// // // 6. Background & killed listener
// // // ------------------
// // export const notificationListeners = async () => {
// //   const app = getApp();
// //   const messagingInstance = getMessaging(app);

// //   // Background tap
// //   onNotificationOpenedApp(messagingInstance, remoteMessage => {
// //     const { screen, id } = remoteMessage?.data || {};
// //     if (screen) {
// //       const item = { id };
// //       console.log('📦 Background notification pressed:', item);
// //       NavigationService.navigate(screen, { item });
// //     } else {
// //       console.warn('Notification me screen ka naam missing hai!');
// //     }
// //   });

// //   // Killed app
// //   const initialMessage = await getInitialNotification(messagingInstance);
// //   if (initialMessage) {
// //     const { screen, id } = initialMessage.data || {};
// //     if (screen) {
// //       const item = { id };
// //       console.log('📦 Killed app notification opened:', item);
// //       setTimeout(() => {
// //         NavigationService.navigate(screen, { item });
// //       }, 1000); // wait for app mount
// //     } else {
// //       console.warn('Notification me screen ka naam missing hai!');
// //     }
// //   }
// // };
