
import React, {useState, Suspense} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import TaskTab from './tasktab';

// Lazy loaded screens
const Team = React.lazy(() => import('./team'));
const Source = React.lazy(() => import('./source'));
const Call = React.lazy(() => import('./call'));

// Top-level tabs
const mainTabs = ['Data', 'Task', 'Call'];
// Nested tabs for "Data"
const dataTabs = ['Team', 'Source'];

const Analytics = ({navigation}) => {
  const [activeMainTab, setActiveMainTab] = useState('Data');
  const [activeDataTab, setActiveDataTab] = useState('Team');

  const renderMainTab = tab => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabItem,
        activeMainTab === tab && styles.activeTabItem,
      ]}
      onPress={() => setActiveMainTab(tab)}>
      <Text
        style={[
          styles.tabText,
          activeMainTab === tab && styles.activeTabText,
        ]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderDataTab = tab => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.nestedTabItem,
        activeDataTab === tab && styles.activeNestedTabItem,
      ]}
      onPress={() => setActiveDataTab(tab)}>
      <Text
        style={[
          styles.tabText,
          activeDataTab === tab && styles.activeTabText,
        ]}>
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (activeMainTab === 'Data') {
      return (
        <View style={{flex: 1}}>
          <View style={styles.nestedTabBar}>
            {dataTabs.map(renderDataTab)}
          </View>
          {activeDataTab === 'Team' ? (
            <Suspense >
              <Team navigation={navigation} />
            </Suspense>
          ) : (
            <Suspense>
              <Source navigation={navigation} />
            </Suspense>
          )}
        </View>
      );
    } else if (activeMainTab === 'Call') {
      return (
        <Suspense fallback={<Text>Loading...</Text>}>
          <Call navigation={navigation} />
        </Suspense>
      );
    } else if (activeMainTab === 'Task') {
      return (
       <Suspense >
          <TaskTab navigation={navigation} />
        </Suspense>
      );
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.tabBar}>{mainTabs.map(renderMainTab)}</View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default Analytics;

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
  nestedTabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
  },
  nestedTabItem: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeNestedTabItem: {
    borderBottomColor: 'blue',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
});
