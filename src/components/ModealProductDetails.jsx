

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();


const LeadSelectionModal = ({
  visible,
  leads,
  selectedLead,
  loadingLeads,
  onSelectLead,
  onClose,
  onSendWhatsApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return leads.filter(item => {
      const name = (item.name || item.full_name || '').toLowerCase();
      const phone = (item.phone || item.mobile || item.contact || '').toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [leads, searchQuery]);

  const renderLeadItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.leadItem,
        selectedLead?.id === item.id && styles.selectedLeadItem,
      ]}
      onPress={() => onSelectLead(item)}>
      <View style={styles.leadInfo}>
        <Text style={styles.leadName}>
          {item.name || item.full_name || 'Unknown Name'}
        </Text>
        <Text style={styles.leadDetails}>
          {item.phone || item.mobile || item.contact || 'No phone'}
        </Text>
      </View>
      {selectedLead?.id === item.id && (
        <FontAwesome name="check-circle" size={rf(2.5)} color="#02519F" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Lead</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={rf(2.5)} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchBoxContainer}>
            <FontAwesome name="search" size={rf(2)} color="#666" />
            <TextInput
              placeholder="Search by name or number"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#888"
            />
          </View>

          {/* Content */}
          {loadingLeads ? (
            <View style={styles.modalLoadingContainer}>
              <ActivityIndicator size="large" color="#02519F" />
              <Text style={styles.modalLoadingText}>Loading leads...</Text>
            </View>
          ) : filteredLeads.length > 0 ? (
            <>
              <FlatList
                data={filteredLeads}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderLeadItem}
                style={styles.leadsList}
                showsVerticalScrollIndicator={false}
              />

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.sendButton,
                    !selectedLead && styles.disabledButton,
                  ]}
                  onPress={onSendWhatsApp}
                  disabled={!selectedLead}>
                  <FontAwesome name="whatsapp" size={rf(2)} color="#fff" style={{ marginRight: rw(1) }} />
                  <Text style={styles.sendButtonText}>Send WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.noLeadsContainer}>
              <FontAwesome name="users" size={rf(4)} color="#ccc" />
              <Text style={styles.noLeadsText}>No leads found</Text>
              <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: rw(isTablet ? 90 : 90),
    maxHeight: rh(isTablet ? 80 : 90),
    backgroundColor: '#fff',
    borderRadius:isTablet?rw(1): rw(2),
    paddingVertical: rh(isTablet ? 3 : 2),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(isTablet ? 3 : 4),
    paddingBottom: rh(1),
  },
  modalTitle: {
    fontSize: rf(isTablet ? 2.6 : 2.2),
    fontWeight: 'bold',
    color: '#02519F',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: rw(isTablet ? 3 : 4),
    marginBottom: rh(1),
    paddingHorizontal: rw(2),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: rw(2),
  },
  searchInput: {
    flex: 1,
    fontSize: rf(isTablet ? 2 : 1.6),
    paddingVertical: rh(isTablet ? 1.2 : 1),
    paddingLeft: rw(2),
    color: '#333',
  },
  modalLoadingContainer: {
    padding: rh(2),
    alignItems: 'center',
  },
  modalLoadingText: {
    marginTop: rh(1),
    fontSize: rf(isTablet ? 1.8 : 1.6),
    color: '#666',
  },
  leadsList: {
    maxHeight: rh(isTablet ? 50 : 40),
    paddingHorizontal: rw(2),
  },
  leadItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(isTablet ? 3 : 4),
    paddingVertical: rh(isTablet ? 2 : 1.5),
    marginHorizontal: rw(2),
    marginVertical: rh(0.5),
    borderRadius: rw(2),
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedLeadItem: {
    borderColor: '#02519F',
    backgroundColor: '#f0f8ff',
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: rf(isTablet ? 2 : 1.8),
    fontWeight: '600',
    color: '#333',
    marginBottom: rh(0.3),
  },
  leadDetails: {
    fontSize: rf(isTablet ? 1.8 : 1.5),
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: rw(isTablet ? 3 : 4),
    paddingTop: rh(2),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    flex: 1,
    paddingVertical: rh(isTablet ? 1.2 : 1),
    paddingHorizontal: rw(4),
    borderRadius: rw(2),
    marginHorizontal: rw(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: rf(isTablet ? 1.8 : 1.6),
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#25D366',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: rf(isTablet ? 1.8 : 1.6),
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  noLeadsContainer: {
    padding: rh(4),
    alignItems: 'center',
  },
  noLeadsText: {
    marginTop: rh(1),
    fontSize: rf(isTablet ? 2 : 1.8),
    color: '#666',
    marginBottom: rh(2),
  },
});


export default LeadSelectionModal;
