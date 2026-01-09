import React, {useCallback, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {_get} from '../../api/apiClient';
import LeadCardContactCallBack from '../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';

const Meeting = ({navigation, userId}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const apiCalled = useRef(false);

  const fetchData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await _get(`/meetingleadsbyuser/${userId}`);
      const result = response?.data?.data;
      if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
        Alert.alert('Error', 'No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong, please try again.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!apiCalled.current) {
        fetchData();
        apiCalled.current = true;
      }
    }, [userId]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await _get(`/meetingleadsbyuser/${userId}`);
      const result = response?.data?.data;
      if (Array.isArray(result)) {
        setData(result);
        setVisibleCount(100);
      } else {
        setData([]);
        Alert.alert('Error', 'No data found.');
      }
    } catch (error) {
      console.error('Refresh Error:', error);
      Alert.alert('Error', 'Could not refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  const handleCallPress = item => {
    const mobile = item?.mobile;
    if (!mobile) return Alert.alert('Phone number is not available');
    Linking.openURL(`tel:${mobile}`)
      .then(() => navigation.navigate('ContactDetails2', {item}))
      .catch(() => Alert.alert('Error', 'Unable to initiate call.'));
  };

  const handleSmsPress = item => {
    const mobile = item?.mobile;
    if (!mobile) return Alert.alert('Phone number is not available');
    Linking.openURL(`sms:${mobile}`).catch(() =>
      Alert.alert('Error', 'Unable to open messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    const mobile = item?.mobile;
    if (!mobile) return Alert.alert('Phone number is not available');
    Linking.openURL(`https://wa.me/${mobile}`).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed on your device.'),
    );
  };

  const renderItem = ({item}) => (
    <View style={{flex: 1}}>
      <LeadCardContactCallBack
        follow_up={item?.followup_on}
        title={item?.name || 'Unknown'}
        subtitle={item?.email || '-'}
        lead_id={item?.id}
        item={item}
        mobile={item?.mobile}
        source={item?.source || '-'}
        oncardPress={() =>
          navigation.navigate('LeadInterested2', {
            item,
            screen: 'Meeting',
          })
        }
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
        />
      ) : (
        <FlatList
          data={data.slice(0, visibleCount)}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>No Meeting leads found.</Text>
            )
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
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

export default Meeting;
