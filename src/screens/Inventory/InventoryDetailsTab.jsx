import {React, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import styles, {
  customStyles,
  imageViewerStyles,
  sliderStyles,
} from './styles.jsx';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useFileDownloader from '../../hooks/useFileDownloader';

const isTablet = DeviceInfo.isTablet();
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

const maskMobile = number => {
  if (!number || number.length < 4) return '-';
  const last4 = number.slice(-4);
  return '+91 XXXXXX' + last4;
};

const DetailsScreen = ({inventoryData}) => {
  const details = [
    {label: 'Owner Name', value: inventoryData.owner_info?.owner_name || '-'},
    {label: 'Owner Email', value: inventoryData.owner_info?.owner_email || '-'},
    {
      label: 'Owner Mobile',
      value: maskMobile(inventoryData.owner_info?.owner_mobile),
    },
    {
      label: 'Alternative No',
      value: maskMobile(inventoryData.owner_info?.alternative_no),
    },
    {
      label: 'Property For',
      value: inventoryData.basic_details?.property_for || '-',
    },
    {
      label: 'Property Type',
      value: inventoryData.basic_details?.property_type || '-',
    },
    {
      label: 'Property Subtype',
      value: inventoryData.basic_details?.property_subtype || '-',
    },
    {
      label: 'Property Source',
      value: inventoryData.basic_details?.property_source || '-',
    },
    {label: 'City', value: inventoryData.location?.city || '-'},
    {label: 'Locality', value: inventoryData.location?.locality || '-'},
    {label: 'Demand Price', value: inventoryData.pricing?.demand_price || '-'},
    {
      label: 'Price Negotiable',
      value: inventoryData.pricing?.price_negotiable ? 'Yes' : 'No',
    },
    {
      label: 'Construction Status',
      value: inventoryData.construction_details?.construction_status || '-',
    },
    {
      label: 'Property Age',
      value: inventoryData.construction_details?.property_age || '-',
    },
    {label: 'Floor No', value: inventoryData.floor_details?.floor_no || '-'},
    {
      label: 'Total Floors',
      value: inventoryData.floor_details?.total_floors || '-',
    },
    {
      label: 'Property Configuration',
      value: inventoryData.configuration?.property_configuration || '-',
    },
    {
      label: 'Furnished Type',
      value: inventoryData.configuration?.furnished_type || '-',
    },
    {label: 'Parking Type', value: inventoryData.parking?.parking_type || '-'},
    {
      label: 'No of Parking',
      value: inventoryData.parking?.no_of_parking || '-',
    },
    {
      label: 'Project Name',
      value: inventoryData.project_details?.project_name || '-',
    },
    {
      label: 'Builder Name',
      value: inventoryData.project_details?.builder_name || '-',
    },
    {
      label: 'Property Status',
      value: inventoryData.additional_info?.property_status || '-',
    },
    {label: 'Created At', value: inventoryData.dates?.created_at || '-'},
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.detailsContainer}>
        {details.map((item, index) => (
          <View key={index} style={styles.detailBox}>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// ---------------------- IMAGE VIEWER COMPONENT ------------------------
const ImageViewerModal = ({visible, images, initialIndex, onClose}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);

  // Fixed dimensions for modal images
  const modalImageHeight = screenHeight * 0.7;
  const modalImageWidth = screenWidth;

  const renderItem = ({item}) => {
    return (
      <View style={{width: modalImageWidth, height: modalImageHeight}}>
        <Image
          source={{uri: item}}
          style={imageViewerStyles.modalImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  const onViewRef = useRef(({viewableItems}) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={imageViewerStyles.modalContainer}>
        <View style={imageViewerStyles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={imageViewerStyles.closeButton}>
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={imageViewerStyles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        <FlatList
          ref={sliderRef}
          data={images}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewRef}
          viewabilityConfig={viewConfigRef}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          initialScrollIndex={initialIndex}
          getItemLayout={(data, index) => ({
            length: modalImageWidth,
            offset: modalImageWidth * index,
            index,
          })}
        />

        {/* Dots Indicator */}
        <View style={imageViewerStyles.dotsContainer}>
          {images.map((_, index) => {
            const inputRange = [
              (index - 1) * modalImageWidth,
              index * modalImageWidth,
              (index + 1) * modalImageWidth,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  imageViewerStyles.dot,
                  {
                    width: dotWidth,
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const DocumentScreen = ({inventoryData}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const {downloadFile} = useFileDownloader();

  // API Images List
  const apiImages =
    inventoryData?.images?.list?.map(img => img.image_path) || [];

  // API Documents List
  const apiDocs = inventoryData?.documents?.list || [];

  const sliderImageWidth = rw(90);
  const sliderImageHeight = isTablet ? rh(30) : rh(25);

  const openImageViewer = index => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const renderSliderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openImageViewer(index)}>
        <View style={sliderStyles.imageContainer}>
          <View style={sliderStyles.imageWrapper}>
            <Image
              source={{uri: item}}
              style={sliderStyles.sliderImage}
              resizeMode="cover"
            />
          </View>

          <View style={sliderStyles.imageCounter}>
            <Text style={sliderStyles.counterText}>
              {index + 1}/{apiImages.length}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Empty State Component
  const EmptyState = ({icon, text}) => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: rh(3),
        paddingHorizontal: rw(4),
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: rh(2),
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
      }}>
      <Icon name={icon} size={rf(3)} color="#999" />
      <Text
        style={{
          fontSize: rf(1.6),
          color: '#666',
          marginTop: rh(1),
        }}>
        {text}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{padding: rw(1), marginTop: 5}}
      showsVerticalScrollIndicator={false}>
      {/* Project Images */}
      <Text style={sliderStyles.sectionTitle}>Project Images</Text>

      {apiImages.length > 0 ? (
        <View style={{marginBottom: rh(3)}}>
          <FlatList
            data={apiImages}
            renderItem={renderSliderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            snapToInterval={sliderImageWidth + rw(2)}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false},
            )}
          />

          {/* Slider Dots */}
          <View style={sliderStyles.dotsContainer}>
            {apiImages.map((_, index) => {
              const inputRange = [
                (index - 1) * sliderImageWidth,
                index * sliderImageWidth,
                (index + 1) * sliderImageWidth,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 20, 8],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    sliderStyles.dot,
                    {
                      width: dotWidth,
                      opacity,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      ) : (
        <EmptyState icon="image" text="No images available" />
      )}

      {/* Documents */}
      <Text
        style={{
          fontSize: rf(1.9),
          fontWeight: '600',
          marginBottom: rh(1),
          color: '#000',
        }}>
        Documents
      </Text>

      {apiDocs.length > 0 ? (
        apiDocs.map(doc => (
          <TouchableOpacity
            key={doc.id}
            style={{
              paddingVertical: rh(1.8),
              paddingHorizontal: rw(4),
              borderRadius: 8,
              backgroundColor: '#f5f5f5',
              marginBottom: rh(1.5),
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => downloadFile(doc.document_path)}>
            <Icon
              name={
                doc.original_name.endsWith('.pdf')
                  ? 'picture-as-pdf'
                  : doc.original_name.endsWith('.jpg') ||
                    doc.original_name.endsWith('.png')
                  ? 'image'
                  : 'insert-drive-file'
              }
              size={rf(2.2)}
              color="#666"
              style={{marginRight: rw(2)}}
            />

            <Text style={{fontSize: rf(1.7), color: '#333', flex: 1}}>
              {doc.original_name}
            </Text>

            <Icon name="download" size={rf(2)} color="#666" />
          </TouchableOpacity>
        ))
      ) : (
        <EmptyState icon="insert-drive-file" text="No documents available" />
      )}

      {/* Image Viewer Modal */}
      <ImageViewerModal
        visible={modalVisible}
        images={apiImages}
        initialIndex={selectedImageIndex}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

// ---------------------- MAIN TAB ------------------------
const InventoryDetailsTab = ({inventoryData}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: 'Inventory Details',
      component: <DetailsScreen inventoryData={inventoryData} />,
    },
    {
      id: 1,
      name: 'Inventory Docs',
      component: <DocumentScreen inventoryData={inventoryData} />,
    },
  ];

  return (
    <View style={customStyles.container}>
      <View style={customStyles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              customStyles.tabItem,
              activeTab === index && customStyles.activeTabItem,
            ]}
            onPress={() => setActiveTab(index)}>
            <Text
              style={[
                customStyles.tabText,
                activeTab === index && customStyles.activeTabText,
              ]}>
              {tab.name}
            </Text>

            {activeTab === index && <View style={customStyles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={customStyles.tabContent}>{tabs[activeTab].component}</View>
    </View>
  );
};

export default InventoryDetailsTab;
