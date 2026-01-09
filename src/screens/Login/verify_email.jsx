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
  StatusBar,
  ScrollView,
  Platform,
  useColorScheme,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute} from '@react-navigation/native';

import {_post} from '../../api/apiClient';
import styles from './verify_email_style';

export default function EmailVerify({navigation}) {
  const route = useRoute();
  const {
    name,
    email: passedEmail,
    mobile,
    companyName,
    address,
  } = route.params || {};

  const scheme = useColorScheme();
  const [email, setEmail] = useState(passedEmail || '');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Individual error states
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);

  // Clear all error messages
  const clearAllErrors = () => {
    setEmailError('');
    setOtpError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  // Show success message temporarily
  const showSuccessMessage = message => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    console.log('Received data from SignUp:', {
      name,
      passedEmail,
      mobile,
      companyName,
      address,
    });

    // Show welcome message
    if (passedEmail) {
      showSuccessMessage(`OTP sent to ${passedEmail}.`);
    }
  }, []);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOtp = otp => {
    return (
      otp.trim().length >= 4 &&
      otp.trim().length <= 6 &&
      /^\d+$/.test(otp.trim())
    );
  };

const handleResendOtp = async () => {
  // 🧹 Clear previous errors
  clearAllErrors();

  // ✅ Validate email
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
    // 📤 Send only email payload
    const payload = { email: email.trim().toLowerCase() };
    console.log('📩 Resend OTP Payload:', payload);

    // ✅ API call  
    const response = await _post('/resend-otp', payload);

    console.log('📩 Resend OTP Response:', response.data);

    const res = response?.data;

    if (res?.success === true || res?.success === 1) {
      // ✅ Success — backend will send OTP automatically
      showSuccessMessage(res?.message || 'OTP sent successfully! Please check your email.');

      // 🔄 Optional: start resend timer (disable button for a while)
      setCanResendOtp(false);
      setOtpTimer(60); // seconds

    } else {
      // ❌ Server returned a failure message
      setGeneralError(res?.message || 'Failed to send OTP. Please try again.');
    }
  } catch (error) {
    console.error('❌ Resend OTP error:', error?.response?.data || error.message);

    // ⚠️ Handle backend error gracefully
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';
    setGeneralError(errMsg);

    // 🔔 Optional toast on Android
    if (Platform.OS === 'android') {
      ToastAndroid.show('Failed to send OTP', ToastAndroid.SHORT);
    }
  } finally {
    setIsLoading(false);
  }
};


 

  const handleVerify = async () => {
    clearAllErrors();
    let hasError = false;

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    // Validate OTP
    if (!otp.trim()) {
      setOtpError('Please enter the OTP sent to your email');
      hasError = true;
    } else if (!validateOtp(otp)) {
      setOtpError('Please enter a valid 4-6 digit OTP');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      };

      console.log('Sending verify payload:', payload);

      const response = await _post('/verify-email-otp', payload);

      console.log('Verification successfulyuio=========:---', response);

      showSuccessMessage('Email verified successfully...');

      // Extract email and password from response
      const {email: verifiedEmail, password} = response.data.data;
      console.log('✅ Email and password to send to Login screen:',
         {
        email: verifiedEmail,
        password: password,
      });

      setTimeout(() => {
        setEmail('');
        setOtp('');
        // Pass email and password as params to Login screen
        navigation.navigate('Login', {
          email: verifiedEmail,
          password: password,
        });
      }, 2000);
    } catch (error) {
      console.error('Verify error:', error);

      if (error.response) {
        const serverErrors = error.response.data;

        if (serverErrors.errors) {
          // Handle specific field errors from server
          if (serverErrors.errors.email) {
            setEmailError(
              serverErrors.errors.email[0] || 'Invalid email address',
            );
          }
          if (serverErrors.errors.otp) {
            setOtpError(serverErrors.errors.otp[0] || 'Invalid or expired OTP');
          }
        } else {
          // Handle general error messages
          const errorMessage = serverErrors.message;
          if (errorMessage && errorMessage.toLowerCase().includes('otp')) {
            setOtpError(errorMessage);
          } else if (
            errorMessage &&
            errorMessage.toLowerCase().includes('email')
          ) {
            setEmailError(errorMessage);
          } else {
            setGeneralError(
              errorMessage || 'Verification failed. Please try again.',
            );
          }
        }
      } else if (error.request) {
        setGeneralError(
          'Network error. Please check your internet connection.',
        );
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }

      // Backup platform-specific notification
      if (Platform.OS === 'android') {
        ToastAndroid.show('Verification failed', ToastAndroid.SHORT);
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

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <Text style={styles.headerText}>Email Verification</Text>
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

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    placeholder="Enter your email"
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

                {/* OTP Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.otpLabelContainer}>
                    <Text style={styles.inputLabel}>Verification Code</Text>
                    <TouchableOpacity
                      onPress={handleResendOtp}
                      disabled={!canResendOtp || isLoading}
                      style={[
                        styles.resendButton,
                        (!canResendOtp || isLoading) &&
                          styles.resendButtonDisabled,
                      ]}>
                      <Text
                        style={[
                          styles.resendText,
                          (!canResendOtp || isLoading) &&
                            styles.resendTextDisabled,
                        ]}>
                        {!canResendOtp
                          ? `Resend in ${formatTime(otpTimer)}`
                          : 'Resend OTP'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#7F7F7F"
                    style={[
                      styles.input,
                      styles.otpInput,
                      {color: scheme === 'dark' ? '#000' : '#000'},
                      otpError && styles.inputError,
                    ]}
                    value={otp}
                    onChangeText={text => {
                      // Only allow numbers and limit to 6 digits
                      const numericText = text
                        .replace(/[^0-9]/g, '')
                        .slice(0, 6);
                      setOtp(numericText);
                      if (otpError) setOtpError('');
                      if (generalError) setGeneralError('');
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                    textAlign="center"
                  />
                  <ErrorText error={otpError} />
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  onPress={handleVerify}
                  style={styles.verifyButton}
                  disabled={isLoading}>
                  <LinearGradient
                    colors={['#0058aa', '#0058aa']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.verifyGradient}>
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.verifyText}>Verify Email</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Help Text */}
                <View style={styles.helpContainer}>
                  <Text style={styles.helpText}>
                    Didn't receive the code? Check your spam folder or try
                    resending.
                  </Text>
                </View>

                {/* Back to Login */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}>← Back to Login</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
}
