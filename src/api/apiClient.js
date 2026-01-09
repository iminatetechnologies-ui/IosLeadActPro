import axios from 'axios';
import {API_BASE_URL} from './../utils/constant';
import {getUserData, clearStorage} from './../components/EncryptedStorageUtil';
import NavigationService from './../navigation/NavigationService';
import {Alert, ToastAndroid} from 'react-native';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // ⏳ 15 sec max wait
});

// 🔹 Prevent repeated logout alerts
let isHandlingLogout = false;

// ✅ Attach token to every request + save start time
apiClient.interceptors.request.use(
  async config => {
    try {
      const token = await getUserData('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log('❌ Error fetching token:', err);
    }

    // Request start time
    config.metadata = {startTime: new Date()};

    // Slow network toast after 8s if still pending
    config.slowNetworkTimer = setTimeout(() => {
      ToastAndroid.show(
        'Network is slow, please check your connection',
        ToastAndroid.LONG,
      );
    }, 8000);

    return config;
  },
  error => Promise.reject(error),
);

// ✅ Centralized response handling (Network + 401 + Slow Network)
apiClient.interceptors.response.use(
  response => {
    // Clear slow network timer
    if (response.config?.slowNetworkTimer) {
      clearTimeout(response.config.slowNetworkTimer);
    }
    return response;
  },
  async error => {
    // Clear slow network timer
    if (error.config?.slowNetworkTimer) {
      clearTimeout(error.config.slowNetworkTimer);
    }

    // 🔹 Network error (no response from server)
    if (!error.response) {
      console.log('🌐 No internet connection or timeout.');

      // Agar timeout hua (15s)
      if (error.code === 'ECONNABORTED') {
        ToastAndroid.show(
          'Connection timed out, redirecting to offline page...',
          ToastAndroid.LONG,
        );
        NavigationService.navigate('NoInternet');
      } else {
        NavigationService.navigate('NoInternet');
      }

      return Promise.reject({message: 'No Internet Connection'});
    }

    const status = error.response?.status;

    // 🔹 Handle unauthorized (401)
    if (status === 401 && !isHandlingLogout) {
      isHandlingLogout = true;

      const currentRoute = NavigationService.getCurrentRouteName?.();

      if (currentRoute === 'Login') {
        console.log('🔁 Already on Login. Skipping repeated logout.');
        isHandlingLogout = false;
        return Promise.reject(error);
      }

      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [
          {
            text: 'OK',
            onPress: async () => {
              try {
                await clearStorage();
              } catch (e) {
                console.log('❌ Error clearing storage:', e);
              }
              NavigationService.reset('Login');
              isHandlingLogout = false;
            },
          },
        ],
        {cancelable: false},
      );
    }

    return Promise.reject(error);
  },
);

// 🧩 Export HTTP methods
const _get = (url, config) => apiClient.get(url, config);
const _post = (url, data, isMultipart = false) => {
  let headers = {};

  if (isMultipart) {
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    headers['Content-Type'] = 'application/json';
  }

  return apiClient.post(url, data, { headers });
};

// const _post = (url, data, config) => apiClient.post(url, data, config);
const _put = (url, data, config) => apiClient.put(url, data, config);
const _delete = (url, config) => apiClient.delete(url, config);

export {_get, _post, _put, _delete};
