import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import AddExpenseModal from '../../components/AddExpenseModal';
import {_get, _post} from '../../api/apiClient';

const formatSectionTitle = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const groupByDate = items => {
  const map = {};
  items.forEach(item => {
    const key = item.expense_date || 'Unknown';
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });

  return Object.keys(map)
    .map(dateKey => ({
      title: dateKey,
      data: map[dateKey].sort(
        (a, b) =>
          new Date(b.created_at || b.expense_date) -
          new Date(a.created_at || a.expense_date),
      ),
    }))
    .sort((a, b) => new Date(b.title) - new Date(a.title));
};

const MyExpenses = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate last 6 months including current month
  const getLast6Months = () => {
    const result = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', {month: 'short'});
      result.push({
        label: `${monthLabel} ${d.getFullYear()}`,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      });
    }
    return result.reverse(); // oldest to latest
  };

  const monthsList = getLast6Months();

  const fetchExpenses = useCallback(
    async (month = selectedMonth, year = selectedYear) => {
      try {
        setLoading(true);
        setErrorMsg('');
        let url = '/list-expenses';
        if (month && year) url += `?month=${month}&year=${year}`;

        const response = await _get(url);
        if (response?.data?.success === 1) {
          const expenseList = response.data.data?.data || [];
          setExpenses(expenseList);
          setSections(groupByDate(expenseList));
        } else {
          setErrorMsg(response?.data?.message || 'No expenses found.');
          setExpenses([]);
          setSections([]);
        }
      } catch (error) {
        console.error('❌ Error fetching expenses:', error);
        const msg =
          error.response?.data?.message ||
          error.message ||
          'Something went wrong while fetching expenses.';
        setErrorMsg(msg);
        setExpenses([]);
        setSections([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedMonth, selectedYear],
  );

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async formData => {
    try {
      const response = await _post('/add-expenses', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      if (response?.data?.success === 1) {
        Alert.alert('Success', response?.data?.message || 'Expense added!');
        const newExpense = response.data.data;
        const newList = [newExpense, ...expenses];
        setExpenses(newList);
        setSections(groupByDate(newList));
        setIsModalVisible(false);
      } else {
        Alert.alert(
          'Error',
          response?.data?.message || 'Failed to add expense.',
        );
      }
    } catch (error) {
      console.error('❌ Error adding expense:', error);
      let msg = 'Something went wrong while adding expense.';
      const res = error.response?.data;
      if (res?.errors) {
        msg = Object.keys(res.errors)
          .map(key => `${key}: ${res.errors[key].join(', ')}`)
          .join('\n');
      } else if (res?.message) msg = res.message;
      else if (error.message) msg = error.message;
      Alert.alert('Error', msg);
      setErrorMsg(msg);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.expenseName}>{item.title}</Text>
          <Text style={styles.dateText}>
            {item.expense_date
              ? new Date(item.expense_date).toLocaleDateString()
              : '-'}
          </Text>
          {item.description ? (
            <Text style={styles.descText}>{item.description}</Text>
          ) : null}
        </View>

        <View style={styles.right}>
          <Text style={styles.amount}>₹{item.amount}</Text>
          {item.invoice_file ? (
            <TouchableOpacity
              onPress={() => console.log('📄 Open file:', item.invoice_file)}>
              <Text style={styles.fileText}>📎 View Bill</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({section}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {formatSectionTitle(section.title)}
      </Text>
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* 🔹 Filter Dropdown (like PhonePe) */}
        <View style={styles.filterWrapper}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={styles.filterText}>
              {monthsList.find(
                m => m.month === selectedMonth && m.year === selectedYear,
              )?.label || 'Filter'}
            </Text>
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.dropdownMenu}>
              <ScrollView nestedScrollEnabled style={{maxHeight: 200}}>
                {monthsList.map(m => (
                  <TouchableOpacity
                    key={`${m.month}-${m.year}`}
                    style={[
                      styles.menuItem,
                      selectedMonth === m.month &&
                        selectedYear === m.year &&
                        styles.menuItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedMonth(m.month);
                      setSelectedYear(m.year);
                      setMenuVisible(false);
                      fetchExpenses(m.month, m.year);
                    }}>
                    <Text
                      style={[
                        styles.menuItemText,
                        selectedMonth === m.month &&
                          selectedYear === m.year &&
                          styles.menuItemTextSelected,
                      ]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* 🔹 Expenses List */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0389ca" />
          </View>
        ) : errorMsg ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={{paddingBottom: 100}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchExpenses}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No expenses found</Text>
            }
          />
        )}

        <FAB
          style={styles.fab}
          icon="plus"
          color="#fff"
          onPress={() => setIsModalVisible(true)}
        />

        <AddExpenseModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddExpense}
        />
      </View>
    </PaperProvider>
  );
};

export default MyExpenses;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5f5f5', padding: 15},
  filterWrapper: {
    alignItems: 'flex-end',
    marginBottom: 10,
    position: 'relative',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#0389ca',
    borderRadius: 8,
  },
  filterText: {color: '#fff', fontWeight: '600'},
  dropdownMenu: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    width: 150,
    paddingVertical: 5,
    zIndex: 100,
  },
  menuItem: {paddingVertical: 8, paddingHorizontal: 10},
  menuItemSelected: {backgroundColor: '#0389ca20'},
  menuItemText: {fontSize: 14, color: '#333'},
  menuItemTextSelected: {color: '#0389ca', fontWeight: '700'},
  sectionHeader: {paddingVertical: 8, backgroundColor: 'transparent'},
  sectionHeaderText: {fontSize: 14, fontWeight: '700', color: '#222'},
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  left: {flex: 1},
  right: {alignItems: 'flex-end'},
  expenseName: {fontSize: 16, fontWeight: '600', color: '#333'},
  descText: {fontSize: 13, color: '#555', marginTop: 3},
  amount: {fontSize: 16, fontWeight: 'bold', color: '#0389ca'},
  fileText: {fontSize: 14, color: '#555', marginTop: 6},
  dateText: {fontSize: 13, color: '#777', marginTop: 4},
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    backgroundColor: '#0389ca',
    borderRadius:50,
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorText: {color: 'red', fontSize: 15, textAlign: 'center'},
  emptyText: {textAlign: 'center', marginTop: 20, color: '#666'},
});
