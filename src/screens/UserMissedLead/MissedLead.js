import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LeadCardContactCallBack from './../../components/LeadCardCallBack';
import LeadCardContactCallBackPlaceholder from '../../components/LeadCardContactCallBackPlaceholder';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {_get} from '../../api/apiClient';

const UserMissedLead = ({navigation, route}) => {
  const {userId} = route.params;
  const [data, setData] = useState({data: []}); // default structure
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(100); // Pagination chunk

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const response = await _get(`/missedleadsbyuser/${userId}`);
      const result = response?.data;
      if (result) {
        setData(result);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSmsPress = item => {
    const mobile = item?.mobile;
    const url = `sms:${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the messaging app.'),
    );
  };

  const handleWhatsappPress = item => {
    const mobile = item?.mobile;
    const url = `https://wa.me/${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'WhatsApp is not installed on your device.'),
    );
  };

  const handleCallPress = item => {
    const mobile = item?.mobile;
    const url = `tel:${mobile}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Phone number is not available'),
    );
  };

  const renderItem = ({item}) => {
    return (
      <View style={{flex: 1}}>
        <LeadCardContactCallBack
          title={item?.name || 'Unknown'}
          subtitle={item?.email || '-'}
          mobile={item?.mobile}
          lead_id={item?.id}
          project={item?.project || '-'}
          source={item?.source || '-'}
          item={item}
          follow_up={item?.reminder_date || '-'}
          substatus_name={item?.substatus_name || '-'}
          oncardPress={() => navigation.navigate('ContactDetails2', {item})}
          onCallPress={() => handleCallPress(item)}
          onSmsPress={() => handleSmsPress(item)}
          onWhatsappPress={() => handleWhatsappPress(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
    <StatusBar  barStyle="light-content" />
      {isLoading ? (
        <FlatList
          data={Array.from({length: 6})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactCallBackPlaceholder />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={data?.data.slice(0, visibleCount)} // Show only 'visibleCount' items
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>No Missed leads found.</Text>
            )
          }
          ListFooterComponent={
            data?.data.length > visibleCount ? (
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

export default UserMissedLead;

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
