// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   Modal,
//   TextInput,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// const options = [
//   'Today',
//   'Yesterday',
//   'Current Month', // 👈 add this line
//   'Last Month',
//   'Last 90 Days',
//   'Yearly',
//   'Custom',
// ];

// const getRange = label => {
//   const today = new Date();
//   const start = new Date();
//   const end = new Date();

//   switch (label) {
//     case 'Today':
//       return [today, today];
//     case 'Yesterday':
//       start.setDate(today.getDate() - 1);
//       return [start, start];
//     case 'Current Month':
//       start.setDate(1); // 👈 1st of current month
//       return [start, today]; // 👈 from 1st to today
//     case 'Last Month':
//       start.setMonth(today.getMonth() - 1);
//       start.setDate(1);
//       end.setDate(0); // 👈 last date of previous month
//       return [start, end];
//     case 'Last 90 Days':
//       start.setDate(today.getDate() - 90);
//       return [start, today];
//     case 'Yearly':
//       start.setFullYear(today.getFullYear() - 1);
//       return [start, today];
//     default:
//       return [null, null];
//   }
// };

// const formatDisplay = date =>
//   date?.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });

// const formatISO = date => date?.toISOString().split('T')[0]; // YYYY-MM-DD

// const DateRangePicker = ({onRangeChange, label = ''}) => {
//   const [rangeLabel, setRangeLabel] = useState('Today');
//   const [[startDate, endDate], setRange] = useState(getRange('Today'));
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleSelect = label => {
//     setRangeLabel(label);
//     setModalVisible(false);
//     if (label === 'Custom') {
//       setShowStartPicker(true);
//     } else {
//       const [start, end] = getRange(label);
//       setRange([start, end]);
//       onRangeChange?.({
//         date_from: formatISO(start),
//         date_to: formatISO(end),
//       });
//     }
//   };

//   const handleDateChange = (type, event, selectedDate) => {
//     if (type === 'start') {
//       setShowStartPicker(false);
//       if (selectedDate) {
//         setRange(prev => [selectedDate, prev[1]]);
//         setShowEndPicker(true);
//       }
//     } else {
//       setShowEndPicker(false);
//       if (selectedDate) {
//         const newRange = [startDate, selectedDate];
//         setRange(newRange);
//         onRangeChange?.({
//           date_from: formatISO(newRange[0]),
//           date_to: formatISO(newRange[1]),
//         });
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>{label}</Text>

//       <TouchableOpacity
//         style={styles.inputContainer}
//         onPress={() => setModalVisible(true)}>
//         <TextInput
//           style={styles.input}
//           value={
//             rangeLabel === 'Custom'
//               ? `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`
//               : rangeLabel
//           }
//           editable={false}
//         />
//         <Icon name="calendar-today" size={20} color="#000" />
//       </TouchableOpacity>

//       {/* Options Modal */}
//       <Modal transparent visible={modalVisible} animationType="fade">
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           onPress={() => setModalVisible(false)}>
//           <View style={styles.modal}>
//             {options.map(opt => (
//               <TouchableOpacity
//                 key={opt}
//                 style={styles.option}
//                 onPress={() => handleSelect(opt)}>
//                 <Text style={styles.optionText}>{opt}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {showStartPicker && (
//         <DateTimePicker
//           value={startDate || new Date()}
//           mode="date"
//           display="calendar"
//           onChange={(e, d) => handleDateChange('start', e, d)}
//           maximumDate={new Date()}
//         />
//       )}

//       {showEndPicker && (
//         <DateTimePicker
//           value={endDate || new Date()}
//           mode="date"
//           display="calendar"
//           onChange={(e, d) => handleDateChange('end', e, d)}
//           minimumDate={startDate}
//           maximumDate={new Date()}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 0,
//     marginHorizontal: 16,
//   },
//   label: {
//     marginBottom: 0,
//     fontSize: 14,
//     color: '#333',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     height: 55,
//     backgroundColor: '#ebedf0',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: 'black',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#00000066',
//   },
//   modal: {
//     backgroundColor: '#fff',
//     marginHorizontal: 40,
//     borderRadius: 10,
//     paddingVertical: 15,
//     elevation: 5,
//   },
//   option: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default DateRangePicker;

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const options = [
  'Today',
  'Yesterday',
  'Current Month',
  'Last Month',
  'Last 90 Days',
  'Yearly',
  'Custom',
];

const getRange = label => {
  const today = new Date();
  const start = new Date();
  const end = new Date();

  switch (label) {
    case 'Today':
      return [today, today];
    case 'Yesterday':
      start.setDate(today.getDate() - 1);
      return [start, start];
    case 'Current Month':
      start.setDate(1);
      return [start, today];
    case 'Last Month':
      start.setMonth(today.getMonth() - 1);
      start.setDate(1);
      end.setDate(0);
      return [start, end];
    case 'Last 90 Days':
      start.setDate(today.getDate() - 90);
      return [start, today];
    case 'Yearly':
      start.setFullYear(today.getFullYear() - 1);
      return [start, today];
    default:
      return [null, null];
  }
};

const formatDisplay = date =>
  date?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatISO = date => date?.toISOString().split('T')[0];

const DateRangePicker = ({onRangeChange, label = ''}) => {
  const [rangeLabel, setRangeLabel] = useState('Today');
  const [[startDate, endDate], setRange] = useState(getRange('Today'));

  const [modalVisible, setModalVisible] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // 🔥 TEMP STATES (iOS spinner ke liye)
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const handleSelect = label => {
    setRangeLabel(label);
    setModalVisible(false);

    if (label === 'Custom') {
      setTempStartDate(startDate || new Date());
      setTempEndDate(endDate || new Date());

      setTimeout(() => {
        setShowCustomModal(true);
      }, Platform.OS === 'ios' ? 300 : 0);
    } else {
      const [start, end] = getRange(label);
      setRange([start, end]);
      onRangeChange?.({
        date_from: formatISO(start),
        date_to: formatISO(end),
      });
    }
  };

  // ✅ FINAL DONE PRESS
  const onDone = () => {
    setShowCustomModal(false);
    setRange([tempStartDate, tempEndDate]);
    setRangeLabel('Custom');

    onRangeChange?.({
      date_from: formatISO(tempStartDate),
      date_to: formatISO(tempEndDate),
    });
  };

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.input}
          editable={false}
          value={
            rangeLabel === 'Custom'
              ? `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`
              : rangeLabel
          }
        />
        <Icon name="calendar-today" size={20} color="#000" />
      </TouchableOpacity>

      {/* OPTIONS MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modal}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={styles.option}
                onPress={() => handleSelect(opt)}>
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 🔥 CUSTOM DATE MODAL (iOS + Android SAFE) */}
      <Modal visible={showCustomModal} animationType="slide">
        <View style={styles.customContainer}>
          <Text style={styles.customTitle}>Select Date Range</Text>

          <Text style={styles.pickerLabel}>Start Date</Text>
          <DateTimePicker
            value={tempStartDate}
            mode="date"
            display="spinner"
            onChange={(e, d) => d && setTempStartDate(d)}
          />

          <Text style={styles.pickerLabel}>End Date</Text>
          <DateTimePicker
            value={tempEndDate}
            mode="date"
            display="spinner"
            minimumDate={tempStartDate}
            onChange={(e, d) => d && setTempEndDate(d)}
          />

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowCustomModal(false)}>
              <Text style={styles.footerText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
              <Text style={styles.footerText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#ebedf0',
    marginTop: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000066',
  },
  modal: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 10,
    paddingVertical: 15,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },

  /* CUSTOM MODAL */
  customContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  customTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  pickerLabel: {
    marginLeft: 16,
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  cancelBtn: {
    padding: 12,
  },
  doneBtn: {
    padding: 12,
  },
  footerText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default DateRangePicker;
