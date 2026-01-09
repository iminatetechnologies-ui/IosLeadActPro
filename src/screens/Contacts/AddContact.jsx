// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   StatusBar,
//   Modal,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import CustomDropdown from '../../components/CustomDropDown';
// import CustomTextInput from '../../components/CustomInput';
// import CustomButton from '../../components/CustomButton';
// import {_get, _post} from '../../api/apiClient';
// import {getUserType} from '../../utils/getUserType';
// import {useRoute} from '@react-navigation/native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {useLocationService} from '../../utils/useLocationService';

// const AddContact = ({navigation}) => {
//   const route = useRoute();

//   const {states, cities, localities, loading, loadCities, loadLocalities} =
//     useLocationService();

//   // Essential state variables only
//   const [isLoading, setIsLoading] = useState(false);
//   const [name, setName] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [alternateNumber, setAlternateNumber] = useState('');

//   const [email, setEmail] = useState('');
//   const [budget, setBudget] = useState([]);
//   const [project, setProject] = useState([]);
//   const [sources, setSources] = useState([]);
//   const [leadStatus, setLeadStatus] = useState([]);
//   const [usertype, setUsertype] = useState(null);

//   // Property related states
//   const [requirement, setRequirementType] = useState('');
//   const [propertyStages, setPropertyStages] = useState('');
//   const [propertyTypes, setPropertyTypes] = useState('');
//   // const [propertyLocation, setPropertyLocation] = useState('');
//   const [leadSource, setLeadSource] = useState('');
//   const [leadType, setLeadType] = useState('');
//   const [propertyBudget, setPropertyBudget] = useState('');
//   const [propertyProject, setPropertyProject] = useState('');

//   // ✅ Form errors + success
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   // 🆕 Modal states
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [newSourceName, setNewSourceName] = useState('');
//   const [isAddingSource, setIsAddingSource] = useState(false);
//   const [modalError, setModalError] = useState('');
//   const [modalSuccess, setModalSuccess] = useState('');

//   // 🆕 Project Modal states
//   const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
//   const [newProjectTitle, setNewProjectTitle] = useState(''); // Title input
//   const [newProjectCategory, setNewProjectCategory] = useState(null); // category_id
//   const [newProjectStatus, setNewProjectStatus] = useState(null); // status
//   const [isAddingProject, setIsAddingProject] = useState(false);
//   const [projectModalError, setProjectModalError] = useState('');
//   const [projectModalSuccess, setProjectModalSuccess] = useState('');

//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedLocality, setSelectedLocality] = useState(null);

//   // ✅ Clear error function
//   const clearError = field => {
//     setErrors(prev => ({...prev, [field]: null}));
//   };

//   // ✅ Handle state selection - SIMPLE VERSION
//   const handleStateSelect = item => {
//     console.log('🗺️ State selected:', item);
//     setSelectedState(item);
//     setSelectedCity(null);
//     setSelectedLocality(null);
//     clearError('state');

//     // ✅ DIRECTLY CALL loadCities
//     loadCities(item.value);
//   };

//   // ✅ Handle city selection - SIMPLE VERSION
//   const handleCitySelect = item => {
//     console.log('🏙️ City selected:', item);
//     setSelectedCity(item);
//     setSelectedLocality(null);
//     clearError('city');

//     // ✅ DIRECTLY CALL loadLocalities
//     loadLocalities(item.value);
//   };

//   // ✅ Handle locality selection
//   const handleLocalitySelect = item => {
//     console.log('📍 Locality selected:', item);
//     setSelectedLocality(item);
//     clearError('locality');
//   };

//   // ✅ Debugging useEffect - REMOVE LATER

//   // Static dropdown data
//   const dropdownData = [
//     {label: 'New Project', value: 1},
//     {label: 'Rental', value: 2},
//     {label: 'Resale', value: 3},
//   ];

//   const leadTypeOptions = [
//     {label: 'Lead', value: 1},
//     {label: 'Data', value: 2},
//   ];

//   const propertyType = [
//     {label: 'Residential', value: 1},
//     {label: 'Commercial', value: 2},
//     {label: 'Industrial', value: 3},
//   ];

//   const propertyStage = [
//     {label: 'Under Construction', value: 1},
//     {label: 'Ready To Move', value: 2},
//     {label: 'Pre Launch', value: 3},
//   ];

//   // Email validation helper
//   const validateEmail = email => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   // Mobile validation helper
//   const validateMobile = mobile => {
//     const mobileRegex = /^[0-9]{10}$/;
//     return mobileRegex.test(mobile);
//   };

//   useEffect(() => {
//     if (route.params?.mobile) {
//       setMobileNumber(route.params.mobile);
//     }
//     if (route.params?.name) {
//       setName(route.params.name);
//     }
//   }, [route.params]);

