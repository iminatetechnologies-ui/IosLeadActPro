import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
  useColorScheme,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {useDispatch, useSelector} from 'react-redux';
import {useUser} from '../contaxt/UserContext';
import {_post, _get} from './../../api/apiClient';
import {
  storeUserData,
  getUserData,
} from '../../components/EncryptedStorageUtil';
import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/Ionicons';
import styles, {isTablet, isLandscape} from './Login2.styles';

export default function Login2({navigation, route}) {
  const {email: prefillEmail, password: prefillPassword} = route.params || {};
  const scheme = useColorScheme();
  const [email, setEmail] = useState(prefillEmail || '');
  const [password, setPassword] = useState(prefillPassword || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: null,
    deviceName: null,
    deviceType: null,
  });

  // Error states for different fields
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deviceName, setDeviceName] = useState(null);

  const dispatch = useDispatch();
  const {loading, error} = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {setUser} = useUser();

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
    if (prefillPassword) setPassword(prefillPassword);
  }, [prefillEmail, prefillPassword]);

  // Get device info
  useEffect(() => {
    const initialize = async () => {
      try {
        const name = await DeviceInfo.getDeviceName();
        setDeviceName(name);
      } catch (error) {
        console.error('Error getting device name:', error);
        setDeviceName('Unknown Device');
      }
    };
    initialize();
  }, []);

  // Clear all error messages
  const clearAllErrors = () => {
    setEmailError('');
    setPasswordError('');
    setOtpError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  // Show success message temporarily
  const showSuccessMessage = message => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 1000);
  };

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceType = DeviceInfo.getDeviceType();

      setDeviceInfo({
        deviceName,
        deviceType,
      });
    };

    fetchDeviceInfo();
  }, []);

  const addDevice = async () => {
    try {
      const data = {
        device_id: deviceInfo.deviceName,
        device_name: deviceInfo.deviceName,
        type: deviceInfo.deviceType,
        env: 'dev',
      };

      const response = await _post('/add-device', data);
      console.log('✅ Device registered: for login page', response);
    } catch (error) {
      console.log('❌ Error registering device:', error);
    }
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(email) || phoneRegex.test(email);
  };

  const handleLogin = async () => {
    clearAllErrors();
    let hasError = false;

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email or phone number');
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email or 10-digit phone number');
      hasError = true;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Please enter your password');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await _post('/login', {email, password});

      if (response.status === 200) {
        // 🔹 Store token in EncryptedStorage
        await storeUserData('userToken', response.data.access_token);

        // 🔹 Add device info after login
        await addDevice();

        // 🔹 Fetch user profile AFTER login
        const profileRes = await _get('/user-profile', {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        });
        const data = profileRes?.data?.data;

        if (data?.name) {
          setUser({
            name: data.name,
            avatar: data.avatar || '',
          });
        }

        // 🔹 Success messages and navigation
        showSuccessMessage('Login Successful! Welcome back.');
        
        // iOS doesn't have ToastAndroid, using Alert instead
        Alert.alert('Success', 'Login Successful! Welcome back.');

        setTimeout(() => {
          const {usertype, plan, requested_plan} = response.data;

          console.log(
            '➡️ UserType:',
            usertype,
            '| Plan:',
            plan,
            '| RequestedPlan:',
            requested_plan,
          );

          if (usertype === 'company' && Number(plan) === 0) {
            if (Number(requested_plan) !== 0) {
              navigation.replace('Home');
            } else {
              navigation.replace('Plans');
            }
          } else {
            navigation.replace('Home');
          }
        }, 300);
      } else {
        setGeneralError(response.data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.log('⛔ Full error object:', error);

      if (error.response?.status === 401) {
        setGeneralError('Invalid email or password. Please try again.');
      } else if (!error.response) {
        setGeneralError('No internet connection. Please try again.');
      } else {
        setGeneralError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    clearAllErrors();

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await _post('/forget', {email});

      if (response.status === 200) {
        showSuccessMessage(`OTP has been sent to ${email}`);
        setIsOtpSent(true);
      } else {
        setGeneralError(
          response.data.message || 'Failed to send OTP. Please try again.',
        );
      }
    } catch (error) {
      console.error('OTP error:', error);
      setGeneralError(
        'Something went wrong while sending OTP. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    clearAllErrors();
    let hasError = false;

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      hasError = true;
    }

    // Validate OTP
    if (!otp.trim()) {
      setOtpError('Please enter the OTP sent to your email');
      hasError = true;
    } else if (otp.length < 4) {
      setOtpError('Please enter a valid OTP');
      hasError = true;
    }

    // Validate new password
    if (!newPassword.trim()) {
      setNewPasswordError('Please enter a new password');
      hasError = true;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Password must be at least 6 characters long');
      hasError = true;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await _post('/reset-password', {
        email,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      if (response.status === 200) {
        showSuccessMessage(
          'Password has been reset successfully! Please login with your new password.',
        );

        setTimeout(() => {
          setIsForgotMode(false);
          setIsOtpSent(false);
          setEmail('');
          setPassword('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          clearAllErrors();
        }, 2000);
      } else {
        const msg =
          response.data?.message ||
          'Failed to reset password. Please try again.';
        setGeneralError(msg);
      }
    } catch (error) {
      if (error.response) {
        const serverMessage =
          error.response.data?.error || error.response.data?.message;
        setGeneralError(
          serverMessage ||
            'Failed to reset password. Please check your inputs.',
        );
      } else if (error.request) {
        setGeneralError('Please check your network connection.');
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }

      console.log(
        'Reset Password Error:',
        error.response?.data || error.message,
      );
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

  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding">
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

          <View style={styles.headerContent}>
            <Image
              source={require('../../assets/images/mainlogo.png')}
              style={styles.logo}
            />
            <Text style={styles.headerText}>Hello{'\n'}Sign in..!</Text>
          </View>

          <View style={styles.formContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.card}>
                {/* Success Message */}
                <SuccessText message={successMessage} />

                {/* General Error Message */}
                <ErrorText error={generalError} />

                {!isForgotMode ? (
                  <>
                    {/* Email Input */}
                    <TextInput
                      placeholder="Gmail or Phone"
                      placeholderTextColor="#7F7F7F"
                      style={[
                        styles.input,
                        emailError ? styles.inputError : null,
                      ]}
                      value={email}
                      onChangeText={text => {
                        setEmail(text);
                        if (emailError) setEmailError('');
                        if (generalError) setGeneralError('');
                      }}
                    />
                    <ErrorText error={emailError} />

                    {/* Password Input with Toggle */}
                    <View style={styles.passwordContainer}>
                      <TextInput
                        placeholder="Password"
                        placeholderTextColor="#7F7F7F"
                        secureTextEntry={!showPassword}
                        style={[
                          styles.passwordInput,
                          passwordError ? styles.inputError : null,
                        ]}
                        value={password}
                        onChangeText={text => {
                          setPassword(text);
                          if (passwordError) setPasswordError('');
                          if (generalError) setGeneralError('');
                        }}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#7F7F7F"
                        />
                      </TouchableOpacity>
                    </View>
                    <ErrorText error={passwordError} />

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity
                        style={styles.forgotButton}
                        onPress={() => {
                          setIsForgotMode(true);
                          clearAllErrors();
                        }}>
                        <Text style={styles.forgotText}>Forget Password</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        style={styles.forgotButton}
                        onPress={() => navigation.navigate('Sign_up')}>
                        <Text style={styles.forgotText}>
                          Create New Account
                        </Text>
                      </TouchableOpacity> */}
                    </View>

                    <TouchableOpacity
                      onPress={handleLogin}
                      disabled={isLoading}
                      activeOpacity={0.8}
                      style={styles.signInButton}
                    >
                      <LinearGradient
                        colors={['#0066CC', '#0052A3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Text style={styles.buttonText}>Sign In</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Forgot Password Mode */}
                    <TextInput
                      placeholder="Enter your Email"
                      placeholderTextColor="#7F7F7F"
                      style={[
                        styles.input,
                        emailError ? styles.inputError : null,
                      ]}
                      value={email}
                      onChangeText={text => {
                        setEmail(text);
                        if (emailError) setEmailError('');
                      }}
                      editable={!isOtpSent}
                    />
                    <ErrorText error={emailError} />

                    {!isOtpSent ? (
                      <TouchableOpacity
                        onPress={handleSendOtp}
                        style={styles.signInButton}
                        disabled={isLoading}>
                        <LinearGradient
                          colors={['#0058aa', '#0058aa']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={styles.buttonGradient}>
                          {isLoading ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text style={styles.buttonText}>Send OTP</Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <>
                        {/* OTP Input */}
                        <TextInput
                          placeholder="Enter OTP"
                          placeholderTextColor="#7F7F7F"
                          style={[
                            styles.input,
                            otpError ? styles.inputError : null,
                          ]}
                          value={otp}
                          onChangeText={text => {
                            setOtp(text);
                            if (otpError) setOtpError('');
                          }}
                          keyboardType="numeric"
                          maxLength={6}
                        />
                        <ErrorText error={otpError} />

                        {/* New Password Input with Toggle */}
                        <View style={styles.passwordContainer}>
                          <TextInput
                            placeholder="New Password"
                            placeholderTextColor="#7F7F7F"
                            secureTextEntry={!showNewPassword}
                            style={[
                              styles.passwordInput,
                              newPasswordError ? styles.inputError : null,
                            ]}
                            value={newPassword}
                            onChangeText={text => {
                              setNewPassword(text);
                              if (newPasswordError) setNewPasswordError('');
                            }}
                          />
                          <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() =>
                              setShowNewPassword(!showNewPassword)
                            }>
                            <Icon
                              name={showNewPassword ? 'eye-off' : 'eye'}
                              size={20}
                              color="#7F7F7F"
                            />
                          </TouchableOpacity>
                        </View>
                        <ErrorText error={newPasswordError} />

                        {/* Confirm Password Input with Toggle */}
                        <View style={styles.passwordContainer}>
                          <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="#7F7F7F"
                            secureTextEntry={!showConfirmPassword}
                            style={[
                              styles.passwordInput,
                              confirmPasswordError ? styles.inputError : null,
                            ]}
                            value={confirmPassword}
                            onChangeText={text => {
                              setConfirmPassword(text);
                              if (confirmPasswordError)
                                setConfirmPasswordError('');
                            }}
                          />
                          <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }>
                            <Icon
                              name={showConfirmPassword ? 'eye-off' : 'eye'}
                              size={20}
                              color="#7F7F7F"
                            />
                          </TouchableOpacity>
                        </View>
                        <ErrorText error={confirmPasswordError} />

                        <TouchableOpacity
                          onPress={handleResetPassword}
                          style={styles.signInButton}
                          disabled={isLoading}>
                          <LinearGradient
                            colors={['#0058aa', '#0058aa']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={styles.buttonGradient}>
                            {isLoading ? (
                              <ActivityIndicator color="#fff" />
                            ) : (
                              <Text style={styles.buttonText}>
                                Reset Password
                              </Text>
                            )}
                          </LinearGradient>
                        </TouchableOpacity>
                      </>
                    )}
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => {
                        setIsForgotMode(false);
                        setIsOtpSent(false);
                        setOtp('');
                        setNewPassword('');
                        setConfirmPassword('');
                        clearAllErrors();
                      }}>
                      <Text style={styles.backButtonText}> ← Back to Login</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
}