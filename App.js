import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator'; // <-- Import your navigator
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { MenuProvider } from 'react-native-popup-menu';
import { UserProvider } from './src/screens/contaxt/UserContext';
import { DevSettings } from 'react-native';
import { LogBox } from 'react-native';


if (__DEV__) {
  DevSettings.addMenuItem('Enable Remote Debugging', () => {
    DevSettings.reload(); // or any debug-related action
  });
}

LogBox.ignoreLogs([
  'RCTComponentViewRegistry: Attempt to recycle a mounted view',
]);

// OR ignore all logs (not recommended but works)
LogBox.ignoreAllLogs(true);
// If you want to ignore all yellow box warnings (not recommended)
// console.disableYellowBox = true;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <MenuProvider>
        <UserProvider>
          <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppNavigator /> {/* Call your main navigator */}
          </View>
        </UserProvider>
      </MenuProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
