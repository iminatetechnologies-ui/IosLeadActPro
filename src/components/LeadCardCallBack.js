import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import {makeCallAndLog} from '../utils/makeCallAndLog';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const LeadCardContactCallBack = ({
  title,
  subtitle,
  mobile,
  source,
  project,
  follow_up,
  substatus_name,
  onSmsPress,
  oncardPress,
  lead_id,
  item,
  isSelected = false,
  onSelect,
  onLongPress,
  showCheckbox = false,
  team_owner,
  leadtype,
}) => {
  const navigation = useNavigation();

  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);

  const customMessages = [
    "Hi, I'm following up on your inquiry.",
    'Is this a good time to talk?',
    'We have exciting offers for your dream home!',
    'Let’s schedule a site visit.',
  ];
  const handleCallPress = () => {
    if (!mobile) {
      alert('📵 Mobile number not available');
      return;
    }

    try {
      Linking.openURL(`tel:${mobile}`);
      const statusName = item?.status_name?.toLowerCase();
      console.log('➡️ item.status_name:', statusName);

      if (statusName === 'interested') {
        navigation.navigate('LeadInterested2', {item});
        console.log('➡️ Navigated to LeadInterested2');
      } else {
        navigation.navigate('ContactDetails2', {item});
        console.log('➡️ Navigated to ContactDetails2');
      }
    } catch (err) {
      console.log('❌ Call failed:', err);
      alert('Unable to make a call');
    }
  };

  return (
    <>
      <Pressable
        onPress={oncardPress}
        onLongPress={onLongPress}
        delayLongPress={1000}
        style={({pressed}) => [
          styles.card,
          isSelected && styles.selectedCard,
          pressed && styles.pressedCard,
        ]}>
        {/* 🔵 Top-right Row for LeadType and Substatus */}
        <View style={styles.topRightRow}>
          <View style={styles.leadTypeBox}>
            <Text style={styles.statusText}>⭐ {leadtype}</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusText2}>{substatus_name}</Text>
          </View>
        </View>

        {/* 🔵 Bottom-right: either checkbox or badges */}
        {/* 🔵 Bottom-right: Checkbox + Team Owner */}
        <View style={styles.bottomRightContainer}>
          {showCheckbox && (
            <TouchableOpacity
              onPress={onSelect}
              style={styles.checkboxContainer}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{checked: isSelected}}>
              {isSelected ? (
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  size={rf(2)} // smaller checkbox
                  color="green"
                />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={rf(2)} // smaller checkbox
                  color="gray"
                />
              )}
            </TouchableOpacity>
          )}
          {team_owner ? (
            <View style={styles.teamBadge}>
              <Text style={styles.statusText3}>{`👥 ${team_owner}`}</Text>
            </View>
          ) : null}
        </View>

        {/* 🔵 Text Info */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            👤 {title}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>📥 Source : </Text>
            <Text style={styles.value}>{source}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>🏢 Project : </Text>
            <Text style={styles.value}>{project}</Text>
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>⏰ Reminder : </Text>
            <Text style={styles.value}>{follow_up}</Text>
          </Text>
        </View>

        {/* 🔵 Action Icons */}
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => makeCallAndLog(mobile, lead_id, item, navigation)}
            // onPress={handleCallPress}
            style={styles.iconTouchable}
            disabled={isSelected}>
            <MaterialCommunityIcons
              name="phone"
              size={isTablet ? 35 : 24}
              color={isSelected ? 'gray' : 'lightgreen'}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={onSmsPress}
            style={styles.iconTouchable}
            disabled={isSelected}>
            <MaterialCommunityIcons
              name="message-text"
              size={isTablet ? 35 : 24}
              color={isSelected ? 'gray' : 'blue'}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={() => setWhatsappModalVisible(true)}
            style={styles.iconTouchable}
            disabled={isSelected}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={isTablet ? 35 : 24}
              color={isSelected ? 'gray' : 'green'}
            />
          </TouchableOpacity>
        </View>
      </Pressable>

      {/* 🔵 WhatsApp Message Modal */}
      <Modal
        transparent
        visible={whatsappModalVisible}
        animationType="fade"
        onRequestClose={() => setWhatsappModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setWhatsappModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Send WhatsApp Message</Text>
            {customMessages.map((msg, index) => (
              <TouchableOpacity
                key={index}
                style={styles.messageButton}
                onPress={() => {
                  const url = `whatsapp://send?phone=${mobile}&text=${encodeURIComponent(
                    msg,
                  )}`;
                  Linking.openURL(url).catch(() =>
                    alert('WhatsApp not installed'),
                  );
                  setWhatsappModalVisible(false);
                }}>
                <Text style={styles.messageText}>{msg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default LeadCardContactCallBack;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: isTablet ? rw(1) : rw(2),
    padding: isTablet ? rw(2) : rw(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: isTablet ? rh(1) : rh(0.5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: rh(1.5)},
    shadowOpacity: 0.2,
    shadowRadius: rw(2),
    elevation: 4,
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#EDE7F6',
  },
  pressedCard: {
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
    marginRight: rw(5),
  },
  title: {
    fontSize: isTablet ? rf(1.2) : rf(1.8),
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    color: '#000',
    fontWeight: '500',
    fontSize: isTablet ? rf(1) : rf(1.5),
  },
  value: {
    color: '#007BFF',
    fontSize: isTablet ? rf(1) : rf(1.5),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconTouchable: {
    paddingVertical: rh(2),
  },
  divider: {
    width: isTablet ? 2 : 1,
    height: isTablet ? rh(4) : rh(3),
    backgroundColor: '#ccc',
    marginHorizontal: rw(2),
  },
  topRightRow: {
    position: 'absolute',
    top: rh(0),
    right: rw(0),
    flexDirection: 'row',
    zIndex: 5,
  },
  statusBox: {
    backgroundColor: '#007BFF',
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.5),
    borderTopRightRadius: isTablet ? rw(1) : rw(2),
    borderBottomLeftRadius: isTablet ? rw(1) : rw(2),
  },
  leadTypeBox: {
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.5),
    borderTopLeftRadius: rw(2),
    borderBottomRightRadius: rw(2),
    marginRight: isTablet ? rw(0) : rw(1),
  },
  statusText: {
    color: '#000',
    fontSize: isTablet ? rf(1) : rf(1.5),
    fontWeight: 'bold',
  },
  statusText2: {
    color: '#fff',
    fontSize: isTablet ? rf(1) : rf(1.5),
    fontWeight: '400',
  },
  statusText1: {
    color: '#000',
    fontSize: isTablet ? rf(1) : rf(1.5),
    fontWeight: '400',
  },
  bottomRightContainer: {
    position: 'absolute',
    bottom: rw(0),
    right: rw(0),
    zIndex: 5,
    flexDirection: 'row',
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(1), // small gap before team owner name
  },
  teamBadge: {
    paddingHorizontal: rw(2),
    paddingVertical: rh(0.3),
    borderRadius: rw(2),
  },

  badgeRow: {
    flexDirection: 'row',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: rw(5),
    borderRadius: rw(2),
    width: '80%',
  },
  modalTitle: {
    fontSize: rf(2.2),
    fontWeight: 'bold',
    marginBottom: rh(2),
    textAlign: 'center',
  },
  messageButton: {
    paddingVertical: rh(1.2),
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  messageText: {
    fontSize: rf(2),
    color: '#007BFF',
    textAlign: 'center',
  },
});
