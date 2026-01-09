import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';

// If you're using react-native-vector-icons, uncomment these:
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Simple icon components as fallback (you can replace with your icon library)
const CheckIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Text style={styles.iconText}>✓</Text>
  </View>
);

const PhoneIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Text style={styles.iconText}>📞</Text>
  </View>
);

const CoffeeIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Text style={styles.iconText}>☕</Text>
  </View>
);

const LocationIcon = () => <Text style={styles.locationIcon}>📍</Text>;

const ChevronIcon = ({color}) => (
  <Text style={[styles.chevron, {color}]}>›</Text>
);

const TodayStatus = () => {
  const [selectedStatus, setSelectedStatus] = useState('Available');

  const statusOptions = [
    {
      id: 'Available',
      label: 'Available',
      IconComponent: CheckIcon,
      color: '#10b981',
    },
    {
      id: 'InMeeting',
      label: 'In Meeting',
      IconComponent: CheckIcon,
      color: '#10b981',
    },
    {
      id: 'OnCall',
      label: 'On Call',
      IconComponent: PhoneIcon,
      color: '#10b981',
    },
    {id: 'Break', label: 'Break', IconComponent: CoffeeIcon, color: '#f59e0b'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.content}>
            {/* Check-in Info */}
            <View style={styles.checkInSection}>
              <Text style={styles.checkInTime}>Checked In at 9:45 AM</Text>
              <View style={styles.locationRow}>
                <LocationIcon />
                <Text style={styles.locationText}>
                  Last Location: Sector 62, Noida
                </Text>
              </View>
            </View>

            {/* Status Buttons */}
            <View style={styles.statusButtons}>
              {statusOptions.map(status => {
                const isSelected = selectedStatus === status.id;
                const IconComponent = status.IconComponent;

                return (
                  <TouchableOpacity
                    key={status.id}
                    style={[
                      styles.statusButton,
                      isSelected
                        ? styles.statusButtonSelected
                        : styles.statusButtonUnselected,
                    ]}
                    onPress={() => setSelectedStatus(status.id)}
                    activeOpacity={0.7}>
                    <View style={styles.statusButtonLeft}>
                      <View
                        style={[
                          styles.iconCircle,
                          {backgroundColor: status.color},
                        ]}>
                        <IconComponent />
                      </View>
                      <Text
                        style={[
                          styles.statusLabel,
                          isSelected && styles.statusLabelSelected,
                        ]}>
                        {status.label}
                      </Text>
                    </View>
                    <ChevronIcon color={isSelected ? 'white' : '#d1d5db'} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* City Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: 'https://tse4.mm.bing.net/th/id/OIP.VQx1OlhclezJzH7Ya73-TAHaFF?pid=Api&P=0&h=180',
                }}
                style={styles.cityImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // elevation: 5,
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    padding: 24,
  },
  checkInSection: {
    marginBottom: 24,
  },
  checkInTime: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statusButtons: {
    marginBottom: 24,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusButtonSelected: {
    backgroundColor: '#0389ca',
    shadowColor: '#0389ca',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statusButtonUnselected: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  statusButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  statusLabelSelected: {
    color: 'white',
  },
  chevron: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityImage: {
    width: '100%',
    height: 160,
  },
})

export default TodayStatus;
