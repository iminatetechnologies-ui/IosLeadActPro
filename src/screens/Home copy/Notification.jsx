import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {_get} from '../../api/apiClient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const res = await _get('/getnotifications');
      const notifList = res?.data?.data;

      if (Array.isArray(notifList)) {
        const formatted = notifList.map(item => ({
          id: item.id.toString(),
          title: item.title,
          message: item.message,
          time: moment(item.created_at).fromNow(),
          isRead: item.is_read === '1',
        }));

        // Sort unseen first
        const sorted = formatted.sort((a, b) => a.isRead - b.isRead);
        setNotifications(sorted);
      }
    } catch (error) {
      console.error('❌ API failed:', error.message);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const handleNotificationPress = async item => {
    try {
      await _get(`/readnotification/${item.id}`);
      setNotifications(prev => {
        const updated = prev.map(n =>
          n.id === item.id ? {...n, isRead: true} : n,
        );
        return updated.sort((a, b) => a.isRead - b.isRead);
      });
    } catch (error) {
      console.warn('❌ Failed to mark as read:', error.message);
    }
    navigation.navigate('Notification', {item});
  };

  const NotificationCard = ({item, onPress}) => {
    return (
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={[styles.card, !item.isRead && styles.unreadCard]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.badgeDot} />}
          </View>
          <Text style={[styles.message, !item.isRead && styles.unreadMessage]}>
            {item.message}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchNotifications(true);
          }}
          renderItem={({item}) => (
            <NotificationCard item={item} onPress={handleNotificationPress} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No notifications</Text>
          }
        />
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(3),
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: wp(2),
    padding: wp(4),
    marginVertical: hp(0.8),
  },
  title: {
    fontSize: wp(4),
    color: '#333',
  },
  message: {
    fontSize: wp(3.8),
    color: '#666',
    marginTop: hp(0.5),
  },
  unreadCard: {
    backgroundColor: '#E8F0FE',
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: '#000',
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#222',
  },
  time: {
    fontSize: wp(3),
    color: '#999',
    marginTop: hp(1),
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    marginTop: hp(3),
    color: '#999',
    fontSize: wp(4),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: 'red',
    marginLeft: wp(2),
  },
});


