// import React, {useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Platform,
//   ToastAndroid,
//   Image,
//   Linking,
// } from 'react-native';

// import Sound from 'react-native-sound';
// import AudioRecord from 'react-native-audio-record';
// import {requestMicrophonePermission} from '../../utils/permissions';

// const AudioRecorder = ({onRecordingComplete}) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedFile, setRecordedFile] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);

//   const soundRef = useRef(null);
//   const recordingTimerRef = useRef(null);

//   const options = {
//     sampleRate: 16000,
//     channels: 1,
//     bitsPerSample: 16,
//     audioSource: 6,
//     wavFile: `callback_audio_${Date.now()}.wav`,
//   };

//   const clearTimers = () => {
//     if (recordingTimerRef.current) {
//       clearInterval(recordingTimerRef.current);
//     }
//   };

//   // ---------------------------------------------------------------------
//   // 🔥 UPDATED MICROPHONE PERMISSION LOGIC (USING YOUR permission.js)
//   // ---------------------------------------------------------------------
//   const onStartRecord = async () => {
//     const granted = await requestMicrophonePermission(); // ⭐ YOUR FUNCTION

//     if (!granted) {
//       // ❌ User denied OR denied permanently handled inside requestMicrophonePermission()
//       return;
//     }

//     // ⭐ If permission granted
//     AudioRecord.init(options);

//     setTimeout(() => {
//       AudioRecord.start();
//       setIsRecording(true);
//       setRecordingTime(0);

//       recordingTimerRef.current = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000);
//     }, 400);
//   };

//   // ---------------------------------------------------------------------
//   // STOP RECORDING
//   // ---------------------------------------------------------------------
//   const onStopRecord = async () => {
//     const audioFile = await AudioRecord.stop();
//     clearTimers();
//     setIsRecording(false);
//     setRecordedFile(audioFile);
//     onRecordingComplete?.(audioFile);
//   };

//   // ---------------------------------------------------------------------
//   // PLAY AUDIO
//   // ---------------------------------------------------------------------
//   const onPlayAudio = () => {
//     if (!recordedFile) return;

//     if (soundRef.current) {
//       soundRef.current.stop();
//       soundRef.current.release();
//     }

//     soundRef.current = new Sound(recordedFile, '', error => {
//       if (error) return;

//       setIsPlaying(true);
//       soundRef.current.play(success => {
//         setIsPlaying(false);
//         soundRef.current.release();
//         soundRef.current = null;
//       });
//     });
//   };

//   // STOP PLAYING
//   const onStopPlaying = () => {
//     setIsPlaying(false);
//     if (soundRef.current) {
//       soundRef.current.stop();
//       soundRef.current.release();
//       soundRef.current = null;
//     }
//   };

//   // DELETE RECORDING
//   const deleteRecording = () => {
//     if (soundRef.current) {
//       soundRef.current.stop();
//       soundRef.current.release();
//       soundRef.current = null;
//     }

//     setRecordedFile(null);
//     setIsPlaying(false);
//     setRecordingTime(0);
//     onRecordingComplete?.(null);

//     Platform.OS === 'android'
//       ? ToastAndroid.show('Recording Deleted', ToastAndroid.SHORT)
//       : Alert.alert('Deleted', 'Recording has been deleted');
//   };

//   const formatTime = seconds => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.audioContainer}>
//       {!isRecording ? (
//         <TouchableOpacity style={styles.recordBtn1} onPress={onStartRecord}>
//           <Image
//             source={require('../../assets/images/record.png')}
//             style={styles.icon}
//           />
//           <Text style={styles.recordText}>Start Recording</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.stopBtn1} onPress={onStopRecord}>
//           <Image
//             source={require('../../assets/images/stop.png')}
//             style={styles.icon}
//           />
//           <Text style={styles.stopText}>Stop Recording</Text>
//         </TouchableOpacity>
//       )}

//       {isRecording && (
//         <Text style={styles.timerText}>
//           Recording: {formatTime(recordingTime)}
//         </Text>
//       )}

