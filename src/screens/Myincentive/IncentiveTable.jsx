import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const IncentiveTable = ({ tableData = [] }) => {
  // 🔹 Column width constants (for perfect alignment)
  const COLUMN_WIDTHS = {
    rank: wp('10%'),
    employee: wp('25%'),
    businessTarget: wp('22%'),
    actualBusiness: wp('22%'),
    excessBusiness: wp('22%'),
    incentivePercent: wp('15%'),
    incentiveAmount: wp('22%'),
    performance: wp('20%'),
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.rank }]}>RANK</Text>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.employee }]}>EMPLOYEE</Text>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.businessTarget }]}>BUSINESS TARGET</Text>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.actualBusiness }]}>ACTUAL BUSINESS</Text>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.excessBusiness }]}>EXCESS BUSINESS</Text>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.incentivePercent }]}>INCENTIVE %</Text>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.incentiveAmount }]}>INCENTIVE AMOUNT</Text>
      <Text style={[styles.headerText, { width: COLUMN_WIDTHS.performance }]}>PERFORMANCE</Text>
    </View>
  );

  const renderRank = index => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? '#f8f8f8' : '#fff' },
      ]}>
      {/* Rank */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.rank }]}>
        <Text style={styles.bodyText}>{renderRank(index)}</Text>
      </View>

      {/* Employee */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.employee }]}>
        <Text style={[styles.bodyText, { fontWeight: '600' }]}>
          {item.employee}
        </Text>
        {item.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{item.role}</Text>
          </View>
        )}
      </View>

      {/* Business Target */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.businessTarget }]}>
        <Text style={styles.bodyText}>
          ₹{item.business_target.toLocaleString()}
        </Text>
      </View>

      {/* Actual Business */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.actualBusiness }]}>
        <Text style={styles.bodyText}>
          ₹{item.actual_business.toLocaleString()}
        </Text>
      </View>

      {/* Excess Business */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.excessBusiness }]}>
        <Text
          style={[
            styles.bodyText,
            {
              color: item.excess_business >= 0 ? '#4CAF50' : '#E53935',
              fontWeight: '600',
            },
          ]}>
          {item.excess_business >= 0
            ? `+₹${item.excess_business.toLocaleString()}`
            : `₹${Math.abs(item.excess_business).toLocaleString()}`}
        </Text>
      </View>

      {/* Incentive % */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.incentivePercent }]}>
        <View style={styles.incentiveBadge}>
          <Text style={styles.incentiveBadgeText}>
            {item.incentive_percent}%
          </Text>
        </View>
      </View>

      {/* Incentive Amount */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.incentiveAmount }]}>
        <Text
          style={[
            styles.bodyText,
            { color: '#009688', fontWeight: '600' },
          ]}>
          ₹{item.incentive_amount.toLocaleString()}
        </Text>
      </View>

      {/* Performance (Top: % | Bottom: Status) */}
      <View style={[styles.cell, { width: COLUMN_WIDTHS.performance }]}>
        <View style={{ alignItems: 'center' }}>
          {/* Top badge - % */}
          <View
            style={[
              styles.performanceSubBadge,
              {
                backgroundColor:
                  item.performance_status === 'Justified'
                    ? '#4CAF50'
                    : '#FFA726',
              },
            ]}>
            <Text style={styles.performancePercent}>
              {item.performance_percent}%
            </Text>
          </View>

          {/* Bottom badge - status */}
          <View
            style={[
              styles.performanceSubBadge,
              {
                backgroundColor:
                  item.performance_status === 'Justified'
                    ? '#81C784'
                    : '#FFB74D',
                marginTop: hp('0.4%'),
              },
            ]}>
            <Text style={styles.performanceText}>
              {item.performance_status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Fixed Header */}
          {renderHeader()}

          {/* Scrollable Body */}
          <ScrollView style={{ maxHeight: hp('50%') }}>
            <FlatList
              data={tableData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('1%'),
  },
  headerRow: {
    backgroundColor: '#e9e9e9',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerText: {
    fontWeight: '700',
    color: '#000',
    fontSize: wp('2.6%'),
    textAlign: 'center',
  },
  bodyText: {
    fontSize: wp('2.6%'),
    color: '#000',
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: '#42A5F5',
    borderRadius: wp('1%'),
    paddingVertical: hp('0.3%'),
    paddingHorizontal: wp('1.5%'),
    marginTop: hp('0.3%'),
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: wp('2.2%'),
    fontWeight: '600',
  },
  incentiveBadge: {
    backgroundColor: '#0288D1',
    borderRadius: wp('1%'),
    paddingVertical: hp('0.2%'),
    paddingHorizontal: wp('2%'),
  },
  incentiveBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('2.5%'),
  },
  performanceSubBadge: {
    borderRadius: wp('1.5%'),
    paddingVertical: hp('0.4%'),
    paddingHorizontal: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp('12%'),
  },
  performancePercent: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp('2.2%'),
  },
  performanceText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('2.2%'),
  },
});

export default IncentiveTable;
