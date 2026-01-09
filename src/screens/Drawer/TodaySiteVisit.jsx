import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import {_get} from '../../api/apiClient';
import {showError} from './../../components/FlashMessage';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';

const TodaySiteVisit = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0); // ✅ NEW

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await _get('/gettodayvisits');
      const result = response?.data?.data;

      if (Array.isArray(result)) {
        setData(result);
        setTotalCount(result.length); // ✅ SET LENGTH
      } else {
        showError('No data found.');
        setTotalCount(0);
      }
    } catch (error) {
      showError('Something went wrong');
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(); // ✅ reuse
    setRefreshing(false);
  }, []);

  const handleSmsPress = item => {
    Linking.openURL(`sms:${item?.mobile}`).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  };

  const renderItem = ({item}) => {
    return (
      <LeadCardContactCallBack
        follow_up={item?.reminder_date || '-'}
        title={item?.name || 'Unknown'}
        subtitle={item?.email || '-'}
        mobile={item?.mobile}
        project={item?.project}
        lead_id={item?.id}
        leadtype={item?.lead_type}
        item={item}
        source={item?.source || '-'}
        substatus_name={item?.substatus_name || '-'}
        team_owner={item?.lead_owner || '-'}
        oncardPress={() => {
          const statusName = item?.status_name?.toLowerCase();
          if (statusName === 'interested') {
            navigation.navigate('LeadInterested2', {item});
          } else if (statusName === 'call back') {
            navigation.navigate('ContactDetails2', {item});
          } else {
            navigation.navigate('LeadDetailsScreen', {item});
          }
        }}
        onSmsPress={() => handleSmsPress(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* ✅ SHOW TOTAL COUNT */}

      <Text style={styles.leadCountText}> {totalCount} records Found</Text>

      {isLoading ? (
        <FlatList
          data={Array.from({length: 8})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactCallBackPlaceholder />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No Today Site Visit leads found.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  list: {padding: 10},
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  },
  leadCountText: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#555',
    textAlign: 'right',
    backgroundColor: '#e8e8e8',
  },
});

export default TodaySiteVisit;
