import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {_get, _post} from '../../api/apiClient';
import {useUser} from '../contaxt/UserContext';
import CustomAlert from '../../components/CustomAlert';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const {setUser} = useUser(); // get context setter

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    dob: '',
    gender: '',
  });

  const [originalForm, setOriginalForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    dob: '',
    gender: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isEditing && hasChanges) {
        Alert.alert(
          'Discard Changes?',
          'You have unsaved changes. Are you sure you want to go back?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Discard',
              onPress: () => {
                handleDiscardChanges();
                // Return false to allow default back behavior
                return false;
              },
            },
          ],
        );
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isEditing, hasChanges]);

  const fetchProfileData = async () => {
    try {
      const response = await _get('/user-profile'); // Replace with actual API
      const data = response?.data?.data;
      // console.log('Profile data:----------', data);

      if (data) {
        const profileData = {
          name: data.name || '',
          mobile: data.mobile || '',
          email: data.email || '',
          address: data.address || '',
          dob: data.dob || '',
          gender: data.gender || '',
          avatar: data.avatar || null,
        };

        setForm(profileData);
        setOriginalForm(profileData);

        if (data.avatar) {
          setProfileImage(data.avatar);
        }
        setUser({name: data.name || '', avatar: data.avatar || ''});
      }
    } catch (error) {
      console.log('Failed to fetch profile:', error);
      Alert.alert('Error', 'Failed to load profile data.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setHasChanges(false);
  };

  const handleDiscardChanges = () => {
    // Reset form to original values
    setForm(originalForm);
    setProfileImage(originalForm.avatar || null);
    setImageAsset(null);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleSave = async () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value || '');
    });

    if (imageAsset) {
      data.append('avatar', {
        uri: imageAsset.uri,
        name: imageAsset.fileName || 'photo.jpg',
        type: imageAsset.type || 'image/jpeg',
      });
    }

    setIsLoading(true);

    try {
      const response = await _post('/update-profile', data, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      const updatedUser = response?.data?.user || {}; // ✅ depends on API structure

      // console.log('Profile updated:', updatedUser);
      // Alert.alert('Success', 'Profile updated successfully!');
      showCustomAlert('Success', 'Profile updated successfully!');

      // ✅ Update global context with fresh data
      setUser({
        name: updatedUser.name || form.name,
        avatar: updatedUser.avatar || imageAsset?.uri || '',
      });
      // console.log('✅ Updated context user:', {name: form.name, avatar: profileImage});

      setIsEditing(false);
      setHasChanges(false);
      fetchProfileData();
    } catch (err) {
      console.error('Update failed:', err);
      Alert.alert('Error', 'Something went wrong while updating.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));

    // Check if any field has been changed
    const updatedForm = {...form, [field]: value};
    const hasAnyChanges =
      Object.keys(updatedForm).some(
        key => updatedForm[key] !== originalForm[key],
      ) || imageAsset !== null;

    setHasChanges(hasAnyChanges);
  };

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setProfileImage(asset.uri);
        setImageAsset(asset);
        setHasChanges(true); // Image change counts as a change

        // Automatically enter edit mode when image is changed
        if (!isEditing) {
          setIsEditing(true);
        }
      }
    });
  };

  const handleImagePress = () => {
    if (profileImage) {
      setShowImageModal(true);
    }
  };

  // Check if only image has been changed (no form field changes)
  const hasOnlyImageChanges = () => {
    const hasFormChanges = Object.keys(form).some(
      key => form[key] !== originalForm[key],
    );
    return imageAsset !== null && !hasFormChanges;
  };

  const ImageModal = () => (
    <Modal
      visible={showImageModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowImageModal(false)}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalCloseArea}
          activeOpacity={1}
          onPress={() => setShowImageModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Photo</Text>
              <TouchableOpacity
                onPress={() => setShowImageModal(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalImageContainer}>
              <Image
                source={
                  profileImage
                    ? {uri: profileImage}
                    : require('../../assets/images/mainlogo.png')
                }
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={() => {
                setShowImageModal(false);
                handleImagePick();
              }}>
              <Text style={styles.changePhotoButtonText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={handleImagePress}
              style={{alignItems: 'center'}}>
              <Image
                source={
                  profileImage
                    ? {uri: profileImage}
                    : require('../../assets/images/mainlogo.png')
                }
                onError={() => setProfileImage(null)}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImagePick}>
              <Text style={styles.changePhotoText}>Tap to change photo</Text>
            </TouchableOpacity>
          </View>

          {['name', 'mobile', 'email', 'address', 'dob', 'gender'].map(
            field => (
              <View key={field} style={styles.inputContainer}>
                <Text style={styles.label}>{field.toUpperCase()}</Text>
                {field === 'dob' ? (
                  <>
                    <TouchableOpacity
                      onPress={() => isEditing && setShowDobPicker(true)}
                      style={[
                        styles.input,
                        {
                          justifyContent: 'center',
                          backgroundColor: isEditing ? '#fff' : '#eee',
                        },
                      ]}>
                      <Text style={{color: form.dob ? '#000' : '#999'}}>
                        {form.dob || 'YYYY-MM-DD'}
                      </Text>
                    </TouchableOpacity>
                    {showDobPicker && (
                      <DateTimePicker
                        value={
                          form.dob ? new Date(form.dob) : new Date('2000-01-01')
                        }
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDobPicker(false);
                          if (selectedDate) {
                            const formatted =
                              moment(selectedDate).format('YYYY-MM-DD');
                            handleChange('dob', formatted);
                          }
                        }}
                        maximumDate={new Date()}
                      />
                    )}
                  </>
                ) : (
                  <TextInput
                    value={form[field]}
                    onChangeText={val => handleChange(field, val)}
                    editable={isEditing}
                    style={[
                      styles.input,
                      {backgroundColor: isEditing ? '#fff' : '#eee'},
                    ]}
                    placeholder={`Enter ${field}`}
                    placeholderTextColor="#999"
                  />
                )}
              </View>
            ),
          )}
        </ScrollView>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onConfirm={() => setAlertVisible(false)}
          confirmText="OK"
        />

        <View style={styles.footer}>
          {isEditing ? (
            <View style={styles.buttonContainer}>
              {hasChanges && (
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Save</Text>
                  )}
                </TouchableOpacity>
              )}

              {/* Show Cancel button when in edit mode */}
              <TouchableOpacity
                style={[styles.cancelBtn, hasChanges && {marginTop: hp('1%')}]}
                onPress={handleDiscardChanges}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      <ImageModal />
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    padding: wp('5%'),
    paddingBottom: hp('10%'),
    alignItems: 'center',
  },
  profileImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: '#ccc',
    marginBottom: hp('1.2%'),
    resizeMode: 'contain',
  },
  changePhotoText: {
    color: '#007AFF',
    fontSize: wp('3.2%'),
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp('0.6%'),
    marginLeft: wp('1%'),
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp('1.5%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: wp('2%'),
    paddingVertical: hp('1.1%'),
    paddingHorizontal: wp('3%'),
    fontSize: wp('3.8%'),
  },
  footer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2.5%'),
    paddingTop: hp('1.2%'),
    backgroundColor: '#f2f2f2',
  },
  buttonContainer: {
    width: '100%',
  },
  editBtn: {
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.4%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.4%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: hp('1.4%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: wp('4.2%'),
    fontWeight: '600',
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
  },
  modalImageContainer: {
    padding: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: screenHeight * 0.4,
  },
  modalImage: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: wp('2%'),
  },
  changePhotoButton: {
    margin: wp('4%'),
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  changePhotoButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});
