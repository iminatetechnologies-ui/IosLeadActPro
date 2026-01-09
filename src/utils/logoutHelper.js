// utils/logoutHelper.js
import { Platform, InteractionManager, BackHandler } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { CommonActions } from '@react-navigation/native';
import { clearStorage } from '../components/EncryptedStorageUtil';
import { clearUserTypeCache } from '../utils/getUserType';
import { clearUserTypeCache1 } from '../utils/getUserTypelogin';

export const performSafeLogout = async (navigation, setUser) => {
  try {
    // 1. Close any open modals, drawers, or overlays
    if (navigation.closeDrawer) {
      navigation.closeDrawer();
    }
    
    // 2. Save permission flag before clearing
    const permissionFlag = await EncryptedStorage.getItem('permissionsGranted');
    
    // 3. Clear all user data
    await clearStorage();
    await clearUserTypeCache();
    await clearUserTypeCache1();
    
    // 4. Restore permission flag if it exists
    if (permissionFlag) {
      await EncryptedStorage.setItem('permissionsGranted', permissionFlag);
    }
    
    // 5. Clear user context
    if (setUser) {
      setUser({ name: null, avatar: null });
    }
    
    // 6. iOS-specific: Force a delay and use InteractionManager
    if (Platform.OS === 'ios') {
      // Wait for any pending animations to complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Use InteractionManager to ensure UI operations are complete
      await new Promise(resolve => {
        InteractionManager.runAfterInteractions(() => {
          resolve();
        });
      });
      
      // Additional delay for iOS
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 7. Reset navigation with minimal animation
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
    
    // 8. Force garbage collection on iOS (if needed)
    if (Platform.OS === 'ios') {
      // Small delay to ensure navigation completes
      setTimeout(() => {
        // This helps iOS clean up memory
        if (global.gc) {
          global.gc();
        }
      }, 500);
    }
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Fallback: Try a simpler navigation reset
    try {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (fallbackError) {
      console.error('Fallback logout failed:', fallbackError);
    }
    
    return false;
  }
};