//       {recordedFile && !isRecording && (
//         <View style={styles.playbackContainer}>
//           {!isPlaying ? (
//             <TouchableOpacity style={styles.playBtn} onPress={onPlayAudio}>
//               <Text style={styles.playText}>▶ Play Audio</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.stopPlayBtn}
//               onPress={onStopPlaying}>
//               <Text style={styles.stopPlayText}>⏹ Stop</Text>
//             </TouchableOpacity>
//           )}

//           {!isPlaying && (
//             <TouchableOpacity
//               style={styles.deleteBtn}
//               onPress={deleteRecording}>
//               <Text style={styles.deleteText}>🗑 Delete Recording</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   audioContainer: {marginHorizontal: 20, marginTop: 8},

//   recordBtn1: {
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: 'black',
//   },
//   stopBtn1: {
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: 'black',
//   },

//   icon: {width: 35, height: 35, marginRight: 8},

//   recordText: {color: '#000', fontSize: 20, fontWeight: '500'},
//   stopText: {color: '#000', fontSize: 20, fontWeight: '500'},

//   timerText: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#e74c3c',
//     textAlign: 'center',
//   },

//   playbackContainer: {marginTop: 8},

//   playBtn: {
//     backgroundColor: '#2ecc71',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   playText: {color: '#fff', fontSize: 14},

//   stopPlayBtn: {
//     backgroundColor: '#e67e22',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stopPlayText: {color: '#fff', fontSize: 14},

//   deleteBtn: {
//     backgroundColor: '#b00020',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   deleteText: {color: '#fff', fontSize: 14},
// });

// export default AudioRecorder;


import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
} from 'react-native';

// Use react-native-audio-recorder-player instead (more iOS compatible)
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {requestMicrophonePermission} from '../../utils/permissions';

