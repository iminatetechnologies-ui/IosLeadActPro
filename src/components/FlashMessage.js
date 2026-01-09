// FlashMessage.js
import React from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';

// Helper function to show success message
export const showSuccess = (message) => {
  showMessage({
    message: message,
    type: 'success', // Can be 'success', 'danger', 'info', or 'default'
    icon: 'success',
    duration: 3000, // Duration in milliseconds
    backgroundColor: 'green', // You can customize the background color
    color: 'white', // Text color
  });
};

// Helper function to show error message
export const showError = (message) => {
  showMessage({
    message: message,
    type: 'danger', // Error messages use 'danger' type
    icon: 'danger',
    duration: 3000, // Duration in milliseconds
    backgroundColor: 'red', // Custom error color
    color: 'white', // Text color
  });
};

const FlashMessageComponent = () => {
  return <FlashMessage position="top" />; // Set position to 'top' or 'bottom'
};

export default FlashMessageComponent;




// // CustomFlashMessage.js
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import FlashMessage, { showMessage } from 'react-native-flash-message';
// import Icon from 'react-native-vector-icons/Feather';

// // ✅ Success message helper
// export const showSuccess = (message) => {
//   showMessage({
//     message: message,
//     type: 'success',
//     icon: 'success',
//     duration: 3000,
//     position: 'bottom', // 👈 bottom toast
//     floating: true,
//   });
// };

// // ✅ Error message helper
// export const showError = (message) => {
//   showMessage({
//     message: message,
//     type: 'danger',
//     icon: 'danger',
//     duration: 3000,
//     position: 'bottom', // 👈 bottom toast
//     floating: true,
//   });
// };

// // ✅ Custom Toast UI
// const CustomFlashMessage = (props) => {
//   const { message } = props;

//   return (
//     <View
//       style={[
//         styles.container,
//         message.type === 'success' ? styles.success : styles.error,
//       ]}
//     >
//       <Icon
//         name={message.type === 'success' ? 'check-circle' : 'alert-circle'}
//         size={20}
//         color="#fff"
//         style={{ marginRight: 6 }}
//       />
//       <Text style={styles.text}>{message.message}</Text>
//     </View>
//   );
// };

// // ✅ FlashMessage Root Component
// const FlashMessageComponent = () => {
//   return (
//     <FlashMessage
//       position="bottom"
//       MessageComponent={CustomFlashMessage}
//       floating={true}
//     />
//   );
// };

// export default FlashMessageComponent;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 25, // 👈 toast look (pill shape)
//     marginBottom: 50, // 👈 above bottom
//     marginHorizontal: 20,
//     elevation: 5,
//   },
//   success: {
//     backgroundColor: '#4CAF50',
//   },
//   error: {
//     backgroundColor: '#F44336',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });
