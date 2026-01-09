import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const EditModalLeadView = ({
  visible,
  onClose,
  name,
  setName,
  alternateNumber,
  setAlternateNumber,
  email,
  setEmail,
  onSubmit,
  loading,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Edit Lead Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Alternate Number"
            value={alternateNumber}
            keyboardType="phone-pad"
            onChangeText={setAlternateNumber}
          />

          <TextInput
            style={styles.input}
            placeholder="Email ID"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSubmit}
              style={styles.saveButton}
              disabled={loading}>
              <Text style={styles.saveText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditModalLeadView;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    height: 45,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  cancelButton: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cancelText: {
    color: '#000',
    fontWeight:'bold',
  },
  saveButton: {
    backgroundColor: '#0389ca',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
