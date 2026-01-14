



// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   Linking,
// } from 'react-native';

// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import {requestMicrophonePermission} from '../../utils/permissions';

// const AudioRecorder = ({onRecordingComplete}) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedFile, setRecordedFile] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [playTime, setPlayTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
//   const recordingTimerRef = useRef(null);

//   // iOS audio session setup
//   useEffect(() => {
//     audioRecorderPlayer.current.setSubscriptionDuration(0.1);

//     return () => {
//       if (recordingTimerRef.current) {
//         clearInterval(recordingTimerRef.current);
//       }
//       audioRecorderPlayer.current.stopPlayer();
//       audioRecorderPlayer.current.stopRecorder();
//       audioRecorderPlayer.current.removePlayBackListener();
//     };
//   }, []);

//   // ---------------- START RECORDING (iOS) ----------------
//   const onStartRecord = async () => {
//     try {
//       const granted = await requestMicrophonePermission();

//       if (!granted) {
//         Alert.alert(
//           'Microphone Permission',
//           'Please allow microphone access to record audio.',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {text: 'Open Settings', onPress: () => Linking.openURL('app-settings:')},
//           ],
//         );
//         return;
//       }

//       const path = `audio_${Date.now()}.m4a`;

//       const audioSet = {
//         AVEncoderAudioQualityKeyIOS: 96,
//         AVNumberOfChannelsKeyIOS: 2,
//         AVFormatIDKeyIOS: 'aac',
//       };

//       await audioRecorderPlayer.current.startRecorder(path, audioSet);

//       setIsRecording(true);
//       setRecordingTime(0);

//       recordingTimerRef.current = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000);
//     } catch (e) {
//       console.log('Record error', e);
//       Alert.alert('Error', 'Unable to start recording');
//     }
//   };

//   // ---------------- STOP RECORDING ----------------
//   const onStopRecord = async () => {
//     try {
//       const result = await audioRecorderPlayer.current.stopRecorder();
//       audioRecorderPlayer.current.removeRecordBackListener();

//       if (recordingTimerRef.current) {
//         clearInterval(recordingTimerRef.current);
//       }

//       setIsRecording(false);
//       setRecordedFile(result);
//       onRecordingComplete?.(result);
//     } catch (e) {
//       console.log('Stop error', e);
//     }
//   };

//   // ---------------- PLAY AUDIO ----------------
//   const onPlayAudio = async () => {
//     if (!recordedFile) return;

//     try {
//       await audioRecorderPlayer.current.startPlayer(recordedFile);

//       audioRecorderPlayer.current.addPlayBackListener(e => {
//         setPlayTime(e.currentPosition);
//         setDuration(e.duration);

//         if (e.currentPosition >= e.duration) {
//           audioRecorderPlayer.current.stopPlayer();
//           audioRecorderPlayer.current.removePlayBackListener();
//           setIsPlaying(false);
//           setPlayTime(0);
//         }
//       });

//       setIsPlaying(true);
//     } catch (e) {
//       console.log('Play error', e);
//       Alert.alert('Error', 'Unable to play audio');
//     }
//   };

//   const onPausePlaying = async () => {
//     await audioRecorderPlayer.current.pausePlayer();
//     setIsPlaying(false);
//   };

//   const onStopPlaying = async () => {
//     await audioRecorderPlayer.current.stopPlayer();
//     audioRecorderPlayer.current.removePlayBackListener();
//     setIsPlaying(false);
//     setPlayTime(0);
//   };

