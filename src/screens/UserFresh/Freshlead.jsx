import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LeadCardContact from '../../components/LeadCardContact';
import LeadCardContactPlaceholder from '../../components/LeadCardContactPlaceholder';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {_get} from '../../api/apiClient';
import {useFocusEffect} from '@react-navigation/native';

const FreshLead = ({navigation, route}) => {
  const {userId} = route.params;
  const [data, setData] = useState({data: []});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  const apiCalled = useRef(false); // <-- flag to prevent repeat calls

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await _get(`/freshleadsbyuser/${userId}`);
      const result = response?.data;
      if (result) setData(result);
      else Alert.alert('No data found.');
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!apiCalled.current) {
        fetchData();
        apiCalled.current = true; // Set flag true after first call
      }
    }, [userId])
  );

  const onRefreshh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await _get(`/freshleadsbyuser/${userId}`);
      const result = response?.data;
      if (result) setData(result);
      else Alert.alert('No data found.');
    } catch (error) {
      console.error('Refresh Error:', error);
      Alert.alert('Error', 'Could not refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  const handleCallPress = item => {
    const mobile = item?.mobile;
    if (!mobile) {
      Alert.alert('Phone number is not available');
      return;
    }
    Linking.openURL(`tel:${mobile}`).catch(() =>
      Alert.alert('Error', 'Unable to initiate call.'),
    );
    navigation.replace('ContactDetails', {item});
  };

  const handleSmsPress = item => {
    const url = `sms:${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    const url = `https://wa.me/${item?.mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'WhatsApp not installed.'),
    );
  };

  const renderItem = ({item}) => (
    <View style={{flex: 1}}>
      <LeadCardContact
        title={item?.name || 'Unknown'}
        email={item?.email || '-'}
        mobile={item?.mobile}
        item={item}
        lead_id={item?.id}
        created_date={item?.created_date || '-'}
        project={item?.project || '-'}
        source={item?.source || '-'}
        oncardPress={() => navigation.replace('LeadDetailsScreen', {item})}
        onCallPress={() => handleCallPress(item)}
        onSmsPress={() => handleSmsPress(item)}
        onWhatsappPress={() => handleWhatsappPress(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
    <StatusBar  barStyle={'light-content'} />
      {isLoading ? (
        <FlatList
          data={Array.from({length: 8})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactPlaceholder />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={data?.data?.slice(0, visibleCount)}
          refreshing={refreshing}
          onRefresh={onRefreshh}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>No Pending leads found.</Text>
            )
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            data?.data?.length > visibleCount ? (
              <TouchableOpacity
                onPress={() => setVisibleCount(prev => prev + 100)}
                style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>See More</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      <PaperProvider>
        <FAB
          style={styles.fab}
          icon="plus"
          color="#ffffff"
          onPress={() => navigation.navigate('AddContact')}
        />
      </PaperProvider>
    </View>
  );
};

export default FreshLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7FF',
  },
  list: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  seeMoreButton: {
    paddingVertical: 12,
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
