import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {_get, _post} from './../../api/apiClient';
import DeviceInfo from 'react-native-device-info';
import CustomAlert from '../../components/CustomAlert';
const isTablet = DeviceInfo.isTablet();

const Birthday = ({navigation}) => {
  const [projects, setProjects] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [performersLoading, setPerformersLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerformer, setSelectedPerformer] = useState(null);
  const [congratulationSent, setCongratulationSent] = useState(false);
  const [congratulationMessage, setCongratulationMessage] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    fetchProjects();
    fetchTopPerformers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await _get('/projectlist');
      const projectArray = res?.data?.data;
      if (Array.isArray(projectArray)) {
        const formattedProjects = projectArray.map(item => ({
          id: item.id,
          name: item.title,
          image: item.banner_url,
          detail: '',
        }));
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error('❌ Error fetching project list:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      const res = await _get('/top-performers');
      const performersArray = res?.data?.data;
      if (Array.isArray(performersArray)) {
        const formattedPerformers = performersArray.map(item => ({
          id: item.id,
          userId: item.user_id,
          name: item.user_name,
          img: item.avatar
            ? `https://leadactpro.in/api/public/uploads/${item.avatar}`
            : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          description: item.description,
          dealsClosed: item.deal_closed,
        }));
        setTopPerformers(formattedPerformers);
      }
    } catch (error) {
      console.error('❌ Error fetching top performers:', error);
    } finally {
      setPerformersLoading(false);
    }
  };

  const sendCongratulations = async userId => {
    if (!congratulationMessage.trim()) {
      Alert.alert(
        'Message Required',
        'Please enter a congratulations message.',
      );
      return;
    }

    try {
      setCongratulationSent(true);
      const res = await _post('/notify-top-performer', {
        user_id: userId,
        message: congratulationMessage.trim(),
      });

      if (res?.data?.success == 1) {
        showCustomAlert('Success', 'Congratulations sent successfully!');
        setCongratulationMessage('');
      }
    } catch (error) {
      console.error('❌ Error sending congratulations:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        fullError: error,
      });

      Alert.alert('Error', 'Failed to send congratulations. Please try again.');
    } finally {
      setCongratulationSent(false);
      setModalVisible(false);
    }
  };

  const handlePerformerPress = performer => {
    setSelectedPerformer(performer);
    setCongratulationMessage('');
    setModalVisible(true);
  };

  return (
    <ScrollView style={{paddingBottom: hp('10%'), marginTop: hp('0%')}}>
      <Text style={[styles.birthday, {color: '#fff'}]}>🎉 Top Performer</Text>

      {performersLoading ? (
        <View style={styles.horizontalScroll}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.leadItem}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.leadImage}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.leadNameShimmer}
              />
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recentLeadsContainer}
          contentContainerStyle={{paddingHorizontal: wp('2%')}}>
          {topPerformers.length > 0 ? (
            topPerformers.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.leadItem}
                onPress={() => handlePerformerPress(item)}>
                <Image source={{uri: item.img}} style={styles.leadImage} />
                <Text style={styles.leadName}>{item.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No Top Performers</Text>
            </View>
          )}
        </ScrollView>
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        confirmText="OK"
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Congratulations!</Text>

            {selectedPerformer && (
              <>
                <Image
                  source={{uri: selectedPerformer.img}}
                  style={styles.modalImage}
                />
                <Text style={styles.modalName}>{selectedPerformer.name}</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type your congratulations message..."
                    placeholderTextColor="#999"
                    value={congratulationMessage}
                    onChangeText={setCongratulationMessage}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.congratulateButton,
                      (!congratulationMessage.trim() || congratulationSent) &&
                        styles.disabledButton,
                    ]}
                    onPress={() =>
                      sendCongratulations(selectedPerformer.userId)
                    }
                    disabled={
                      congratulationSent || !congratulationMessage.trim()
                    }>
                    <Text style={styles.buttonText}>
                      {congratulationSent
                        ? 'Sending...'
                        : 'Send Congratulations 🎉'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => {
                      setModalVisible(false);
                      setCongratulationMessage('');
                    }}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Text style={[styles.birthday, {marginTop: hp('1%'), color: '#fff'}]}>
        🚀 Projects We Do
      </Text>

      {loading ? (
        <View style={styles.horizontalScroll}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.projectCard}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.projectImage}
              />
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.projectNameShimmer}
              />
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.projectContainer}
          contentContainerStyle={{paddingHorizontal: wp('2%')}}>
          {projects.length > 0 ? (
            projects.map(project => (
              <TouchableOpacity
                key={project.id}
                onPress={() =>
                  navigation.navigate('ProjectDetails', {id: project.id})
                }>
                <View style={styles.projectCard}>
                  <Image
                    source={{uri: project.image}}
                    style={styles.projectImage}
                  />
                  <Text style={styles.projectName}>{project.name}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer1}>
              <Text style={styles.emptyStateText1}>No Projects Available</Text>
            </View>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default Birthday;

const styles = StyleSheet.create({
  recentLeadsContainer: {
    marginTop: hp('0%'),
  },
  leadItem: {
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  leadImage: {
    width: isTablet ? wp('4%') : wp('12%'),
    height: isTablet ? wp('4%') : wp('12%'),
    borderRadius: isTablet ? wp('4%') : wp('6%'),
    backgroundColor: '#ccc',
  },
  leadName: {
    marginTop: hp('0.2%'),
    fontSize: isTablet ? wp('1.5%') : wp('3%'),
    color: '#fff',
    fontWeight: '500',
  },
  leadNameShimmer: {
    width: isTablet ? wp('7%') : wp('10%'),
    height: isTablet ? hp('1.5%') : hp('1.8%'),
    borderRadius: wp('1%'),
    marginTop: hp('0.5%'),
  },

  birthday: {
    fontSize: isTablet ? wp('2%') : wp('3.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1.5%'),
    marginLeft: isTablet ? wp('1%') : wp('3.5%'),
    marginTop: hp('0%'),
  },
  projectContainer: {
    marginTop: hp('0%'),
  },
  projectCard: {
    width: isTablet ? wp('15%') : wp('35%'),
    height: isTablet ? hp('20%') : hp('16%'),
    backgroundColor: '#fff',
    borderRadius: isTablet ? wp('1%') : wp('2'),
    marginRight: isTablet ? wp('1%') : wp('2.5%'),
    padding: isTablet ? wp('0.5%') : wp('1.5%'),
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: hp('20%'),
  },
  projectImage: {
    width: '100%',
    height: isTablet ? hp('10%') : hp('10%'),
    borderRadius: isTablet ? wp('1%') : wp('2'),
    resizeMode: isTablet ? 'cover' : 'cover',
  },
  projectName: {
    marginTop: hp('1%'),
    fontSize: isTablet ? wp('1.5%') : wp('3%'),
    fontWeight: '600',
    color: '#000',
  },
  projectNameShimmer: {
    width: isTablet ? wp('20%') : wp('30%'),
    height: isTablet ? hp('1.8%') : hp('2.2%'),
    borderRadius: wp('1%'),
    marginTop: hp('1%'),
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingHorizontal: wp('2%'),
    marginTop: hp('0%'),
  },
  emptyStateContainer: {
    width: wp('90%'),
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('2%'),
    marginHorizontal: wp('2%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: isTablet ? wp('1.8%') : wp('3.5%'),
    color: '#fff',
    fontWeight: '500',
    opacity: 0.7,
  },
  emptyStateContainer1: {
    width: wp('90%'),
    height: hp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('2%'),
    marginHorizontal: wp('2%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  emptyStateText1: {
    fontSize: isTablet ? wp('1.8%') : wp('3.5%'),
    color: '#fff',
    fontWeight: '500',
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    padding: wp('6%'),
    margin: wp('5%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    width: wp('90%'),
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: isTablet ? wp('3%') : wp('5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('2%'),
  },
  modalImage: {
    width: isTablet ? wp('14%') : wp('20%'),
    height: isTablet ? wp('14%') : wp('20%'),
    borderRadius: isTablet ? wp('7%') : wp('10%'),
    marginBottom: hp('1.5%'),
  },
  modalName: {
    fontSize: isTablet ? wp('2%') : wp('4%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  modalDescription: {
    fontSize: isTablet ? wp('2.5%') : wp('3.5%'),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  modalDeals: {
    fontSize: isTablet ? wp('2.5%') : wp('3.5%'),
    color: '#007bff',
    fontWeight: '600',
    marginBottom: hp('3%'),
  },
  modalButtons: {
    width: '100%',
    gap: hp('1%'),
  },
  modalButton: {
    padding: isTablet ? hp('1.2%') : hp('1.5%'),
    borderRadius: isTablet ? hp('1.2%') : hp('1%'),
    alignItems: 'center',
  },
  congratulateButton: {
    backgroundColor: '#0389ca',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: isTablet ? wp('1.5%') : wp('3.5%'),
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp('2%'),
  },
  inputLabel: {
    fontSize: isTablet ? wp('2%') : wp('3.5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: isTablet ? wp('1%') : wp('2%'),
    padding: isTablet ? hp('1%') : hp('1.5%'),
    fontSize: isTablet ? wp('1.5%') : wp('3.5%'),
    color: '#333',
    backgroundColor: '#f8f9fa',
    minHeight: hp('8%'),
    maxHeight: hp('12%'),
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
});
