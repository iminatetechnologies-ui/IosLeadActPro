// services/locationService.js
// Yeh file saari API calls handle karegi

import {_get} from '../api/apiClient';

/**
 * Fetch all states
 * Endpoint: GET /getStates
 */
export const getStates = async () => {
  try {
    const response = await _get('/getStates');
    // console.log('getStates Response:', response);
    
    // ✅ Direct response.data use karo (axios response hai)
    if (response.data && Array.isArray(response.data)) {
      const states = response.data.map(state => ({
        label: state.name,
        value: state.id.toString(),
      }));
      // console.log('Formatted states:', states);
      return states;
    }
    
    console.log('No states data found');
    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

/**
 * Fetch cities by state ID
 * Endpoint: GET /getCities/{id}
 */
export const getCitiesByState = async (stateId) => {
  if (!stateId) {
    return [];
  }

  try {
    const response = await _get(`/getCities/${stateId}`);
    // console.log('getCities Response:', response);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(city => ({
        label: city.name,
        value: city.id.toString(),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

/**
 * Fetch localities by city ID
 * Endpoint: GET /getLocalities/{id}
 */
export const getLocalitiesByCity = async (cityId) => {
  if (!cityId) {
    return [];
  }

  try {
    const response = await _get(`/getLocalities/${cityId}`);
    // console.log('getLocalities Response:', response);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(locality => ({
        label: locality.name,
        value: locality.id.toString(),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export default {
  getStates,
  getCitiesByState,
  getLocalitiesByCity,
};