//   // Get user type
//   useEffect(() => {
//     (async () => {
//       const type = await getUserType();
//       setUsertype(type);
//     })();
//   }, []);

//   // 🆕 Fetch sources function (can be called separately)
//   const fetchSources = async () => {
//     try {
//       const response = await _get('/getresources');
//       if (response.status === 200 && response.data.data.leadsources) {
//         const sourceOptions = response.data.data.leadsources.map(item => ({
//           label: item.name,
//           id: item.id,
//           value: item.id,
//         }));
//         setSources(sourceOptions);
//       } else {
//         console.log('jnfeje=evrgt');
//       }
//     } catch (error) {
//       console.error('Error fetching sources:', error);
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       const response = await _get('/getresources');
//       if (response.status === 200 && response.data.data.project) {
//         const projectOptions = response.data.data.project.map(item => ({
//           label: item.title,
//           id: item.id,
//           value: item.id,
//         }));
//         setProject(projectOptions);
//       }
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   // Single useEffect for fetching data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await _get('/getresources');
//         console.log('API Response:', response.data.data);

//         if (response.status === 200) {
//           const responseData = response.data.data;

//           // Process project data
//           if (responseData.project) {
//             const projectOptions = responseData.project.map(item => ({
//               label: item.title,
//               id: item.id,
//               value: item.id,
//             }));
//             setProject(projectOptions);
//           }

//           // Process budget data
//           if (responseData.budget) {
//             const budgetOptions = responseData.budget.map(item => ({
//               label: item.name,
//               id: item.id,
//               value: item.id,
//             }));
//             setBudget(budgetOptions);
//           }

//           // Process lead sources data
//           if (responseData.leadsources) {
//             const sourceOptions = responseData.leadsources.map(item => ({
//               label: item.name,
//               id: item.id,
//               value: item.id,
//             }));
//             setSources(sourceOptions);
//           }

//           // Process lead status data
//           if (responseData.lead_status) {
//             const statusOptions = responseData.lead_status.map(item => ({
//               label: item.name,
//               id: item.id,
//               value: item.id,
//             }));
//             setLeadStatus(statusOptions);
//           }
//         } else {
//           setErrors({api: response.data.message || 'Failed to fetch data'});
//         }
//       } catch (error) {
//         console.error('API Error:', error);
//         setErrors({api: 'Something went wrong, please try again'});
//       }
//     };

//     fetchData();
//   }, []);

//   // 🆕 Handle Add Source
//   const handleAddSource = async () => {
//     setModalError('');
//     setModalSuccess('');

//     if (!newSourceName.trim()) {
//       setModalError('Source name is required');
//       return;
//     }

//     setIsAddingSource(true);

//     try {
//       const response = await _post(
//         '/addsource',
//         JSON.stringify({name: newSourceName.trim()}),
//       );
//       // console.log('---------------',response)

//       if (response.status === 201) {
//         setModalSuccess('Source added successfully');
//         setNewSourceName('');
//         setIsModalVisible(false);
//         setModalSuccess('');
//         // Refresh sources list
//         await fetchSources();

//         // Close modal after 1 second
//       } else {
//         setModalError(response.data?.message || 'Failed to add source');
//       }
//     } catch (error) {
//       console.error('Add Source Error:', error);
//       setModalError('Something went wrong, please try again');
//     } finally {
//       setIsAddingSource(false);
//     }
//   };

//   // 🆕 Close modal and reset
//   const closeModal = () => {
//     setIsModalVisible(false);
//     setNewSourceName('');
//     setModalError('');
//     setModalSuccess('');
//   };
//   const handleAddProject = async () => {
//     setProjectModalError('');
//     setProjectModalSuccess('');

//     // Validation
//     if (!newProjectTitle.trim()) {
//       setProjectModalError('Project title is required');
//       return;
//     }
//     if (!newProjectCategory) {
//       setProjectModalError('Please select a category');
//       return;
//     }
//     if (!newProjectStatus) {
//       setProjectModalError('Please select a status');
//       return;
//     }

//     const payload = {
//       title: newProjectTitle.trim(),
//       category_id: newProjectCategory,
//       status: newProjectStatus,
//     };

//     console.log('Add Project Payload:', payload); // ✅ Log payload

//     setIsAddingProject(true);

//     try {
//       const response = await _post('/addproject', JSON.stringify(payload));

//       if (response.status === 201) {
//         setProjectModalSuccess('Project added successfully');
//         setNewProjectTitle('');
//         setNewProjectCategory(null);
//         setNewProjectStatus(null);
//         setIsProjectModalVisible(false);
//         await fetchProjects(); // refresh dropdown
//       } else {
//         setProjectModalError(response.data?.message || 'Failed to add project');
//       }
//     } catch (error) {
//       console.error('Add Project Error:', error);
//       setProjectModalError('Something went wrong, please try again');
//     } finally {
//       setIsAddingProject(false);
//     }
//   };

