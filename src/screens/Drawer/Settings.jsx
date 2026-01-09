import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const policies = {
  'Privacy Policy': `
LeadAct Pro is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.

1. Information We Collect:
- Name, email, phone number, user type, etc.
- Device name, OS, FCM token
- Location (if permission granted)
- Call logs & activity (if enabled)

2. How We Use Your Data:
- Lead tracking & assignments
- Notifications and analytics
- App performance improvement

3. Data Security:
- Encrypted storage and secure APIs

4. Data Sharing:
- Only with your organization/team or as required by law

5. Your Rights:
- Request data deletion or correction
- Revoke permissions anytime
  `,

  'Terms & Conditions': `
By using the LeadAct Pro app, you agree to the following terms:

1. Account Responsibility:
- Keep your login safe
- You are responsible for account activity

2. Usage Rules:
- No spam or fake leads
- Use accurate info only

3. App Access:
- Features may change
- Accounts violating terms may be suspended

4. Data Usage:
- Location/device data is used to improve experience

5. Termination:
- Misuse can result in account suspension
  `,

  'About Us': `
LeadAct Pro is a smart lead tracking and performance management app for sales teams, telecallers, and managers.

Mission:
To simplify lead management, improve team productivity, and bring transparency to sales processes.

Features:
- Lead assignment & follow-up
- Call logging and analytics
- Team performance dashboard
- Reminders & notifications

Developed By:
LeadAct Tech Solutions Pvt. Ltd.
📧 support@leadactpro.com
  `,
};

const Settings = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (title) => {
    setSelectedPolicy(title);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {Object.keys(policies).map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.button}
          onPress={() => openModal(item)}
        >
          <Text style={styles.buttonText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedPolicy}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalText}>{policies[selectedPolicy]}</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#f2f2f2',
    borderRadius: wp('1.5%'),
    marginBottom: hp('1%'),
  },
  buttonText: {
    fontSize: wp('4%'),
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('0%'),
    color: '#000',
    textAlign:'center'
  },
  modalText: {
    fontSize: wp('4%'),
    color: '#444',
    lineHeight: hp('2.5%'),
  },
  closeButton: {
    marginTop: hp('3%'),
    alignSelf: 'center',
    backgroundColor: '#0389ca',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('2%'),
  },
  closeText: {
    color: '#fff',
    fontSize: wp('4%'),
  },
});
