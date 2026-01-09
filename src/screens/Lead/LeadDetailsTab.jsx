import {React, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

import {_get, _post} from './../../api/apiClient';
import AudioPlayer from '../Audio/AudioPlayer.jsx';
import styles from './styles.js';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const maskMobile = number => {
  if (!number || number.length < 4) return '-';
  const last4 = number.slice(-4);
  return '+91 XXXXXX' + last4;
};

const DetailsScreen = ({
  city,
  project_name,
  leadSource,
  property_type,
  mobile,
  alternative_no,
  property_stage,
  budget_name,
  email,
  leadType,
}) => {
  const details = [
    {label: 'Country', value: 'India'},
    {label: 'City', value: city || '-'},
    {label: 'Project', value: project_name || '-'},
    {label: 'Lead Source', value: leadSource || '-'},
    {label: 'Property Type', value: property_type || '-'},
    {label: 'Contact Number', value: maskMobile(mobile)},
    {label: 'Property Sub Type', value: '-'},
    {label: 'Alternate Number', value: maskMobile(alternative_no)},
    {label: 'Property Stage', value: property_stage || '-'},
    {label: 'Lead Type', value: leadType || '-'},
    {label: 'Budget', value: budget_name || '-'},
    {label: 'Email', value: email || '-'},
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.detailsContainer}>
        {details.map((item, index) => (
          <View key={index} style={styles.detailBox}>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const ActivityScreen = ({data}) => {
  return (
    <View style={styles.activityContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <View key={index} style={styles.activityCard}>
              {/* TYPE */}
              <View style={styles.activityRow}>
                <Text style={styles.activityLabel}>Type</Text>
                <Text style={styles.activitySeparator}>:</Text>
                <Text style={styles.activityValue}>{item.type || '-'}</Text>
              </View>

              {/* CREATED AT */}
              <View style={styles.activityRow}>
                <Text style={styles.activityLabel}>Created At</Text>
                <Text style={styles.activitySeparator}>:</Text>
                <Text style={styles.activityValue}>
                  {item.created_at || '-'}
                </Text>
              </View>

              {/* ACTION */}
              <View style={styles.activityRow}>
                <Text style={styles.activityLabel}>Action</Text>
                <Text style={styles.activitySeparator}>:</Text>
                <Text style={styles.activityValue}>{item.action || '-'}</Text>
              </View>

              {/* AUDIO */}
              {item.has_audio ? (
                <View style={styles.activityRow}>
                  <Text style={styles.activityLabel}>Audio</Text>
                  <Text style={styles.activitySeparator}>:</Text>

                  <View style={{flex: 0}}>
                    <AudioPlayer audioUrl={item.audio_file_url} />
                  </View>
                </View>
              ) : null}
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No activity available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const LeadDetailsTab = ({
  email,
  mobile,
  property_type,
  leadSource,
  property_stage,
  budget_name,
  alternative_no,
  project_name,
  city,
  leadType,
  // callData,
  data: activityData,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: 'Lead Details',
      component: (
        <DetailsScreen
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
        />
      ),
    },
    {
      id: 1,
      name: 'Activity',
      component: <ActivityScreen data={activityData} />,
    },
  ];

  return (
    <View style={customStyles.container}>
      {/* Custom Tab Bar */}
      <View style={customStyles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              customStyles.tabItem,
              activeTab === index && customStyles.activeTabItem,
            ]}
            onPress={() => setActiveTab(index)}>
            <Text
              style={[
                customStyles.tabText,
                activeTab === index && customStyles.activeTabText,
              ]}>
              {tab.name}
            </Text>
            {activeTab === index && <View style={customStyles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={customStyles.tabContent}>{tabs[activeTab].component}</View>
    </View>
  );
};

// Custom styles for the tab navigator
const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isTablet ? rh(1.5) : rh(2),
    position: 'relative',
  },
  activeTabItem: {
    // You can add active tab styling here if needed
  },
  tabText: {
    fontSize: isTablet ? rf(1.5) : rf(1.6),
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: isTablet ? rh(0.3) : rh(0.32),
    backgroundColor: '#000',
    borderRadius: 2,
  },
  tabContent: {
    flex: 1,
  },
});

export default LeadDetailsTab;
