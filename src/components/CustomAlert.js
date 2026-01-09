
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const CustomAlert = ({ 
  visible, 
  title, 
  message, 
  onCancel, 
  onConfirm, 
  cancelText = "Cancel", 
  confirmText = "OK" 
}) => {
  const slideAnim = useRef(new Animated.Value(2000)).current; // start position (bottom)

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onCancel}>
      
      <View style={styles.overlay}>
        <Animated.View style={[styles.alertBox, { transform: [{ translateY: slideAnim }] }]}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            {onCancel && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.btnText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            {onConfirm && (
              <TouchableOpacity style={styles.okBtn} onPress={onConfirm}>
                <Text style={styles.btnText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 280,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#222',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  okBtn: {
    backgroundColor: '#2D87DB',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
