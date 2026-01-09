import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HideHomeModal = ({visible, onCheckStatus}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = async () => {
    setLoading(true);

    try {
      // 🔥 1) API call aur delay dono parallel chalenge
      const apiCall = onCheckStatus(); // API call
      const delay = new Promise(res => setTimeout(res, 2000)); // 2 sec wait

      // 🔥 2) Dono ka wait karega → minimum 2 sec guarantee
      const res = await Promise.all([apiCall, delay]).then(r => r[0]);

      // 🔥 3) Toast
      if (res?.message) {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="hourglass-bottom" size={60} color="#007AFF" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Account Approval Pending</Text>

          {/* Message */}
          <Text style={styles.message}>
            Thank you for registering with us.{'\n\n'}
            Your account is currently under review.{'\n'}
            Our team will verify your details and update you shortly.
          </Text>

          {/* Button with Loader */}
          <TouchableOpacity
            style={[styles.button, loading && {opacity: 0.7}]}
            onPress={handleCheckStatus}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Check Status</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HideHomeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: responsiveWidth(88),
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 10,
  },
  iconContainer: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    borderRadius: responsiveWidth(11),
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(2.5),
  },
  title: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: responsiveHeight(1.5),
    textAlign: 'center',
  },
  message: {
    fontSize: responsiveFontSize(2.1),
    color: '#444',
    lineHeight: responsiveHeight(3.2),
    textAlign: 'center',
    marginBottom: responsiveHeight(3),
  },
  button: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#007AFF',
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(10),
    borderRadius: 12,
  },
  buttonText: {
    fontSize: responsiveFontSize(2.2),
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
