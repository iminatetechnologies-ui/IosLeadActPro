

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {PieChart} from 'react-native-chart-kit';
import CardComponent from './CardComponent';
import StatusTable from './StatusTabledashboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const GraphPage = ({
  navigation,
  cardData,
  isFilterApplied,
  resetFilters,
  setFilterModalVisible,
  activeFilterParams,
}) => {
 // console.log('👉 Active Filter Params in GraphPage:', activeFilterParams); // ✅ Console log here

  return (
    <View style={styles.pageContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Source Dashboard</Text>
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

      <StatusTable activeFilterParams={activeFilterParams} />
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
