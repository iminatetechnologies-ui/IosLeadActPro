import {CommonActions, StackActions} from '@react-navigation/native';

let _navigator;

// 🔗 Set navigation reference
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

// 🔀 Navigate to a screen
function navigate(routeName, params) {
  if (_navigator && routeName) {
    _navigator.navigate(routeName, params);
  }
}

// 🔁 Replace current screen
function replace(routeName, params) {
  if (_navigator && routeName) {
    _navigator.dispatch(StackActions.replace(routeName, params));
  }
}

// ⬅️ Go back
function goBack() {
  if (_navigator) {
    _navigator.goBack();
  }
}

// 🧹 Reset navigation stack
function reset(routeName, params = {}) {
  if (_navigator) {
    _navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: routeName, params}],
      }),
    );
  }
}

// 👁️ Get current route name
function getCurrentRouteName() {
  if (!_navigator?.getCurrentRoute) return null;
  return _navigator.getCurrentRoute()?.name;
}

export default {
  navigate,
  replace,
  goBack,
  reset,
  setTopLevelNavigator,
  getCurrentRouteName,
};
