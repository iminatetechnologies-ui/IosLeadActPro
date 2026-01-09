// hooks/useLocationService.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getStates, getCitiesByState, getLocalitiesByCity } from './locationService';

export const useLocationService = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState({
    states: false,
    cities: false,
    localities: false,
  });

  // ✅ States load karen on component mount
  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      setLoading(prev => ({...prev, states: true}));
      const statesData = await getStates();
      // console.log('✅ States loaded:', statesData.length);
      setStates(statesData);
    } catch (error) {
      console.error('❌ Error loading states:', error);
      Alert.alert('Error', 'Failed to load states');
    } finally {
      setLoading(prev => ({...prev, states: false}));
    }
  };

  const loadCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    
    try {
      setLoading(prev => ({...prev, cities: true}));
      // console.log('🔄 Loading cities for state:', stateId);
      const citiesData = await getCitiesByState(stateId);
      // console.log('✅ Cities loaded:', citiesData.length);
      setCities(citiesData);
    } catch (error) {
      console.error('❌ Error loading cities:', error);
      Alert.alert('Error', 'Failed to load cities');
      setCities([]);
    } finally {
      setLoading(prev => ({...prev, cities: false}));
    }
  };

  const loadLocalities = async (cityId) => {
    if (!cityId) {
      setLocalities([]);
      return;
    }
    
    try {
      setLoading(prev => ({...prev, localities: true}));
      // console.log('🔄 Loading localities for city:', cityId);
      const localitiesData = await getLocalitiesByCity(cityId);
      // console.log('✅ Localities loaded:', localitiesData.length);
      setLocalities(localitiesData);
    } catch (error) {
      console.error('❌ Error loading localities:', error);
      Alert.alert('Error', 'Failed to load localities');
      setLocalities([]);
    } finally {
      setLoading(prev => ({...prev, localities: false}));
    }
  };

  return {
    states,
    cities,
    localities,
    loading,
    loadCities,
    loadLocalities,
  };
};