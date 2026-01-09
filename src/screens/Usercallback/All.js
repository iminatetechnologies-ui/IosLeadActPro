import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {_get} from '../../api/apiClient';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';
import {useFocusEffect} from '@react-navigation/native';

const All = ({navigation, userId}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);

  const apiCalled = useRef(false); // 👈 this prevents repeat calls

  useFocusEffect(
    useCallback(() => {
      if (!apiCalled.current) {
        fetchData();
        apiCalled.current = true;
      }
    }, [userId])
  );

  const fetchData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await _get(`/callbackleadbyuser/${userId}`);
      const result = response?.data?.data;
      if (result) setData(result);
      else Alert.alert('No data found.');
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    try {
      const response = await _get(`/callbackleadbyuser/${userId}`);
      const result = response?.data?.data;
      if (result) {
        setData(result);
        setVisibleCount(100);
      } else {
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
    <View style={{flex: 1}}>
      <LeadCardContactCallBack
        follow_up={item?.followup_on}
        title={item?.name || 'Unknown'}
        subtitle={item?.email || '-'}
        mobile={item?.mobile}
        lead_id={item?.id}
        item={item}
        source={item?.source || '-'}
        oncardPress={() => navigation.navigate('ContactDetails2', {item})}
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
          data={data?.slice(0, visibleCount)}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading && <Text style={styles.emptyText}>No leads found.</Text>
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

export default All;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  loader: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
