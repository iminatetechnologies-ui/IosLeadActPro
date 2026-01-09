

import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar, BackHandler} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import All from './All';
import FollowUp from './FollowUp';
import SiteVisit from './SiteVisit';
import Meeting from './Meeting';
import EOI from './EOI';

const tabs = ['All', 'FollowUp', 'SiteVisit', 'Meeting' ,'EOI'];

const InterestedLead = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('All');

  // ✅ Back button logic
  useEffect(() => {
    const backAction = () => {
      if (activeTab !== 'All') {
        setActiveTab('All');
        return true; // stop going back
      } else {
        return false; // allow normal back
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [activeTab]);

  const renderTab = tab => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
      onPress={() => setActiveTab(tab)}>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'All':
        return <All navigation={navigation} />;
      case 'FollowUp':
        return <FollowUp navigation={navigation} />;
      case 'SiteVisit':
        return <SiteVisit navigation={navigation} />;
      case 'Meeting':
        return <Meeting navigation={navigation} />;
      case 'EOI':
        return <EOI navigation={navigation}/>
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.tabBar}>{tabs.map(renderTab)}</View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default InterestedLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: hp('1.2%'),
  },
  tabItem: {
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: isTablet ? wp('1.5%') : wp('3%'),
    color: '#444',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'blue',
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
