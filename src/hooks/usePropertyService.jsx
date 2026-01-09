// hooks/usePropertyService.js

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getPropertyTypes, getPropertySubTypes } from './propertyService';

export const usePropertyService = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertySubTypes, setPropertySubTypes] = useState([]);

  const [loading, setLoading] = useState({
    propertyTypes: false,
    propertySubTypes: false,
  });

  // Auto-load property types on mount
  useEffect(() => {
    loadPropertyTypes();
  }, []);

  const loadPropertyTypes = async () => {
    try {
      setLoading(prev => ({...prev, propertyTypes: true}));
      const data = await getPropertyTypes();
    //   console.log('✅ PropertyTypes loaded:', data.length);
      setPropertyTypes(data);
    } catch (error) {
      console.error('❌ Error loading property types:', error);
      Alert.alert("Error", "Failed to load property types");
    } finally {
      setLoading(prev => ({...prev, propertyTypes: false}));
    }
  };

  const loadPropertySubTypes = async (typeId) => {
    if (!typeId) {
      setPropertySubTypes([]);
      return;
    }

    try {
      setLoading(prev => ({...prev, propertySubTypes: true}));
    //   console.log("🔄 Loading Property SubTypes for:", typeId);

      const data = await getPropertySubTypes(typeId);
    //   console.log("✅ Property SubTypes loaded:", data.length);

      setPropertySubTypes(data);
    } catch (error) {
      console.error('❌ Error loading property sub types:', error);
      Alert.alert("Error", "Failed to load property sub types");
      setPropertySubTypes([]);
    } finally {
      setLoading(prev => ({...prev, propertySubTypes: false}));
    }
  };

  return {
    propertyTypes,
    propertySubTypes,
    loading,
    loadPropertySubTypes,
  };
};
