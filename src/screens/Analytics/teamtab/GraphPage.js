import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TabView, TabBar} from 'react-native-tab-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CardComponent from './CardComponent';
import StatusTable from './StatusTabledashboard';
import StatusTableInactive from './StatusTabledashboardInactive';
import {getUserType} from '../../../utils/getUserType';

const ActiveRoute = React.memo(({activeFilterParams}) => {
  return (
    <StatusTable status="active" activeFilterParams={activeFilterParams} />
  );
});

const InactiveRoute = React.memo(({activeFilterParams}) => {
  return (
    <StatusTableInactive
      status="inactive"
      activeFilterParams={activeFilterParams}
    />
  );
});

const GraphPage = ({
  navigation,
  cardData,
  isFilterApplied,
  resetFilters,
  setFilterModalVisible,
  activeFilterParams,
}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await getUserType();
      setUserType(type);
    };
    fetchUserType();
  }, []);

  const [routes] = useState([
    {key: 'active', title: 'Active Users'},
    {key: 'inactive', title: 'Inactive Users'},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'active':
        return <ActiveRoute activeFilterParams={activeFilterParams} />;
      case 'inactive':
        return <InactiveRoute activeFilterParams={activeFilterParams} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Team Dashboard</Text>
        <TouchableOpacity
          onPress={() =>
            isFilterApplied ? resetFilters() : setFilterModalVisible(true)
          }>
          <Icon
            name={isFilterApplied ? 'x' : 'filter'}
            size={wp('6%')}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <CardComponent
        navigation={navigation}
        cardData={cardData}
        isFilterApplied={isFilterApplied}
        resetFilters={resetFilters}
        setFilterModalVisible={setFilterModalVisible}
        activeFilterParams={activeFilterParams}
      />

      {userType === 'company' || userType === 'team_owner' ? (
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          swipeEnabled={false}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{backgroundColor: '#000'}}
              style={{backgroundColor: '#f5f5f5'}}
              labelStyle={{
                color: '#000',
                fontWeight: '600',
                fontSize: wp('3.5%'),
              }}
              activeColor="#000"
              inactiveColor="#000"
            />
          )}
          style={{marginTop: hp('2%'), flex: 1, width: '100%'}}
        />
      ) : (
        <StatusTable status="active" activeFilterParams={activeFilterParams} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('2%'),
  },
  headerRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#000',
  },
});

export default GraphPage;
