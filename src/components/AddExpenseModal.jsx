import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const AddExpenseModal = ({visible, onClose, onAdd}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleAdd = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('amount', amount);
    formData.append('description', description);
    formData.append('expense_date', new Date().toISOString().split('T')[0]);

    if (file) {
      formData.append('invoice_file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    onAdd(formData);
    handleReset();
  };

  const handleReset = () => {
    setTitle('');
    setAmount('');
    setDescription('');
    setFile(null);
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('File Picker Error:', err);
        Alert.alert('Error', 'Unable to pick file');
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Add New Expense</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              placeholder="Title *"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Amount *"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              placeholderTextColor="#999"
              multiline
            />

            <TouchableOpacity style={styles.fileButton} onPress={pickFile}>
              <Text style={styles.fileButtonText}>
                📎 {file ? file.name : 'Attach Bill / Invoice'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddExpenseModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 6,
    maxHeight: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 15,
    color: '#000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  fileButton: {
    borderWidth: 1,
    borderColor: '#0389ca',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  fileButtonText: {
    color: '#0389ca',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#0389ca',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#0389ca',
    fontWeight: '600',
  },
});
