// import React from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import LinearGradient from 'react-native-linear-gradient';

// const NoticeModal = ({visible, onClose}) => {
//   return (
//     <Modal transparent visible={visible} animationType="slide">
//       <View style={styles.modalBackground}>
//         <View style={styles.modalContainer}>
//           {/* Header */}
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>📢 Notice</Text>
//             <TouchableOpacity onPress={onClose}>
//               <FontAwesome name="times" size={22} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {/* Message */}
//           <View style={styles.messageContainer}>
//             <Text style={styles.noticeText}>
//               📢...Aapke leads data ko aur behtar manage karne ke liye system update kiya gaya hai.
//               Naye features jaise callback reminders aur auto-followup ab uplabdh hain.
//               कृपया अपडेट्स का लाभ उठाएं।
//             </Text>
//           </View>

//           {/* Footer */}
//           <View style={styles.modalActions}>
//             <TouchableOpacity onPress={onClose} style={{flex: 1}}>
//               <LinearGradient
//                colors={['#B3D9FF', '#02519F', '#B3D9FF']}

//                 style={styles.continueButton}>
//                 <Text style={styles.continueButtonText}>Continue</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default NoticeModal;

// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingVertical: 20,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#02519F',
//   },
//   messageContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//   },
//   noticeText: {
//     fontSize: 16,
//     color: '#444',
//     lineHeight: 24,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   continueButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   continueButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {_get} from '../api/apiClient'; // ✅ Make sure path is correct

const NoticeModal = ({visible, onClose}) => {
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchNotice();
    }
  }, [visible]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const res = await _get('/getnotes'); // ✅ Replace with your actual endpoint
      const notice = res?.data?.data;
      if (notice) {
        setNoticeTitle(notice.title || '📢 Notice');
        setNoticeDescription(notice.description || 'कोई विवरण उपलब्ध नहीं है।');
      } else {
        setNoticeTitle('📢 Notice');
        setNoticeDescription('कोई सूचना नहीं मिली।');
      }
    } catch (error) {
      console.error('Notice fetch error:', error);
      setNoticeTitle('❗ Error');
      setNoticeDescription('Notice fetch failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible && !!noticeTitle && !!noticeDescription}
      animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>📢 {noticeTitle}</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#02519F" />
            ) : (
              <Text style={styles.noticeText}>{noticeDescription}</Text>
            )}
          </View>

          {/* Footer */}
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose} style={{flex: 1}}>
              <LinearGradient
                colors={['#B3D9FF', '#02519F', '#B3D9FF']}
                style={styles.continueButton}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NoticeModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#02519F',
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  noticeText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
