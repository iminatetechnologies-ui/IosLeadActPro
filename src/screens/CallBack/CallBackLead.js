import React, {useState, useEffect, Suspense} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const UpcomingScreen = React.lazy(() => import('./Upcoming'));
const All = React.lazy(() => import('./All'));

const tabs = ['Current', 'Upcoming'];

const CallBackLead = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Current');

  // ✅ Back button handle
  useEffect(() => {
    const backAction = () => {
      if (activeTab !== 'Current') {
        setActiveTab('Current');
        return true; // prevent default back (page exit)
      } else {
        return false; // allow normal back (exit screen)
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
      case 'Current':
        return (
          <Suspense>
            <All navigation={navigation} />
          </Suspense>
        );
      case 'Upcoming':
        return (
          <Suspense>
            <UpcomingScreen navigation={navigation} />
          </Suspense>
        );
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

export default CallBackLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
    paddingVertical: hp('1%'),
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
});
