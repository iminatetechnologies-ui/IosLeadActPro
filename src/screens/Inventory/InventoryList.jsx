import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {styles} from './InventoryListStyles';
import {_get} from '../../api/apiClient';
import FilterModal from './FilterModal'; // Import the new component

const InventoryList = ({navigation}) => {
  const [inventory, setInventory] = useState([]);
  const [originalInventory, setOriginalInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    property_type: '',
    property_for: '',
    city: '',
    locality: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchInventory = async () => {
    try {
      const response = await _get('/getresaleinventory');
      console.log(response);
      if (response.data.success == 1) {
        const items = response.data.data.items || [];
        setOriginalInventory(items); // Always update original data

        // Apply existing filters to new data
        applyFiltersToData(items);
      } else {
        Alert.alert('Error', response.data.message);
        setInventory([]);
        setOriginalInventory([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load inventory list');
      setInventory([]);
      setOriginalInventory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // NEW FUNCTION: Apply filters to any data
  const applyFiltersToData = data => {
    const active = [];
    let filteredData = [...data];

    // Property Type filter
    if (filters.property_type) {
      filteredData = filteredData.filter(
        item => item.property_type === filters.property_type,
      );
      active.push(`Type: ${filters.property_type}`);
    }

    // Property For filter
    if (filters.property_for) {
      filteredData = filteredData.filter(
        item => item.property_for === filters.property_for,
      );
      active.push(`For: ${filters.property_for}`);
    }

    // City filter
    if (filters.city) {
      filteredData = filteredData.filter(item =>
        item.city?.toLowerCase().includes(filters.city.toLowerCase()),
      );
      active.push(`City: ${filters.city}`);
    }

    // Locality filter
    if (filters.locality) {
      filteredData = filteredData.filter(item =>
        item.locality?.toLowerCase().includes(filters.locality.toLowerCase()),
      );
      active.push(`Locality: ${filters.locality}`);
    }

    // Status filter
    if (filters.status) {
      filteredData = filteredData.filter(
        item => item.status === filters.status,
      );
      active.push(`Status: ${filters.status}`);
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      filteredData = filteredData.filter(item => {
        const price = parseFloat(item.demand_price) || 0;
        const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        return price >= min && price <= max;
      });

      if (filters.minPrice && filters.maxPrice) {
        active.push(`Price: ₹${filters.minPrice} - ₹${filters.maxPrice}`);
      } else if (filters.minPrice) {
        active.push(`Min Price: ₹${filters.minPrice}`);
      } else if (filters.maxPrice) {
        active.push(`Max Price: ₹${filters.maxPrice}`);
      }
    }

    setInventory(filteredData);
    setActiveFilters(active);
  };

  // UPDATED: Now calls applyFiltersToData
  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory(); // This will apply existing filters
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Extract unique values for dropdown options
  const getUniqueValues = key => {
    return [
      ...new Set(originalInventory.map(item => item[key]).filter(Boolean)),
    ];
  };

  // UPDATED: Apply filters (now uses applyFiltersToData)
  const applyFilters = () => {
    applyFiltersToData(originalInventory);
    setShowFilterModal(false);
  };

  // UPDATED: Clear all filters
  const clearFilters = () => {
    setFilters({
      property_type: '',
      property_for: '',
      city: '',
      locality: '',
      status: '',
      minPrice: '',
      maxPrice: '',
    });
    setInventory(originalInventory);
    setActiveFilters([]);
    setShowFilterModal(false);
  };

  const removeFilter = filterText => {
    const filterKey = filterText.split(': ')[0].toLowerCase();

    // Reset the specific filter
    setFilters(prev => {
      const keyMap = {
        type: 'property_type',
        for: 'property_for',
        city: 'city',
        locality: 'locality',
        status: 'status',
        price: 'minPrice',
        'min price': 'minPrice',
        'max price': 'maxPrice',
      };

      const newFilters = {...prev};
      const filterKeyToReset = keyMap[filterKey];

      if (filterKey === 'price') {
        newFilters.minPrice = '';
        newFilters.maxPrice = '';
      } else if (filterKeyToReset) {
        newFilters[filterKeyToReset] = '';
      }

      return newFilters;
    });

    // Remove from active filters
    const newActiveFilters = activeFilters.filter(f => f !== filterText);
    setActiveFilters(newActiveFilters);

    // Reapply remaining filters
    if (newActiveFilters.length === 0) {
      setInventory(originalInventory);
    } else {
      // Reapply filters with updated filter state
      setTimeout(() => applyFiltersToData(originalInventory), 100);
    }
  };

  const viewDetails = item => {
    navigation.navigate('InventoryDetailsScreen', {
      id: item.id,
    });
  };

  const addInventory = () => {
    navigation.navigate('Add Inventory');
  };

  const formatPropertyType = type => {
    if (!type) return 'N/A';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading Inventory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Inventory List</Text>
          <Text style={styles.headerSubtitle}>
            Total Properties: {inventory.length}
            {activeFilters.length > 0 && ` (Filtered)`}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}>
            <Text style={styles.filterButtonText}>🔍 Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={addInventory}>
            <Text style={styles.addButtonText}>+ Add Inventory</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activeFiltersList}>
              {activeFilters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.activeFilterChip}
                  onPress={() => removeFilter(filter)}>
                  <Text style={styles.activeFilterText}>{filter}</Text>
                  <Text style={styles.removeFilterIcon}>✕</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={clearFilters}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
          />
        }>
        <View style={styles.cardsContainer}>
          {inventory.map((item, index) => (
            // FULL CARD CLICKABLE
            <TouchableOpacity
              key={item.id || index}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => viewDetails(item)}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.projectName}>
                    {item.owner_name || 'Owner'}
                  </Text>

                  <Text style={styles.cardId}>
                    {formatPropertyType(item.property_type)}
                  </Text>
                </View>

                {/* Status on Right Side */}
                <Text style={styles.cardPrice}>{item.property_for}</Text>
              </View>

              {/* Location (Left) & Project (Right) */}
              <View style={styles.section}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {/* LEFT SIDE — Location */}
                  <View style={{flex: 1}}>
                    <Text style={styles.sectionLabel}>Location</Text>
                    <Text style={styles.sectionValue}>
                      {item.locality}, {item.city}
                    </Text>
                  </View>

                  {/* RIGHT SIDE — Project Name (if available) */}
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={styles.sectionLabel}>Project</Text>
                    <Text style={styles.sectionValue}>{item.project}</Text>
                  </View>
                </View>
              </View>

              {/* Property Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Floors</Text>
                  <Text style={styles.detailValue}>
                    {item.floor}/{item.total_floor}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Demand Price</Text>
                  <Text style={styles.detailValue}>
                    {item.demand_price || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Configuration</Text>
                  <Text style={styles.detailValue}>{item.configuration}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Facing</Text>
                  <Text style={styles.detailValue}>{item.facing || 'N/A'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {inventory.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No inventory found</Text>
            <Text style={styles.emptySubtext}>
              {activeFilters.length > 0
                ? 'Try changing your filters'
                : 'Add your first property to get started'}
            </Text>

            {activeFilters.length > 0 && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal - Now using separate component */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        getUniqueValues={getUniqueValues}
        originalInventory={originalInventory}
      />
    </View>
  );
};

export default InventoryList;
