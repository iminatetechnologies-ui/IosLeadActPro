import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import icons

const PermissionModal = ({visible, onContinue}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}>
            <Text style={styles.title}>Grant Permissions</Text>

            {/* Phone */}
            {/* <View style={styles.row}>
              <MaterialIcons name="phone" size={20} color="#0389ca" />
              <Text style={styles.itemTitle}> Phone</Text>
            </View>
            <Text style={styles.itemDesc}>
              Phone permission is needed to access your call logs.
            </Text> */}

            {/* Contacts */}
            {/* <View style={styles.row}>
              <MaterialIcons name="contacts" size={20} color="#0389ca" />
              <Text style={styles.itemTitle}> Contacts</Text>
            </View>
            <Text style={styles.itemDesc}>
              To enhance app features like importing contacts, we collect and
              access contact information from your Contact List. Before
              collecting and transmitting this data, we require your consent.
            </Text> */}

            {/* Notifications */}
            <View style={styles.row}>
              <MaterialIcons name="notifications" size={20} color="#0389ca" />
              <Text style={styles.itemTitle}> Notification</Text>
            </View>
            <Text style={styles.itemDesc}>
              We need notification permission to send you notifications.
            </Text>

            {/* Alarms */}
            <View style={styles.row}>
              <MaterialIcons name="alarm" size={20} color="#0389ca" />
              <Text style={styles.itemTitle}> Alarms And Reminder</Text>
            </View>
            <Text style={styles.itemDesc}>
              We need alarms and reminder permission to send you reminders.
            </Text>

             {/* 🔊 Microphone Permission */}
            <View style={styles.row}>
              <MaterialIcons name="mic" size={20} color="#0389ca" />
              <Text style={styles.itemTitle}> Microphone</Text>
            </View>
            <Text style={styles.itemDesc}>
              Microphone permission is required to record audio messages or
              notes inside the app. Without this permission, audio recording
              features will not work.
            </Text>

            {/* Location */}
            <View style={styles.row}>
              <MaterialIcons name="location-on" size={20} color="#0389ca" />
              <Text style={styles.itemTitle}> Location</Text>
            </View>
            <Text style={styles.itemDesc}>
              Location permission is required to fetch your current location for
              app features like geo-tagging and nearby services.
            </Text>

            {/* Storage */}
            {/* <View style={styles.row}>
              <MaterialIcons name="folder" size={20} color="#0389ca" />
              <Text style={styles.itemTitle}> Storage</Text>
            </View>
            <Text style={styles.itemDesc}>
              We need access to your storage for storing and importing
              recordings, files, images, and videos when you want.
            </Text> */}

            <Text style={styles.note}>
              <Text style={{fontWeight: 'bold'}}>Note: </Text>
              If you don't allow the sufficient permissions, you will be able to
              use the application but some features will be limited.
            </Text>

            {/* Privacy Policy link */}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://your-privacy-policy-link.com')
              }>
              <Text style={styles.privacyLink}>Privacy Policy</Text>
            </TouchableOpacity>

            {/* Continue button */}
            <TouchableOpacity style={styles.button} onPress={onContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '88%',
    maxHeight: '65%',
    elevation: 5,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  itemDesc: {
    fontSize: 14,
    marginTop: 8,
    color: '#3b3a3aff',
    lineHeight: 20,
  },
  note: {
    fontSize: 13,
    marginTop: 16,
    color: '#666',
  },
  privacyLink: {
    fontSize: 14,
    color: '#0389ca',
    marginTop: 14,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#0389ca',
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-end',
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PermissionModal;
