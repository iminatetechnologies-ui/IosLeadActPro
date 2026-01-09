import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import {_get} from '../../api/apiClient';
import {getUserType} from '../../utils/getUserType';
import CardComponentPlaceholder from '../../components/CardComponentPlaceholder';
import DeviceInfo from 'react-native-device-info';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const isTablet = DeviceInfo.isTablet();

const staticCardData = [
  {
    label: 'Fresh',
    icon: 'bar-chart',
    iconColor: '#2196F3',
  },
  {
    label: 'Interested',
    icon: 'thumb-up',
    iconColor: '#4CAF50',
  },
  {
    label: 'Callback',
    icon: 'call',
    iconColor: '#FF9800',
  },
  {
    label: 'Missed',
    icon: 'do-not-disturb',
    iconColor: '#F44336',
  },
  {
    label: 'Opportunity',
    icon: 'star-outline',
    iconColor: '#9C27B0',
  },
  {
    label: 'Won',
    icon: 'emoji-events',
    iconColor: '#FFD700',
  },
];

const CardComponent = ({navigation, refreshTrigger}) => {
  const [cardData, setCardData] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [usertype, setUsertype] = useState(null);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [lead_res, setleadRes] = useState();

  useEffect(() => {
    const onChange = result => {
      setScreenData(result.window);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Determine if tablet is in landscape mode
  const isLandscape = screenData.width > screenData.height;

  // Calculate card width based on device and orientation
  const getCardWidth = () => {
    if (!isTablet) {
      // Phone: 3 cards per row (same as before)
      return wp('29%');
    } else {
      // Tablet
      if (isLandscape) {
        // Landscape: 6 cards per row
        return wp('15%');
      } else {
        // Portrait: 3 cards per row
        return wp('26.5%');
      }
    }
  };

  // Calculate card height based on device and orientation
  const getCardHeight = () => {
    if (!isTablet) {
      // Phone: keep original height
      return hp('8%');
    } else {
      // Tablet
      if (isLandscape) {
        // Landscape: smaller height to fit 6 cards
        return hp('10%');
      } else {
        // Portrait: medium height for 3 cards
        return hp('12%');
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!apiCalled) {
          try {
            const type = await getUserType();
            setUsertype(type);
          } catch (err) {
            console.log('User type fetch error:', err);
          }
          fetchData(true);
          setApiCalled(true);
        }
      };
      init();
    }, [apiCalled]),
  );

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     fetchData(false);
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  const fetchData = async isInitialLoad => {
    try {
      if (isInitialLoad) setInitialLoading(true);
      const response = await _get('/getdashboard');
      // console.log('home card -----', response);
      const finalData = response?.data?.data;
      const lead_res = response?.data?.data?.lead_restriction;
      setleadRes(lead_res);
      if (!finalData) return;

      const res = staticCardData.map(staticCard => {
        const key = staticCard.label;
        return {
          label: key,
          count: finalData[key] || 0,
          icon: staticCard.icon,
          iconColor: staticCard.iconColor,
        };
      });

      setCardData(res);
    } catch (error) {
      console.log('Fetch error:', error);
    } finally {
      if (isInitialLoad) setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const navigateToScreen = async label => {
    if (label === 'Fresh') {
      navigation.navigate('Fresh Leads');
      return;
    } else {
      const routes = {
        Missed: 'Missed Lead',
        Interested: 'Interested Lead',
        Callback: 'CallBack Lead',
        Opportunity: 'Opportunity',
        Won: 'Won Lead',
      };
      navigation.navigate(routes[label] || 'Home');
    }
  };

  // Dynamic styles based on device and orientation
  const dynamicStyles = StyleSheet.create({
    card: {
      width: getCardWidth(),
      height: getCardHeight(),
      borderRadius: isTablet ? hp('1%') : hp('1%'),
      marginBottom: hp('1%'),
      overflow: 'hidden',
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardContent: {
      flex: 1,
      borderRadius: wp('1%'),
      padding: isTablet ? (isLandscape ? wp('1%') : wp('1.5%')) : wp('3%'),
      justifyContent: 'space-between',
      backgroundColor: '#fff',
    },
    label: {
      color: '#000',
      fontWeight: '600',
      fontSize: isTablet ? (isLandscape ? wp('1.3%') : wp('1.5%')) : wp('3.5%'),
      marginBottom: hp('0.5%'),
    },
    count: {
      color: '#0389ca',
      fontSize: isTablet ? (isLandscape ? wp('1.5%') : wp('1.8%')) : wp('4.2%'),
      fontWeight: '700',
    },
    icon: {
      marginLeft: isTablet ? wp('2%') : wp('3%'),
    },
  });

  const iconSize = isTablet
    ? isLandscape
      ? wp('1.7%')
      : wp('2.5%')
    : wp('5.2%');

  return (
    <View style={styles.container}>
      {initialLoading ? (
        <CardComponentPlaceholder />
      ) : (
        cardData.map((item, index) => {
          const missedCard = cardData.find(c => c.label === 'Missed');
          const missedCount = missedCard?.count || 0;
          const noRestriction =
            usertype === 'company' || usertype === 'team_owner';

          const isMissedActive = !noRestriction && missedCount > lead_res;
          const isTouchable =
            noRestriction ||
            item.label === 'Missed' ||
            item.label === 'Won' ||
            item.label === 'Interested' ||
            item.label === 'Callback' ||
            item.label === 'Opportunity' ||
            !isMissedActive;
          const displayCount = item.count;

          return (
            <TouchableOpacity
              key={index}
              style={[dynamicStyles.card, !isTouchable && {opacity: 0.5}]}
              activeOpacity={0.8}
              onPress={() => isTouchable && navigateToScreen(item.label)}
              disabled={!isTouchable}>
              <View style={dynamicStyles.cardContent}>
                <View>
                  <Text style={dynamicStyles.label}>{item.label}</Text>
                  <View style={styles.countRow}>
                    <Text style={dynamicStyles.count}>{displayCount}</Text>
                    <MaterialIcons
                      name={item.icon}
                      size={iconSize}
                      color={item.iconColor}
                      style={dynamicStyles.icon}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('2%'),
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CardComponent;
