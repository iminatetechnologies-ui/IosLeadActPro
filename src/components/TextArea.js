// import React from 'react';
// import { View, TextInput, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure to install react-native-vector-icons

// const TextareaWithIcon = ({value,onChangeText}) => {
//   return (
//     <View style={styles.container}>
//       <Icon name="edit" size={24} color="#7a7a7a" style={styles.icon} />
//       <TextInput
//         style={styles.textarea}
//         placeholder="Write here..."
//         multiline={true}
//         numberOfLines={4}
//         placeholderTextColor="#999"
//         value={value} // Bind the state to the TextInput
//         onChangeText={onChangeText}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     padding: 10,
//     marginHorizontal: 16,
//     marginTop: 10,
//     //margin: 10,
//   },
//   icon: {
//     marginRight: 10,
//     marginTop: 6,
//   },
//   textarea: {
//     flex: 1,
//     color: '#333',
//     fontSize: 16,
//     textAlignVertical: 'top', // Ensures proper alignment in Android
//     height: 100,
//   },
// });

// export default TextareaWithIcon;


import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TextareaWithIcon = ({ value, onChangeText, error }) => {
  return (
    <View style={{ marginHorizontal: 16, marginTop: 10 }}>
      <View style={[styles.container, error ? styles.errorBorder : null]}>
        <Icon name="edit" size={24} color="#7a7a7a" style={styles.icon} />
        <TextInput
          style={styles.textarea}
          placeholder="Write here..."
          multiline={true}
          numberOfLines={4}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ebedf0',
    borderRadius: 8,
    padding: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 6,
  },
  textarea: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
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
});

export default TextareaWithIcon;
