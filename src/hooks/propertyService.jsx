// services/propertyService.js

import {_get} from '../api/apiClient';


export const getPropertyTypes = async () => {
  try {
    const response = await _get('/getPropertyTypes');
    // console.log('getPropertyTypes Response:', response);

  
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      const mappedData = response.data.data.map(item => ({
        label: item.property_type, // ✅ Field name is "property_type"
        value: item.id.toString(),
      }));

      // console.log('✅ Mapped Property Types:', mappedData);
      return mappedData;
    }

    console.log('⚠️ Invalid response structure:', response.data);
    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

/**
 * Fetch Property Sub Types based on Property Type ID
 * Endpoint: GET /property-sub-types/{id}
 */
export const getPropertySubTypes = async propertyTypeId => {
  if (!propertyTypeId) {
    console.log('⚠️ No propertyTypeId provided');
    return [];
  }

  try {
    const response = await _get(`/property-sub-types/${propertyTypeId}`);
    // console.log('getPropertySubTypes Response:', response);

    // ✅ Corrected: Field name is "sub_type_name"
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      const mappedData = response.data.data.map(item => ({
        label: item.sub_type_name, // ✅ Correct field name
        value: item.id.toString(),
      }));

      // console.log('✅ Mapped Property Sub-Types:', mappedData);
      return mappedData;
    }

    console.log('⚠️ Invalid sub-types response structure:', response.data);
    return [];
  } catch (error) {
    console.log('🔴 API ERROR OCCURRED -----------------------');
    return [];
  }
};

export default {
  getPropertyTypes,
  getPropertySubTypes,
};
