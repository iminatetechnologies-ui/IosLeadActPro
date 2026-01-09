// import { View, Text } from 'react-native'
// import React from 'react'

// const makeCallAndLog = () => {
//   return (
//     <View>
//       <Text>makeCallAndLog</Text>
//     </View>
//   )
// }

// export default makeCallAndLog

import {Linking, Alert, AppState, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {_post} from '../api/apiClient';

let startTime = null;
let appStateListener = null;

// Helper: format date same as call log (YYYY-MM-DD HH:mm:ss)
const formatDateTime = date => {
  const pad = n => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
};

export const makeCallAndLog = async (mobile, leadId, item, navigation) => {
  if (!mobile || !leadId) {
    Alert.alert('Mobile number ya lead ID missing hai');
    console.log('❌ Missing mobile or leadId');
    return;
  }

  try {
    // ✅ status_name ke hisaab se screen decide
    const statusName = item?.status_name?.toLowerCase();
    console.log('➡️ item.status_name:', statusName);

    if (statusName === 'interested') {
      navigation.navigate('LeadInterested2', {item});
      // console.log('➡️ Navigated to LeadInterested2');
    } else if (statusName === 'fresh') {
      navigation.navigate('LeadDetailsScreen', {item});
    } else {
      navigation.navigate('ContactDetails2', {item});
      // console.log('➡️ Navigated to ContactDetails2');
    }

    // ✅ Call start time record karo
    startTime = new Date();
    console.log('⏱️ Call start time:', startTime);

    // ✅ Call open karo
    console.log(`📞 Calling: tel:${mobile}`);
    await Linking.openURL(`tel:${mobile}`);

    const deviceName = await DeviceInfo.getDeviceName();

    if (Platform.OS === 'android') {
      // ✅ App state listener lagao
      appStateListener = AppState.addEventListener(
        'change',
        async nextAppState => {
          console.log('🔄 App state changed:', nextAppState);

          if (nextAppState === 'active' && startTime) {
            console.log('✅ App foreground me wapas aaya (call likely ended)');

            const endTime = new Date();
            const duration = Math.floor((endTime - startTime) / 1000); // seconds

            const formattedStart = formatDateTime(startTime);
            const formattedEnd = formatDateTime(endTime);

            console.log('🕒 call_time:', formattedStart);
            console.log('🕒 u_time:', formattedEnd);
            console.log('⏳ duration:', duration);

            const payload = [
              {
                lead_id: leadId,
                call_time: formattedStart,
                u_time: formattedEnd,
                number: mobile,
                duration: duration,
                callType: 'Outgoing',
                device_name: deviceName,
              },
            ];

            console.log('📤 Sending payload to API:', payload);
            try {
              await _post('/calldata', {request_data: payload});
              console.log('✅ API call successful');
            } catch (err) {
              console.log('❌ Error posting call data:', err);

              if (err.response) {
                // Server ne response bheja (e.g., 422, 500)
                console.log('🔸 Response Data:', err.response.data);
                console.log('🔸 Response Status:', err.response.status);
                console.log('🔸 Response Headers:', err.response.headers);
              } else if (err.request) {
                // Request gaya, par response nahi aaya
                console.log('📡 No Response Received:', err.request);
              } else {
                // Request banana hi fail ho gaya
                console.log('⚙️ Error Message:', err.message);
              }
            }

            // ✅ Cleanup
            startTime = null;
            appStateListener?.remove();
            console.log('🧹 AppState listener removed');
          }
        },
      );
    }
  } catch (error) {
    console.error('❌ Call/log error:', error);
  }
};
