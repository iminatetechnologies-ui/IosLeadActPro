import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  useColorScheme,
  ToastAndroid,
  Dimensions,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {_post} from '../../api/apiClient';

import styles from './SignUpStyles'; // Import external stylesheet

export default function SignUp({navigation}) {
  const scheme = useColorScheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [userType, setUserType] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown states
  const [userTypeModalVisible, setUserTypeModalVisible] = useState(false);
  const [companyTypeModalVisible, setCompanyTypeModalVisible] = useState(false);

  // Dropdown options
  const userTypeOptions = [
    {label: 'Freelancer', value: 'freelancer'},
    {label: 'Individual', value: 'individual'},
    {label: 'Company', value: 'company'},
  ];

  const companyTypeOptions = [
    {label: 'Private Limited', value: 'private Limited'},
    {label: 'Public Limited', value: 'public Limited'},
    {label: 'Partnership', value: 'partnership'},
    {label: 'Proprietor', value: 'proprietor'},
  ];

  // Individual error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [userTypeError, setUserTypeError] = useState('');
  const [companyTypeError, setCompanyTypeError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Clear all error messages
  const clearAllErrors = () => {
    setNameError('');
    setEmailError('');
    setMobileError('');
    setCompanyNameError('');
    setAddressError('');
    setUserTypeError('');
    setCompanyTypeError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  // Show success message temporarily
  const showSuccessMessage = message => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = mobile => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateName = name => {
    return name.trim().length >= 2;
  };

  const handleUserTypeSelect = option => {
    setUserType(option.value);
    setUserTypeModalVisible(false);
    if (userTypeError) setUserTypeError('');
    if (generalError) setGeneralError('');

    if (option.value === 'freelancer' || option.value === 'individual') {
      setCompanyType('');
      if (companyTypeError) setCompanyTypeError('');
    }
  };

  const handleCompanyTypeSelect = option => {
    setCompanyType(option.value);
    setCompanyTypeModalVisible(false);
    if (companyTypeError) setCompanyTypeError('');
    if (generalError) setGeneralError('');
  };

  const getUserTypeLabel = () => {
    const option = userTypeOptions.find(opt => opt.value === userType);
    return option ? option.label : 'Select User Type';
  };

  const getCompanyTypeLabel = () => {
    const option = companyTypeOptions.find(opt => opt.value === companyType);
    return option ? option.label : 'Select Company Type';
  };

  const handleSignUp = async () => {
    clearAllErrors();
    let hasError = false;

    // Validate name
    if (!name.trim()) {
      setNameError('Please enter your full name');
      hasError = true;
    } else if (!validateName(name)) {
      setNameError('Name must be at least 2 characters long');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!mobile.trim()) {
      setMobileError('Please enter your mobile number');
      hasError = true;
    } else if (!validateMobile(mobile.trim())) {
      setMobileError('Please enter a valid 10-digit mobile number');
      hasError = true;
    }

    if (!companyName.trim()) {
      setCompanyNameError('Please enter your company name');
      hasError = true;
    } else if (companyName.trim().length < 2) {
      setCompanyNameError('Company name must be at least 2 characters long');
      hasError = true;
    }

    if (!address.trim()) {
      setAddressError('Please enter your address');
      hasError = true;
    } else if (address.trim().length < 10) {
      setAddressError('Please enter a complete address');
      hasError = true;
    }

    if (!userType) {
      setUserTypeError('Please select a user type');
      hasError = true;
    }

    if (
      userType !== 'freelancer' &&
      userType !== 'individual' &&
      !companyType
    ) {
      setCompanyTypeError('Please select a company type');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const signupPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        companyName: companyName.trim(),
        address: address.trim(),
        userType: userType,
        companyType: companyType,
      };

      console.log('Sending signup payload:--------', signupPayload);

      const response = await _post('/signup', signupPayload);

      console.log('Signup successful:', response);
      showSuccessMessage('successfully! OTP sent to your email.');

      setTimeout(() => {
        navigation.navigate('Very_Email', {email: email.trim()});
      }, 1500);
    } catch (error) {
      console.error('Signup error full object:', error);

      let errorMessage = 'Sign up failed. Please try again.';

      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);

        if (error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;

          if (serverErrors.email) {
            setEmailError(
              serverErrors.email[0] || 'Email is already registered',
            );
          }
          if (serverErrors.mobile) {
            setMobileError(
              serverErrors.mobile[0] || 'Mobile number is already registered',
            );
          }
          if (serverErrors.name) {
            setNameError(serverErrors.name[0]);
          }
          if (serverErrors.companyName) {
            setCompanyNameError(serverErrors.companyName[0]);
          }
          if (serverErrors.address) {
            setAddressError(serverErrors.address[0]);
          }
          if (serverErrors.userType) {
            setUserTypeError(serverErrors.userType[0]);
          }
          if (serverErrors.companyType) {
            setCompanyTypeError(serverErrors.companyType[0]);
          }

          if (
            !serverErrors.email &&
            !serverErrors.mobile &&
            !serverErrors.name &&
            !serverErrors.companyName &&
            !serverErrors.address &&
            !serverErrors.userType &&
            !serverErrors.companyType
          ) {
            setGeneralError(error.response.data.message || errorMessage);
          }
        } else {
          setGeneralError(error.response.data.message || errorMessage);
        }
      } else if (error.request) {
        console.error('Error request (no response):', error.request);
        setGeneralError(
          'Network error. Please check your internet connection.',
        );
      } else {
        console.error('Error message:', error.message);
        setGeneralError(error.message || errorMessage);
      }

      if (Platform.OS === 'android') {
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorText = ({error}) => {
    if (!error) return null;
    return <Text style={styles.errorText}>{error}</Text>;
  };

  const SuccessText = ({message}) => {
    if (!message) return null;
    return <Text style={styles.successText}>{message}</Text>;
  };

  const DropdownModal = ({visible, onClose, options, onSelect, title}) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => onSelect(item)}>
                <Text style={styles.modalOptionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground
          source={require('../../assets/images/loginback.jpeg')}
          style={{flex: 1}}
          resizeMode="cover">
          <LinearGradient
            colors={[
              'rgba(220, 239, 255, 0.0)',
              '#02519F',
              '#02519F',
              '#02519F',
            ]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={StyleSheet.absoluteFillObject}
          />

          <View
            style={[
              styles.headerContent,
              {
                paddingTop:
                  Platform.OS === 'android' ? StatusBar.currentHeight : 0,
              },
            ]}>
            <Image
              source={require('../../assets/images/mainlogo.png')}
              style={styles.logo}
            />
            <Text style={styles.headerText}>Sign up..!</Text>
          </View>

          <View style={styles.formContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.card}>
                <SuccessText message={successMessage} />
                <ErrorText error={generalError} />

                {/* User Type dropdown */}
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={[
                      styles.dropdown,
                      userTypeError && styles.inputError,
                    ]}
                    onPress={() => setUserTypeModalVisible(true)}>
                    <Text
                      style={[
                        styles.dropdownText,
                        !userType && styles.dropdownPlaceholder,
                      ]}>
                      {getUserTypeLabel()}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                  <ErrorText error={userTypeError} />
                </View>

                {/* Company Type dropdown if applicable */}
                {userType &&
                  userType !== 'freelancer' &&
                  userType !== 'individual' && (
                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        style={[
                          styles.dropdown,
                          companyTypeError && styles.inputError,
                        ]}
                        onPress={() => setCompanyTypeModalVisible(true)}>
                        <Text
                          style={[
                            styles.dropdownText,
                            !companyType && styles.dropdownPlaceholder,
                          ]}>
                          {getCompanyTypeLabel()}
                        </Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                      </TouchableOpacity>
                      <ErrorText error={companyTypeError} />
                    </View>
                  )}

                {/* Full Name */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#7F7F7F"
                    style={[
                      styles.input,
                      {color: scheme === 'dark' ? '#000' : '#000'},
                      nameError && styles.inputError,
                    ]}
                    value={name}
                    onChangeText={text => {
                      setName(text);
                      if (nameError) setNameError('');
                      if (generalError) setGeneralError('');
                    }}
                    autoCapitalize="words"
                  />
                  <ErrorText error={nameError} />
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor="#7F7F7F"
                    style={[
                      styles.input,
                      {color: scheme === 'dark' ? '#000' : '#000'},
                      emailError && styles.inputError,
                    ]}
                    value={email}
                    onChangeText={text => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                      if (generalError) setGeneralError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  <ErrorText error={emailError} />
                </View>

                {/* Mobile Number */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Mobile Number (10 digits)"
                    placeholderTextColor="#7F7F7F"
                    style={[
                      styles.input,
                      {color: scheme === 'dark' ? '#000' : '#000'},
                      mobileError && styles.inputError,
                    ]}
                    value={mobile}
                    onChangeText={text => {
                      const numericText = text
                        .replace(/[^0-9]/g, '')
                        .slice(0, 10);
                      setMobile(numericText);
                      if (mobileError) setMobileError('');
                      if (generalError) setGeneralError('');
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  <ErrorText error={mobileError} />
                </View>

                {/* Company Name */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Company Name"
                    placeholderTextColor="#7F7F7F"
                    style={[
                      styles.input,
                      {color: scheme === 'dark' ? '#000' : '#000'},
                      companyNameError && styles.inputError,
                    ]}
                    value={companyName}
                    onChangeText={text => {
                      setCompanyName(text);
                      if (companyNameError) setCompanyNameError('');
                      if (generalError) setGeneralError('');
                    }}
                    autoCapitalize="words"
                  />
                  <ErrorText error={companyNameError} />
                </View>

                {/* Address */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Complete Address"
                    placeholderTextColor="#7F7F7F"
                    style={[
                      styles.inputMultiline,
                      {color: scheme === 'dark' ? '#000' : '#000'},
                      addressError && styles.inputMultilineError,
                    ]}
                    value={address}
                    onChangeText={text => {
                      setAddress(text);
                      if (addressError) setAddressError('');
                      if (generalError) setGeneralError('');
                    }}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    autoCapitalize="words"
                  />
                  <ErrorText error={addressError} />
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  onPress={handleSignUp}
                  style={styles.signUpButton}
                  disabled={isLoading}>
                  <LinearGradient
                    colors={['#0058aa', '#0058aa']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.signUpGradient}>
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.signUpText}>Sign up</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Redirect */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}>
                    Already have an account? Login
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Dropdown Modals */}
          <DropdownModal
            visible={userTypeModalVisible}
            onClose={() => setUserTypeModalVisible(false)}
            options={userTypeOptions}
            onSelect={handleUserTypeSelect}
            title="Select User Type"
          />

          <DropdownModal
            visible={companyTypeModalVisible}
            onClose={() => setCompanyTypeModalVisible(false)}
            options={companyTypeOptions}
            onSelect={handleCompanyTypeSelect}
            title="Select Company Type"
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
}
