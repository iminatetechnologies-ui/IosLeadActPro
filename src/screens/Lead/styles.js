import {StyleSheet} from 'react-native';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
const isTablet = DeviceInfo.isTablet();
import DeviceInfo from 'react-native-device-info';

export default StyleSheet.create({
  container: {
    backgroundColor: '#EDE7FF',
    paddingTop: rh(1),
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: rw(2),
    padding: rw(1),
    marginHorizontal: rw(0),
    marginVertical: rh(0),
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rh(1),
  },
  filterText: {
    fontSize: rf(1.8),
    color: '#000',
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: rh(1),
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
  ///---------------------------------------------
  activityContainer: {
    backgroundColor: '#EDE7FF',
    paddingTop: rh(1),
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: rw(2),
    padding: rw(1),
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rh(1),
  },
  headerText: {
    fontSize: rf(2),
    color: '#000',
  },
  scrollViewContent: {
    paddingVertical: rh(1.5),
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: isTablet ? rw(1) : rw(2),
    paddingVertical: rh(0.5),
    paddingHorizontal: rw(3),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: rh(1),
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: rh(0.7),
  },
  activityLabel: {
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  activitySeparator: {
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    color: '#555',
    paddingHorizontal: rw(1.5),
  },
  activityValue: {
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    color: '#555',
    flex: 2,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: isTablet ? rf(1.5) : rf(2),
    color: '#888',
  },

  //---------------------------------------------

  logContainer: {
    flex: 1,
    backgroundColor: '#EDE7FF',
    padding: rw(1), // around 10px on most screens
    paddingTop: rh(2.5),
  },
  logSection: {
    // marginBottom: rh(1),
    marginTop: rh(2),
  },
  logDate: {
    fontSize: rf(1.8),
    color: 'black',
    marginBottom: rh(0),
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: isTablet ? rw(2) : rw(3),
    borderRadius: isTablet ? rw(1) : rw(2),
    elevation: 0,
  },
  logDetails: {
    flex: 1,
  },
  logType: {
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    fontWeight: '500',
    color: '#333',
    marginBottom: rh(0.5),
  },
  logTime: {
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    color: '#7D7D7D',
  },
  logDuration: {
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    color: '#7D7D7D',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: isTablet ? rf(1.5) : rf(2),
    color: '#888',
   
  },
  ///----------------------------------------------

  notesContainer: {
    flex: 1,
    padding: rw(2),
    backgroundColor: '#EDE7FF',
  },
  notesInputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fileBox: {
    backgroundColor: '#fff',
    padding: rw(2),
    marginBottom: rh(0),
    borderRadius: rw(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileText: {
    fontSize: rf(1.8),
    color: '#333',
  },
  buttonRow: {
    marginTop: rh(5),
    gap: rh(2),
  },
  attachButton: {
    paddingVertical: rh(1.8),
    backgroundColor: '#fff',
    borderRadius:isTablet?rw(1): rw(2),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  attachButtonText: {
    fontSize: isTablet ? rf(1.2) : rf(1.5),
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical:isTablet?rh(1.5): rh(2),
    borderRadius:isTablet?rw(1): rw(2),
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? rf(1.2) : rf(1.5),
  },
});
