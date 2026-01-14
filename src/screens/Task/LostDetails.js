// import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
// import React, {useState} from 'react';
// import CustomDropdown from './../../components/CustomDropDown';
// import CustomButton from './../../components/CustomButton';
// import TextareaWithIcon from './../../components/TextArea';
// import {_post} from '../../api/apiClient';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const LostDetails = ({navigation, route}) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const {item} = route.params;
//   const [notes, setNotes] = useState('');
//   const [substatus, setSubStatus] = useState('');

//   // ✅ form errors + success
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   const dropdownData = [
//     {label: 'Better Deal/Already Purchased', value: 4},
//     {label: 'Loan Issue', value: 5},
//     {label: 'Finance Concern', value: 6},
//     {label: 'Plan Postponed', value: 7},
//   ];

//   const handleSubmit = async () => {
//     let newErrors = {};
//     setSuccessMessage(''); // clear old success msg

//     if (!substatus) newErrors.substatus = 'Please select a reason';
//     if (!notes.trim()) newErrors.notes = 'Notes field is required';

//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return; // agar error hai to stop

//     const data = {
//       subsubstatus_id: substatus,
//       notes: notes,
//     };

//     setIsLoading(true);
//     try {
//       const response = await _post(`/lead/lostleads/save/${item?.id}`, data);
//       if (response.status === 200) {
//         setSuccessMessage('Lost Lead Updated Successfully');
//         setErrors({}); // clear old errors
//         setTimeout(() => {
//           navigation.goBack();
//         }, 700);
//       } else {
//         setErrors({api: response.data?.message || 'No data found.'});
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       setErrors({api: 'Something went wrong, please try again.'});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <StatusBar barStyle={'light-content'} />

//       <View style={styles.header}>
//         <Text style={styles.title}>LOST REASON</Text>
//         <CustomDropdown
//           data={dropdownData}
//           onSelect={item => {
//             setSubStatus(item?.value);
//             setErrors(prev => ({...prev, substatus: null}));
//           }}
//           placeholder="Choose an option"
//           error={errors.substatus}
//         />
//         {errors.substatus && (
//           <Text style={styles.errorText}>{errors.substatus}</Text>
//         )}

//         <Text style={styles.title}>NOTES</Text>
//         <TextareaWithIcon
//           value={notes}
//           onChangeText={text => {
//             setNotes(text);
//             setErrors(prev => ({...prev, notes: null}));
//           }}
//           error={errors.notes}
//         />
//         {errors.notes && <Text style={styles.errorText}>{errors.notes}</Text>}

//         {/* ✅ Success Message */}
//         {successMessage && (
//           <Text style={styles.successText}>{successMessage}</Text>
//         )}

//         {/* ✅ Global API Error */}
//         {errors.api && <Text style={styles.apiErrorText}>{errors.api}</Text>}

//         <View style={styles.buttonContainer}>
//           <CustomButton
//             title={isLoading ? 'Submitting...' : 'Submit'}
//             onPress={handleSubmit}
//             isLoading={isLoading}
//             disabled={isLoading}
//             textStyle={{fontSize: 18}}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     paddingTop: wp('4%'),
//   },
//   title: {
//     fontSize: wp('3.5%'),
//     fontWeight: '600',
//     paddingHorizontal: 15,
//     marginTop: 5,
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
//   buttonContainer: {
//     margin: 16,
//   },
// });

// export default LostDetails;

import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import AudioRecorder from '../Audio/AudioRecorder'; // import audio recorder
import {_post} from '../../api/apiClient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const LostDetails = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item} = route.params;
  const [notes, setNotes] = useState('');
  const [substatus, setSubStatus] = useState('');
  const [recordedFile, setRecordedFile] = useState(null); // audio file state

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const dropdownData = [
    {label: 'Better Deal/Already Purchased', value: 4},
    {label: 'Loan Issue', value: 5},
    {label: 'Finance Concern', value: 6},
    {label: 'Plan Postponed', value: 7},
  ];

  const handleSubmit = async () => {
    let newErrors = {};
    setSuccessMessage('');

    // Existing validations
    if (!substatus) newErrors.substatus = 'Please select a reason';

    // ------------------------------------
    // 🔥 IMPORTANT VALIDATION:
    // Notes OR Audio → koi ek required
    // ------------------------------------
    if (!notes.trim() && !recordedFile) {
      newErrors.main = 'Please add Notes or record Audio (one is required)';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // ------------------------------------
    // FORM DATA (multipart)
    // ------------------------------------
    const formData = new FormData();
    formData.append('subsubstatus_id', substatus);

    // Notes allow even empty when audio is there
    formData.append('notes', notes);

    // Audio add if exists
    if (recordedFile) {
      formData.append('audio_file', {
        uri: recordedFile.startsWith('file://')
          ? recordedFile
          : `file://${recordedFile}`,
        type: 'audio/wav',
        name: `lost_audio_${Date.now()}.wav`,
      });
    }

    setIsLoading(true);
    try {
      const response = await _post(
        `/lead/lostleads/save/${item?.id}`,
        formData,
        true, // multipart
      );

      console.log('///////----', response);

      if (response.status === 200) {
        setSuccessMessage('Lost Lead Updated Successfully');
        setErrors({});
        setTimeout(() => {
          navigation.goBack();
        }, 700);
      } else {
        setErrors({api: response.data?.message || 'No data found.'});
      }
    } catch (error) {
      console.error('API Error:', error);
      setErrors({api: 'Something went wrong, please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <Text style={styles.title}>LOST REASON</Text>
        <CustomDropdown
          data={dropdownData}
          onSelect={item => {
            setSubStatus(item?.value);
            setErrors(prev => ({...prev, substatus: null}));
          }}
          placeholder="Choose an option"
          error={errors.substatus}
        />
        {errors.substatus && (
          <Text style={styles.errorText}>{errors.substatus}</Text>
        )}

        <Text style={styles.title}>NOTES</Text>
        <TextareaWithIcon
          value={notes}
          onChangeText={text => {
            setNotes(text);
            setErrors(prev => ({...prev, notes: null}));
          }}
          error={errors.notes}
        />
        {errors.notes && <Text style={styles.errorText}>{errors.notes}</Text>}
        {errors.main && <Text style={styles.errorText}>{errors.main}</Text>}

        {/* ✅ Audio Section */}
        <Text style={styles.title}>AUDIO NOTE (OPTIONAL)</Text>
        <AudioRecorder onRecordingComplete={file => setRecordedFile(file)} />

        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}
        {errors.api && <Text style={styles.apiErrorText}>{errors.api}</Text>}

        <View style={styles.buttonContainer}>
          <CustomButton
            title={isLoading ? 'Submitting...' : 'Submit'}
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
            textStyle={{fontSize: 18}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffffff'},
  header: {paddingTop: wp('4%')},
  title: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    paddingHorizontal: 15,
    marginTop: 5,
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
  buttonContainer: {margin: 16},
});

export default LostDetails;
