import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomDropdown from '../../components/CustomDropDown';
import CustomTextInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {_post} from '../../api/apiClient';
import {useRoute} from '@react-navigation/native';
import AudioRecorder from '../Audio/AudioRecorder'; // COMMENTED

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useLocationService} from '../../hooks/useLocationService';
import {useResources} from '../../hooks/useResources';
import {usePropertyService} from '../../hooks/usePropertyService';

const AddLead = ({navigation}) => {
  const route = useRoute();
  const [recordedFile, setRecordedFile] = useState(null); // audio file state - COMMENTED

  // STATE / CITY / LOCALITY SERVICE
  const {states, cities, localities, loading, loadCities, loadLocalities} =
    useLocationService();

  // PROPERTY SERVICE
  const {
    propertyTypes: apiPropertyTypes,
    propertySubTypes: apiPropertySubTypes,
    loading: propertyLoading,
    loadPropertySubTypes,
  } = usePropertyService();

  // FORM STATES
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [email, setEmail] = useState('');

  const [requirement, setRequirementType] = useState('');
  const [propertyStages, setPropertyStages] = useState('');

  const [propertyTypes, setPropertyTypes] = useState(null);
  const [propertySubType, setPropertySubType] = useState(null);

  const [propertyBudget, setPropertyBudget] = useState('');
  const [propertyProject, setPropertyProject] = useState('');

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);

  const {projects, budget} = useResources();

  // CLEAR SPECIFIC ERROR
  const clearError = field => {
    setErrors(prev => ({...prev, [field]: null}));
  };

  // LOCATION HANDLERS
  const handleStateSelect = item => {
    setSelectedState(item);
    setSelectedCity(null);
    setSelectedLocality(null);
    clearError('state');
    loadCities(item.value);
  };

  const handleCitySelect = item => {
    setSelectedCity(item);
    setSelectedLocality(null);
    clearError('city');
    loadLocalities(item.value);
  };

  const handleLocalitySelect = item => {
    setSelectedLocality(item);
    clearError('locality');
  };

  // PROPERTY TYPE HANDLER
  const handlePropertyTypeSelect = item => {
    setPropertyTypes(item);
    setPropertySubType(null);
    loadPropertySubTypes(item.value);
    clearError('propertyTypes');
  };

  const handlePropertySubTypeSelect = item => {
    setPropertySubType(item);
    clearError('propertySubType');
  };

  const dropdownData = [
    {label: 'New Project', value: 1},
    {label: 'Rental', value: 2},
    {label: 'Resale', value: 3},
  ];

  const propertyStage = [
    {label: 'Under Construction', value: 1},
    {label: 'Ready To Move', value: 2},
    {label: 'Pre Launch', value: 3},
  ];

  const validateMobile = mobile => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  // PRE-FILL DATA COMING FROM ROUTE PARAMS
  useEffect(() => {
    if (route.params?.mobile) setMobileNumber(route.params.mobile);
    if (route.params?.name) setName(route.params.name);
  }, [route.params]);

  // RESET ALL FORM FIELDS
  const resetForm = () => {
    setRequirementType('');
    setName('');
    setMobileNumber('');
    setAlternateNumber('');
    setEmail('');

    setPropertyTypes(null);
    setPropertySubType(null);
    setPropertyStages('');
    setPropertyBudget('');
    setPropertyProject('');

    setSelectedState(null);
    setSelectedCity(null);
    setSelectedLocality(null);

    setErrors({});
    setSuccessMessage('');
    setRecordedFile(null); // COMMENTED
  };

  // RESET FORM WHEN COMPONENT MOUNTS OR ROUTE PARAMS CHANGE
  useEffect(() => {
    // If you want to reset form every time component mounts
    // resetForm();
  }, []);


  const handleSubmit = async () => {
    let newErrors = {};
    setSuccessMessage('');

    // VALIDATION
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobile(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter valid 10 digit number';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    // ----------------------------------------
    // 🔥 Convert NORMAL DATA -> FormData (multipart)
    // ----------------------------------------

    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email || '');
    formData.append('mobile', mobileNumber);

    formData.append('requirement_type', requirement || '');
    formData.append('alternative_no', alternateNumber || '');
    formData.append('project_id', propertyProject || '');
    formData.append('property_stage', propertyStages || '');
    formData.append('property_type', propertyTypes?.value || '');
    formData.append('property_sub_type', propertySubType?.value || '');
    formData.append('budget', propertyBudget || '');
    formData.append('lead_stage', propertyStages || '');
    formData.append('state', selectedState?.value || '');
    formData.append('city', selectedCity?.value || '');
    formData.append('locality', selectedLocality?.value || '');

    // ----------------------------------------
    // 🔥 COMMENTED - AUDIO FILE ADD (IF RECORDED)
    // ----------------------------------------
    if (recordedFile) {
      formData.append('audio_file', {
        uri: recordedFile.startsWith('file://')
          ? recordedFile
          : `file://${recordedFile}`,
        type: 'audio/wav',
        name: `lead_audio_${Date.now()}.wav`,
      });
    }

    try {
      // console.log('-----------', formData);
      const response = await _post('/lead/tele/create', formData, true); // true = multipart
      console.log('responce----',response)
      if (response.status === 201) {
        ToastAndroid.show('Lead Created Successfully', ToastAndroid.SHORT);
        setSuccessMessage('Lead has been created successfully');
        navigation.goBack();
        resetForm();
        return;
      } else {
        setErrors({
          api: response.data?.message || 'Failed to create lead',
        });
      }
    } catch (error) {
      console.log('🔥 API ERROR:', error);
      setErrors({api: 'Something went wrong, please try again'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>REQUIREMENT TYPE</Text>
        <CustomDropdown
          data={dropdownData}
          onSelect={item => {
            setRequirementType(item.value);
            clearError('requirement');
          }}
          placeholder="Choose an option"
          value={
            requirement
              ? dropdownData.find(item => item.value === requirement)
              : null
          }
          error={errors.requirement}
        />

        <Text style={styles.title}>FIRST NAME*</Text>
        <CustomTextInput
          iconName="person"
          placeholder="First Name"
          value={name}
          onChangeText={text => {
            setName(text);
            clearError('name');
          }}
          error={errors.name}
        />

        <Text style={styles.title}>CONTACT NUMBER*</Text>
        <CustomTextInput
          iconName="phone"
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={mobileNumber}
          maxLength={10}
          onChangeText={text => {
            setMobileNumber(text);
            clearError('mobileNumber');
          }}
          error={errors.mobileNumber}
        />

        <Text style={styles.title}>ALTERNATE NUMBER</Text>
        <CustomTextInput
          iconName="phone"
          placeholder="Alternate mobile number"
          keyboardType="phone-pad"
          value={alternateNumber}
          maxLength={10}
          onChangeText={text => {
            setAlternateNumber(text);
            clearError('alternateNumber');
          }}
        />

        <Text style={styles.title}>EMAIL</Text>
        <CustomTextInput
          iconName="email"
          placeholder="Enter your email"
          value={email}
          onChangeText={text => {
            setEmail(text);
            clearError('email');
          }}
          error={errors.email}
        />

        {/* PROPERTY TYPE */}
        <Text style={styles.title}>PROPERTY TYPE</Text>
        <CustomDropdown
          data={apiPropertyTypes}
          onSelect={handlePropertyTypeSelect}
          placeholder={
            propertyLoading.propertyTypes
              ? 'Loading property types...'
              : 'Choose an option'
          }
          value={propertyTypes}
          disabled={propertyLoading.propertyTypes}
          error={errors.propertyTypes}
        />

        {/* PROPERTY SUB TYPE */}
        <Text style={styles.title}>PROPERTY SUB TYPE</Text>
        <CustomDropdown
          data={apiPropertySubTypes}
          onSelect={handlePropertySubTypeSelect}
          placeholder={
            !propertyTypes
              ? 'Select property type first'
              : propertyLoading.propertySubTypes
              ? 'Loading sub types...'
              : 'Choose an option'
          }
          value={propertySubType}
          disabled={!propertyTypes || propertyLoading.propertySubTypes}
          error={errors.propertySubType}
        />

        <Text style={styles.title}>PROPERTY STAGE</Text>
        <CustomDropdown
          data={propertyStage}
          onSelect={item => {
            setPropertyStages(item.value);
            clearError('propertyStages');
          }}
          placeholder="Choose an option"
          value={
            propertyStages
              ? propertyStage.find(item => item.value === propertyStages)
              : null
          }
        />

        <Text style={styles.title}>BUDGET</Text>
        <CustomDropdown
          data={budget}
          onSelect={item => {
            setPropertyBudget(item.id);
            clearError('propertyBudget');
          }}
          placeholder="Choose an option"
          value={
            propertyBudget
              ? budget.find(item => item.id === propertyBudget)
              : null
          }
        />

        <Text style={styles.title}>PROJECTS</Text>
        <CustomDropdown
          data={projects}
          onSelect={item => {
            setPropertyProject(item.value);
            clearError('propertyProject');
          }}
          placeholder="Choose an option"
          value={
            propertyProject
              ? projects.find(item => item.value === propertyProject)
              : null
          }
        />

        <Text style={styles.title}>STATE</Text>
        <CustomDropdown
          data={states}
          onSelect={handleStateSelect}
          placeholder={loading.states ? 'Loading states...' : 'Select State'}
          value={selectedState}
          error={errors.state}
        />

        <Text style={styles.title}>CITY</Text>
        <CustomDropdown
          data={cities}
          onSelect={handleCitySelect}
          placeholder={
            !selectedState
              ? 'Select state first'
              : loading.cities
              ? 'Loading cities...'
              : 'Select City'
          }
          value={selectedCity}
          error={errors.city}
        />

        <Text style={styles.title}>LOCALITY</Text>
        <CustomDropdown
          data={localities}
          onSelect={handleLocalitySelect}
          placeholder={
            !selectedCity
              ? 'Select city first'
              : loading.localities
              ? 'Loading localities...'
              : 'Select Locality'
          }
          value={selectedLocality}
          error={errors.locality}
        />

        {/* COMMENTED - Audio Section */}
        <Text style={styles.title}>AUDIO NOTE (OPTIONAL)</Text>
        <AudioRecorder onRecordingComplete={file => setRecordedFile(file)} />

        {successMessage !== '' && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}

        {errors.api && <Text style={styles.apiErrorText}>{errors.api}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title={isLoading ? 'Submitting...' : 'Submit'}
          isLoading={isLoading}
          disabled={isLoading}
          textStyle={{fontSize: 18}}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default AddLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  scrollContent: {
    padding: 5,
    paddingBottom: 20,
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: hp('1.3%'),
    marginTop: 4,
    marginLeft: 20,
    fontWeight: '500',
  },
  apiErrorText: {
    color: '#e74c3c',
    fontSize: wp('3.5%'),
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  successText: {
    color: '#27ae60',
    fontSize: wp('3.5%'),
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: '#eafaf1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    fontWeight: '500',
  },
});