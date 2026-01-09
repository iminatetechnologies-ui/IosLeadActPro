
import React, { useState, Suspense } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Lead = React.lazy(() => import('./lead'));
const Leave = React.lazy(() => import('./leave'));
const Onsite = React.lazy(() => import('./onsite'));

const tabs = ['Lead', 'Leave', 'Onsite'];

const Request = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Lead');

  const renderTab = (tab) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Lead':
        return (
          <Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
            <Lead navigation={navigation} />
          </Suspense>
        );
      case 'Leave':
        return (
          <Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
            <Leave navigation={navigation} />
          </Suspense>
        );
      case 'Onsite':
        return (
          <Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
            <Onsite navigation={navigation} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.tabBar}>
        {tabs.map(renderTab)}
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default Request;

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
    paddingVertical: 10,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 14,
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