//   const closeProjectModal = () => {
//     setIsProjectModalVisible(false);
//     setNewProjectTitle('');
//     setProjectModalError('');
//     setProjectModalSuccess('');
//   };

//   const handleSubmit = async () => {
//     let newErrors = {};
//     setSuccessMessage('');

//     // Validation with proper error messages
//     if (!requirement)
//       newErrors.requirement = 'Please select the requirement type';
//     if (!name.trim()) newErrors.name = 'Name is required';
//     if (!mobileNumber.trim()) {
//       newErrors.mobileNumber = 'Mobile number is required';
//     } else if (!validateMobile(mobileNumber)) {
//       newErrors.mobileNumber = 'Please enter a valid mobile number (10 digits)';
//     }
//     if (email && !validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
//     if (!leadType) newErrors.leadType = 'Please select the lead type';
//     if (!leadSource) newErrors.leadSource = 'Please select the lead source';
//     // if (!propertyTypes)
//     //   newErrors.propertyTypes = 'Please select the property type';

//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     setIsLoading(true);

//     const data = {
//       name: name,
//       email: email,
//       mobile: mobileNumber,
//       lead_type: leadType,
//       requirement_type: requirement,
//       alternative_no: alternateNumber,
//       project_id: propertyProject,
//       property_stage: propertyStages,
//       property_type: propertyTypes,
//       property_sub_type: '2',
//       budget: propertyBudget,
//       lead_stage: propertyStages,
//       lead_source: leadSource,
//       state: selectedState?.value, // State ID
//       city: selectedCity?.value, // City ID
//       locality: selectedLocality?.value, // Locality ID
//     };

