import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import {stepsMeta, initialFormState, renderField} from './formFieldsConfig';
import {
  getStates,
  getCitiesByState,
  getLocalitiesByCity,
} from '../../hooks/locationService';
import {_post} from '../../api/apiClient';
import {useResources} from '../../hooks/useResources';

export default function InventoryFormWizard({navigation}) {
  const totalSteps = stepsMeta.length;
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const progress = useRef(new Animated.Value(0)).current;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Naya state for location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState({
    states: false,
    cities: false,
    localities: false,
  });

  const {projects, loadingResources, resourceError, fetchResources} =
    useResources();

  // ✅ States load karen on component mount
  useEffect(() => {
    loadStates();
  }, []);

  // ✅ Jab state change ho tab cities load karen
  useEffect(() => {
    if (form.state?.value) {
      loadCities(form.state.value);
    } else {
      setCities([]);
      setLocalities([]);
    }
  }, [form.state]);

  // ✅ Jab city change ho tab localities load karen
  useEffect(() => {
    if (form.city?.value) {
      loadLocalities(form.city.value);
    } else {
      setLocalities([]);
    }
  }, [form.city]);

  const loadStates = async () => {
    try {
      setLoading(prev => ({...prev, states: true}));
      const statesData = await getStates();
      setStates(statesData);
    } catch (error) {
      console.error('Error loading states:', error);
      Alert.alert('Error', 'Failed to load states');
    } finally {
      setLoading(prev => ({...prev, states: false}));
    }
  };

  const loadCities = async stateId => {
    try {
      setLoading(prev => ({...prev, cities: true}));
      setCities([]); // Reset cities
      setForm(prev => ({...prev, city: null, locality: null})); // Reset city and locality

      const citiesData = await getCitiesByState(stateId);
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      Alert.alert('Error', 'Failed to load cities');
    } finally {
      setLoading(prev => ({...prev, cities: false}));
    }
  };

  const loadLocalities = async cityId => {
    try {
      setLoading(prev => ({...prev, localities: true}));
      setLocalities([]); // Reset localities
      setForm(prev => ({...prev, locality: null})); // Reset locality

      const localitiesData = await getLocalitiesByCity(cityId);
      setLocalities(localitiesData);
    } catch (error) {
      console.error('Error loading localities:', error);
      Alert.alert('Error', 'Failed to load localities');
    } finally {
      setLoading(prev => ({...prev, localities: false}));
    }
  };

  useEffect(() => {
    const toValue = (currentStep + 1) / totalSteps;
    Animated.timing(progress, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progress, totalSteps]);

  const updateField = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
    setErrors(prev => ({...prev, [key]: null}));
  };

  const validateStep = () => {
    const stepKeys = stepsMeta[currentStep].fields;
    const newErrors = {};

    // Required fields list
    const requiredFieldsAll = [
      'ownername',
      'mobile',
      'propertytype',
      'propertysubtype',
      'state',
      'city',
      'locality',
    ];

    // Helper to make field names user-friendly
    const formatFieldName = key =>
      key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    stepKeys.forEach(key => {
      const val = form[key];

      if (requiredFieldsAll.includes(key)) {
        // Check empty
        if (!val || (typeof val === 'string' && val.trim() === '')) {
          if (key === 'mobile') {
            newErrors[key] = 'Mobile number is required and must be 10 digits';
          } else if (key === 'ownername') {
            newErrors[key] = 'Owner Name is required';
          } else {
            newErrors[key] = `${formatFieldName(key)} is required`;
          }
        } else if (key === 'mobile') {
          // Mobile number length check
          const digitsOnly = val.replace(/\D/g, '');
          if (digitsOnly.length !== 10) {
            newErrors[key] = 'Mobile number must be exactly 10 digits';
          }
        }
      }
    });

    setErrors(prev => ({...prev, ...newErrors}));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  // const handleSubmit = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     const formData = new FormData();

  //     // ---------- TEXT FIELDS ----------
  //     formData.append('owner_name', form.ownername || '');
  //     formData.append('owner_email', form.owneremail || '');
  //     formData.append('owner_mobile', form.mobile || '');
  //     formData.append('alternative_no', form.alternative || '');
  //     formData.append('reference', form.reference || '');

  //     // ---------- DROPDOWNS ----------
  //     formData.append('property_for', form.propertyfor?.value || '');
  //     formData.append('property_type', form.propertytype?.value || '');
  //     formData.append('property_subtype', form.propertysubtype?.value || '');
  //     formData.append('property_source', form.propertysource?.value || '');
  //     formData.append('property_age', form.propertyage?.value || '');
  //     formData.append('price_negotiable', form.pricenegotiable?.value || '');

  //     // ---------- LOCATION ----------
  //     formData.append('property_state', form.state?.value || '');
  //     formData.append('property_city', form.city?.value || '');
  //     formData.append('property_locality', form.locality?.value || '');

  //     // ---------- AREA ----------
  //     formData.append('super_area', form.superarea || '');
  //     formData.append('plot_area', form.plotarea || '');
  //     formData.append('carpet_area', form.carpetarea || '');

  //     formData.append(
  //       'construction_status',
  //       form.constructionstatus?.value || '',
  //     );
  //     formData.append('possession_year', form.possession?.value || '');
  //     formData.append('brokerage', form.brokerage?.value || '');

  //     // ---------- FLOOR DETAILS ----------
  //     formData.append('tower_name', form.towername || '');
  //     formData.append('floor_no', form.floornumber?.value || '');
  //     formData.append('total_floors', form.totalfloors?.value || '');
  //     formData.append('unit_number', form.unitnumber || '');
  //     formData.append(
  //       'property_configuration',
  //       form.configuration?.value || '',
  //     );

  //     // ---------- DEMAND PRICE ----------
  //     formData.append('demand_price', form.expectedprice || '');

  //     // ---------- OTHER DETAILS ----------
  //     formData.append('facing', form.facingdirection?.value || '');
  //     formData.append('furnished_type', form.furnishedtype?.value || '');
  //     formData.append('parking_type', form.parkingtype?.value || '');
  //     formData.append('no_of_parking', form.noofparking?.value || '');
  //     formData.append('preference', form.tenantpreference?.value || '');

  //     // ---------- PROJECT ----------
  //     formData.append('project_id', form.projectname?.value || '');
  //     formData.append('builder_name', form.buildername || '');
  //     // Missing fields from curl:
  //     formData.append('block_number', form.blocknumber || ''); // Missing in your code
  //     formData.append('project_address', form.projectaddress || '');
  //     // Missing fields from curl:
  //     formData.append('latitude', form.latitude || ''); // Missing in your code
  //     formData.append('longitude', form.longitude || ''); // Missing in your code
  //     formData.append('remarks', form.remarks || '');

  //     // ==================================================
  //     // ******* EXACT BACKEND FORMAT LIKE YOUR CURL *******
  //     // ==================================================

  //     // ---------- FEATURES[] ----------
  //     if (form.features?.length > 0) {
  //       form.features.forEach(item => {
  //         // Make sure to send just the value, not the object
  //         const value = typeof item === 'object' ? item.value : item;
  //         formData.append('features[]', value || '');
  //       });
  //     } else {
  //       // Send empty array if no features
  //       formData.append('features[]', '');
  //     }

  //     // ---------- AMENITIES[] ----------
  //     if (form.amenities?.length > 0) {
  //       form.amenities.forEach(item => {
  //         // Make sure to send just the value, not the object
  //         const value = typeof item === 'object' ? item.value : item;
  //         formData.append('amenities[]', value || '');
  //       });
  //     } else {
  //       // Send empty array if no amenities
  //       formData.append('amenities[]', '');
  //     }

  //     // ---------- IMAGES ----------
  //     if (
  //       Array.isArray(form.propertyimages) &&
  //       form.propertyimages.length > 0
  //     ) {
  //       form.propertyimages.forEach((img, index) => {
  //         // For React Native, use the actual file object
  //         const imageUri = img.uri || img;
  //         const filename = imageUri.split('/').pop();
  //         const match = /\.(\w+)$/.exec(filename);
  //         const type = match ? `image/${match[1]}` : 'image/jpeg';

  //         formData.append('property_images[]', {
  //           uri: imageUri,
  //           name: filename || `image_${index}.jpg`,
  //           type: type,
  //         });
  //       });
  //     } else {
  //       // Send empty array if no images
  //       formData.append('property_images[]', '');
  //     }

  //     // ---------- DOCUMENTS ----------
  //     if (
  //       Array.isArray(form.propertydocuments) &&
  //       form.propertydocuments.length > 0
  //     ) {
  //       form.propertydocuments.forEach((doc, index) => {
  //         // For React Native, use the actual file object
  //         const docUri = doc.uri || doc;
  //         const filename = docUri.split('/').pop();
  //         const match = /\.(\w+)$/.exec(filename);
  //         const type = match
  //           ? match[1] === 'pdf'
  //             ? 'application/pdf'
  //             : 'application/octet-stream'
  //           : 'application/pdf';

  //         formData.append('property_documents[]', {
  //           uri: docUri,
  //           name: filename || `doc_${index}.pdf`,
  //           type: type,
  //         });
  //       });
  //     } else {
  //       // Send empty array if no documents
  //       formData.append('property_documents[]', '');
  //     }

  //     // ---------- DEBUG LOG ----------
  //     // console.log('========== FINAL FORMDATA ==========');
  //     // if (formData._parts) {
  //     //   formData._parts.forEach(p => console.log(p[0], p[1]));
  //     // }

  //     // ---------- API CALL ----------
  //     const res = await _post('/addinventory', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     console.log('API RESPONSE >>>', res);

  //     if (res.data.success == 1) {
  //       Alert.alert('Success', 'Inventory Added Successfully!');
  //       setForm(initialFormState);
  //       setCurrentStep(0);
  //     } else {
  //       Alert.alert(
  //         'Error-----------',
  //         res?.data?.message || 'Something went wrong!',
  //       );
  //     }
  //   } catch (error) {
  //     console.log('Error message:', error?.message);

  //     Alert.alert(
  //       'Error',
  //       error?.response?.data?.message ||
  //         error?.message ||
  //         'Failed to add inventory',
  //     );
  //   } finally {
  //     setIsSubmitting(false); // ✅ Stop loading
  //   }
  // };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // ---------- TEXT FIELDS ----------
      formData.append('owner_name', form.ownername || '');
      formData.append('owner_email', form.owneremail || '');
      formData.append('owner_mobile', form.mobile || '');
      formData.append('alternative_no', form.alternative || '');
      formData.append('reference', form.reference || '');

      // ---------- DROPDOWNS ----------
      formData.append('property_for', form.propertyfor?.value || '');
      formData.append('property_type', form.propertytype?.value || '');
      formData.append('property_subtype', form.propertysubtype?.value || '');
      formData.append('property_source', form.propertysource?.value || '');
      formData.append('property_age', form.propertyage?.value || '');
      formData.append('price_negotiable', form.pricenegotiable?.value || '');

      // ---------- LOCATION ----------
      formData.append('property_state', form.state?.value || '');
      formData.append('property_city', form.city?.value || '');
      formData.append('property_locality', form.locality?.value || '');

      // ---------- AREA ----------
      formData.append('super_area', form.superarea || '');
      formData.append('plot_area', form.plotarea || '');
      formData.append('carpet_area', form.carpetarea || '');

      // ---------- CONSTRUCTION & POSSESSION ----------
      formData.append(
        'construction_status',
        form.constructionstatus?.value || '',
      );
      formData.append('possession_year', form.possession?.value || '');
      formData.append('brokerage', form.brokerage?.value || '');

      // ---------- FLOOR DETAILS ----------
      formData.append('tower_name', form.towername || '');
      formData.append('floor_no', form.floornumber?.value || '');
      formData.append('total_floors', form.totalfloors?.value || '');
      formData.append('unit_number', form.unitnumber || '');
      formData.append(
        'property_configuration',
        form.configuration?.value || '',
      );

      // ---------- DEMAND PRICE ----------
      formData.append('demand_price', form.expectedprice || '');

      // ---------- OTHER DETAILS ----------
      formData.append('facing', form.facingdirection?.value || '');
      formData.append('furnished_type', form.furnishedtype?.value || '');
      formData.append('parking_type', form.parkingtype?.value || '');
      formData.append('no_of_parking', form.noofparking?.value || '');
      formData.append('preference', form.tenantpreference?.value || '');

      // ---------- PROJECT DETAILS ----------
      formData.append('project_id', form.projectname?.value || '');
      formData.append('builder_name', form.buildername || '');
      formData.append('block_number', form.blocknumber || '');
      formData.append('project_address', form.projectaddress || '');
      formData.append('latitude', form.latitude || '');
      formData.append('longitude', form.longitude || '');
      formData.append('remarks', form.remarks || '');

      // ---------- FEATURES[] ----------
      if (form.features?.length > 0) {
        form.features.forEach(item => {
          const value = typeof item === 'object' ? item.value : item;
          formData.append('features[]', value || '');
        });
      } else {
        formData.append('features[]', '');
      }

      // ---------- AMENITIES[] ----------
      if (form.amenities?.length > 0) {
        form.amenities.forEach(item => {
          const value = typeof item === 'object' ? item.value : item;
          formData.append('amenities[]', value || '');
        });
      } else {
        formData.append('amenities[]', '');
      }

      // ---------- IMAGES ----------
      if (
        Array.isArray(form.propertyimages) &&
        form.propertyimages.length > 0
      ) {
        form.propertyimages.forEach((img, index) => {
          const imageUri = img.uri || img;
          const filename = img.name || imageUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';

          formData.append('property_images[]', {
            uri: imageUri,
            name: filename || `image_${index}.jpg`,
            type: type,
          });
        });
      } else {
        formData.append('property_images[]', '');
      }

      // ---------- DOCUMENTS ----------
      if (
        Array.isArray(form.propertydocuments) &&
        form.propertydocuments.length > 0
      ) {
        form.propertydocuments.forEach((doc, index) => {
          const docUri = doc.uri || doc;
          const filename = doc.name || docUri.split('/').pop();

          // Detect mime type
          let type = 'application/octet-stream';
          const match = /\.(\w+)$/.exec(filename);
          if (match) {
            const ext = match[1].toLowerCase();
            if (ext === 'pdf') type = 'application/pdf';
            else if (ext === 'doc') type = 'application/msword';
            else if (ext === 'docx')
              type =
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            else if (['jpg', 'jpeg', 'png'].includes(ext))
              type = `image/${ext}`;
          }

          formData.append('property_documents[]', {
            uri: docUri,
            name: filename || `doc_${index}.pdf`,
            type: type,
          });
        });
      } else {
        formData.append('property_documents[]', '');
      }

      // console.log('=========== FORM DATA CONTENT ===========');
      // if (formData._parts) {
      //   formData._parts.forEach((item, index) => {
      //     console.log(index, item[0], item[1]);
      //   });
      // }
      // console.log('========================================');

      // ---------- API CALL ----------
      const res = await _post('/addinventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success == 1) {
        Alert.alert('Success', 'Inventory Added Successfully!');
        setForm(initialFormState);
        setCurrentStep(0);
        navigation.navigate('Resale');
      } else {
        Alert.alert('Error', res?.data?.message || 'Something went wrong!');
      }
    } catch (error) {
      console.log('Error message:', error?.message);
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Failed to add inventory',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderFieldsForStep = () => {
    const keys = stepsMeta[currentStep].fields;
    return (
      <View style={styles.fieldsWrap}>
        {keys.map(key =>
          renderField(
            key,
            form,
            updateField,
            errors,
            states, // ✅ Yahan pass karo
            cities, // ✅ Yahan pass karo
            localities, // ✅ Yahan pass karo
            projects,
          ),
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Progress Bar */}
        <View style={styles.header}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[styles.progressFill, {width: progressInterpolate}]}
            />
          </View>

          {/* Steps */}
          <View style={styles.stepsRow}>
            {stepsMeta.map((s, idx) => {
              const isActive = idx <= currentStep;
              return (
                <View key={s.key} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      isActive
                        ? styles.stepCircleActive
                        : styles.stepCircleInactive,
                    ]}>
                    <Text
                      style={[
                        styles.stepNum,
                        isActive && styles.stepNumActive,
                      ]}>
                      {idx + 1}
                    </Text>
                  </View>
                  <Text style={styles.stepLabel}>{s.title}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Form */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>
            {stepsMeta[currentStep].title}
          </Text>

          {renderFieldsForStep()}

          {/* Buttons */}
          <View style={styles.actionsRow}>
            <CustomButton
              title="Back"
              onPress={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              style={styles.backButton}
              textStyle={{color: currentStep === 0 ? '#999' : '#fff'}}
            />
            {isSubmitting && currentStep === totalSteps - 1 ? (
              <View style={[styles.nextButton, styles.loadingButton]}>
                <ActivityIndicator
                  color="#fff"
                  size="small"
                  style={{marginRight: 8}}
                />
                <Text style={styles.loadingButtonText}>Submitting...</Text>
              </View>
            ) : (
              <CustomButton
                title={currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
                onPress={handleNext}
                style={styles.nextButton}
                disabled={isSubmitting}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  loadingButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5a67d8', // Same as your nextButton color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loadingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#2196F3',
  },
  stepCircleInactive: {
    backgroundColor: '#e0e0e0',
  },
  stepNum: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  stepNumActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  fieldsWrap: {
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#757575',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
});
