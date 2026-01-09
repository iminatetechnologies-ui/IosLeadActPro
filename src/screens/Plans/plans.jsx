import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import styles from './PlansStyles';
import {_get, _post} from '../../api/apiClient'; // your API client
import EncryptedStorage from 'react-native-encrypted-storage';


// ---- Plan Card Component ----
const PlanCard = ({
  title,
  price,
  duration,
  features,
  isSelected,
  onSelect,
  onSubmit,
  submitting,
}) => (
  <TouchableOpacity
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={onSelect}
    activeOpacity={0.8}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{title}</Text>
    </View>

    <Text style={styles.price}>₹{price}</Text>
    <Text style={styles.lifetime}>/{duration}</Text>
    <Text style={styles.trialText}>Free Trial Days : 0</Text>

    <View style={styles.featuresContainer}>
      {features.map((feature, index) => {
        const isDisabled = feature.includes('❌');
        return (
          <View key={index} style={styles.featureRow}>
            <View
              style={[
                styles.checkIcon,
                {backgroundColor: isDisabled ? '#ccc' : '#4CAF50'},
              ]}>
              <Text style={styles.checkText}>{isDisabled ? '-' : '+'}</Text>
            </View>
            <Text
              style={[
                styles.featureText,
                isDisabled && {
                  textDecorationLine: 'line-through',
                  color: '#999',
                },
              ]}>
              {feature.replace(' ✅', '').replace(' ❌', '')}
            </Text>
          </View>
        );
      })}
    </View>

    <View style={styles.radioContainer}>
      <View
        style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </View>

    {/* Continue button inside selected card */}
    {isSelected && (
      <TouchableOpacity
        style={styles.submitButton}
        onPress={onSubmit}
        disabled={submitting}>
        <Text style={styles.submitButtonText}>
          {submitting ? 'Submitting...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

// ---- Plans Screen ----
const Plans = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await _get('/plans'); // your endpoint
      //   console.log('Plans API Response:', response.data);

      // Transform features
      const transformedData = response.data.data.map((plan, index) => {
        const rawFeatures = [
          `${plan.max_employee || 0} Users`,
          plan.accounts ? 'Enable Accounts ✅' : 'Enable Accounts ❌',
          plan.crm ? 'Enable CRM ✅' : 'Enable CRM ❌',
          plan.hrm ? 'Enable HRM ✅' : 'Enable HRM ❌',
          plan.project ? 'Enable Project ✅' : 'Enable Project ❌',
          plan.inventory ? 'Enable Inventory ✅' : 'Enable Inventory ❌',
        ];

        const sortedFeatures = rawFeatures.sort((a, b) => {
          const aDisabled = a.includes('❌');
          const bDisabled = b.includes('❌');
          if (aDisabled === bDisabled) return 0;
          return aDisabled ? 1 : -1;
        });

        return {
          id: plan.id,
          title: plan.name,
          price: plan.price,
          duration: plan.duration,
          features: sortedFeatures,
        };
      });

      setPlansData(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch plans');
      setLoading(false);
      console.error('Error fetching plans:', err);
    }
  };

  // ---- Submit selected plan ----
  const handleSubmitPlan = async () => {
    if (!selectedPlan) return;

    try {
      setSubmitting(true);

      const planObj = plansData.find(plan => plan.id === selectedPlan);
      if (!planObj) {
        setSubmitting(false);
        alert('Selected plan not found.');
        return;
      }

      const payload = {
        plan_id: planObj.id,
        price: planObj.price,
        duration: planObj.duration,
      };

      console.log('Sending payload:', payload);

      const response = await _post('/buyplan', payload);
      // console.log('======', response);
      setSubmitting(false);

      if (response?.data?.success) {

        await EncryptedStorage.setItem('planPurchased', 'true'); 
        // Success path
        ToastAndroid.show('Plan purchased successfully', ToastAndroid.SHORT);
        // alert(response.data.message); // Optional: show "Plan purchased successfully"
        navigation.reset({
          index: 0,
          routes: [{name: 'Home2'}],
        });
      } else {
        // This will only run if success is false
        alert('Plan selection failed, please try again.');
      }
    } catch (err) {
      setSubmitting(false);

      // Axios specific error handling
      if (err.response) {
        // Server responded with a status code out of 2xx
        console.error('Plan submit error response:', err.response.data);
        console.error('Status:', err.response.status);
        console.error('Headers:', err.response.headers);
        alert(`Error: ${err.response.data.message || 'Something went wrong'}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('Plan submit error request:', err.request);
        alert('No response from server. Please try again.');
      } else {
        // Something else happened
        console.error('Plan submit error message:', err.message);
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color="#0389ca" />
        <Text style={{marginTop: 10, color: '#333'}}>Loading plans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center', padding: 20},
        ]}>
        <Text style={{color: 'red', fontSize: 16, textAlign: 'center'}}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchPlans}
          style={{
            marginTop: 20,
            backgroundColor: '#0389ca',
            padding: 10,
            borderRadius: 5,
          }}>
          <Text style={{color: '#fff'}}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Recommended plan for you</Text>

        {plansData.map((plan, index) => (
          <PlanCard
            key={index}
            title={plan.title}
            price={plan.price}
            duration={plan.duration}
            features={plan.features}
            isSelected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
            onSubmit={handleSubmitPlan}
            submitting={submitting}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Plans;