//     try {
//       const response = await _post('/lead/create', JSON.stringify(data));
//       console.log('---ok------', response);
//       if (response.status === 200) {
//         setSuccessMessage('Lead has been created successfully');
//         setErrors({});
//         setTimeout(() => {
//           navigation.goBack();
//         }, 1500);
//       } else {
//         setErrors({api: response.data?.message || 'Failed to create lead'});
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       setErrors({api: 'Something went wrong, please try again'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.title}>REQUIREMENT TYPE*</Text>
//         <CustomDropdown
//           data={dropdownData}
//           onSelect={item => {
//             setRequirementType(item.value);
//             clearError('requirement');
//           }}
//           placeholder="Choose an option"
//           error={errors.requirement}
//         />
//         {errors.requirement && (
//           <Text style={styles.errorText}>{errors.requirement}</Text>
//         )}

//         <Text style={styles.title}>FIRST NAME*</Text>
//         <CustomTextInput
//           iconName="person"
//           placeholder="First Name"
//           value={name}
//           onChangeText={text => {
//             setName(text);
//             clearError('name');
//           }}
//           error={errors.name}
//         />
//         {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

//         <Text style={styles.title}>CONTACT NUMBER*</Text>
//         <CustomTextInput
//           iconName="phone"
//           placeholder="Enter your mobile number"
//           keyboardType="phone-pad"
//           value={mobileNumber}
//           maxLength={10}
//           onChangeText={text => {
//             setMobileNumber(text);
//             clearError('mobileNumber');
//           }}
//           error={errors.mobileNumber}
//         />
//         {errors.mobileNumber && (
//           <Text style={styles.errorText}>{errors.mobileNumber}</Text>
//         )}

//         <Text style={styles.title}>ALTERNATE NUMBER</Text>
//         <CustomTextInput
//           iconName="phone"
//           placeholder="Alternate mobile number"
//           keyboardType="phone-pad"
//           value={alternateNumber}
//           maxLength={10}
//           onChangeText={text => {
//             setAlternateNumber(text);
//             clearError('alternateNumber');
//           }}
//           error={errors.alternateNumber}
//         />
//         {errors.alternateNumber && (
//           <Text style={styles.errorText}>{errors.alternateNumber}</Text>
//         )}

//         <Text style={styles.title}>EMAIL</Text>
//         <CustomTextInput
//           iconName="email"
//           placeholder="Enter your email"
//           value={email}
//           onChangeText={text => {
//             setEmail(text);
//             clearError('email');
//           }}
//           error={errors.email}
//         />
//         {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

//         <Text style={styles.title}>PROPERTY TYPE*</Text>
//         <CustomDropdown
//           data={propertyType}
//           onSelect={item => {
//             setPropertyTypes(item.value);
//             clearError('propertyTypes');
//           }}
//           placeholder="Choose an option"
//           error={errors.propertyTypes}
//         />
//         {errors.propertyTypes && (
//           <Text style={styles.errorText}>{errors.propertyTypes}</Text>
//         )}

//         <Text style={styles.title}>PROPERTY STAGE</Text>
//         <CustomDropdown
//           data={propertyStage}
//           onSelect={item => {
//             setPropertyStages(item.value);
//             clearError('propertyStages');
//           }}
//           placeholder="Choose an option"
//           error={errors.propertyStages}
//         />
//         {errors.propertyStages && (
//           <Text style={styles.errorText}>{errors.propertyStages}</Text>
//         )}

//         <Text style={styles.title}>BUDGET</Text>
//         <CustomDropdown
//           data={budget}
//           onSelect={item => {
//             setPropertyBudget(item.id);
//             clearError('propertyBudget');
//           }}
//           placeholder="Choose an option"
//           error={errors.propertyBudget}
//         />
//         {errors.propertyBudget && (
//           <Text style={styles.errorText}>{errors.propertyBudget}</Text>
//         )}

//         {/* <Text style={styles.title}>LOCATION</Text>
//         <CustomDropdown
//           data={location}
//           onSelect={item => {
//             setPropertyLocation(item.value);
//             clearError('propertyLocation');
//           }}
//           placeholder="Choose an option"
//           error={errors.propertyLocation}
//         />
//         {errors.propertyLocation && (
//           <Text style={styles.errorText}>{errors.propertyLocation}</Text>
//         )} */}

//         <Text style={styles.title}>LEAD TYPE*</Text>
//         <CustomDropdown
//           data={leadTypeOptions}
//           onSelect={item => {
//             setLeadType(item.value);
//             clearError('leadType');
//           }}
//           placeholder="Choose an option"
//           error={errors.leadType}
//         />
//         {errors.leadType && (
//           <Text style={styles.errorText}>{errors.leadType}</Text>
//         )}

//         {/* 🆕 Sources Section with Add Button */}
//         <View style={styles.sourceHeader}>
//           <Text style={styles.title}>SOURCES*</Text>
//           {usertype === 'company' && (
//             <TouchableOpacity
//               style={styles.addSourceButton}
//               onPress={() => setIsModalVisible(true)}>
//               <Text style={styles.addSourceButtonText}>➕</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <CustomDropdown
//           data={sources}
//           onSelect={item => {
//             setLeadSource(item.value);
//             clearError('leadSource');
//           }}
//           placeholder="Choose an option"
//           error={errors.leadSource}
//         />
//         {errors.leadSource && (
//           <Text style={styles.errorText}>{errors.leadSource}</Text>
//         )}

//         <View style={styles.sourceHeader}>
//           <Text style={styles.title}>PROJECTS</Text>
//           {usertype === 'company' && (
//             <TouchableOpacity
//               style={styles.addSourceButton}
//               onPress={() => setIsProjectModalVisible(true)}>
//               <Text style={styles.addSourceButtonText}>➕</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <CustomDropdown
//           data={project}
//           onSelect={item => {
//             setPropertyProject(item.value);
//             clearError('propertyProject');
//           }}
//           placeholder="Choose an option"
//           error={errors.propertyProject}
//         />
//         {errors.propertyProject && (
//           <Text style={styles.errorText}>{errors.propertyProject}</Text>
//         )}

//         {/* ✅ NEW: State, City, Locality Dropdowns */}
//         <Text style={styles.title}>STATE</Text>
//         <CustomDropdown
//           data={states}
//           onSelect={handleStateSelect}
//           placeholder={loading.states ? 'Loading states...' : 'Select State'}
//           value={selectedState}
//           disabled={loading.states}
//           error={errors.state}
//         />
//         {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

//         <Text style={styles.title}>CITY</Text>
//         <CustomDropdown
//           data={cities}
//           onSelect={handleCitySelect}
//           placeholder={
//             !selectedState
//               ? 'Select state first'
//               : loading.cities
//               ? 'Loading cities...'
//               : 'Select City'
//           }
//           value={selectedCity}
//           disabled={!selectedState || loading.cities}
//           error={errors.city}
//         />
//         {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

//         <Text style={styles.title}>LOCALITY</Text>
//         <CustomDropdown
//           data={localities}
//           onSelect={handleLocalitySelect}
//           placeholder={
//             !selectedCity
//               ? 'Select city first'
//               : loading.localities
//               ? 'Loading localities...'
//               : 'Select Locality'
//           }
//           value={selectedLocality}
//           disabled={!selectedCity || loading.localities}
//           error={errors.locality}
//         />
//         {errors.locality && (
//           <Text style={styles.errorText}>{errors.locality}</Text>
//         )}

//         {/* <Text style={styles.title}>CITY</Text>
//         <CustomTextInput
//           iconName="house"
//           placeholder="City"
//           value={city}
//           onChangeText={text => {
//             setCity(text);
//             clearError('city');
//           }}
//           error={errors.city}
//         />
//         {errors.city && <Text style={styles.errorText}>{errors.city}</Text>} */}

//         {successMessage && (
//           <Text style={styles.successText}>{successMessage}</Text>
//         )}

//         {errors.api && <Text style={styles.apiErrorText}>{errors.api}</Text>}
//       </ScrollView>

//       {/* Footer Submit Button */}
//       <View style={styles.footer}>
//         <CustomButton
//           title={isLoading ? 'Submitting...' : 'Submit'}
//           isLoading={isLoading}
//           disabled={isLoading}
//           textStyle={{fontSize: 18}}
//           onPress={handleSubmit}
//         />
//       </View>

//       {/* 🆕 Add Source Modal */}
//       <Modal
//         visible={isModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeModal}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add New Source</Text>
//               <TouchableOpacity onPress={closeModal}>
//                 <Text style={styles.closeButton}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <CustomTextInput
//               iconName="add-circle-outline"
//               placeholder="Enter source name"
//               value={newSourceName}
//               onChangeText={text => {
//                 setNewSourceName(text);
//                 setModalError('');
//               }}
//               error={modalError}
//             />

//             {modalError && (
//               <Text style={styles.modalErrorText}>{modalError}</Text>
//             )}

//             {modalSuccess && (
//               <Text style={styles.modalSuccessText}>{modalSuccess}</Text>
//             )}

//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={closeModal}
//                 disabled={isAddingSource}>
//                 <Text style={styles.modalCancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.modalAddButton,
//                   isAddingSource && styles.modalAddButtonDisabled,
//                 ]}
//                 onPress={handleAddSource}
//                 disabled={isAddingSource}>
//                 {isAddingSource ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.modalAddButtonText}>Add Source</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modal
//         visible={isProjectModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeProjectModal}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add New Project</Text>
//               <TouchableOpacity onPress={closeProjectModal}>
//                 <Text style={styles.closeButton}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Project Title */}
//             <CustomTextInput
//               iconName="add-circle-outline"
//               placeholder="Enter project title"
//               value={newProjectTitle}
//               onChangeText={text => {
//                 setNewProjectTitle(text);
//                 setProjectModalError('');
//               }}
//               error={projectModalError}
//             />

//             {/* Category Dropdown */}
//             <Text style={{marginTop: 10, marginLeft: 5}}>Category*</Text>
//             <CustomDropdown
//               data={propertyType} // propertyType = category options
//               onSelect={item => setNewProjectCategory(item.value)}
//               placeholder="Select Category"
//             />

//             {/* Status Dropdown */}
//             <Text style={{marginTop: 10, marginLeft: 5}}>Status*</Text>
//             <CustomDropdown
//               data={propertyStage} // propertyStage = status options
//               onSelect={item => setNewProjectStatus(item.value)}
//               placeholder="Select Status"
//             />

//             {projectModalError && (
//               <Text style={styles.modalErrorText}>{projectModalError}</Text>
//             )}

//             {projectModalSuccess && (
//               <Text style={styles.modalSuccessText}>{projectModalSuccess}</Text>
//             )}

//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={closeProjectModal}
//                 disabled={isAddingProject}>
//                 <Text style={styles.modalCancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.modalAddButton,
//                   isAddingProject && styles.modalAddButtonDisabled,
//                 ]}
//                 onPress={handleAddProject}
//                 disabled={isAddingProject}>
//                 {isAddingProject ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.modalAddButtonText}>Add Project</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     paddingHorizontal: 20,
//     marginTop: 16,
//   },
//   scrollContent: {
//     padding: 5,
//     paddingBottom: 20,
//   },
//   footer: {
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   errorText: {
//     color: '#e74c3c',
//     fontSize: hp('1.3%'),
//     marginTop: 4,
//     marginLeft: 20,
//     fontWeight: '500',
//   },
//   apiErrorText: {
//     color: '#e74c3c',
//     fontSize: wp('3.5%'),
//     textAlign: 'center',
//     marginTop: 16,
//     marginHorizontal: 20,
//     padding: 12,
//     backgroundColor: '#ffeaea',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#f5c6cb',
//   },
//   successText: {
//     color: '#27ae60',
//     fontSize: wp('3.5%'),
//     textAlign: 'center',
//     marginTop: 16,
//     marginHorizontal: 20,
//     padding: 12,
//     backgroundColor: '#eafaf1',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#c3e6cb',
//     fontWeight: '500',
//   },
//   // 🆕 Source Header Styles
//   sourceHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 0,
//     marginTop: 0,
//   },
//   addSourceButton: {
//     // backgroundColor: '#3498db',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     marginRight: 15,
//   },
//   addSourceButtonText: {
//     color: '#ffffff',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   // 🆕 Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     width: wp('85%'),
//     maxWidth: 400,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   closeButton: {
//     fontSize: 24,
//     color: '#7f8c8d',
//     fontWeight: 'bold',
//   },
//   modalErrorText: {
//     color: '#e74c3c',
//     fontSize: 13,
//     marginTop: 8,
//     marginLeft: 4,
//   },
//   modalSuccessText: {
//     color: '#27ae60',
//     fontSize: 14,
//     marginTop: 12,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   modalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     gap: 10,
//   },
//   modalCancelButton: {
//     flex: 1,
//     backgroundColor: '#ecf0f1',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   modalCancelButtonText: {
//     color: '#2c3e50',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalAddButton: {
//     flex: 1,
//     backgroundColor: '#0389ca',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   modalAddButtonDisabled: {
//     backgroundColor: '#95a5a6',
//   },
//   modalAddButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default AddContact;

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomDropdown from '../../components/CustomDropDown';
import CustomTextInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {_get, _post} from '../../api/apiClient';
import {getUserType} from '../../utils/getUserType';
import {useRoute} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useLocationService} from '../../hooks/useLocationService';
import {useResources} from '../../hooks/useResources';

const AddContact = ({navigation}) => {
  const route = useRoute();

  const {states, cities, localities, loading, loadCities, loadLocalities} =
    useLocationService();

  // Essential state variables only
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');

  const [email, setEmail] = useState('');
  const [usertype, setUsertype] = useState(null);

  // Property related states
  const [requirement, setRequirementType] = useState('');
  const [propertyStages, setPropertyStages] = useState('');
  const [propertyTypes, setPropertyTypes] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [leadType, setLeadType] = useState('');
  const [propertyBudget, setPropertyBudget] = useState('');
  const [propertyProject, setPropertyProject] = useState('');

  // ✅ Form errors + success
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // 🆕 Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // 🆕 Project Modal states
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState(''); // Title input
  const [newProjectCategory, setNewProjectCategory] = useState(null); // category_id
  const [newProjectStatus, setNewProjectStatus] = useState(null); // status
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectModalError, setProjectModalError] = useState('');
  const [projectModalSuccess, setProjectModalSuccess] = useState('');

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

  // ✅ Clear error function
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

  // ✅ Debugging useEffect - REMOVE LATER

  // Static dropdown data
  const dropdownData = [
    {label: 'New Project', value: 1},
    {label: 'Rental', value: 2},
    {label: 'Resale', value: 3},
  ];

  const leadTypeOptions = [
    {label: 'Lead', value: 1},
    {label: 'Data', value: 2},
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

  // Email validation helper
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mobile validation helper
  const validateMobile = mobile => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  useEffect(() => {
    if (route.params?.mobile) {
      setMobileNumber(route.params.mobile);
    }
    if (route.params?.name) {
      setName(route.params.name);
    }
  }, [route.params]);

  // Get user type
  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  // 🆕 Handle Add Source
  const handleAddSource = async () => {
    setModalError('');
    setModalSuccess('');

    if (!newSourceName.trim()) {
      setModalError('Source name is required');
      return;
    }

    setIsAddingSource(true);

    try {
      const response = await _post(
        '/addsource',
        JSON.stringify({name: newSourceName.trim()}),
      );
      // console.log('---------------',response)

      if (response.status === 201) {
        setModalSuccess('Source added successfully');
        setNewSourceName('');
        setIsModalVisible(false);
        setModalSuccess('');
        // Refresh sources list
        await fetchResources();

        // Close modal after 1 second
      } else {
        setModalError(response.data?.message || 'Failed to add source');
      }
    } catch (error) {
      console.error('Add Source Error:', error);
      setModalError('Something went wrong, please try again');
    } finally {
      setIsAddingSource(false);
    }
  };

  // 🆕 Close modal and reset
  const closeModal = () => {
    setIsModalVisible(false);
    setNewSourceName('');
    setModalError('');
    setModalSuccess('');
  };
  const handleAddProject = async () => {
    setProjectModalError('');
    setProjectModalSuccess('');

    // Validation
    if (!newProjectTitle.trim()) {
      setProjectModalError('Project title is required');
      return;
    }
    if (!newProjectCategory) {
      setProjectModalError('Please select a category');
      return;
    }
    if (!newProjectStatus) {
      setProjectModalError('Please select a status');
      return;
    }

    const payload = {
      title: newProjectTitle.trim(),
      category_id: newProjectCategory,
      status: newProjectStatus,
    };

    console.log('Add Project Payload:', payload); // ✅ Log payload

    setIsAddingProject(true);

    try {
      const response = await _post('/addproject', JSON.stringify(payload));

      if (response.status === 201) {
        setProjectModalSuccess('Project added successfully');
        setNewProjectTitle('');
        setNewProjectCategory(null);
        setNewProjectStatus(null);
        setIsProjectModalVisible(false);
        await fetchResources(); // refresh dropdown
      } else {
        setProjectModalError(response.data?.message || 'Failed to add project');
      }
    } catch (error) {
      console.error('Add Project Error:', error);
      setProjectModalError('Something went wrong, please try again');
    } finally {
      setIsAddingProject(false);
    }
  };

  const closeProjectModal = () => {
    setIsProjectModalVisible(false);
    setNewProjectTitle('');
    setProjectModalError('');
    setProjectModalSuccess('');
  };

  const handleSubmit = async () => {
    let newErrors = {};
    setSuccessMessage('');

    // Validation with proper error messages
    if (!requirement)
      newErrors.requirement = 'Please select the requirement type';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobile(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number (10 digits)';
    }
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!leadType) newErrors.leadType = 'Please select the lead type';
    if (!leadSource) newErrors.leadSource = 'Please select the lead source';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    const data = {
      name: name,
      email: email,
      mobile: mobileNumber,
      lead_type: leadType,
      requirement_type: requirement,
      alternative_no: alternateNumber,
      project_id: propertyProject,
      property_stage: propertyStages,
      property_type: propertyTypes,
      property_sub_type: '2',
      budget: propertyBudget,
      lead_stage: propertyStages,
      lead_source: leadSource,
      state: selectedState?.value, // State ID
      city: selectedCity?.value, // City ID
      locality: selectedLocality?.value, // Locality ID
    };

    try {
      const response = await _post('/lead/create', JSON.stringify(data));
      // console.log('---ok------', response);
      if (response.status === 200) {
        setSuccessMessage('Lead has been created successfully');
        setErrors({});
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        setErrors({api: response.data?.message || 'Failed to create lead'});
      }
    } catch (error) {
      console.error('API Error:', error);
      setErrors({api: 'Something went wrong, please try again'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>REQUIREMENT TYPE*</Text>
        <CustomDropdown
          data={dropdownData}
          onSelect={item => {
            setRequirementType(item.value);
            clearError('requirement');
          }}
          placeholder="Choose an option"
          error={errors.requirement}
        />
        {errors.requirement && (
          <Text style={styles.errorText}>{errors.requirement}</Text>
        )}

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
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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
        {errors.mobileNumber && (
          <Text style={styles.errorText}>{errors.mobileNumber}</Text>
        )}

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
          error={errors.alternateNumber}
        />
        {errors.alternateNumber && (
          <Text style={styles.errorText}>{errors.alternateNumber}</Text>
        )}

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
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={styles.title}>PROPERTY TYPE*</Text>
        <CustomDropdown
          data={propertyType}
          onSelect={item => {
            setPropertyTypes(item.value);
            clearError('propertyTypes');
          }}
          placeholder="Choose an option"
          error={errors.propertyTypes}
        />
        {errors.propertyTypes && (
          <Text style={styles.errorText}>{errors.propertyTypes}</Text>
        )}

        <Text style={styles.title}>PROPERTY STAGE</Text>
        <CustomDropdown
          data={propertyStage}
          onSelect={item => {
            setPropertyStages(item.value);
            clearError('propertyStages');
          }}
          placeholder="Choose an option"
          error={errors.propertyStages}
        />
        {errors.propertyStages && (
          <Text style={styles.errorText}>{errors.propertyStages}</Text>
        )}

        <Text style={styles.title}>BUDGET</Text>
        <CustomDropdown
          data={budget}
          onSelect={item => {
            setPropertyBudget(item.id);
            clearError('propertyBudget');
          }}
          placeholder="Choose an option"
          error={errors.propertyBudget}
        />
        {errors.propertyBudget && (
          <Text style={styles.errorText}>{errors.propertyBudget}</Text>
        )}

        <Text style={styles.title}>LEAD TYPE*</Text>
        <CustomDropdown
          data={leadTypeOptions}
          onSelect={item => {
            setLeadType(item.value);
            clearError('leadType');
          }}
          placeholder="Choose an option"
          error={errors.leadType}
        />
        {errors.leadType && (
          <Text style={styles.errorText}>{errors.leadType}</Text>
        )}

        {/* 🆕 Sources Section with Add Button */}
        <View style={styles.sourceHeader}>
          <Text style={styles.title}>SOURCES*</Text>
          {usertype === 'company' && (
            <TouchableOpacity
              style={styles.addSourceButton}
              onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addSourceButtonText}>➕</Text>
            </TouchableOpacity>
          )}
        </View>

        <CustomDropdown
          data={sources}
          onSelect={item => {
            setLeadSource(item.value);
            clearError('leadSource');
          }}
          placeholder="Choose an option"
          error={errors.leadSource}
        />
        {errors.leadSource && (
          <Text style={styles.errorText}>{errors.leadSource}</Text>
        )}

        <View style={styles.sourceHeader}>
          <Text style={styles.title}>PROJECTS</Text>
          {usertype === 'company' && (
            <TouchableOpacity
              style={styles.addSourceButton}
              onPress={() => setIsProjectModalVisible(true)}>
              <Text style={styles.addSourceButtonText}>➕</Text>
            </TouchableOpacity>
          )}
        </View>

        <CustomDropdown
          data={projects}
          onSelect={item => {
            setPropertyProject(item.value);
            clearError('propertyProject');
          }}
          placeholder="Choose an option"
          error={errors.propertyProject}
        />
        {errors.propertyProject && (
          <Text style={styles.errorText}>{errors.propertyProject}</Text>
        )}

        {/* ✅ NEW: State, City, Locality Dropdowns */}
        <Text style={styles.title}>STATE</Text>
        <CustomDropdown
          data={states}
          onSelect={handleStateSelect}
          placeholder={loading.states ? 'Loading states...' : 'Select State'}
          value={selectedState}
          disabled={loading.states}
          error={errors.state}
        />
        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

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
          disabled={!selectedState || loading.cities}
          error={errors.city}
        />
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

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
          disabled={!selectedCity || loading.localities}
          error={errors.locality}
        />
        {errors.locality && (
          <Text style={styles.errorText}>{errors.locality}</Text>
        )}

        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}

        {errors.api && <Text style={styles.apiErrorText}>{errors.api}</Text>}
      </ScrollView>

      {/* Footer Submit Button */}
      <View style={styles.footer}>
        <CustomButton
          title={isLoading ? 'Submitting...' : 'Submit'}
          isLoading={isLoading}
          disabled={isLoading}
          textStyle={{fontSize: 18}}
          onPress={handleSubmit}
        />
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Source</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <CustomTextInput
              iconName="add-circle-outline"
              placeholder="Enter source name"
              value={newSourceName}
              onChangeText={text => {
                setNewSourceName(text);
                setModalError('');
              }}
              error={modalError}
            />

            {modalError && (
              <Text style={styles.modalErrorText}>{modalError}</Text>
            )}

            {modalSuccess && (
              <Text style={styles.modalSuccessText}>{modalSuccess}</Text>
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeModal}
                disabled={isAddingSource}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalAddButton,
                  isAddingSource && styles.modalAddButtonDisabled,
                ]}
                onPress={handleAddSource}
                disabled={isAddingSource}>
                {isAddingSource ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalAddButtonText}>Add Source</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isProjectModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeProjectModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Project</Text>
              <TouchableOpacity onPress={closeProjectModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Project Title */}
            <CustomTextInput
              iconName="add-circle-outline"
              placeholder="Enter project title"
              value={newProjectTitle}
              onChangeText={text => {
                setNewProjectTitle(text);
                setProjectModalError('');
              }}
              error={projectModalError}
            />

            {/* Category Dropdown */}
            <Text style={{marginTop: 10, marginLeft: 5}}>Category*</Text>
            <CustomDropdown
              data={propertyType} // propertyType = category options
              onSelect={item => setNewProjectCategory(item.value)}
              placeholder="Select Category"
            />

            {/* Status Dropdown */}
            <Text style={{marginTop: 10, marginLeft: 5}}>Status*</Text>
            <CustomDropdown
              data={propertyStage} // propertyStage = status options
              onSelect={item => setNewProjectStatus(item.value)}
              placeholder="Select Status"
            />

            {projectModalError && (
              <Text style={styles.modalErrorText}>{projectModalError}</Text>
            )}

            {projectModalSuccess && (
              <Text style={styles.modalSuccessText}>{projectModalSuccess}</Text>
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeProjectModal}
                disabled={isAddingProject}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalAddButton,
                  isAddingProject && styles.modalAddButtonDisabled,
                ]}
                onPress={handleAddProject}
                disabled={isAddingProject}>
                {isAddingProject ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalAddButtonText}>Add Project</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  // 🆕 Source Header Styles
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginTop: 0,
  },
  addSourceButton: {
    // backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 15,
  },
  addSourceButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  // 🆕 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: wp('85%'),
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    fontSize: 24,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  modalErrorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
  },
  modalSuccessText: {
    color: '#27ae60',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: '#0389ca',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalAddButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  modalAddButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddContact;
