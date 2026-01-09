import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import {_post} from '../../api/apiClient';
// import AudioRecorder from '../Audio/AudioRecorder'; // COMMENTED
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const WonDetails = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item} = route.params;
  const [notes, setNotes] = useState('');
  const [substatus, setSubStatus] = useState('');

  // COMMENTED - AUDIO FILE STATE
  // const [recordedFile, setRecordedFile] = useState(null);

  // form errors + success
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const dropdownData = [
    {label: 'Cheque Collected', value: 1},
    {label: 'Application Form Collected', value: 2},
    {label: 'All Done', value: 3},
  ];

const handleSubmit = async () => {
  let newErrors = {};
  setSuccessMessage('');

  // Reason required
  if (!substatus) newErrors.substatus = 'Please select a reason';

  // -------------------------------
  // 🔥 UPDATED CONDITION:
  // Only notes required (audio removed)
  // -------------------------------
  if (!notes.trim()) {
    newErrors.main = 'Please enter Notes';
  }

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  // ---------------------------------------
  // 🔥 FORM DATA
  // ---------------------------------------
  const formData = new FormData();
  formData.append('subsubstatus_id', substatus);
  formData.append('notes', notes);

  // COMMENTED - Audio handling removed
  // if (recordedFile) {
  //   formData.append('audio_file', {
  //     uri: recordedFile.startsWith('file://')
  //       ? recordedFile
  //       : `file://${recordedFile}`,
  //     type: 'audio/wav',
  //     name: `won_audio_${Date.now()}.wav`,
  //   });
  // }

  setIsLoading(true);
  try {
    const response = await _post(
      `/leads/wonleads/save/${item?.id}`,
      formData,
      true
    );

    if (response.status === 200) {
      setSuccessMessage('Won Lead Updated Successfully');
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
        <Text style={styles.title}>WON REASON</Text>

        <CustomDropdown
          data={dropdownData}
          onSelect={item => {
            setSubStatus(item.value);
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
            setErrors(prev => ({...prev, notes: null, main: null}));
          }}
          error={errors.notes}
        />

        {/* ❌ MAIN ERROR: Notes required */}
        {errors.main && (
          <Text style={[styles.errorText, {color: 'red', marginLeft: 20}]}>
            {errors.main}
          </Text>
        )}

        {/* COMMENTED - AUDIO RECORDER */}
        {/* <Text style={styles.title}>RECORD AUDIO (Optional)</Text>
        <AudioRecorder
          onRecordingComplete={file => {
            setRecordedFile(file);
            setErrors(prev => ({...prev, main: null}));
          }}
        /> */}

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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: wp('4%'),
  },
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
  buttonContainer: {
    margin: 16,
  },
});

export default WonDetails;