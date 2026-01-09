
// import React, {useState} from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   Text,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const DateTimePickerComponent = ({onDateChange, error, errorMessage}) => {
//   const [date, setDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);
//   const [mode, setMode] = useState('date');

//   const handleDateChange = (event, selectedDate) => {
//     setShowPicker(Platform.OS === 'ios');

//     if (selectedDate) {
//       const currentDate = selectedDate || date;
//       setDate(currentDate);

//       if (Platform.OS === 'android') {
//         if (mode === 'date') {
//           setMode('time');
//           setShowPicker(true);
//           return;
//         }
//         if (mode === 'time') {
//           setShowPicker(false);
//           sendDateToApi(currentDate);
//         }
//       } else {
//         sendDateToApi(currentDate);
//       }
//     } else {
//       setShowPicker(false);
//     }
//   };

//   const sendDateToApi = selectedDate => {
//     const isoDate = selectedDate.toISOString();
//     onDateChange(isoDate);
//   };

//   const formatDisplayDate = date => {
//     return date.toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[
//           styles.inputContainer,
//           error ? styles.errorBorder : null, // 👈 error border
//         ]}
//         onPress={() => {
//           setMode('date'); 
//           setShowPicker(true);
//         }}>
//         <TextInput
//           style={styles.input}
//           pointerEvents="none"
//           placeholder="Select date and time"
//           value={formatDisplayDate(date)}
//           editable={false}
//         />
//         <Icon name="calendar-today" size={20} color="#666" />
//       </TouchableOpacity>

//       {error && errorMessage ? (
//         <Text style={styles.errorText}>{errorMessage}</Text>
//       ) : null}

//       {showPicker && (
//         <DateTimePicker
//           value={date}
//           mode={Platform.OS === 'ios' ? 'datetime' : mode}
//           display="spinner"
//           onChange={handleDateChange}
//           minimumDate={new Date()}
//           themeVariant="light"
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 15,
//     marginHorizontal: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     height: 50,
//     backgroundColor: 'white',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: 0,
//   },
//   errorBorder: {
//     borderWidth: 0.5,
//     borderColor: 'red',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 4,
//     marginLeft: 4,
//   },
// });

// export default DateTimePickerComponent;



import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DateTimePickerComponent = ({ onDateChange, error, errorMessage }) => {
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date()); // 👈 iOS temp state
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date');

  const handleDateChange = (event, selectedDate) => {
    if (!selectedDate) return;

    if (Platform.OS === 'ios') {
      setTempDate(selectedDate); // scroll ke time sirf temp update
    } else {
      setDate(selectedDate);

      if (mode === 'date') {
        setMode('time');
        setShowPicker(true);
      } else {
        setShowPicker(false);
        sendDateToApi(selectedDate);
      }
    }
  };

  const onDonePress = () => {
    setDate(tempDate);
    sendDateToApi(tempDate);
    setShowPicker(false);
  };

  const sendDateToApi = selectedDate => {
    onDateChange(selectedDate.toISOString());
  };

  const formatDisplayDate = date => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error ? styles.errorBorder : null,
        ]}
        onPress={() => {
          setMode('date');
          setTempDate(date);
          setShowPicker(true);
        }}
      >
        <TextInput
          style={styles.input}
          pointerEvents="none"
          placeholder="Select date and time"
          value={formatDisplayDate(date)}
          editable={false}
        />
        <Icon name="calendar-today" size={20} color="#666" />
      </TouchableOpacity>

      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {showPicker && (
        <View>
          <DateTimePicker
            value={Platform.OS === 'ios' ? tempDate : date}
            mode={Platform.OS === 'ios' ? 'datetime' : mode}
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />

          {/* ✅ iOS Done Button */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onDonePress}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  errorBorder: {
    borderWidth: 0.5,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  doneBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default DateTimePickerComponent;
