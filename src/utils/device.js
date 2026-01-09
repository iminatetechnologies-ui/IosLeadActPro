import {Dimensions} from 'react-native';

/**
 * Google recommended tablet detection
 * Min screen dimension >= 600dp
 */
export const isTablet = () => {
  const {width, height} = Dimensions.get('window');
  const isTab = Math.min(width, height) >= 600;

//   console.log(
//     '📱 Device check → width:',
//     width,
//     'height:',
//     height,
//     'isTablet:',
//     isTab,
//   );

  return isTab;
};
