import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomTextInput from './../../components/CustomInput';
import CustomButton from './../../components/CustomButton';
import {_get, _post} from '../../api/apiClient';
import DateTimePickerComponent from './../../components/DateTimeSelector';
import TextareaWithIcon from './../../components/TextArea';
import AudioRecorder from '../Audio/AudioRecorder'; // UNCOMMENTED
import {useLocationService} from '../../hooks/useLocationService';
import {useResources} from '../../hooks/useResources';

const InterestedDetails = ({navigation, route}) => {
  const {item, otherParam, leadSource} = route.params;

  const {states, cities, localities, loading, loadCities, loadLocalities} =
    useLocationService();

  // API data states
  const [project, setProject] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [recordedFile, setRecordedFile] = useState(null); // UNCOMMENTED

  // Form states with auto-fill from route params
  const [fullName, setFullName] = useState(item?.name || item?.fullname || '');
  const [number, setNumber] = useState(
    item?.alternative_no || item?.phone || item?.mobile || '',
  );
  const [notes, setNotes] = useState(item?.notes || '');
  const [requirement, setRequirementType] = useState(null);
  const [propertyStages, setPropertyStages] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState(null);
  const [nextFollowUpType, setNextFollowUpType] = useState(
    item?.followup_type || '',
  );
  const [nextFollowupTime, setFollowupTime] = useState(item?.followup_on || '');
  const [propertyBudget, setPropertyBudget] = useState(null);
  const [propertyProject, setPropertyProject] = useState(null);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);

  const {
    projects,
    loadingResources,
    resourceError,
    fetchResources,
    budget,
    sources,
  } = useResources();

  const clearError = field => {
    setErrors(prev => ({...prev, [field]: null}));
  };

  // ✅ Handle state selection - SIMPLE VERSION
  const handleStateSelect = item => {
    console.log('🗺️ State selected:', item);
    setSelectedState(item);
    setSelectedCity(null);
    setSelectedLocality(null);
    clearError('state');

    // ✅ DIRECTLY CALL loadCities
    loadCities(item.value);
  };

  // ✅ Handle city selection - SIMPLE VERSION
  const handleCitySelect = item => {
    console.log('🏙️ City selected:', item);
    setSelectedCity(item);
    setSelectedLocality(null);
    clearError('city');

    // ✅ DIRECTLY CALL loadLocalities
    loadLocalities(item.value);
  };

  // ✅ Handle locality selection
  const handleLocalitySelect = item => {
    console.log('📍 Locality selected:', item);
    setSelectedLocality(item);
    clearError('locality');
  };

  // Static dropdown data
  const dropdownData = [
    {label: 'New Project', value: 1},
    {label: 'Rental', value: 2},
    {label: 'Resale', value: 3},
  ];

  const propertyType = [
    {label: 'Residential', value: 1},
    {label: 'Commercial', value: 2},
    {label: 'Industrial', value: 3},
  ];

  const propertyStage = [
    {label: 'Under Construction', value: 1},
    {label: 'Ready To Move', value: 2},
    {label: 'Pre Launch', value: 3},
  ];

  const followUpType = [
    {label: 'Follow up', value: 5},
    {label: 'Meetings', value: 6},
    {label: 'Site visit', value: 7},
  ];

  // UNCOMMENTED - Audio recording handler
  const handleRecordingComplete = audioFile => {
    console.log('🎵 Audio recorded:', audioFile);
    setRecordedFile(audioFile);
  };

  // ✅ Auto-selection logic for static dropdowns
  useEffect(() => {
    if (item?.property_type) {
      const cleanPropertyType = item.property_type
        .toLowerCase()
        .replace(/\s+/g, '');
      const matchPropertyType = propertyType.find(
        pt => pt.label.toLowerCase().replace(/\s+/g, '') === cleanPropertyType,
      );
      if (matchPropertyType) {
        setPropertyTypes(matchPropertyType);
      }
    }

    if (item?.property_stage) {
      const cleanPropertyStage = item.property_stage
        .toLowerCase()
        .replace(/\s+/g, '');
      const matchPropertyStage = propertyStage.find(
        ps => ps.label.toLowerCase().replace(/\s+/g, '') === cleanPropertyStage,
      );
      if (matchPropertyStage) {
        setPropertyStages(matchPropertyStage);
      }
    }
  }, [item]);

  // ✅ Auto-selection logic for API dropdowns
  useEffect(() => {
    if (budget.length > 0 && item?.budget_name) {
      const cleanBudgetName = item.budget_name
        .toLowerCase()
        .replace(/\s+/g, '');
      const matchBudget = budget.find(
        b => b.label.toLowerCase().replace(/\s+/g, '') === cleanBudgetName,
      );
      if (matchBudget) {
        setPropertyBudget(matchBudget);
      }
    }

    if (projects.length > 0 && item?.project_name) {
      const cleanProjectName = item.project_name
        .toLowerCase()
        .replace(/\s+/g, '');
      const matchProject = projects.find(
        p => p.label.toLowerCase().replace(/\s+/g, '') === cleanProjectName,
      );
      if (matchProject) {
        setPropertyProject(matchProject);
      }
    }
  }, [budget, projects, item]);

  const handleDateTimeSubmit = isoDateTime => {
    setFollowupTime(isoDateTime);
    clearError('nextFollowupTime');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!requirement) newErrors.requirement = 'Requirement type is required';
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!nextFollowUpType)
      newErrors.nextFollowUpType = 'Next follow up type is required';
    if (!nextFollowupTime)
      newErrors.nextFollowupTime = 'Please select a follow-up date and time';
    if (number && (number.length < 10 || number.length > 13)) {
      newErrors.number = 'Phone number should be between 10-13 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    let newErrors = {};

    // 🔥 UPDATED VALIDATION → Notes are no longer required since audio is an alternative
    if (!notes.trim() && !recordedFile) {
      newErrors.main = 'Please add Notes or record an Audio note';
    }

    // Existing validation function
    if (!validateForm()) {
      setErrors(prev => ({...prev, main: newErrors.main}));
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({...prev, ...newErrors}));
      return;
    }

    // ----------------------------------------
    // MULTIPART FORM DATA
    // ----------------------------------------
    const formData = new FormData();

    formData.append('fullname', fullName);
    formData.append('requirements', requirement?.value || requirement);
    formData.append('budget_id', propertyBudget?.id || propertyBudget);
    formData.append('project_id', propertyProject?.value || propertyProject);
    formData.append('property_type', propertyTypes?.value || propertyTypes);
    formData.append('property_stage', propertyStages?.value || propertyStages);
    formData.append('followup_type', nextFollowUpType);
    formData.append('followup_on', nextFollowupTime);
    formData.append('alternative_no', number);
    formData.append('notes', notes);
    formData.append('lead_type', otherParam);
    formData.append('state', selectedState?.value || ''); // State ID
    formData.append('city', selectedCity?.value || ''); // City ID
    formData.append('locality', selectedLocality?.value || ''); // Locality ID

    // UNCOMMENTED - Audio file handling
    if (recordedFile) {
      console.log('📁 Adding audio file to FormData:', recordedFile);

      formData.append('audio_file', {
        uri: recordedFile.startsWith('file://')
          ? recordedFile
          : `file://${recordedFile}`,
        type: 'audio/wav',
        name: `interested_audio_${Date.now()}.wav`,
      });
    }

    setIsLoading(true);

    try {
      const response = await _post(
        `/leads/interested/save/${item?.id}`,
        formData,
        true,
      );

      console.log('✅ API Response:', response);

      if (response.status === 200) {
        ToastAndroid.show(
          'Lead has been updated successfully',
          ToastAndroid.SHORT,
        );
        setErrors({});
        setRecordedFile(null); // UNCOMMENTED
        setTimeout(() => navigation.goBack(), 1000);
      } else {
        setErrors({api: response.data?.message || 'Update failed'});
      }
    } catch (error) {
      console.error('❌ API Error:', error);

      if (error.response) {
        console.log('📊 Error Response:', error.response);

        if (error.response.status === 422) {
          const errs = error.response.data.errors;

          // UNCOMMENTED - Audio error handling
          if (errs.audio_file) {
            setErrors({api: `Audio error: ${errs.audio_file[0]}`});
          } else if (errs.substatus_id) {
            setErrors({api: errs.substatus_id[0]});
          } else if (errs.notes) {
            setErrors({api: errs.notes[0]});
          } else {
            setErrors({api: 'Validation failed'});
          }
        } else {
          setErrors({api: `Server error: ${error.response.status}`});
        }
      } else {
        setErrors({api: 'Network error: Please check your connection'});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (title, isRequired = false) => (
    <Text style={styles.title}>
      {title}
      {isRequired && '*'}
    </Text>
  );

  const renderError = error =>
    error && <Text style={styles.errorText}>{error}</Text>;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {errors.api && <Text style={styles.apiErrorText}>{errors.api}</Text>}

        {renderFormField('REQUIREMENT TYPE', true)}
        <CustomDropdown
          data={dropdownData}
          value={requirement}
          onSelect={item => {
            setRequirementType(item);
            clearError('requirement');
          }}
          placeholder="Choose an option"
          error={errors.requirement}
        />
        {renderError(errors.requirement)}

        {renderFormField('FULLNAME', true)}
        <CustomTextInput
          keyboardType="default"
          iconName="person"
          placeholder="Full Name"
          value={fullName}
          onChangeText={value => {
            setFullName(value);
            clearError('fullName');
          }}
          error={errors.fullName}
        />
        {renderError(errors.fullName)}

        {renderFormField('ALTERNATIVE NUMBER')}
        <CustomTextInput
          keyboardType="numeric"
          iconName="phone"
          placeholder="Number"
          value={number}
          maxLength={13}
          onChangeText={value => {
            setNumber(value);
            clearError('number');
          }}
          error={errors.number}
        />
        {renderError(errors.number)}

        {renderFormField('BUDGET')}
        <CustomDropdown
          data={budget}
          value={propertyBudget}
          onSelect={item => setPropertyBudget(item)}
          placeholder="Choose an option"
        />

        {renderFormField('PROJECT')}
        <CustomDropdown
          data={projects}
          value={propertyProject}
          onSelect={item => setPropertyProject(item)}
          placeholder="Choose an option"
        />

        {renderFormField('PROPERTY TYPE')}
        <CustomDropdown
          data={propertyType}
          value={propertyTypes}
          onSelect={item => setPropertyTypes(item)}
          placeholder="Select the property type"
        />

        {renderFormField('PROPERTY STAGE')}
        <CustomDropdown
          data={propertyStage}
          value={propertyStages}
          onSelect={item => setPropertyStages(item)}
          placeholder="Choose an option"
        />

        {renderFormField('STATE', true)}
        <CustomDropdown
          data={states}
          onSelect={handleStateSelect}
          placeholder={loading.states ? 'Loading states...' : 'Select State'}
          value={selectedState}
          disabled={loading.states}
          error={errors.state}
        />
        {renderError(errors.state)}

        {renderFormField('CITY', true)}
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
          disabled={!selectedState || loading.cities}
          error={errors.city}
        />
        {renderError(errors.city)}

        {renderFormField('LOCALITY', true)}
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
          disabled={!selectedCity || loading.localities}
          error={errors.locality}
        />
        {renderError(errors.locality)}

        {renderFormField('Next Follow-Up Type', true)}
        <CustomDropdown
          data={followUpType}
          onSelect={item => {
            setNextFollowUpType(item.value);
            clearError('nextFollowUpType');
          }}
          placeholder="Choose an option"
          error={errors.nextFollowUpType}
        />
        {renderError(errors.nextFollowUpType)}

        {renderFormField('Next Follow-Up Time And Date', true)}
        <DateTimePickerComponent
          onDateChange={handleDateTimeSubmit}
          initialDate={nextFollowupTime}
          error={errors.nextFollowupTime}
        />
        {renderError(errors.nextFollowupTime)}

        {renderFormField('NOTES', true)}
        <TextareaWithIcon
          value={notes}
          onChangeText={text => {
            setNotes(text);
            clearError('notes');
          }}
          error={errors.notes}
        />
        {errors.main && <Text style={styles.errorText}>{errors.main}</Text>}

        {/* UNCOMMENTED - Audio Recording Section */}
        {renderFormField('AUDIO NOTE (OPTIONAL)')}
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />

        {/* UNCOMMENTED - Show recorded file info */}
        {recordedFile && (
          <View style={styles.audioInfoContainer}>
            <Text style={styles.audioInfoText}>
              ✅ Audio recorded successfully
            </Text>
            <Text style={styles.audioInfoSubText}>
              Audio note will be attached with this lead
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footerButton}>
        <CustomButton
          title={isLoading ? 'Submitting...' : 'Submit'}
          isLoading={isLoading}
          disabled={isLoading}
          textStyle={{fontSize: 18}}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

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
    paddingBottom: 10,
  },
  footerButton: {
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
    fontSize: 12,
    marginTop: 4,
    marginLeft: 20,
    fontWeight: '500',
  },
  apiErrorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  // UNCOMMENTED - Audio info styles
  audioInfoContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#eafaf1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  audioInfoText: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '500',
  },
  audioInfoSubText: {
    color: '#27ae60',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default InterestedDetails;