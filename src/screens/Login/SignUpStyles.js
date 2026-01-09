import {StyleSheet, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const isTablet = DeviceInfo.isTablet();
const {width, height} = Dimensions.get('window');
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
  formContainer: {
    width: '100%',
    backgroundColor: '#EDE7FF',
    borderTopRightRadius: rw(isTablet ? (isLandscape ? 1.5 : 2) : 4),
    borderTopLeftRadius: rw(isTablet ? (isLandscape ? 1.5 : 2) : 4),
    padding: rw(0),
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
  dropdown: {
    width: rw(isTablet ? (isLandscape ? 90 : 90) : 90),
    height: rh(isTablet ? (isLandscape ? 8 : 6) : 6),
    backgroundColor: '#fff',
    borderRadius: rw(isTablet ? (isLandscape ? 0.8 : 1) : 1.5),
    paddingHorizontal: rw(isTablet ? (isLandscape ? 1.5 : 2) : 3),
    marginVertical: rh(isTablet ? (isLandscape ? 0.2 : 0.3) : 0.5),
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: '#000',
    fontSize: isTablet ? (isLandscape ? rw(1.8) : rw(3)) : rw(3),
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#7F7F7F',
  },
  dropdownArrow: {
    color: '#666',
    fontSize: rf(isTablet ? (isLandscape ? 1.2 : 1.4) : 1.6),
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 0.5,
  },
  inputContainer: {
    marginVertical: rh(isTablet ? (isLandscape ? 0.1 : 0.2) : 0.3),
  },
  inputMultiline: {
    width: rw(isTablet ? (isLandscape ? 90 : 90) : 90),
    minHeight: rh(isTablet ? (isLandscape ? 12 : 9) : 9),
    backgroundColor: '#fff',
    borderRadius: rw(isTablet ? (isLandscape ? 0.8 : 1) : 1.5),
    paddingHorizontal: rw(isTablet ? (isLandscape ? 1.5 : 2) : 3),
    paddingVertical: rh(isTablet ? (isLandscape ? 1 : 1.5) : 1.5),
    marginVertical: rh(isTablet ? (isLandscape ? 0.2 : 0.3) : 0.5),
    color: '#000',
    fontSize: isTablet ? (isLandscape ? rw(1.8) : rw(3)) : rw(3),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputMultilineError: {
    borderColor: '#ff4444',
    borderWidth: 0.5,
  },
  errorText: {
    color: '#ff4444',
    fontSize: rf(isTablet ? (isLandscape ? 1.2 : 1.4) : 1.6),
    marginTop: rh(0.1),
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
  signUpButton: {
    borderRadius: Platform.OS === 'ios' ? 14 : 25,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,

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

  signUpGradient: {
    paddingVertical: Platform.OS === 'ios' ? 0 : 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 20,
    minHeight: Platform.OS === 'ios' ? 44 : undefined,
  },

  signUpText: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    color: '#fff',
    fontWeight: '600',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
        letterSpacing: 0.5,
      },
    }),
  },
  loginButton: {
    alignSelf: 'flex-start',
    marginTop: rh(isTablet ? (isLandscape ? 1 : 1) : 1.5),
  },
  loginText: {
    color: '#000',
    fontSize: rf(isTablet ? (isLandscape ? 1.3 : 1.5) : 1.8),
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: rw(2),
    padding: rw(4),
    width: rw(80),
    maxHeight: rh(50),
  },
  modalTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: rh(2),
  },
  modalOption: {
    paddingVertical: rh(1.5),
    paddingHorizontal: rw(2),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: rf(1.8),
    color: '#000',
    textAlign: 'center',
  },
});
