// // src/utils/backgroundLocationSender.js
// import BackgroundFetch from 'react-native-background-fetch';
// import Geolocation from 'react-native-geolocation-service';
// import DeviceInfo from 'react-native-device-info';
// import {PermissionsAndroid, Platform} from 'react-native';
// import {_post} from '../api/apiClient';

// const getCurrentLocation = async () => {
//   try {
//     // 📌 Permission request (sirf Android ke liye)
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('❌ Location permission denied');
//         return null;
//       }
//     }

//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         async position => {
//           const lat = position.coords.latitude;
//           const lon = position.coords.longitude;
//           const deviceName = await DeviceInfo.getDeviceName();

//           // ✅ Timestamp format (yyyy-mm-dd hh:mm:ss)
//           const now = new Date();
//           const timestamp = `${now.getFullYear()}-${String(
//             now.getMonth() + 1,
//           ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
//             now.getHours(),
//           ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
//             now.getSeconds(),
//           ).padStart(2, '0')}`;

//           const data = {
//             latitude: lat,
//             longitude: lon,
//             device_name: deviceName,
//             u_time: timestamp,
//           };

//           console.log('📤 [Background] Posting Location Data:', data);

//           try {
//             const response = await _post('/user-location', data);
//             if (response.status === 200) {
//               console.log(`✅ [${timestamp}] Location posted successfully`);
//             } else {
//               console.log(`❌ [${timestamp}] Location post failed`);
//             }
//           } catch (err) {
//             console.error(`🔥 [${timestamp}] Location post error:`, err.message);
//           }

//           resolve(data);
//         },
//         error => {
//           console.error('❌ Geolocation error:', error.message);
//           reject(error);
//         },
//         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//       );
//     });
//   } catch (error) {
//     console.error('❌ Location fetch error:', error);
//     return null;
//   }
// };

// // ✅ Background setup
// export const setupBackgroundLocationSender = async () => {
//   BackgroundFetch.configure(
//     {
//       minimumFetchInterval: 15, // ⏰ 15 minutes
//       stopOnTerminate: false,
//       startOnBoot: true,
//       enableHeadless: true,
//       requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
//     },
//     async taskId => {
//       console.log(`[🛰 BackgroundFetch-Location] Task started: ${taskId}`);
//       await getCurrentLocation();
//       BackgroundFetch.finish(taskId);
//     },
//     error => {
//       console.error('[❌ BackgroundFetch-Location Init Error]:', error);
//     },
//   );
// };

// // ✅ For headless mode
// export const sendLocationToServer = async () => {
//   await getCurrentLocation();
// };
