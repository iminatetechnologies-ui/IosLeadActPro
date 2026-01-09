


import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * Store user data securely
 * @param {string} key
 * @param {object} value
 */
export const storeUserData = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
    console.log('✅ Data stored!');
  } catch (error) {
    console.error('❌ Failed to store data', error);
  }
};

/**
 * Retrieve stored user data
 * @param {string} key
 * @returns {object|null}
 */
export const getUserData = async (key) => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Failed to retrieve data', error);
    return null;
  }
};

/**
 * Remove a specific key
 * @param {string} key
 */
export const clearUserData = async (key) => {
  try {
    await EncryptedStorage.removeItem(key);
    console.log('✅ Data cleared!');
  } catch (error) {
    console.error('❌ Failed to clear data', error);
  }
};

/**
 * Clear all storage and run logout callback
 * @param {Function} navigateToLogin
 */
export async function clearStorage(navigateToLogin) {
  try {
    await EncryptedStorage.clear();
    console.log('✅ All storage cleared!');
    navigateToLogin?.(); // Navigate to Login screen
  } catch (error) {
    console.log('❌ Error in clearStorage', error);
  }
}
