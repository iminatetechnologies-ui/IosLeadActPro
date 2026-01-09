import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {_get} from '../../api/apiClient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const TodayScreen = React.lazy(() => import('./Today'));
const UpcomingScreen = React.lazy(() => import('./Upcoming'));
const All = React.lazy(() => import('./All'));

const UserCallBackLead = ({navigation,route}) => {
 const {userId} = route.params;
 console.log(userId,"--------------")
  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content'/>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          //tabBarItemStyle: { width: 100 },
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIndicatorStyle: { backgroundColor: 'blue' },
        }}
      >
        <Tab.Screen name="All">
          {() => (
            <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
              <All navigation={navigation}  userId={userId}/>
            </React.Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen name="Today">
          {() => (
            <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
              <TodayScreen navigation={navigation}  userId={userId}/>
            </React.Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen name="Upcoming">
          {() => (
            <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
              <UpcomingScreen navigation={navigation } userId={userId}/>
            </React.Suspense>
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <View>
     <PaperProvider>
        <FAB
          style={styles.fab}
          icon="plus"
          color="#ffffff"
          onPress={() => navigation.navigate('AddContact')}
        />
      </PaperProvider>
      </View>
    </View>
  );
};

export default UserCallBackLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 50,
  },
});
