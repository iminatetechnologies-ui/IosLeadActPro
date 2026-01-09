import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {styles} from './InventoryListStyles';
import CustomDropdown from './CustomDropdown'; // Import the dropdown

const FilterModal = ({
  visible,
  onClose,
  filters,
  setFilters,
  applyFilters,
  clearFilters,
  getUniqueValues,
  originalInventory, // Add this prop to get all inventory data
}) => {
  // Get unique cities from inventory
  const getUniqueCities = () => {
    const cities = originalInventory
      .map(item => item.city)
      .filter(city => city && city.trim() !== '');
    return [...new Set(cities)];
  };

  // Get unique localities from inventory
  const getUniqueLocalities = () => {
    const localities = originalInventory
      .map(item => item.locality)
      .filter(locality => locality && locality.trim() !== '');
    return [...new Set(localities)];
  };

  // Get filtered localities based on selected city
  const getFilteredLocalities = () => {
    if (!filters.city) {
      return getUniqueLocalities();
    }
    
    const filteredLocalities = originalInventory
      .filter(item => item.city === filters.city)
      .map(item => item.locality)
      .filter(locality => locality && locality.trim() !== '');
    
    return [...new Set(filteredLocalities)];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Inventory</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterForm}>
            {/* Property Type */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Property Type</Text>
              <View style={styles.filterOptions}>
                {getUniqueValues('property_type').map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.property_type === type &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() =>
                      setFilters(prev => ({
                        ...prev,
                        property_type: prev.property_type === type ? '' : type,
                      }))
                    }>
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.property_type === type &&
                          styles.filterOptionTextSelected,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Property For */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Property For</Text>
              <View style={styles.filterOptions}>
                {getUniqueValues('property_for').map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.property_for === type &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() =>
                      setFilters(prev => ({
                        ...prev,
                        property_for: prev.property_for === type ? '' : type,
                      }))
                    }>
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.property_for === type &&
                          styles.filterOptionTextSelected,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.filterOptions}>
                {getUniqueValues('status').map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      filters.status === status && styles.filterOptionSelected,
                    ]}
                    onPress={() =>
                      setFilters(prev => ({
                        ...prev,
                        status: prev.status === status ? '' : status,
                      }))
                    }>
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.status === status &&
                          styles.filterOptionTextSelected,
                      ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location Filters - Now with Dropdowns */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>City</Text>
              <CustomDropdown
                value={filters.city}
                onSelect={(value) => setFilters(prev => ({...prev, city: value}))}
                options={getUniqueCities()}
                placeholder="Select City"
                style={styles.dropdownInput}
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Locality</Text>
              <CustomDropdown
                value={filters.locality}
                onSelect={(value) => setFilters(prev => ({...prev, locality: value}))}
                options={getFilteredLocalities()}
                placeholder="Select Locality"
                style={styles.dropdownInput}
              />
            </View>

            {/* Price Range */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Price Range (₹)</Text>
              <View style={styles.priceRangeContainer}>
                <TextInput
                  style={[styles.filterInput, styles.priceInput]}
                  placeholder="Min Price"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={filters.minPrice}
                  onChangeText={text =>
                    setFilters(prev => ({...prev, minPrice: text}))
                  }
                />
                <Text style={styles.priceRangeSeparator}>to</Text>
                <TextInput
                  style={[styles.filterInput, styles.priceInput]}
                  placeholder="Max Price"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={filters.maxPrice}
                  onChangeText={text =>
                    setFilters(prev => ({...prev, maxPrice: text}))
                  }
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;