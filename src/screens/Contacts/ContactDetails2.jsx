import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Linking,
  Alert,
  ImageBackground,
  BackHandler,
  ToastAndroid,
  AppState,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { _get, _post } from './../../api/apiClient';

import SingleAssignLead from '../../components/SingleAssignLead';
import ContactDetails2Tab from './ContactDetails2tab';
import { useFocusEffect } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import EditModalLeadView from '../../components/EditModalLeadView';
import { makeCallAndLog } from '../../utils/makeCallAndLog';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const isTablet = DeviceInfo.isTablet();
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const Tab = createMaterialTopTabNavigator();

export default function ContactDetails2({ navigation, route }) {
  const { item, screen } = route.params;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [property_type, setProperty_Type] = useState('');
  const [property_stage, setProperty_Stage] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [leadType, setLeadType] = useState('');
  const [budget_name, setbudget] = useState('');
  const [alternative_no, setAlternative_No] = useState('');
  const [project_name, setProject_Name] = useState('');
  const [city, setCity] = useState('');
  const [activityData, setActivityData] = useState([]);
  const [status, setStatus] = useState('');
  const [callLog, setCalllogs] = useState([]);
  const [deviceName, setDeviceName] = useState('Fetching...');
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const menuRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusSelected, setStatusSelected] = useState(false);
  const [userType, setUserType] = useState(null);
  const [leadowner, setLeadOwner] = useState('');
  const [callData, setCallData] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [name1, setName1] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [email1, setEmail1] = useState('');
  const [loading, setLoading] = useState(false);

  const [leadDetails, setLeadDetails] = useState(null);

  // NEW: Track if call was initiated and app state
  const [callInitiated, setCallInitiated] = useState(false);
  const [lastCallLogCount, setLastCallLogCount] = useState(0);
  const appState = useRef(AppState.currentState);

  const openAssignModal = () => {
    fetchUserList();
    setIsAssignModalVisible(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalVisible(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        id: item.id,
        name: name1,
        alternate_number: alternateNumber,
        email: email1,
      };

      const res = await _post('/lead/edit/save', payload);

      if (res.status) {
        getLeadView();
        alert('Lead updated successfully');
        setModalVisible(false);
      } else {
        alert(res.message || 'Update failed');
      }
    } catch (err) {
      alert('Something went wrong');
      console.error('Update Lead Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await _get('/usertype');
        setUserType(response?.data?.user_type);
      } catch (error) {
        console.error('Role fetch error:', error);
      }
    };
    fetchUserType();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (userType === 'employee' && !statusSelected) {
          ToastAndroid.show(
            'Please select a status first!',
            ToastAndroid.SHORT,
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [userType, statusSelected]),
  );

  useEffect(() => {
    getLeadView();
    // getDevice();
  }, []);

  // Fetch lead details API
  const getLeadView = async () => {
    try {
      const response = await _get(`/leadview/${item?.id}`);
      const timelineData = response?.data?.timeline || [];
      const activityArray = timelineData.map(entry => ({
        type: entry.type,
        created_at: entry.created_at,
        action: entry.action,
        has_audio: entry.has_audio,
        audio_file_url: entry.audio_file_url,
      }));

      setActivityData(activityArray);

      const { data } = response;

      if (data?.data) {
        const {
          name,
          email,
          mobile,
          city,
          project_name,
          property_type,
          property_stage,
          alternative_no,
          budget_name,
          lead_source,
          lead_type,
          lead_owner,
        } = data.data;

        // Store full details in one object
        const fullLeadData = {
          id: item?.id,
          name,
          email,
          mobile,
          city,
          project_name,
          property_type,
          property_stage,
          alternative_no,
          budget_name,
          lead_source,
          lead_type,
          lead_owner: lead_owner || '-',
          status: data?.currentstatus?.status || 'Fresh',
          timeline: timelineData,
        };

        setLeadDetails(fullLeadData);

        // Also keep setting individual states if needed
        setName(name || '');
        setEmail(email || '');
        setMobile(mobile || '');
        setCity(city || '');
        setProject_Name(project_name || '');
        setProperty_Type(property_type || '');
        setProperty_Stage(property_stage || '');
        setAlternative_No(alternative_no || '');
        setbudget(budget_name || '');
        setLeadSource(lead_source || '');
        setLeadType(lead_type || '');
        setLeadOwner(lead_owner || '-');
        setStatus(data?.currentstatus?.status || 'Fresh');
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  // MODIFIED: Call button handler
  // const handleCallPress = async () => {
  //   // console.log('---',id)
  //   if (!mobile) {
  //     Alert.alert('Mobile number is not available');
  //     return;
  //   }

  //   try {
  //     await Linking.openURL(`tel:${mobile}`);
  //   } catch (err) {
  //     Alert.alert('Error', 'Failed to initiate call');
  //     console.error(err);
  //   }
  // };
  const handleCallPress = async () => {
    try {
      if (!mobile || !item?.id) {
        Alert.alert('Lead ID ya Mobile number missing hai');
        return;
      }

      // ✅ call function jahan aapka logging logic already hai
      await makeCallAndLog(mobile, item.id, item, navigation);
    } catch (error) {
      console.error('Error in handleCallPress:', error);
      Alert.alert('Error', 'Failed to make or log call');
    }
  };

  // User list fetch for assign modal
  const fetchUserList = async () => {
    try {
      const response = await _get('/userlist');

      if (Array.isArray(response.data.data)) {
        setUserList(response.data.data);
      } else {
        setUserList([]);
      }

      setIsAssignModalVisible(true);
    } catch (error) {
      console.error('Error fetching user list:', error);
      setUserList([]);
    }
  };

  const handleAssign = async assignPayload => {
    if (!selectedUser) {
      alert('Please select a user to assign.');
      return;
    }

    // ✅ Payload with all required fields
    const payload = {
      userid: selectedUser.id,
      lead_id: item?.id,
      share_as: assignPayload.leadOrData,
      assign_as_fresh: assignPayload.freshAssign,
      show_history: assignPayload.viewHistory,
    };

    console.log('📦 Final Assign Payload:---contact-', payload);

    try {
      const response = await _post('/assignleads', payload);
      const res = response?.data;

      console.log('📩 API Response:', res);

      if (res?.success) {
        // ✅ Success case
        alert(res?.message || 'Lead assigned successfully!');
        closeAssignModal();
      } else {
        // ❌ Backend returned failure message
        alert(res?.message || 'Failed to assign lead.');
      }
    } catch (error) {
      console.error(
        '❌ Error assigning lead:',
        error?.response?.data || error.message || error,
      );

      // ⚠️ Handle network or unexpected errors
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      alert(errMsg);
    }
  };

  const handleInterestedPress = async () => {
    try {
      setStatusSelected(true);

      navigation.replace('InterestedDetails', {
        item: leadDetails, // ✅ send full API data
        otherParam: leadDetails?.lead_type,
      });
    } catch (error) {
      console.error('Error in handleInterestedPress:', error);

      navigation.replace('InterestedDetails', {
        item: leadDetails,
        otherParam: leadDetails?.lead_type,
      });
    }
  };

  const handleCallBackPress = async () => {
    try {
      setStatusSelected(true);

            navigation.replace('CallBackDetails', { item: item });

    } catch (error) {
      console.error('Error in handleCallBackPress:', error);
      // Navigate anyway, even if call log fetch fails
      navigation.replace('CallBackDetails', { item: item });
    }
  };

  const handleNotInterestedPress = async () => {
    try {
      setStatusSelected(true);

      navigation.replace('NotIntrested', { item: item });
    } catch (error) {
      console.error('Error in handleNotInterestedPress:', error);
      // Navigate anyway, even if call log fetch fails
      navigation.replace('NotIntrested', { item: item });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={require('../../assets/images/loginback.jpeg')}
        style={{ flex: 1 }}
        resizeMode="contain">
        <View style={styles.container}>
          <LinearGradient
            colors={[
              'rgba(220, 239, 255, 0.0)',
              '#02519F',
              '#02519F',
              '#02519F',
            ]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.header}>
            <View style={styles.headerIcons}>
              {userType !== 'employee' ? (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialIcons
                    name="chevron-left"
                    size={isTablet ? 30 : 35}
                    color="#000"
                  />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 35 }} /> // Placeholder so layout same rahe
              )}

              <Menu ref={menuRef}>
                <MenuTrigger>
                  <MaterialIcons
                    name="more-vert"
                    size={isTablet ? rf(2) : rf(3)}
                    color="#000"
                  />
                </MenuTrigger>

                <MenuOptions
                  customStyles={{
                    optionsContainer: {
                      padding: rh(0),
                      borderRadius: isTablet ? rw(1) : rw(2),
                      backgroundColor: '#fff',
                      width: isTablet ? rw(18) : rw(50),
                    },
                  }}>
                  <MenuOption
                    onSelect={() => {
                      setShowSubMenu(false);
                      openAssignModal();
                    }}>
                    <Text style={styles.menuText}>Assign</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() => {
                      setShowSubMenu(false);
                      setModalVisible(true);
                    }}>
                    <Text style={styles.menuText}>Edit</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>

            <SingleAssignLead
              visible={isAssignModalVisible}
              userList={userList}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              onAssign={handleAssign}
              onClose={closeAssignModal}
              leadType={leadType}
            />

            <EditModalLeadView
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              name={name1}
              setName={setName1}
              alternateNumber={alternateNumber}
              setAlternateNumber={setAlternateNumber}
              email={email1}
              setEmail={setEmail1}
              onSubmit={handleSubmit}
              loading={loading}
            />

            <View style={styles.headerContent}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitial}>
                  {name ? name.charAt(0).toUpperCase() : '-'}
                </Text>
              </View>
              <View>
                <Text style={styles.nameText}>{name ? name : ' '}</Text>
                <Text style={styles.statusText}>Status : {status}</Text>
                <Text style={styles.dateText}>Lead Owner : {leadowner}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.callShareContainer}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCallPress}>
                <MaterialIcons
                  name="call"
                  size={isTablet ? 25 : 20}
                  color="#fff"
                />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={() =>
                  navigation.navigate('Maching Inventory', { lead_id: item?.id })
                }>
                <Text style={styles.shareButtonText}>Matching Inventory</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.tabContainer}>
                <ContactDetails2Tab
                  email={email}
                  mobile={mobile}
                  property_type={property_type}
                  leadSource={leadSource}
                  property_stage={property_stage}
                  budget_name={budget_name}
                  alternative_no={alternative_no}
                  project_name={project_name}
                  city={city}
                  leadType={leadType}
                  data={activityData}
                // callData={callData}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#3498db' }]}
                onPress={handleInterestedPress}>
                <Text style={styles.buttonText}>Interested</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#f1c40f' }]}
                onPress={handleCallBackPress}>
                <Text style={styles.buttonText}>Call Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={handleNotInterestedPress}>
                <Text style={styles.buttonText}>Not Interested</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: rw(4),
    marginBottom: rh(5),
    marginTop: rh(8),
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isTablet ? rh(0) : rh(1),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: isTablet ? rw(1) : rw(2),
  },
  menuText: {
    paddingVertical: rh(0.7),
    paddingHorizontal: rw(3),
    fontSize: rf(1.7),
    color: '#000',
  },
  profileCircle: {
    width: isTablet ? rw(5) : rw(12),
    height: isTablet ? rw(5) : rw(12),
    borderRadius: isTablet ? rw(2.5) : rw(6),
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(2),
  },
  profileInitial: {
    color: '#fff',
    fontSize: isTablet ? rf(2) : rf(3),
    fontWeight: 'bold',
  },
  nameText: {
    color: '#002147',
    fontSize: isTablet ? rf(1.5) : rf(2),
    fontWeight: 'bold',
    marginRight: isTablet ? rw(10) : rw(12),
  },
  statusText: {
    color: '#fff',
    fontSize: isTablet ? rf(1.5) : rf(2),
  },
  dateText: {
    color: '#fff',
    fontSize: isTablet ? rf(1.5) : rf(2),
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#EDE7FF',
    borderTopRightRadius: isTablet ? rw(2) : rw(6),
    borderTopLeftRadius: isTablet ? rw(2) : rw(6),
    padding: isTablet ? rw(1) : rw(3),
    flexGrow: 1,
    paddingBottom: isTablet ? rh(1) : rh(1),
  },
  card: {
    width: '100%',
    borderRadius: rw(0),
    backgroundColor: '#EDE7FF',
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    padding: 0,
    backgroundColor: '#EDE7FF',
  },
  callShareContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: isTablet ? rw(2) : rw(5),
    marginBottom: rh(1.5),
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: isTablet ? rh(1) : rh(1),
    paddingHorizontal: isTablet ? rw(2) : rw(3),
    borderRadius: isTablet ? rw(0.5) : rw(2),
    marginRight: rw(2),
  },
  callButtonText: {
    color: '#fff',
    marginLeft: rw(2),
    fontWeight: 'bold',
    fontSize: isTablet ? rf(1.5) : rf(1.8),
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'green',
    paddingVertical: isTablet ? rh(1) : rh(1),
    paddingHorizontal: isTablet ? rw(2) : rw(3),
    borderRadius: isTablet ? rw(0.5) : rw(2),
  },
  shareButtonText: {
    color: 'green',
    marginLeft: rw(2),
    fontWeight: 'bold',
    fontSize: isTablet ? rf(1.5) : rf(1.8),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: rh(0),
    backgroundColor: 'white',
    padding: rw(0),
    paddingVertical: rh(0.5),
    borderRadius: isTablet ? rw(1) : rw(2),
    marginBottom: isTablet ? rh(0) : rh(0),
    marginTop: isTablet ? rh(0) : rh(0.7),
  },
  button: {
    flex: 1,
    paddingVertical: rh(1.7),
    borderRadius: isTablet ? rw(1) : rw(2),
    marginHorizontal: rw(1),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: isTablet ? rf(1) : rf(1.5),
  },
});
