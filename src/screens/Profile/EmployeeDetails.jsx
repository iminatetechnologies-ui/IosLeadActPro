import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {_get, _post} from '../../api/apiClient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';


export default function EmployeeDetails() {
  const route = useRoute();
  const {userId} = route.params;

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusToggle, setStatusToggle] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const res = await _get(`/employeedetails/${userId}`);
      const data = res?.data?.data;
      setDetails(data);
      setStatusToggle(data?.is_active == 1); // Set switch based on is_active
    } catch (err) {
      console.error('Error fetching employee details:', err);
      Alert.alert('Error', 'Could not fetch employee details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    try {
      const updatedStatus = statusToggle ? 0 : 1; // reverse of current status
      const newStatusLabel = updatedStatus === 1 ? 'Active' : 'Inactive';

      const res = await _post(`/employee/status/${userId}`, {
        is_active: updatedStatus,
      });

      if (res?.data?.success == 1) {
        setStatusToggle(updatedStatus === 1);
        setDetails(prev => ({...prev, is_active: updatedStatus}));
        Alert.alert('Success', `Employee marked as ${newStatusLabel}`);
      } else {
        throw new Error(res?.data?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Update failed:', err);
      Alert.alert('Failed', err?.message || 'Could not update status');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.loader}>
        <Text>No employee details found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri:
            details?.avatar || 'https://leadactpro.in/api/public/default.jpg',
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{details?.name}</Text>
      <Text style={styles.designation}>{details?.designation}</Text>

      <View style={styles.card}>
        <InfoRow
          icon="id-card-outline"
          label="Employee ID"
          value={details?.emp_id}
        />
        <InfoRow icon="call-outline" label="Mobile" value={details?.mobile} />
        <InfoRow icon="mail-outline" label="Email" value={details?.email} />
        <InfoRow icon="calendar-outline" label="DOB" value={details?.dob} />
        <InfoRow icon="male-female" label="Gender" value={details?.gender} />
        <InfoRow icon="home-outline" label="Address" value={details?.address} />
        <InfoRow
          icon="calendar-sharp"
          label="Joining Date"
          value={details?.joining_date}
        />
        <InfoRow
          icon="checkmark-circle-outline"
          label="Status"
          value={details?.is_active == 1 ? 'Active' : 'Inactive'}
        />
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>
          {statusToggle ? 'Deactivate Employee' : 'Activate Employee'}
        </Text>
        <Switch value={statusToggle} onValueChange={toggleStatus} />
      </View>
    </ScrollView>
  );
}

const InfoRow = ({icon, label, value}) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={isTablet?20:15} color="#555" style={styles.icon} />
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 15,
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   designation: {
//     fontSize: 16,
//     color: '#777',
//     marginBottom: 20,
//   },
//   card: {
//     width: '100%',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   icon: {
//     width: 24,
//   },
//   label: {
//     fontWeight: '600',
//     color: '#444',
//     marginRight: 6,
//     width: 110,
//   },
//   value: {
//     flex: 1,
//     color: '#333',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingVertical: 10,
//   },
//   toggleLabel: {
//     fontSize: 16,
//     color: '#555',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });






const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: isTablet ? rw(2) : rw(4),
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: isTablet ? rw(17) : rw(30),
    height: isTablet ? rw(17) : rw(30),
    borderRadius: isTablet ? rw(8.5) : rw(15),
    marginBottom: rh(2),
  },
  name: {
    fontSize: isTablet ? rf(2) : rf(2),
    fontWeight: 'bold',
    color: '#333',
  },
  designation: {
    fontSize: isTablet ? rf(1.5) : rf(1.8),
    color: '#777',
    marginBottom: rh(2.5),
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: isTablet ? rw(2) : rw(4),
    borderRadius: rw(2),
    marginBottom: rh(2.5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rh(1.5),
  },
  icon: {
    width: isTablet ? rw(5) : rw(6),
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginRight: rw(2),
    width: isTablet ? rw(25) : rw(30),
        fontSize: isTablet ? rf(1.3) : rf(1.5),

  },
  value: {
    flex: 1,
    color: '#333',
    fontSize: isTablet ? rf(1.5) : rf(1.6),
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isTablet ? rw(2) : rw(3),
    paddingVertical: rh(1.5),
  },
  toggleLabel: {
    fontSize: isTablet ? rf(1.5) : rf(1.5),
    color: '#555',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
