import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import {_get} from '../../api/apiClient';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

export default function MyTeam() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false); // 🔥 Pull-to-refresh
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  const navigation = useNavigation();
  const abc = 2;

  useEffect(() => {
    fetchTeamData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, activeUsers, inactiveUsers, activeTab]);

  const fetchTeamData = async () => {
    try {
      const res = await _get('/getteams');
      if (res?.data?.success === '1') {
        setActiveUsers(res?.data?.active_users || []);
        setInactiveUsers(res?.data?.inactive_users || []);
      }
    } catch (err) {
      console.warn('❌ Error fetching team data:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // 🔥 End refresh
    }
  };

  // 🔥 Pull down = refresh API
  const onRefresh = () => {
    setRefreshing(true);
    fetchTeamData();
  };

  const filterData = () => {
    const dataToFilter = activeTab === 'active' ? activeUsers : inactiveUsers;

    if (searchQuery.trim() === '') {
      setFilteredData(dataToFilter);
    } else {
      const filtered = dataToFilter.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Employee Details', {userId: item.user_id})
      }
      style={styles.card}>
      <Image source={{uri: item.photo}} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.designation}>{item.designation}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText,
            ]}>
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'inactive' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('inactive')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'inactive' && styles.activeTabText,
            ]}>
            Inactive
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search by name"
        placeholderTextColor="#aaa"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* List with pull-to-refresh */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.user_id}
        numColumns={abc}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{paddingBottom: hp(2)}}
        ListEmptyComponent={
          <Text style={styles.noData}>No team members found.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? wp(1) : wp(4),
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: isTablet ? hp(2) : hp(1),
  },
  tabButton: {
    flex: 1,
    paddingVertical: isTablet ? hp(0.8) : hp(1),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: isTablet ? wp(1) : wp(2),
    marginHorizontal: isTablet ? wp(0.5) : wp(1),
  },
  activeTab: {
    backgroundColor: '#2D87DB',
  },
  tabText: {
    color: '#555',
    fontSize: isTablet ? wp(2) : wp(4),
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: isTablet ? wp(0.5) : wp(2),
    paddingHorizontal: isTablet ? wp(1.5) : wp(4),
    paddingVertical: isTablet ? hp(1.2) : hp(1),
    fontSize: isTablet ? wp(2) : wp(4),
    marginBottom: isTablet ? hp(2) : hp(1.5),
    color: '#333',
  },
  card: {
    width: isTablet ? wp(28) : wp(45),
    backgroundColor: '#f1f1f1',
    borderRadius: isTablet ? wp(1) : wp(2),
    alignItems: 'center',
    padding: isTablet ? wp(2) : wp(4),
    marginHorizontal: isTablet ? wp(1) : wp(1),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isTablet ? hp(1) : hp(1),
  },

  avatar: {
    width: isTablet ? wp(10) : wp(20),
    height: isTablet ? wp(10) : wp(20),
    borderRadius: isTablet ? wp(5) : wp(10),
    marginBottom: isTablet ? hp(0.5) : hp(1),
  },
  name: {
    fontSize: isTablet ? wp(2) : wp(4),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  designation: {
    fontSize: isTablet ? wp(1.8) : wp(3.5),
    color: '#777',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
  },
  noData: {
    textAlign: 'center',
    fontSize: isTablet ? wp(2) : wp(4),
    marginTop: isTablet ? hp(2) : hp(4),
    color: '#888',
  },
});
