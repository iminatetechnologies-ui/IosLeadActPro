// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // 👈 Must be last in the list
};