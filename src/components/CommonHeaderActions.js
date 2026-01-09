import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { responsiveWidth as rw, responsiveHeight as rh, responsiveFontSize as rf } from 'react-native-responsive-dimensions';
import { FAB, Provider as PaperProvider } from 'react-native-paper';

const CommonHeaderActions = ({
  isFilterApplied,
  leadcount,
  onFilterPress,
  areAllVisibleSelected,
  onSelectAllPress,
  selectedIds,
  onClearPress,
  onFabPress,
  showFab = false
}) => {
  return (
    <>
      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <View style={styles.filterContent}>
          <Text style={styles.leftText}>Filter</Text>
          <Text style={styles.centerText}>
            {isFilterApplied
              ? `${leadcount} records found`
              : `${leadcount} total records`}
          </Text>
          <Icon
            name={isFilterApplied ? 'x' : 'filter'}
            size={24}
            color="#333"
          />
        </View>
      </TouchableOpacity>

      {/* Select All / Clear */}
      {selectedIds.length > 0 && (
        <View style={styles.selectAllContainer}>
          <TouchableOpacity onPress={onSelectAllPress}>
            <Text style={styles.selectAllText}>
              {areAllVisibleSelected ? 'Unselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>

          <View style={styles.selectionCounter}>
            <Text style={styles.selectionCounterText}>
              {selectedIds.length} Selected
            </Text>
          </View>

          <TouchableOpacity onPress={onClearPress}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FAB */}
      {showFab && selectedIds.length > 0 && (
        <PaperProvider>
          <FAB
            style={styles.fab}
            icon="share"
            color="#fff"
            onPress={onFabPress}
          />
        </PaperProvider>
      )}
    </>
  );
};

export default CommonHeaderActions;

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e8e8e8',
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  centerText: {
    flex: 1,
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    paddingVertical: rh(1),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectAllText: {
    fontSize: rf(1.6),
    color: '#2D87DB',
    fontWeight: '600',
  },
  selectionCounter: {
    backgroundColor: '#2D87DB',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
    borderRadius: rw(5),
  },
  selectionCounterText: {
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: 'bold',
  },
  clearText: {
    backgroundColor: '#2D87DB',
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
    borderRadius: rw(1),
    color: '#fff',
    fontSize: rf(1.6),
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2D87DB',
    borderRadius: 80,
  },
});