//   // ---------------- DELETE ----------------
//   const deleteRecording = () => {
//     Alert.alert('Delete Recording', 'Are you sure?', [
//       {text: 'Cancel', style: 'cancel'},
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: () => {
//           onStopPlaying();
//           setRecordedFile(null);
//           setRecordingTime(0);
//           onRecordingComplete?.(null);
//         },
//       },
//     ]);
//   };

//   const formatTime = sec =>
//     `${Math.floor(sec / 60).toString().padStart(2, '0')}:${Math.floor(sec % 60)
//       .toString()
//       .padStart(2, '0')}`;

//   return (
//     <View style={styles.audioContainer}>
//       {!isRecording ? (
//         <TouchableOpacity style={styles.recordBtn} onPress={onStartRecord}>
//           <Image source={require('../../assets/images/record.png')} style={styles.icon} />
//           <Text style={styles.text}>Start Recording</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.stopBtn} onPress={onStopRecord}>
//           <Image source={require('../../assets/images/stop.png')} style={styles.icon} />
//           <Text style={styles.text}>Stop Recording</Text>
//         </TouchableOpacity>
//       )}

//       {isRecording && (
//         <Text style={styles.timer}>Recording: {formatTime(recordingTime)}</Text>
//       )}

//       {recordedFile && !isRecording && (
//         <View style={styles.player}>
//           {!isPlaying ? (
//             <TouchableOpacity style={styles.playBtn} onPress={onPlayAudio}>
//               <Text style={styles.whiteText}>▶ Play</Text>
//             </TouchableOpacity>
//           ) : (
//             <View style={styles.row}>
//               <TouchableOpacity style={styles.pauseBtn} onPress={onPausePlaying}>
//                 <Text style={styles.whiteText}>⏸ Pause</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.stopPlayBtn} onPress={onStopPlaying}>
//                 <Text style={styles.whiteText}>⏹ Stop</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {isPlaying && (
//             <Text style={styles.progress}>
//               {formatTime(playTime / 1000)} / {formatTime(duration / 1000)}
//             </Text>
//           )}

//           {!isPlaying && (
//             <TouchableOpacity style={styles.deleteBtn} onPress={deleteRecording}>
//               <Text style={styles.whiteText}>🗑 Delete</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   audioContainer: {margin: 20},
//   recordBtn: {
//     backgroundColor: '#FFE5E3',
//     borderColor: '#FF3B30',
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   stopBtn: {
//     backgroundColor: '#FFE5E3',
//     borderColor: '#FF3B30',
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   icon: {width: 30, height: 30, marginRight: 8},
//   text: {color: '#FF3B30', fontSize: 18, fontWeight: '500'},
//   timer: {marginTop: 8, textAlign: 'center', color: '#FF3B30'},
//   player: {marginTop: 16, padding: 12, backgroundColor: '#F5F5F7', borderRadius: 8},
//   playBtn: {backgroundColor: '#34C759', padding: 12, borderRadius: 8},
//   pauseBtn: {backgroundColor: '#FF9500', padding: 12, borderRadius: 8, flex: 1},
//   stopPlayBtn: {backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, flex: 1},
//   deleteBtn: {backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, marginTop: 8},
//   row: {flexDirection: 'row', gap: 8},
//   whiteText: {color: '#fff', textAlign: 'center'},
//   progress: {textAlign: 'center', marginVertical: 6, color: '#8E8E93'},
// });

// export default AudioRecorder;


import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from 'react-native';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {requestMicrophonePermission, openAppSettings} from '../../utils/permissions';

const AudioRecorder = ({onRecordingComplete}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const recordingTimerRef = useRef(null);

  // iOS audio session setup
  useEffect(() => {
    audioRecorderPlayer.current.setSubscriptionDuration(0.1);

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      audioRecorderPlayer.current.stopPlayer();
      audioRecorderPlayer.current.stopRecorder();
      audioRecorderPlayer.current.removePlayBackListener();
    };
  }, []);

  // Show permission alert when denied
  const showPermissionAlert = () => {
    Alert.alert(
      'Microphone Permission Required',
      'This app needs microphone access to record audio. Please enable it in settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: openAppSettings},
      ],
    );
  };

  // ---------------- START RECORDING ----------------
  const onStartRecord = async () => {
    try {
      // Request permission first
      const granted = await requestMicrophonePermission();

      if (!granted) {
        // Permission was denied, show custom alert
        showPermissionAlert();
        return;
      }

      const path = `audio_${Date.now()}.m4a`;

      const audioSet = {
        AVEncoderAudioQualityKeyIOS: 96,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: 'aac',
      };

      await audioRecorderPlayer.current.startRecorder(path, audioSet);

      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (e) {
      console.log('Record error', e);
      
      // Check if it's a permission error
      if (e.message && e.message.includes('permission') || 
          e.code === 'permission_denied' ||
          e.message === 'Recording not authorized') {
        showPermissionAlert();
      } else {
        Alert.alert('Error', 'Unable to start recording');
      }
    }
  };

  // ---------------- STOP RECORDING ----------------
  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.current.stopRecorder();
      audioRecorderPlayer.current.removeRecordBackListener();

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      setIsRecording(false);
      setRecordedFile(result);
      onRecordingComplete?.(result);
    } catch (e) {
      console.log('Stop error', e);
    }
  };

  // ---------------- PLAY AUDIO ----------------
  const onPlayAudio = async () => {
    if (!recordedFile) return;

    try {
      await audioRecorderPlayer.current.startPlayer(recordedFile);

      audioRecorderPlayer.current.addPlayBackListener(e => {
        setPlayTime(e.currentPosition);
        setDuration(e.duration);

        if (e.currentPosition >= e.duration) {
          audioRecorderPlayer.current.stopPlayer();
          audioRecorderPlayer.current.removePlayBackListener();
          setIsPlaying(false);
          setPlayTime(0);
        }
      });

      setIsPlaying(true);
    } catch (e) {
      console.log('Play error', e);
      Alert.alert('Error', 'Unable to play audio');
    }
  };

  const onPausePlaying = async () => {
    await audioRecorderPlayer.current.pausePlayer();
    setIsPlaying(false);
  };

  const onStopPlaying = async () => {
    await audioRecorderPlayer.current.stopPlayer();
    audioRecorderPlayer.current.removePlayBackListener();
    setIsPlaying(false);
    setPlayTime(0);
  };

  // ---------------- DELETE ----------------
  const deleteRecording = () => {
    Alert.alert('Delete Recording', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          onStopPlaying();
          setRecordedFile(null);
          setRecordingTime(0);
          onRecordingComplete?.(null);
        },
      },
    ]);
  };

  const formatTime = sec =>
    `${Math.floor(sec / 60).toString().padStart(2, '0')}:${Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')}`;

  return (
    <View style={styles.audioContainer}>
      {!isRecording ? (
        <TouchableOpacity style={styles.recordBtn} onPress={onStartRecord}>
          <Image source={require('../../assets/images/record.png')} style={styles.icon} />
          <Text style={styles.text}>Start Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopBtn} onPress={onStopRecord}>
          <Image source={require('../../assets/images/stop.png')} style={styles.icon} />
          <Text style={styles.text}>Stop Recording</Text>
        </TouchableOpacity>
      )}

      {isRecording && (
        <Text style={styles.timer}>Recording: {formatTime(recordingTime)}</Text>
      )}

      {recordedFile && !isRecording && (
        <View style={styles.player}>
          {!isPlaying ? (
            <TouchableOpacity style={styles.playBtn} onPress={onPlayAudio}>
              <Text style={styles.whiteText}>▶ Play</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.row}>
              <TouchableOpacity style={styles.pauseBtn} onPress={onPausePlaying}>
                <Text style={styles.whiteText}>⏸ Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopPlayBtn} onPress={onStopPlaying}>
                <Text style={styles.whiteText}>⏹ Stop</Text>
              </TouchableOpacity>
            </View>
          )}

          {isPlaying && (
            <Text style={styles.progress}>
              {formatTime(playTime / 1000)} / {formatTime(duration / 1000)}
            </Text>
          )}

          {!isPlaying && (
            <TouchableOpacity style={styles.deleteBtn} onPress={deleteRecording}>
              <Text style={styles.whiteText}>🗑 Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  audioContainer: {margin: 20},
  recordBtn: {
    backgroundColor: '#FFE5E3',
    borderColor: '#FF3B30',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  stopBtn: {
    backgroundColor: '#FFE5E3',
    borderColor: '#FF3B30',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {width: 30, height: 30, marginRight: 8},
  text: {color: '#FF3B30', fontSize: 18, fontWeight: '500'},
  timer: {marginTop: 8, textAlign: 'center', color: '#FF3B30'},
  player: {marginTop: 16, padding: 12, backgroundColor: '#F5F5F7', borderRadius: 8},
  playBtn: {backgroundColor: '#34C759', padding: 12, borderRadius: 8},
  pauseBtn: {backgroundColor: '#FF9500', padding: 12, borderRadius: 8, flex: 1},
  stopPlayBtn: {backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, flex: 1},
  deleteBtn: {backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, marginTop: 8},
  row: {flexDirection: 'row', gap: 8},
  whiteText: {color: '#fff', textAlign: 'center'},
  progress: {textAlign: 'center', marginVertical: 6, color: '#8E8E93'},
});

export default AudioRecorder;