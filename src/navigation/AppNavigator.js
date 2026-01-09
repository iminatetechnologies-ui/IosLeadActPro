import {TouchableOpacity, Text, View, Image, StyleSheet} from 'react-native';

import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  Splash,
  Contact,
  AddContact,
  InterestedDetails,
  NotIntrested,
  CallBackDetails,
  CreateTask,
  RescheduleTask,
  LostDetails,
  InterestedLead,
  InventoryForm,
  NotIntrestedLead,
  CallBackLead,
  PendingLead,
  Opportunity,
  WonDetails,
  MissedLead,
  WonLead,
  Login,
  LeadDet,
  LeadDetailsScreen,
  LeadInterested2,
  ContactDetails2,
  FreshLead,
  UserInterestedLead,
  UserCallbackLead,
  UserWonLead,
  UserMissedLead,
  UserOpportunity,
  NotInterestedLead,
  TotalLeads,
  PendingLead2,
  Analytics,
  Freshdata,
  ProjectDetails,
  Request,
  Notification,
  NotificationDetails,
  EmployeeDetails,
  OverDueLead,
  FilterTaskdata,
  FilterTaskdatacard,
  InvetoryDetailsScreen,
  SourceFreshdata,
  machinginventory,
  Inventory,
  InventoryList,
  incentive,
  plans,
  EmailVerify,
  SignUp,
  OfflineNotice,
  permission,
  checkoutout,
  managerdashboard,
  todaystatus,
  // Endday,
  Enddaymanager,
} from './../screens/index';
import NavigationService from './NavigationService';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" headerMode="screen">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Sign_up"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Very_Email"
        component={EmailVerify}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="NoInternet"
        component={OfflineNotice}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="LeadDetailsScreen"
        component={LeadDetailsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="LeadDetails"
        component={LeadDet}
        options={{
          headerTitle: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Search Leads
              </Text>
            </View>
          ),
          headerTitleAlign: 'left',
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
          headerRight: () => (
            <Image
              source={require('../assets/images/pendinglead.png')}
              style={{width: 120, height: 150}} // Adjusted size
              resizeMode="contain"
            />
          ),
        }}
      />

      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContact}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="InterestedDetails"
        component={InterestedDetails}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="NotIntrested"
        component={NotIntrested}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="CallBackDetails"
        component={CallBackDetails}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="CreateTask"
        component={CreateTask}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="WonDetails"
        component={WonDetails}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="RescheduleTask"
        component={RescheduleTask}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="LostDetails"
        component={LostDetails}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="ContactDetails2"
        component={ContactDetails2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Interested Lead"
        component={InterestedLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="LeadInterested2"
        component={LeadInterested2}
        options={{headerShown: false}}
      />

      <Stack.Screen name="NotIntrestedLead" component={NotIntrestedLead} />
      <Stack.Screen
        name="CallBack Lead"
        component={CallBackLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="PendingLead"
        component={PendingLead}
        options={{
          headerTitle: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Fresh Lead
              </Text>
            </View>
          ),
          headerTitleAlign: 'left',
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
          headerRight: () => (
            <Image
              source={require('../assets/images/pendinglead.png')}
              style={{width: 120, height: 150}} // Adjusted size
              resizeMode="contain"
            />
          ),
        }}
      />

      <Stack.Screen
        name="Opportunity"
        component={Opportunity}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Missed Lead"
        component={MissedLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Won Lead"
        component={WonLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="OverDueLead"
        component={OverDueLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Filter Data"
        component={FilterTaskdata}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Filter Data Task"
        component={FilterTaskdatacard}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      {/* //-------------------user Detais aal page --------------------- */}

      <Stack.Screen
        name="User Fresh Leads"
        component={FreshLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="User Interested Leads"
        component={UserInterestedLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="User CallBack Leads"
        component={UserCallbackLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="User Won Leads"
        component={UserWonLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="User Missed Leads"
        component={UserMissedLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="User Opportunity Leads"
        component={UserOpportunity}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="User NotInterested Leads"
        component={NotInterestedLead}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Total Leads"
        component={TotalLeads}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Fresh Leads"
        component={PendingLead2}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      {/* //-------------------analytics page start --------------------- */}
      <Stack.Screen
        name="Analytics"
        component={Analytics}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Request"
        component={Request}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="Filtered Leads"
        component={Freshdata}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Source Leads"
        component={SourceFreshdata}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetails}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notification}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationDetails}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="Add Inventory"
        component={InventoryForm}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Maching Inventory"
        component={machinginventory}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="Resale"
        component={InventoryList}
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(' Analytics')}
              style={{
                backgroundColor: '#ffffff33', // white with little transparency
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: 1,
                borderColor: '#fff',
              }}>
              <Text style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
                Analytics
              </Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name=" Analytics"
        component={Inventory}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="InventoryDetailsScreen"
        component={InvetoryDetailsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Employee Details"
        component={EmployeeDetails}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Plans"
        component={plans}
        options={{
          headerShown: false,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Incentive Details"
        component={incentive}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Permissions"
        component={permission}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={checkoutout}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
       <Stack.Screen
        name="Manager Dashboard"
        component={managerdashboard}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Today Status"
        component={todaystatus}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      />
      {/* <Stack.Screen
        name="End Day-Check Out"
        component={Endday}
        options={{
          headerShown: false,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
        }}
      /> */}
      <Stack.Screen
        name="End Day-Check Out "
        component={Enddaymanager}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#2D87DB'},
          headerTintColor: '#fff',
          headerTitle: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                End Day Summary
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <NavigationContainer
          ref={ref => NavigationService.setTopLevelNavigator(ref)}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="AuthStack" component={AuthStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default AppNavigator;
