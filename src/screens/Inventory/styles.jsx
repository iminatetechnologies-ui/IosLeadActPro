import {StyleSheet} from 'react-native';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

// Default/Main Styles
export default StyleSheet.create({
  container: {
    backgroundColor: '#EDE7FF',
    paddingTop: rh(1),
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: rw(1),
  },
  detailBox: {
    width: '48%',
    backgroundColor: '#fff',
    padding: isTablet ? rw(1) : rw(2.5),
    marginVertical: rh(0.5),
    borderRadius: isTablet ? rw(1) : rw(2),
  },
  detailLabel: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    marginBottom: rh(0.5),
  },
  detailValue: {
    color: '#555',
    fontSize: isTablet ? rf(1.2) : rf(1.5),
  },
});
// Image Viewer Styles
export const imageViewerStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(4),
    zIndex: 1000,
  },
  closeButton: {
    padding: rw(2),
  },
  counter: {
    color: '#fff',
    fontSize: rf(1.8),
    fontWeight: '600',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});
// Slider Styles
export const sliderStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: rf(1.9),
    fontWeight: '600',
    marginBottom: rh(1.5),
    color: '#000',
  },
  imageContainer: {
    width: rw(90),
    marginRight: rw(2),
    position: 'relative',
  },
  imageWrapper: {
    width: rw(90),
    height: isTablet ? rh(30) : rh(25),
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: rw(2),
    paddingVertical: rh(0.5),
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontSize: rf(1.4),
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(1.5),
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 3,
  },
});
// Custom Tab Styles
export const customStyles = StyleSheet.create({
  container: {flex: 1},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: rh(2),
    position: 'relative',
  },
  tabText: {
    fontSize: rf(1.6),
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: rh(0.35),
    left: 0,
    right: 0,
    backgroundColor: '#000',
  },
  tabContent: {flex: 1},
});
