
import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Linking,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import LeadCardContact from './../../components/LeadCardContact';
import LeadCardContactPlaceholder from '../../components/LeadCardContactPlaceholder';

export default function LeadDet({route, navigation}) {
  const {leads} = route.params; // Receiving leads array

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh logic
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsLoading(true);

    // ⚡ Yaha aapko actual API call karni hogi taaki naye leads reload ho
    setTimeout(() => {
      setRefreshing(false);
      setIsLoading(false);
    }, 1500);
  }, []);

  // ✅ Card press logic using status_name
  const handleCardPress = item => {
    const statusName = item?.status_name?.toLowerCase();

    if (statusName === 'interested') {
      navigation.navigate('LeadInterested2', {item});
    } else {
      navigation.navigate('ContactDetails2', {item});
    }
  };

  const handleCallPress = item => {
    const mobile = item?.mobile;
    if (!mobile) {
      Alert.alert('Error', 'Phone number is not available');
      return;
    }

    Linking.openURL(`tel:${mobile}`)
      .then(supported => {
        if (supported) {
          navigation.navigate('ContactDetails2', {item});
        } else {
          Alert.alert('Error', 'Unable to open phone dialer');
        }
      })
      .catch(err => console.log(err));
  };

  const handleSmsPress = item => {
    const mobile = item?.mobile;
    if (!mobile) {
      Alert.alert('Error', 'Phone number is not available');
      return;
    }

    const url = `sms:${mobile}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening messaging app:', err),
    );
  };

  const handleWhatsappPress = item => {
    const mobile = item?.mobile;
    if (!mobile) {
      Alert.alert('Error', 'Phone number is not available');
      return;
    }

    const url = `https://wa.me/${mobile}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening WhatsApp:', err),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {isLoading ? (
        // 🔹 Placeholder list while loading
        <FlatList
          data={Array.from({length: 8})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <LeadCardContactPlaceholder />}
          contentContainerStyle={styles.list}
        />
      ) : (
        // 🔹 Actual leads list
        <FlatList
          data={leads}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => (
            <LeadCardContact
              title={item.name || 'Unknown'}
              email={item.email || '-'}
              mobile={item.mobile || '-'}
              lead_id={item?.id}
              item={item}
              leadtype={item?.lead_type}
              substatus_name={item?.substatus_name || '-'}
              source={item?.source || '-'}
              team_owner={item?.lead_owner || '-'}
              project={item?.project}
              created_date={item?.created_date}
              // ✅ yaha updated press logic laga diya
              oncardPress={() => handleCardPress(item)}
              onCallPress={() => handleCallPress(item)}
              onSmsPress={() => handleSmsPress(item)}
              onWhatsappPress={() => handleWhatsappPress(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7FF',
    padding: 0,
  },
  list: {
    padding: 10,
  },
});
