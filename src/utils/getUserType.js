// src/utils/getUserType.js
import {_get} from '../api/apiClient';

let cachedUserType = null;

export const getUserType = async () => {
  if (cachedUserType) return cachedUserType;

  try {
    const response = await _get('/usertype');
    const userType = response?.data?.user_type || null;
    cachedUserType = userType; // cache it
    return userType;
  } catch (error) {
    return null;
  }
};

export const clearUserTypeCache = () => {
  cachedUserType = null;
};
