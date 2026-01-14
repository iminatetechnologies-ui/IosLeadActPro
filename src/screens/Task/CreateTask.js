import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import DateTimePickerComponent from './../../components/DateTimeSelector';
import MultiSelectDropdown from './../../components/MultiSelectDropdown';
import AudioRecorder from '../Audio/AudioRecorder'; // ✅ SAME as LostDetails
import {_post, _get} from '../../api/apiClient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CreateTask = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item} = route.params;

  const [notes, setNotes] = useState('');
  const [substatus, setSubStatus] = useState(null);
  const [followUp, setFollowUp] = useState(null);
  const [followUpTime, setFollowUpTime] = useState('');

  const [projectList, setProjectList] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [recordedFile, setRecordedFile] = useState(null); // ✅ audio state

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const substatusdata = [
    {label: 'Completed', value: 1},
    {label: 'Cancel', value: 2},
    {label: 'Plan', value: 3},
  ];

  const followUpType = [
    {label: 'FollowUp', value: 5},
    {label: 'Meeting', value: 6},
    {label: 'Site Visit', value: 7},
    {label: 'EOI Collected', value: 21},
  ];

  useEffect(() => {
    if (item?.substatus_name) {
      const cleanName = item.substatus_name.toLowerCase().replace(/\s+/g, '');
      const matchFollowUp = followUpType.find(
        f => f.label.toLowerCase().replace(/\s+/g, '') === cleanName,
      );
      if (matchFollowUp) {
        setFollowUp(matchFollowUp);
      }
    }
  }, [item]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await _get('/getresources');

        if (response.status === 200) {
          const {data} = response.data;
          if (data.project) {
            setProjectList(
              data.project.map(it => ({
                label: it.title,
                id: it.id,
                value: it.id,
              })),
            );
          }
        }
      } catch (error) {
        console.error('Project Fetch Error:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleDateTimeSubmit = isoDateTime => {
    setFollowUpTime(isoDateTime);
    setErrors(prev => ({...prev, followUpTime: null}));
  };

  const handleSubmit = async () => {
    let newErrors = {};
    setSuccessMessage('');

    // Existing validations
    if (!substatus)
      newErrors.substatus = 'Please select an existing task status';
    if (!followUp) newErrors.followUp = 'Current status is required';
    if (!followUpTime) newErrors.followUpTime = 'Please select date & time';

    // ------------------------------------
    // 🔥 NEW IMPORTANT VALIDATION
    // Notes OR Audio → koi ek compulsory
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

    formData.append('substatus_id', followUp?.value);
    formData.append('followup_on', followUpTime);
    formData.append('task_status', substatus?.value);
    formData.append('notes', notes);

    // Multiple project_ids
    if (selectedProjects.length > 0) {
      selectedProjects.forEach((p, index) => {
        formData.append(`project_ids[${index}]`, p.value);
      });
    }

    // AUDIO
    if (recordedFile) {
      formData.append('audio_file', {
        uri: recordedFile.startsWith('file://')
          ? recordedFile
          : `file://${recordedFile}`,
        type: 'audio/wav',
        name: `task_audio_${Date.now()}.wav`,
      });
    }

    setIsLoading(true);
    try {
      const response = await _post(
        `/leads/taskcreate/save/${item?.id}`,
        formData,
        true, // multipart
      );

      if (response.status === 200) {
        setSuccessMessage('Task has been created successfully');
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
        <Text style={styles.title}>CURRENT STATUS</Text>
        <CustomDropdown
          data={followUpType}
          value={followUp}
          onSelect={selected => {
            setFollowUp(selected);
            setErrors(prev => ({...prev, followUp: null}));
          }}
          placeholder="Select current status"
          error={errors.followUp}
        />

        <Text style={styles.title}>EXISTING TASK STATUS</Text>
        <CustomDropdown
          data={substatusdata}
          value={substatus}
          onSelect={selected => {
            setSubStatus(selected);
            setErrors(prev => ({...prev, substatus: null}));
          }}
          placeholder="Choose an option"
          error={errors.substatus}
        />

        <Text style={styles.title}>ASSIGN PROJECTS</Text>
        <MultiSelectDropdown
          data={projectList}
          selectedValues={selectedProjects}
          onSelect={items => setSelectedProjects(items)}
        />

        <Text style={styles.title}>NEXT FOLLOW UP DATE AND TIME</Text>
        <DateTimePickerComponent
          onDateChange={handleDateTimeSubmit}
          initialDate={followUpTime}
          error={errors.followUpTime}
        />

        <Text style={styles.title}>NOTES</Text>
        <TextareaWithIcon
          value={notes}
          onChangeText={text => {
            setNotes(text);
            setErrors(prev => ({...prev, notes: null}));
          }}
          error={errors.notes}
        />
        {errors.main && <Text style={styles.errorText}>{errors.main}</Text>}

        {/* ✅ Same Audio Section as LostDetails */}
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

export default CreateTask;
