import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import TextareaWithIcon from './../../components/TextArea';
import CustomButton from './../../components/CustomButton';
import AudioRecorder from '../Audio/AudioRecorder'; // Import the audio component
import {_post} from '../../api/apiClient';

const NotInterested = ({navigation, route}) => {
  const {item} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [subStatus, setStatusId] = useState('');
  const [recordedFile, setRecordedFile] = useState(null); // Audio file state

  // Error states
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const dropdownData = [
    {label: 'Broker Lead', value: 12},
    {label: 'DND', value: 13},
    {label: 'Invalid Number', value: 14},
    {label: 'Location Mismatched', value: 15},
    {label: 'Low Budget', value: 16},
    {label: 'Not a property seeker', value: 17},
    {label: 'Looking for rental lead', value: 18},
    {label: 'Resale Lead', value: 19},
    {label: 'Loan Issue', value: 20},
  ];

  const handleRecordingComplete = audioFile => {
    setRecordedFile(audioFile);
  };

  const handleSubmit = async () => {
    let newErrors = {};
    setSuccessMessage('');

    // Validation: at least one required (notes OR audio)
    if (!notes.trim() && !recordedFile) {
      newErrors.notes = 'Please enter notes or record an audio';
    }

    if (!subStatus) {
      newErrors.subStatus = 'Please select a reason';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('substatus_id', subStatus);
    formData.append('notes', notes);

    // Add audio only if exists
    if (recordedFile) {
      formData.append('audio_file', {
        uri: recordedFile.startsWith('file://')
          ? recordedFile
          : `file://${recordedFile}`,
        type: 'audio/wav',
        name: `not_interested_audio_${Date.now()}.wav`,
      });
    }

    setIsLoading(true);

    try {
      const response = await _post(
        `leads/notinterested/save/${item?.id}`,
        formData,
        true,
      );
      console.log('not interested--->', response);

      if (response.status === 200) {
        setSuccessMessage('Lead has been updated successfully');
        setErrors({});

        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        setErrors({api: response.data?.message || 'Update failed'});
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('API Error:', error);

      if (error.response && error.response.status === 422) {
        const errs = error.response.data.errors;
        if (errs.substatus_id) setErrors({api: errs.substatus_id[0]});
        else if (errs.notes) setErrors({api: errs.notes[0]});
        else if (errs.audio_file) setErrors({api: errs.audio_file[0]});
        else setErrors({api: 'Validation failed'});
      } else {
        setErrors({api: 'Something went wrong, please try again'});
      }
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={'light-content'} />

      <Text style={styles.title}>NOT INTERESTED REASON</Text>
      <CustomDropdown
        data={dropdownData}
        onSelect={item => {
          setStatusId(item?.value);
          setErrors(prev => ({...prev, subStatus: null})); // clear error on select
        }}
        placeholder="Choose an option"
        error={errors.subStatus}
      />
      {errors.subStatus && (
        <Text style={styles.errorText}>{errors.subStatus}</Text>
      )}

      <Text style={styles.title}>NOTES</Text>
      <TextareaWithIcon
        value={notes}
        onChangeText={text => {
          setNotes(text);
          setErrors(prev => ({...prev, notes: null})); // clear error on type
        }}
        error={errors.notes}
      />
      {errors.notes && <Text style={styles.errorText}>{errors.notes}</Text>}

      {/* Audio Recording Section */}
      <Text style={styles.title}>AUDIO NOTE (OPTIONAL)</Text>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />

      {/* Success Message */}
      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}

      {/* API Error */}
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
  successText: {
    color: '#27ae60',
    fontSize: 14,
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

export default NotInterested;