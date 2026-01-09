import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {_get} from '../../api/apiClient';
import {useFocusEffect} from '@react-navigation/native';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';

const All = ({navigation, userId}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);

  const apiCalled = useRef(false); // Prevent repeated fetch

  useFocusEffect(
    useCallback(() => {
      if (!apiCalled.current) {
        fetchData();
        apiCalled.current = true;
      }
    }, [userId]),
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await _get(`/interestedleadsbyuser/${userId}`);
      const result = response?.data?.data;
      if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
        Alert.alert('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await _get(`/interestedleadsbyuser/${userId}`);
      const result = response?.data?.data;
      if (Array.isArray(result)) {
        setData(result);
        setVisibleCount(100);
      } else {
        setData([]);
        Alert.alert('No data found.');
      }
    } catch (error) {
      console.error('Refresh Error:', error);
      Alert.alert('Error', 'Could not refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  const handleSmsPress = item => {
    const url = `sms:${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    const url = `https://wa.me/${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed on your device.'),
    );
  };

  const handleCallPress = item => {
    const url = `tel:${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Phone number is not available'),
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <LeadCardContactCallBack
        follow_up={item?.followup_on}
        title={item?.name || 'Unknown'}
        subtitle={item?.email || '-'}
        mobile={item?.mobile}
        lead_id={item?.id}
        item={item}
        source={item?.source || '-'}
        oncardPress={() => navigation.navigate('LeadInterested2', {item})}
        onCallPress={() => handleCallPress(item)}
        onSmsPress={() => handleSmsPress(item)}
        onWhatsappPress={() => handleWhatsappPress(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <FlatList
          data={Array.from({length: 6})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactCallBackPlaceholder />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={data.slice(0, visibleCount)}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No interested leads found.</Text>
            </View>
          }
          ListFooterComponent={
            data.length > visibleCount ? (
              <TouchableOpacity
                onPress={() => setVisibleCount(prev => prev + 100)}
                style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>See More</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // listContainer: {
  //   flex: 1, // ✅ ensures full height
  // },
  list: {
    flexGrow: 1,
    padding: 10,
  },
  itemContainer: {
    width: '100%',
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    padding: 20,
  },
  seeMoreButton: {
    paddingVertical: 12,
    //backgroundColor: '#239999',
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  seeMoreText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default All;
