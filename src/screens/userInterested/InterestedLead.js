
import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';

import All from './All';
import FollowUp from './FollowUp';
import SiteVisit from './SiteVisit';
import Meeting from './Meeting';

const Tab = createMaterialTopTabNavigator();

const UserInterestedLead = ({navigation, route}) => {
  const {userId} = route.params;
  //console.log('----------dkhdhsfhs---------->',userId)
  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
    <StatusBar  barStyle="light-content" />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
          tabBarStyle: {backgroundColor: '#fff', elevation: 0},
          tabBarIndicatorStyle: {backgroundColor: 'blue'},
        }}>
       
        <Tab.Screen name="All">
          {() => <All navigation={navigation} userId={userId} />}
        </Tab.Screen>
        <Tab.Screen name="FollowUp">
          {() => <FollowUp navigation={navigation} userId={userId} />}
        </Tab.Screen>
        <Tab.Screen name="SiteVisit">
          {() => <SiteVisit navigation={navigation} userId={userId} />}
        </Tab.Screen>
        <Tab.Screen name="Meeting">
          {() => <Meeting navigation={navigation} userId={userId} />}
        </Tab.Screen>
      </Tab.Navigator>

      {/* <PaperProvider> */}
      <FAB
        style={styles.fab}
        icon="plus"
        color="#ffffff"
        onPress={() => navigation.navigate('AddContact')}
      />
      {/* </PaperProvider> */}
    </SafeAreaView>
  );
};

export default UserInterestedLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 10,
    bottom: 10,
    backgroundColor: 'red',
    borderRadius: 50,
    marginBottom: 20,
  },
});
