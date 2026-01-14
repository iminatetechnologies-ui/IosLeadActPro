// import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
// import React, {useState} from 'react';
// import CustomButton from './../../components/CustomButton';
// import TextareaWithIcon from './../../components/TextArea';
// import DateTimePickerComponent from './../../components/DateTimeSelector';
// import {_post} from '../../api/apiClient';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const RescheduleTask = ({navigation, route}) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const {item} = route.params;
//   const [notes, setNotes] = useState('');
//   const [callBackTime, setCallBackTime] = useState('');

//   // ✅ errors + success state
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleDateTimeSubmit = isoDateTime => {
//     setCallBackTime(isoDateTime);
//     setErrors(prev => ({...prev, callBackTime: null})); // clear error
//   };

//   const handleSubmit = async () => {
//     let newErrors = {};
//     setSuccessMessage('');

//     if (!callBackTime)
//       newErrors.callBackTime = 'Please select follow-up date and time';
//     if (!notes.trim()) newErrors.notes = 'Notes field is required';

//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     const data = {
//       followup_on: callBackTime,
//       notes: notes,
//     };

//     setIsLoading(true);
//     try {
//       const response = await _post(
//         `/leads/taskreschedule/save/${item?.id}`,
//         data,
//       );
//       if (response.status === 200) {
//         setSuccessMessage('Lead Rescheduled Successfully');
//         setErrors({});
//         setTimeout(() => {
//           navigation.goBack();
//         }, 700);
//       } else {
//         setErrors({api: response.data?.message || 'No data found.'});
//       }
//     } catch (error) {
//       // ✅ Full error object
//       console.error('API Error:', JSON.stringify(error, null, 2));

//       // ✅ Agar Axios error hai toh aur details nikal lo
//       if (error.response) {
//         console.log('📌 Response Error:', {
//           status: error.response.status,
//           data: error.response.data,
//           headers: error.response.headers,
//         });
//       } else if (error.request) {
//         console.log('📌 Request Error:', error.request);
//       } else {
//         console.log('📌 General Error:', error.message);
//       }

//       setErrors({
//         api: error.message || 'Something went wrong, please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <StatusBar barStyle={'light-content'} />

//       <View style={styles.header}>
//         <Text style={styles.title}>NEXT FOLLOW UP DATE AND TIME</Text>
//         <DateTimePickerComponent
//           onDateChange={handleDateTimeSubmit}
//           initialDate={callBackTime}
//           error={errors.callBackTime}
//         />
//         {errors.callBackTime && (
//           <Text style={styles.errorText}>{errors.callBackTime}</Text>
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

//         {/* ✅ API Error */}
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

// export default RescheduleTask;



import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import React, {useState} from 'react';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import DateTimePickerComponent from './../../components/DateTimeSelector';
import AudioRecorder from '../Audio/AudioRecorder'; // added
import {_post} from '../../api/apiClient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RescheduleTask = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item} = route.params;

  const [notes, setNotes] = useState('');
  const [callBackTime, setCallBackTime] = useState('');
  const [recordedFile, setRecordedFile] = useState(null); // audio file

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleDateTimeSubmit = isoDateTime => {
    setCallBackTime(isoDateTime);
    setErrors(prev => ({...prev, callBackTime: null}));
  };

  const handleSubmit = async () => {
    let newErrors = {};
    setSuccessMessage('');

    // ⛔ Validation 1: Date/time required
    if (!callBackTime)
      newErrors.callBackTime = 'Please select follow-up date and time';

    // ⛔ Validation 2: Notes or Audio — at least one required
    if (!notes.trim() && !recordedFile) {
      newErrors.main = 'Please add Notes or Audio (one is required)';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // ---- Prepare FormData ----
    const formData = new FormData();
    formData.append('followup_on', callBackTime);

    if (notes.trim()) {
      formData.append('notes', notes);
    }

    if (recordedFile) {
      formData.append('audio_file', {
        uri: recordedFile.startsWith('file://')
          ? recordedFile
          : `file://${recordedFile}`,
        type: 'audio/wav',
        name: `reschedule_audio_${Date.now()}.wav`,
      });
    }

    setIsLoading(true);
    try {
      const response = await _post(
        `/leads/taskreschedule/save/${item?.id}`,
        formData,
        true,
      );

      if (response.status === 200) {
        setSuccessMessage('Lead Rescheduled Successfully');
        setErrors({});
        setTimeout(() => navigation.goBack(), 700);
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
        <Text style={styles.title}>NEXT FOLLOW UP DATE AND TIME</Text>

        <DateTimePickerComponent
          onDateChange={handleDateTimeSubmit}
          initialDate={callBackTime}
          error={errors.callBackTime}
        />
        {errors.callBackTime && (
          <Text style={styles.errorText}>{errors.callBackTime}</Text>
        )}

        <Text style={styles.title}>NOTES (OPTIONAL)</Text>
        <TextareaWithIcon
          value={notes}
          onChangeText={text => {
            setNotes(text);
            setErrors(prev => ({...prev, notes: null, main: null}));
          }}
          error={errors.notes}
        />

        <Text style={styles.title}>AUDIO NOTE (OPTIONAL)</Text>
        <AudioRecorder
          onRecordingComplete={file => {
            setRecordedFile(file);
            setErrors(prev => ({...prev, main: null}));
          }}
        />

        {/* ❗ Notes or Audio Required Error */}
        {errors.main && <Text style={styles.errorText}>{errors.main}</Text>}

        {/* Success Message */}
        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}

        {/* API Error */}
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

export default RescheduleTask;
