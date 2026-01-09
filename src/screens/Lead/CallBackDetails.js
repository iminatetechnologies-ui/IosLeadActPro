import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import CustomDropdown from './../../components/CustomDropDown';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import DateTimePickerComponent from './../../components/DateTimeSelector';
// import AudioRecorder from '../Audio/AudioRecorder'; // COMMENTED
import {_post} from '../../api/apiClient';

const CallBackDetails = ({navigation, route}) => {
  const {item} = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [callBackReasonNotes, setCallBackReasonNotes] = useState('');
  const [callBackReason, setCallBackReason] = useState('');
  const [callBackTime, setCallBackTime] = useState('');
  // const [recordedFile, setRecordedFile] = useState(null); // COMMENTED
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const dropdownData = [
    {label: 'Not Picked', value: 8},
    {label: 'Not Reachable', value: 9},
    {label: 'On Request', value: 10},
    {label: 'Switched Off', value: 11},
    {label: 'Busy', value: 22},
  ];

  const handleDateTimeSubmit = isoDateTime => {
    setCallBackTime(isoDateTime);
    setErrors(prev => ({...prev, callBackTime: null}));
  };

  // COMMENTED - Audio recording handler
  // const handleRecordingComplete = audioFile => {
  //   setRecordedFile(audioFile);
  // };

  const handleSubmit = async () => {
    let newErrors = {};
    setSuccessMessage('');

    if (!callBackReason)
      newErrors.callBackReason = 'Please select a call back reason';

    // Follow-up required always
    if (!callBackTime)
      newErrors.callBackTime = 'Please select next follow-up date and time';

    // UPDATED VALIDATION → Only notes required (audio removed)
    if (!callBackReasonNotes.trim()) {
      newErrors.main = 'Please add Notes';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append('substatus_id', Number(callBackReason));
    formData.append('notes', callBackReasonNotes);
    formData.append('followup_on', callBackTime);

    // COMMENTED - Audio file handling removed
    // if (recordedFile) {
    //   formData.append('audio_file', {
    //     uri: recordedFile.startsWith('file://')
    //       ? recordedFile
    //       : `file://${recordedFile}`,
    //     type: 'audio/wav',
    //     name: `callback_audio_${Date.now()}.wav`,
    //   });
    // }

    console.log('=== FORM DATA SENT ===');
    console.log('substatus_id:', Number(callBackReason));
    console.log('notes:', callBackReasonNotes);
    console.log('followup_on:', callBackTime);
    // console.log('audio_file:', recordedFile); // COMMENTED

    setIsLoading(true);

    try {
      const response = await _post(
        `/leads/callback/save/${item?.id}`,
        formData,
        true,
      );

      console.log('API Response:', response);

      if (response.status === 200) {
        setSuccessMessage('Lead has been updated successfully');
        setErrors({});
        setTimeout(() => navigation.goBack(), 800);
      } else {
        setErrors({api: response.data?.message || 'Update failed'});
      }
    } catch (error) {
      console.log('API Error:', error);
      setErrors({api: 'Something went wrong, please try again'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={'light-content'} />

      <Text style={styles.title}>CALL BACK REASON</Text>

      <CustomDropdown
        data={dropdownData}
        onSelect={item => {
          setCallBackReason(item.value);
          setErrors(prev => ({...prev, callBackReason: null}));
        }}
        placeholder="Choose an option"
        error={errors.callBackReason}
      />

      {errors.callBackReason && (
        <Text style={styles.errorText}>{errors.callBackReason}</Text>
      )}

      {/* ALWAYS SHOW FOLLOW-UP FIELD */}
      <Text style={styles.title}>NEXT FOLLOW UP DATE AND TIME</Text>

      <DateTimePickerComponent
        onDateChange={handleDateTimeSubmit}
        error={errors.callBackTime}
      />

      {errors.callBackTime && (
        <Text style={styles.errorText}>{errors.callBackTime}</Text>
      )}

      <Text style={styles.title}>CALL BACK NOTES</Text>

      <TextareaWithIcon
        value={callBackReasonNotes}
        onChangeText={text => {
          setCallBackReasonNotes(text);
          setErrors(prev => ({...prev, callBackReasonNotes: null}));
        }}
        error={errors.callBackReasonNotes}
      />

      {errors.main && <Text style={styles.errorText}>{errors.main}</Text>}

      {/* COMMENTED - AUDIO NOTE SECTION */}
      {/* <Text style={styles.title}>AUDIO NOTE (OPTIONAL)</Text>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} /> */}

      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
      {errors.api && <Text style={styles.apiErrorText}>{errors.api}</Text>}

      <View style={styles.buttonContainer}>
        <CustomButton
          title={isLoading ? 'Submitting...' : 'Submit'}
          isLoading={isLoading}
          disabled={isLoading}
          textStyle={{fontSize: 18}}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffffff'},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  errorText: {color: '#e74c3c', fontSize: 12, marginLeft: 20, marginTop: 4},
  successText: {
    color: '#27ae60',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#eafaf1',
    padding: 12,
    borderRadius: 8,
  },
  apiErrorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#ffeaea',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
  buttonContainer: {margin: 16},
});

export default CallBackDetails;