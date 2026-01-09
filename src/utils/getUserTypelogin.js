


// src/utils/getUserType.js
import { _get } from '../api/apiClient';

let cachedUserType = null;
let cachedPlan = null;

export const getUserType1 = async () => {
  if (cachedUserType && cachedPlan !== undefined) {
    return { userType: cachedUserType, plan: cachedPlan };
  }

  try {
    const response = await _get('/logintype');
    // console.log('usetype------888888888888888', response);

    const userType = response?.data?.user_type ?? null;
    const plan = response?.data?.plan ?? null;

    cachedUserType = userType;
    cachedPlan = plan;

    return { userType, plan };
  } catch (error) {
    console.error('Error fetching user type:', error);
    return { userType: null, plan: null };
  }
};

export const clearUserTypeCache1 = () => {
  cachedUserType = null;
  cachedPlan = null;
};
