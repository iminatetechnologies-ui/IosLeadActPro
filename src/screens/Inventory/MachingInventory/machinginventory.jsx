import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {_get} from '../../../api/apiClient';
import CardComponent from './CardComponent';
import {styles} from './machinginventry';

export default function MatchingInventory({route, navigation}) {
  const {lead_id} = route.params;

  const [loading, setLoading] = useState(true);
  const [leadData, setLeadData] = useState(null);
  const [matchList, setMatchList] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [budget, setBudget] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [cardValues, setCardValues] = useState({
    totalMatches: 0,
    exactBudgetMatch: 0,
    highMatchScore: 0,
  });

  useEffect(() => {
    fetchMatchingInventory();
  }, []);

  const fetchMatchingInventory = async () => {
    try {
      setLoading(true);
      const res = await _get(`/matchinginventory/${lead_id}`);
      console.log('API RESPONSE:', res.data);

      const {
        lead_info,
        matches = [],
        total_matches = 0,
        lead_budget_range,
      } = res.data.data;

      setLeadData(lead_info);
      setMatchList(Array.isArray(matches) ? matches : []);
      setTotalMatches(total_matches || 0);
      setBudget(lead_budget_range);

      // Calculate exact budget matches
      const exactBudgetMatch = Array.isArray(matches)
        ? matches.filter(item => item?.budget_match_type === 'exact').length
        : 0;

      // Calculate close budget matches
      const closeBudgetMatch = Array.isArray(matches)
        ? matches.filter(item => item?.budget_match_type === 'close').length
        : 0;

      const highMatchScore = Array.isArray(matches)
        ? matches.filter(item => item && item.match_percentage >= 80).length
        : 0;

      setCardValues({
        totalMatches: total_matches || 0,
        exactBudgetMatch,
        closeBudgetMatch,
        highMatchScore,
      });

      setNoDataFound(!matches || matches.length === 0);
    } catch (error) {
      console.log('API Error:', error);
      setMatchList([]);
      setNoDataFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Format price helper function
  const formatPrice = price => {
    if (!price) return 'N/A';

    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;

    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(2)} L`;
    } else {
      return `₹${numPrice.toLocaleString()}`;
    }
  };

  // Handle view details
  const viewDetails = property => {
    // Navigate to property details screen or show modal
    console.log('View details:', property.id);
    // navigation.navigate('PropertyDetails', { property });
    navigation.navigate('InventoryDetailsScreen', {
      id: property.id,
    });
  };

  // Handle delete inventory
  const deleteInventory = (id, name) => {
    console.log('Delete inventory:', id, name);
    // Implement delete functionality
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0389ca" />
      </View>
    );
  }

  if (noDataFound) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No Matching Properties Found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchMatchingInventory}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Lead Details Card */}
      <View style={styles.leadCard}>
        <View style={styles.leadRowContainer}>
          {/* Row 1 */}
          <View style={styles.leadRow}>
            <Text style={styles.leadValue} numberOfLines={1}>
              {leadData?.name || 'N/A'}
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.leadRow}>
            <View style={styles.leadFieldContainer}>
              <Text style={styles.leadLabel}>Project </Text>
              <Text style={styles.leadValue} numberOfLines={1}>
                {leadData?.project_name || '-'}
              </Text>
            </View>

            <View style={styles.leadFieldContainer}>
              <Text style={styles.leadLabel}>Budget </Text>
              <Text style={styles.leadValue} numberOfLines={1}>
                {budget ? `${budget.name}` : '-'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 10,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>
          Inventory
        </Text>
      </View>

      <ScrollView
        style={styles.scrollableCardsContainer}
        showsVerticalScrollIndicator={false}>
        {/* <View style={styles.cardsContainer}>
          {matchList.map((matchItem, index) => (
           
            <TouchableOpacity
              key={matchItem.property?.id || index}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => viewDetails(matchItem.property)}>
             
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.projectName}>
                    {matchItem.property?.owner_name || 'Owner'}
                  </Text>

                  <Text style={styles.cardId}>
                    Match :{' '}
                    {Array.isArray(matchItem.matched_criteria)
                      ? matchItem.matched_criteria
                          .map(
                            item =>
                              item.charAt(0).toUpperCase() + item.slice(1),
                          )
                          .join(', ')
                      : matchItem.matched_criteria?.charAt(0).toUpperCase() +
                        matchItem.matched_criteria?.slice(1)}
                  </Text>
                </View>

                
                <Text style={styles.cardPrice}>
                  {matchItem.property?.property_for
                    ? matchItem.property.property_for.charAt(0).toUpperCase() +
                      matchItem.property.property_for.slice(1)
                    : 'N/A'}
                </Text>
              </View>

              <View style={styles.section}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={styles.sectionLabel}>Location</Text>
                    <Text style={styles.sectionValue}>
                      {matchItem.property?.locality_name || 'N/A'},{' '}
                      {matchItem.property?.city_name || 'N/A'}
                    </Text>
                  </View>

                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={styles.sectionLabel}>Project</Text>
                    <Text style={styles.sectionValue}>
                      {matchItem.property?.project_name || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Floors</Text>
                  <Text style={styles.detailValue}>
                    {matchItem.property?.floor_no || 'N/A'}/
                    {matchItem.property?.total_floors || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Demand Price</Text>
                  <Text style={styles.detailValue}>
                    {formatPrice(matchItem.property?.demand_price)}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Configuration</Text>
                  <Text style={styles.detailValue}>
                    {matchItem.property?.property_configuration || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Facing</Text>
                  <Text style={styles.detailValue}>
                    {matchItem.property?.facing || 'N/A'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={styles.cardsContainer}>
          {matchList.map((matchItem, index) => (
            <TouchableOpacity
              key={matchItem.property?.id || index}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => viewDetails(matchItem.property)}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.projectName}>
                    {matchItem.property?.owner_name || 'Owner'}
                  </Text>

                  <Text style={styles.cardId}>
                    Match :{' '}
                    {Array.isArray(matchItem.matched_criteria)
                      ? matchItem.matched_criteria
                          .map(
                            item =>
                              item.charAt(0).toUpperCase() + item.slice(1),
                          )
                          .join(', ')
                      : matchItem.matched_criteria?.charAt(0).toUpperCase() +
                        matchItem.matched_criteria?.slice(1)}
                  </Text>
                </View>

                {/* Status Right Side */}
                <Text style={styles.cardPrice}>
                  {matchItem.property?.property_for
                    ? matchItem.property.property_for.charAt(0).toUpperCase() +
                      matchItem.property.property_for.slice(1)
                    : 'N/A'}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${matchItem.match_percentage || 0}%`,
                        backgroundColor:
                          (matchItem.match_percentage || 0) <= 40
                            ? 'red'
                            : (matchItem.match_percentage || 0) <= 70
                            ? 'yellow'
                            : 'green',
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    styles.floatingPercent,
                    {
                      left: `${matchItem.match_percentage || 0}%`,
                      color:
                        (matchItem.match_percentage || 0) <= 40
                          ? 'red'
                          : (matchItem.match_percentage || 0) <= 70
                          ? 'yellow'
                          : 'green',
                    },
                  ]}>
                  {matchItem.match_percentage || 0}%
                </Text>
              </View>

              {/* 🔥 END */}

              <View style={styles.section}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={styles.sectionLabel}>Location</Text>
                    <Text style={styles.sectionValue}>
                      {matchItem.property?.locality_name || 'N/A'},
                      {matchItem.property?.city_name || 'N/A'}
                    </Text>
                  </View>

                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={styles.sectionLabel}>Project</Text>
                    <Text style={styles.sectionValue}>
                      {matchItem.property?.project_name || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Floors</Text>
                  <Text style={styles.detailValue}>
                    {matchItem.property?.floor_no || 'N/A'}/
                    {matchItem.property?.total_floors || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Demand Price</Text>
                  <Text style={styles.detailValue}>
                    {formatPrice(matchItem.property?.demand_price)}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Configuration</Text>
                  <Text style={styles.detailValue}>
                    {matchItem.property?.property_configuration || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Facing</Text>
                  <Text style={styles.detailValue}>
                    {matchItem.property?.facing || 'N/A'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
