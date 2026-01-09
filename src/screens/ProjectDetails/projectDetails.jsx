import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LeadSelectionModal from '../../components/ModealProductDetails';
import DeviceInfo from 'react-native-device-info';
const isTablet = DeviceInfo.isTablet();

import {_get, _post} from '../../api/apiClient';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectDetails = ({route}) => {
  const [projectData, setProjectData] = useState(null);
  const [floorPlans, setFloorPlans] = useState([]);
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // ❌ yeh mat karo: const { id } = route.params;
  // ✅ safe:
  const idFromParams = route?.params?.id;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // console.log('🟡 useEffect fired. route.params =', route?.params);

    const fetchProjectDetails = async projectId => {
      console.log('➡️ fetchProjectDetails() called with:', projectId);
      try {
        setLoading(true);
        // console.log('🌐 GET =>', `project-details/${projectId}`);
        const response = await _get(`project-details/${projectId}`);
        // console.log('✅ API response received');

        if (response?.data) {
          const project = response.data;
          setProjectData(project);
          // console.log('📦 setProjectData done');

          const plans = project?.data?.floor_plans;
          setFloorPlans(Array.isArray(plans) ? plans : []);
          // console.log('🗂️ floorPlans length:', Array.isArray(plans) ? plans.length : 0);

          const whatsappUrl = project?.data?.whatsapp_share_link;
          if (whatsappUrl) {
            setWhatsappLink(whatsappUrl);
            // console.log('🔗 WhatsApp link set');
          }
        } else {
          // console.log('⚠️ response.data missing');
        }
      } catch (error) {
        // console.log('❌ Error fetching project details:', error?.message || error);
        Alert.alert('Error', 'Failed to load project details.');
      } finally {
        setLoading(false);
        // console.log('🔚 fetchProjectDetails finished');
      }
    };

    const fetchUserProfile = async () => {
      // console.log('➡️ fetchUserProfile() called');
      try {
        const response = await _get(`/user-profile`);
        const data = response?.data;
        const name = data?.data?.name ? data.data.name : 'User';
        setUserName(name);
        // console.log('👤 User name set:', name);
      } catch (error) {
        // console.log('❌ Error fetching user name:', error?.message || error);
        setUserName('User');
      }
    };

    const init = async () => {
      try {
        // console.log('🚀 init() start');
        let projectId = idFromParams;

        if (projectId) {
          // console.log('🧭 ID from params:', projectId);
          try {
            await AsyncStorage.setItem('lastProjectId', String(projectId));
            // console.log('💾 Saved to AsyncStorage lastProjectId =', projectId);
          } catch (e) {
            // console.log('❌ AsyncStorage setItem error:', e?.message || e);
          }
        } else {
          // console.log('🔍 No ID in params. Trying AsyncStorage…');
          try {
            const storedId = await AsyncStorage.getItem('lastProjectId');
            projectId = storedId || null;
            // console.log('📥 Got from AsyncStorage lastProjectId =', storedId);
          } catch (e) {
            // console.log('❌ AsyncStorage getItem error:', e?.message || e);
          }
        }

        if (!projectId) {
          // console.log('⛔ projectId still missing. Showing alert.');
          setLoading(false);
          Alert.alert('Error', 'Project ID not found.');
          return;
        }

        // Safety: persist again (in case it came from storage)
        try {
          await AsyncStorage.setItem('lastProjectId', String(projectId));
          // console.log('✅ Confirmed persist lastProjectId =', projectId);
        } catch (e) {
          // console.log('❌ AsyncStorage persist confirm error:', e?.message || e);
        }

        await Promise.all([fetchProjectDetails(projectId), fetchUserProfile()]);

        // console.log('🎉 init() finished successfully');
      } catch (e) {
        // console.log('❌ init() fatal error:', e?.message || e);
        setLoading(false);
        Alert.alert('Error', 'Something went wrong.');
      }
    };

    init();
  }, [idFromParams]);

  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const response = await _post('/getallleads');
      const leadsData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      Alert.alert('Error', 'Failed to load leads. Please try again.');
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  const handleWhatsAppShare = () => {
    if (whatsappLink) {
      try {
        const parts = whatsappLink.split('?text=');
        let message = parts?.[1]
          ? decodeURIComponent(parts[1])
              .replace(/\+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
          : '';

        const finalMessage = `${message}\n\nShared by ${userName || 'User'}`;
        const finalLink = `${parts[0]}?text=${encodeURIComponent(
          finalMessage,
        )}`;

        Linking.openURL(finalLink).catch(error => {
          console.error('Failed to open WhatsApp:', error);
          Alert.alert(
            'Error',
            'Unable to open WhatsApp. Please check if the app is installed.',
          );
        });
      } catch (error) {
        console.error('WhatsApp link error:', error);
        Alert.alert('Error', 'Something went wrong while sharing.');
      }
    } else {
      Alert.alert(
        'Info',
        'WhatsApp sharing is not available for this project.',
      );
    }
  };

  const handleSendToLead = () => {
    setVisible(true);
    fetchLeads();
  };

  const handleLeadSelection = lead => {
    setSelectedLead(lead);
  };

  const handleSendWhatsApp = () => {
    if (!selectedLead) {
      Alert.alert('Error', 'Please select a lead first.');
      return;
    }

    const phoneNumber =
      selectedLead.phone || selectedLead.mobile || selectedLead.contact;
    if (!phoneNumber) {
      Alert.alert('Error', 'No phone number available for this lead.');
      return;
    }

    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const parts = whatsappLink?.split('?text=');
    let message = parts?.[1]
      ? decodeURIComponent(parts[1])
          .replace(/\+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      : 'Check out this project!';
    const finalMessage = `${message}\n\nShared by ${userName || 'User'}`;

    const finalLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      finalMessage,
    )}`;

    Linking.openURL(finalLink).catch(error => {
      console.error('Failed to open WhatsApp:', error);
      Alert.alert(
        'Error',
        'Unable to open WhatsApp. Please check if the app is installed.',
      );
    });
  };

  const closeModal = () => {
    setVisible(false);
    setSelectedLead(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#02519F" />
        <Text style={styles.loadingText}>Loading project details...</Text>
      </View>
    );
  }

  if (!projectData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load project details</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setLoading(true)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const projectInfo = projectData.data;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={styles.slider}>
            {projectInfo?.banner?.image_url ? (
              <Image
                source={{
                  uri: `https://leadactpro.in/storage/app/public/${projectInfo.banner.image_url}`,
                }}
                style={styles.bannerImage}
                resizeMode="conver"
              />
            ) : (
              <View style={styles.noBannerContainer}>
                <FontAwesome name="image" size={rf(4)} color="#ccc" />
                <Text style={styles.noBannerText}>No banner available</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {projectInfo?.title || 'Project Title'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <FontAwesome
                name="map-marker"
                size={isTablet ? rf(1.5) : rf(2)}
                color="#02519F"
              />{' '}
              Address
            </Text>
            <Text style={styles.description}>
              {projectInfo?.address || 'Address not available'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <FontAwesome name="info-circle" size={rf(2)} color="#02519F" />{' '}
              Description
            </Text>
            <Text style={styles.description}>
              {projectInfo?.description || 'No description available'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <FontAwesome name="home" size={rf(2)} color="#02519F" /> Floor
              Plans
            </Text>
            {floorPlans.length > 0 ? (
              <View style={styles.floorPlansGrid}>
                {floorPlans.map(plan => (
                  <View key={plan.id} style={styles.floorPlanCard}>
                    <TouchableOpacity style={styles.floorImageContainer}>
                      <Image
                        source={{
                          uri: `https://leadactpro.in/storage/app/public/${plan.image_url}`,
                        }}
                        style={styles.floorPlanImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <View style={styles.floorPlanInfo}>
                      <Text style={styles.floorPlanType}>{plan.type}</Text>
                      <Text style={styles.floorPlanDetail}>
                        Area: {plan.size} sq ft
                      </Text>
                      <Text style={styles.floorPlanDetail}>
                        Price: {plan.price}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <FontAwesome name="home" size={rf(3)} color="#ccc" />
                <Text style={styles.noDataText}>No floor plans available</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.sendToLeadButton}
              onPress={handleSendToLead}>
              <FontAwesome
                name="paper-plane"
                size={rf(2)}
                color="#fff"
                style={{marginRight: rw(2)}}
              />
              <Text style={styles.buttonText}>Send to Lead</Text>
            </TouchableOpacity>
          </View>

          <LeadSelectionModal
            visible={visible}
            leads={leads}
            selectedLead={selectedLead}
            loadingLeads={loadingLeads}
            onSelectLead={handleLeadSelection}
            onClose={closeModal}
            onSendWhatsApp={handleSendWhatsApp}
          />
        </View>
      </ScrollView>

      {whatsappLink && (
        <View style={styles.shareButtonContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleWhatsAppShare}
            activeOpacity={0.8}>
            <FontAwesome
              name="whatsapp"
              size={isTablet ? rf(2.5) : rf(3)}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: rh(2),
    fontSize: rf(1.8),
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: rw(8),
  },
  errorText: {
    fontSize: rf(2),
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: rh(2),
  },
  retryButton: {
    backgroundColor: '#02519F',
    paddingHorizontal: rw(6),
    paddingVertical: rh(1.5),
    borderRadius: rw(2),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: rf(1.8),
    fontWeight: '600',
  },

  // Main Content
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: rh(12),
  },
  contentContainer: {
    paddingHorizontal: rw(4),
  },

  // Banner Section
  bannerContainer: {
    marginBottom: rh(2),
  },
  slider: {
    height: rh(30),
  },
  bannerImage: {
    width: rw(100),
    height: rh(30),
  },
  noBannerContainer: {
    width: rw(100),
    height: rh(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noBannerText: {
    marginTop: rh(1),
    fontSize: rf(1.6),
    color: '#999',
  },

  // Title Section
  titleContainer: {
    marginBottom: rh(2),
  },
  title: {
    fontSize: isTablet ? rf(1.5) : rf(2.4),
    fontWeight: 'bold',
    color: '#02519F',
    lineHeight: rh(3),
  },

  // Content Sections
  section: {
    marginBottom: isTablet ? rf(2.5) : rh(2),
  },
  sectionTitle: {
    fontSize: isTablet ? rf(1.5) : rf(2),
    fontWeight: '600',
    color: '#02519F',
    marginBottom: rh(1.5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: isTablet ? rf(1.4) : rf(1.7),
    color: '#444',
    lineHeight: isTablet ? rh(4) : rh(2.5),
    textAlign: 'justify',
  },

  // Floor Plans
  floorPlansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  floorPlanCard: {
    width: isTablet ? rw(29) : rw(42),
    marginBottom: rh(3),
    backgroundColor: '#fff',
    borderRadius: isTablet ? rw(1) : rw(2),
    //  elevation: 5,
    // shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  floorImageContainer: {
    borderTopLeftRadius: isTablet ? rw(1) : rw(2),
    borderTopRightRadius: isTablet ? rw(1) : rw(2),
    overflow: 'hidden',
  },
  floorPlanImage: {
    width: '100%',
    height: isTablet ? rh(16) : rh(12),
  },
  floorPlanInfo: {
    padding: rw(3),
  },
  floorPlanType: {
    fontSize: isTablet ? rf(1.4) : rf(1.8),
    fontWeight: '600',
    color: '#02519F',
    marginBottom: rh(0.5),
  },
  floorPlanDetail: {
    fontSize: isTablet ? rf(1.3) : rf(1.5),
    color: '#666',
    marginBottom: rh(0.3),
  },

  // No Data State
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: rh(4),
  },
  noDataText: {
    marginTop: rh(1),
    fontSize: rf(1.6),
    color: '#999',
  },

  // Send to Lead Button
  buttonContainer: {
    marginVertical: rh(2),
  },
  sendToLeadButton: {
    backgroundColor: '#0389ca',
    paddingVertical: rh(1.5),
    paddingHorizontal: rw(6),
    borderRadius: isTablet ? rh(1.4) : rh(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: isTablet ? rf(1.5) : rf(1.8),
    fontWeight: '600',
  },

  // Share Button
  shareButtonContainer: {
    position: 'absolute',
    bottom: rh(4),
    right: rw(4),
    zIndex: 10,
  },
  shareButton: {
    width: isTablet ? rw(8) : rw(14),
    height: isTablet ? rw(8) : rw(14),
    backgroundColor: '#25D366',
    borderRadius: rw(7),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});

export default ProjectDetails;
