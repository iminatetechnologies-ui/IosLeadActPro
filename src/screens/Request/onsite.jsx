import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import RequestModal from '../../components/Request/LeadModal';
import {_get, _post} from '../../api/apiClient';
import {getUserType} from '../../utils/getUserType';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Onsite() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [requestType, setRequestType] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [description, setDescription] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [usertype, setUsertype] = useState(null);

  const slideAnim = useRef(new Animated.Value(wp('100%'))).current;

  useEffect(() => {
    (async () => {
      const type = await getUserType();
      setUsertype(type);
    })();
  }, []);

  useEffect(() => {
    // Set default active request based on user type
    if (usertype === 'company') {
      setActiveRequest('Pending Request');
    } else {
      setActiveRequest('New Request');
    }

    Animated.timing(slideAnim, {
      toValue: wp('30%'),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [usertype]);

  const openPanel = async type => {
    setActiveRequest(type);
    Animated.timing(slideAnim, {
      toValue: wp('30%'),
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (type === 'Pending Request') {
      try {
        let response;

        if (usertype === 'company' || usertype === 'team_owner') {
          // For company or team_owner, call /pendingrequest
          response = await _get('/adminrequest?status=0&subject=onsite');
        } else {
          // For normal users, call /userrequests with filters
          response = await _get('/userrequests?status=pending&subject=onsite');
        }

        const requestsData = response?.data?.data;
        setPendingRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (error) {
        console.error(
          'Error fetching pending requests:',
          error?.response?.data?.message || error.message,
        );
        setPendingRequests([]);
      }
    }

    if (type === 'Approved Request') {
      try {
        let response;

        if (usertype === 'company' || usertype === 'team_owner') {
          // For company or team_owner, use /approvedrequest
          response = await _get('/adminrequest?status=1&subject=onsite');
        } else {
          // For other users, use filtered /userrequests API
          response = await _get('/userrequests?status=approved&subject=onsite');
        }

        const requestsData = response?.data?.data;
        // console.log('-------------------', requestsData);
        setApprovedRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (error) {
        console.error(
          'Error fetching approved requests:',
          error?.response?.data?.message,
        );
        setApprovedRequests([]);
      }
    }

    if (type === 'Rejected Request') {
      try {
        let response;

        if (usertype === 'company' || usertype === 'team_owner') {
          response = await _get('/adminrequest?status=2&subject=onsite');
        } else {
          response = await _get('/userrequests?status=rejected&subject=onsite');
        }

        const requestsData = response?.data?.data;
        setRejectedRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (error) {
        console.error(
          'Error fetching rejected requests:',
          error?.response?.data?.message,
        );
        setRejectedRequests([]);
      }
    }
  };

  const closePanel = () => {
    Animated.timing(slideAnim, {
      toValue: wp('100%'),
      duration: 300,
      useNativeDriver: false,
    }).start(() => setActiveRequest(null));
  };

  const handleSubmit = async () => {
    if (!requestType || !assignTo || !description) {
      Alert.alert('Please fill in all fields before submitting.');
      return;
    }

    const payload = {
      subject: 'onsite',
      type: requestType,
      department: assignTo,
      description: description,
    };

    try {
      console.log('Submitting request with payload:', payload);
      await _post('/addrequest', payload);
      Alert.alert('Request submitted successfully');

      setRequestType('');
      setAssignTo('');
      setDescription('');
    } catch (error) {
      console.error(
        'Error submitting request:',
        error?.response?.data || error.message,
      );
    }
  };

  const handleApprove = async requestId => {
    try {
      await _get(`/approverequest/${requestId}`);
      Alert.alert('Request approved successfully');
      // Refresh the pending requests
      const response = await _get(
        '/userrequests?status=pending&subject=onsite',
      );
      const requestsData = response?.data?.data;
      setPendingRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error(
        'Error approving request:',
        error?.response?.data?.message || error.message,
      );
      Alert.alert('Error', 'Failed to approve request');
    }
  };

  const handleReject = async requestId => {
    try {
      await _get(`/rejectrequest/${requestId}`);
      Alert.alert('Request rejected successfully');
      // Refresh the pending requests
      const response = await _get(
        '/userrequests?status=pending&subject=onsite',
      );
      const requestsData = response?.data?.data;
      setPendingRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error(
        'Error rejecting request:',
        error?.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to reject request');
    }
  };

  const renderRequestsList = (requests, title, showActions = false) => {
    if (requests.length === 0) {
      return (
        <View style={styles.contentBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>No {title.toLowerCase()} found.</Text>
        </View>
      );
    }

    return (
      <View style={styles.pendingContainer}>
        <Text style={styles.mainTitle}>{title}</Text>
        <ScrollView style={styles.scrollContainer}>
          {requests.map((request, index) => (
            <View key={request.id} style={styles.cardContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Subject - </Text>
                <Text style={styles.value}>{request.subject}</Text>

                <Text style={[styles.label, {marginLeft: 20}]}>Type - </Text>
                <Text style={styles.value}>{request.type}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Department - </Text>
                <Text style={styles.value}>{request.department}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Description - </Text>
                <Text style={styles.value}>{request.description}</Text>
              </View>

              {showActions &&
                (usertype === 'team_owner' || usertype === 'company') && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleApprove(request.id)}>
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(request.id)}>
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPendingRequests = () => {
    return renderRequestsList(pendingRequests, 'Pending Requests', true);
  };

  const renderApprovedRequests = () => {
    return renderRequestsList(approvedRequests, 'Approved Requests', false);
  };

  const renderRejectedRequests = () => {
    return renderRequestsList(rejectedRequests, 'Rejected Requests', false);
  };

  const renderContent = () => {
    if (activeRequest === 'New Request') {
      return (
        <RequestModal
          visible={true}
          onClose={closePanel}
          onSubmit={handleSubmit}
          requestType={requestType}
          setRequestType={setRequestType}
          assignTo={assignTo}
          setAssignTo={setAssignTo}
          description={description}
          setDescription={setDescription}
        />
      );
    }

    if (activeRequest === 'Pending Request') {
      return renderPendingRequests();
    }

    if (activeRequest === 'Approved Request') {
      return renderApprovedRequests();
    }

    if (activeRequest === 'Rejected Request') {
      return renderRejectedRequests();
    }

    return null;
  };

  // Filter buttons based on user type
  const getButtonTypes = () => {
    const allButtons = [
      'New Request',
      'Pending Request',
      'Approved Request',
      'Rejected Request',
    ];

    // If usertype is 'company', exclude 'New Request'
    if (usertype === 'company') {
      return allButtons.filter(button => button !== 'New Request');
    }

    return allButtons;
  };

  return (
    <View style={styles.container}>
      {/* Left Panel */}
      <View style={styles.leftPanel}>
        <Text style={styles.heading}>OnSite Requests</Text>

        {getButtonTypes().map((type, index) => (
          <TouchableOpacity
            key={index}
            style={styles.leftPanelButton}
            onPress={() => openPanel(type)}>
            <Text style={styles.buttonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Right-Side Sliding Panel */}
      {activeRequest && (
        <Animated.View style={[styles.rightPanel, {left: slideAnim}]}>
          {renderContent()}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  leftPanel: {
    width: wp('30%'),
    padding: wp('4%'),
    backgroundColor: '#fff',
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
  heading: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  leftPanelButton: {
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    textAlign: 'center',
  },
  rightPanel: {
    position: 'absolute',
    top: 0,
    width: wp('70%'),
    height: '100%',
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderColor: '#ccc',
    elevation: 4,
    zIndex: 10,
    padding: wp('1%'),
  },
  contentBox: {
    backgroundColor: '#f0f0f0',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
  },
  content: {
    fontSize: wp('3.5%'),
    color: '#333',
  },
  pendingContainer: {
    flex: 1,
    padding: wp('2%'),
  },
  scrollContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
    color: '#333',
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 12,
    margin: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
    gap: wp('2%'),
  },
  actionButton: {
    flex: 1,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('1.5%'),
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#0389ca',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
});
