import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const isTablet = DeviceInfo.isTablet();
const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: rh(isTablet ? (isLandscape ? 2 : 0) : 1),
  },
  headerContent: {
    alignItems: 'flex-start',
    marginBottom: rh(isTablet ? (isLandscape ? 4 : 0) : 0),
    marginTop: rh(5),
    width: '100%',
    paddingHorizontal: rw(isTablet ? (isLandscape ? 2 : 5) : 5),
  },
  logo: {
    width: rw(isTablet ? (isLandscape ? 20 : 25) : 45),
    height: rh(isTablet ? (isLandscape ? 25 : 25) : 15),
    resizeMode: 'contain',
    marginBottom: rh(isTablet ? (isLandscape ? 2 : 0) : 2),
  },
  headerText: {
    color: '#fff',
    fontSize: rf(isTablet ? (isLandscape ? 2 : 2.5) : 4),
    fontWeight: 'bold',
    lineHeight: rh(isTablet ? (isLandscape ? 3.5 : 4) : 4.5),
    textAlign: 'left',
  },
  subHeaderText: {
    color: '#fff',
    fontSize: rf(isTablet ? (isLandscape ? 1.2 : 1.4) : 1.8),
    fontWeight: '400',
    marginTop: rh(0.5),
    opacity: 0.9,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#EDE7FF',
    borderTopRightRadius: rw(isTablet ? (isLandscape ? 1.5 : 2) : 4),
    borderTopLeftRadius: rw(isTablet ? (isLandscape ? 1.5 : 2) : 4),
    padding: rw(4),
    alignItems: 'center',
    flex: 1,
    marginTop: rh(isTablet ? (isLandscape ? 1.5 : 2) : 2),
  },
  card: {
    width: '100%',
    borderRadius: rw(isTablet ? (isLandscape ? 1 : 1.5) : 2),
    padding: rw(0),
    marginTop: rh(isTablet ? (isLandscape ? 1 : 2) : 5),
  },
  inputContainer: {
    marginVertical: rh(isTablet ? (isLandscape ? 0.3 : 0.5) : 0.8),
  },
  inputLabel: {
    color: '#333',
    fontSize: rf(isTablet ? (isLandscape ? 1.3 : 1.5) : 1.8),
    fontWeight: '600',
    marginBottom: rh(0.5),
    marginLeft: rw(1),
  },
  input: {
    width: rw(isTablet ? (isLandscape ? 90 : 90) : 90),
    height: rh(isTablet ? (isLandscape ? 8 : 6) : 6),
    backgroundColor: '#fff',
    borderRadius: rw(isTablet ? (isLandscape ? 0.8 : 1) : 1.5),
    paddingHorizontal: rw(isTablet ? (isLandscape ? 1.5 : 2) : 3),
    marginVertical: rh(isTablet ? (isLandscape ? 0.2 : 0.3) : 0.5),
    color: '#000',
    fontSize: isTablet ? (isLandscape ? rw(1.8) : rw(3)) : rw(3),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  otpInput: {
    fontSize: rf(isTablet ? (isLandscape ? 2.2 : 2.5) : 3),
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: rf(isTablet ? (isLandscape ? 1.2 : 1.4) : 1.6),
    marginTop: rh(0.2),
    marginLeft: rw(1),
    textAlign: 'left',
  },
  successText: {
    color: '#22c55e',
    fontSize: rf(isTablet ? (isLandscape ? 1.3 : 1.5) : 1.8),
    marginBottom: rh(1),
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
    fontWeight: '500',
  },
  otpLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rh(0.5),
  },
  resendButton: {
    paddingVertical: rh(0.3),
    paddingHorizontal: rw(2),
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#0058aa',
    fontSize: rf(isTablet ? (isLandscape ? 1.2 : 1.4) : 1.6),
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#999',
  },
  verifyButton: {
    borderRadius: Platform.OS === 'ios' ? 14 : 25, // iOS uses slightly smaller radius
    overflow: 'hidden',
    width: '100%', // Use full width for better iOS appearance
    alignSelf: 'center',
    marginTop: 20,
    // iOS-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  verifyGradient: {
    paddingVertical: Platform.OS === 'ios' ? 0 : 16, // Slightly taller for iOS
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 20, // Match parent borderRadius
    // Minimum touch target size for iOS (44px)
    minHeight: Platform.OS === 'ios' ? 44 : undefined,
  },
  verifyText: {
    color: '#fff',
    fontSize: Platform.OS === 'ios' ? 18 : 16, // Slightly larger text for iOS
    fontWeight: '600', // Semi-bold for better readability on iOS
    // iOS-specific text styling
    ...Platform.select({
      ios: {
        fontFamily: 'System', // Use system font for iOS
        letterSpacing: 0.5, // Slightly more letter spacing for iOS
      },
    }),
  },
  helpContainer: {
    marginTop: rh(2),
    paddingHorizontal: rw(2),
  },
  helpText: {
    color: '#666',
    fontSize: rf(isTablet ? (isLandscape ? 1.1 : 1.3) : 1.5),
    textAlign: 'center',
    lineHeight: rh(2.5),
  },
   loginButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
    // Minimum touch target for iOS
    minHeight: Platform.OS === 'ios' ? 44 : undefined,
  },
  loginText: {
    color: '#0066CC',
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontWeight: '500',
  },
});