const AudioRecorder = ({onRecordingComplete}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const recordingTimerRef = useRef(null);

  // iOS-specific audio session setup
  useEffect(() => {
    // Initialize audio session for iOS
    if (Platform.OS === 'ios') {
      audioRecorderPlayer.current.setSubscriptionDuration(0.1); // Update interval
    }
    
    return () => {
      clearTimers();
      // Cleanup on unmount
      stopPlaying();
      stopRecording();
    };
  }, []);

  const clearTimers = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  // ---------------------------------------------------------------------
  // START RECORDING (iOS Compatible)
  // ---------------------------------------------------------------------
  const onStartRecord = async () => {
    try {
      const granted = await requestMicrophonePermission();
      
      if (!granted) {
        Alert.alert(
          'Microphone Access Required',
          'Please enable microphone access in Settings to record audio.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                }
              }
            },
          ],
        );
        return;
      }

      // iOS path format
      const path = Platform.select({
        ios: `audio_${Date.now()}.m4a`, // iOS typically uses .m4a
        android: `audio_${Date.now()}.mp3`,
      });

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };

      // iOS recording setup
      if (Platform.OS === 'ios') {
        await audioRecorderPlayer.current.startRecorder(path, audioSet);
      } else {
        await audioRecorderPlayer.current.startRecorder(path);
      }

      setIsRecording(true);
      setRecordingTime(0);

      // Timer for recording duration
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  // ---------------------------------------------------------------------
  // STOP RECORDING
  // ---------------------------------------------------------------------
  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.current.stopRecorder();
      clearTimers();
      setIsRecording(false);
      setRecordedFile(result);
      onRecordingComplete?.(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  // ---------------------------------------------------------------------
  // PLAY AUDIO (iOS Compatible)
  // ---------------------------------------------------------------------
  const onPlayAudio = async () => {
    if (!recordedFile) return;

    try {
      await audioRecorderPlayer.current.startPlayer(recordedFile);
      
      // Listen for playback progress
      audioRecorderPlayer.current.addPlayBackListener((e) => {
        setPlayTime(e.currentPosition);
        setDuration(e.duration);
        
        if (e.currentPosition === e.duration) {
          setIsPlaying(false);
          setPlayTime(0);
        }
      });
      
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  // STOP PLAYING
  const onStopPlaying = async () => {
    try {
      await audioRecorderPlayer.current.stopPlayer();
      audioRecorderPlayer.current.removePlayBackListener();
      setIsPlaying(false);
      setPlayTime(0);
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  };

  // PAUSE PLAYING
  const onPausePlaying = async () => {
    try {
      await audioRecorderPlayer.current.pausePlayer();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  };

  // RESUME PLAYING
  const onResumePlaying = async () => {
    try {
      await audioRecorderPlayer.current.resumePlayer();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error resuming playback:', error);
    }
  };

  // DELETE RECORDING
  const deleteRecording = () => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await onStopPlaying();
            setRecordedFile(null);
            setRecordingTime(0);
            onRecordingComplete?.(null);
            
            // iOS-specific alert
            Alert.alert('Deleted', 'Recording has been deleted');
          },
        },
      ],
    );
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.audioContainer}>
      {/* Recording Controls */}
      {!isRecording ? (
        <TouchableOpacity style={styles.recordBtn1} onPress={onStartRecord}>
          <Image
            source={require('../../assets/images/record.png')}
            style={styles.icon}
          />
          <Text style={styles.recordText}>Start Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopBtn1} onPress={onStopRecord}>
          <Image
            source={require('../../assets/images/stop.png')}
            style={styles.icon}
          />
          <Text style={styles.stopText}>Stop Recording</Text>
        </TouchableOpacity>
      )}

      {isRecording && (
        <Text style={styles.timerText}>
          Recording: {formatTime(recordingTime)}
        </Text>
      )}

      {/* Playback Controls */}
      {recordedFile && !isRecording && (
        <View style={styles.playbackContainer}>
          {/* Play/Pause Controls */}
          <View style={styles.playbackControls}>
            {!isPlaying ? (
              <TouchableOpacity style={styles.playBtn} onPress={onPlayAudio}>
                <Text style={styles.playText}>▶ Play</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.playingControls}>
                <TouchableOpacity
                  style={styles.pauseBtn}
                  onPress={onPausePlaying}>
                  <Text style={styles.pauseText}>⏸ Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stopPlayBtn}
                  onPress={onStopPlaying}>
                  <Text style={styles.stopPlayText}>⏹ Stop</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Playback Progress */}
          {isPlaying && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {formatTime(playTime / 1000)} / {formatTime(duration / 1000)}
              </Text>
            </View>
          )}

          {/* Delete Button */}
          {!isPlaying && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={deleteRecording}>
              <Text style={styles.deleteText}>🗑 Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

// Audio configuration constants (for TypeScript or autocomplete)
const AudioEncoderAndroidType = {
  AAC: 3,
  AMR_NB: 1,
  AMR_WB: 2,
  HE_AAC: 4,
  OPUS: 5,
};

const AudioSourceAndroidType = {
  DEFAULT: 0,
  MIC: 1,
  VOICE_UPLINK: 2,
  VOICE_DOWNLINK: 3,
  VOICE_CALL: 4,
  CAMCORDER: 5,
  VOICE_RECOGNITION: 6,
  VOICE_COMMUNICATION: 7,
  REMOTE_SUBMIX: 8,
  UNPROCESSED: 9,
  VOICE_PERFORMANCE: 10,
};

const AVEncoderAudioQualityIOSType = {
  min: 0,
  low: 32,
  medium: 64,
  high: 96,
  max: 127,
};

const AVEncodingOption = {
  aac: 'aac',
  alac: 'alac',
  ima4: 'ima4',
  ilbc: 'ilbc',
  ulaw: 'ulaw',
  mp1: 'mp1',
  mp2: 'mp2',
  alaw: 'alaw',
  mp3: 'mp3',
  flac: 'flac',
  opus: 'opus',
};

const styles = StyleSheet.create({
  audioContainer: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  recordBtn1: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
    backgroundColor: '#FFE5E3',
  },
  stopBtn1: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
    backgroundColor: '#FFE5E3',
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  recordText: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: '500',
  },
  stopText: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: '500',
  },
  timerText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
  },
  playbackContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  playBtn: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  playText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  playingControls: {
    flexDirection: 'row',
    flex: 1,
  },
  pauseBtn: {
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  pauseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  stopPlayBtn: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  stopPlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  deleteBtn: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AudioRecorder;