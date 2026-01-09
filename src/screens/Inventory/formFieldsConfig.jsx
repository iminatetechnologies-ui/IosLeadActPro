import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import CustomDropDown from '../../components/CustomDropDown';
import CustomTextInput from '../../components/CustomInput';
import TextareaWithIcon from '../../components/TextArea';
import CustomButton from '../../components/CustomButton';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import {pickDocuments, pickImages} from '../../hooks/mediaPicker';
// ✅ YEH NAYA IMPORT ADD KAREN

// Dropdown Options
export const dropdownOptions = {
  propertyFor: [
    {label: 'Sale', value: 'Sale'},
    {label: 'Rent', value: 'Rent'},
  ],
  propertyType: [
    {label: 'Residential', value: 'residential'},
    {label: 'Commercial', value: 'commercial'},
    {label: 'Industrial', value: 'industrial'},
  ],
  propertySubtype: [
    {label: 'Office Space', value: 'Office Space'},
    {label: 'Retail Shop', value: 'Retail Shop'},
    {label: 'Showroom', value: 'Showroom'},
    {label: 'Commercial Land', value: 'Commercial Land'},
    {label: 'Werehouse', value: 'Werehouse'},
    {label: 'Industrial Building', value: 'Industrial Building'},
  ],
  propertySource: [
    {label: 'Owner', value: 'Owner'},
    {label: 'Agent', value: 'Agent'},
  ],
  propertyAge: [
    {label: 'New Construction', value: 'New Construction'},
    {label: '0-1 Years', value: '0-1'},
    {label: '1-5 Years', value: '1-5'},
    {label: '5-10 Years', value: '5-10'},
    {label: '10+ Years', value: '10+'},
  ],
  constructionStatus: [
    {label: 'Under Construction', value: 'Under Construction'},
    {label: 'Ready to Move', value: 'Ready to Move'},
  ],
  possession: [
    {label: 'Within 3 Months', value: '3 Months'},
    {label: 'Within 6 Months', value: '6 Months'},
    {label: 'Within 1 Year', value: '1 Year'},
    {label: 'Within 2 Year', value: '2 Year'},
  ],
  brokerage: [
    {label: '1 Month', value: '1 Month'},
    {label: '2 Months', value: '2 Months'},
    {label: '1%', value: '1%'},
    {label: '2%', value: '2%'},
  ],
  configuration: [
    {label: '1 BHK', value: '1 BHK'},
    {label: '2 BHK', value: '2 BHK'},
    {label: '3 BHK', value: '3 BHK'},
    {label: '4 BHK', value: '4 BHK'},
    {label: 'Studio', value: 'Studio'},
    {label: 'PentHouse', value: 'PentHouse'},
    {label: 'Villa', value: 'Villa'},
  ],
  totalFloors: [
    {label: '1 Floor', value: '1'},
    {label: '2 Floors', value: '2'},
    {label: '3 Floors', value: '3'},
    {label: '4 Floors', value: '4'},
    {label: '5 Floors', value: '5'},
    {label: '6 Floors', value: '6'},
    {label: '7 Floors', value: '7'},
    {label: '8 Floors', value: '8'},
    {label: '9 Floors', value: '9'},
    {label: '10 Floors', value: '10'},
    {label: '11 Floors', value: '11'},
    {label: '12 Floors', value: '12'},
    {label: '13 Floors', value: '13'},
    {label: '14 Floors', value: '14'},
    {label: '15 Floors', value: '15'},
    {label: '16 Floors', value: '16'},
    {label: '17 Floors', value: '17'},
    {label: '18 Floors', value: '18'},
    {label: '19 Floors', value: '19'},
    {label: '20 Floors', value: '20'},
    {label: '21 Floors', value: '21'},
    {label: '22 Floors', value: '22'},
    {label: '23 Floors', value: '23'},
    {label: '24 Floors', value: '24'},
    {label: '25 Floors', value: '25'},
    {label: '26 Floors', value: '26'},
    {label: '27 Floors', value: '27'},
    {label: '28 Floors', value: '28'},
    {label: '29 Floors', value: '29'},
    {label: '30 Floors', value: '30'},
    {label: '31 Floors', value: '31'},
    {label: '32 Floors', value: '32'},
    {label: '33 Floors', value: '33'},
    {label: '34 Floors', value: '34'},
    {label: '35 Floors', value: '35'},
    {label: '36 Floors', value: '36'},
    {label: '37 Floors', value: '37'},
    {label: '38 Floors', value: '38'},
    {label: '39 Floors', value: '39'},
    {label: '40 Floors', value: '40'},
    {label: '41 Floors', value: '41'},
    {label: '42 Floors', value: '42'},
    {label: '43 Floors', value: '43'},
    {label: '44 Floors', value: '44'},
    {label: '45 Floors', value: '45'},
    {label: '46 Floors', value: '46'},
    {label: '47 Floors', value: '47'},
    {label: '48 Floors', value: '48'},
    {label: '49 Floors', value: '49'},
    {label: '50 Floors', value: '50'},
  ],
  floorNumber: [
    {label: 'Ground Floor', value: 'Ground'},
    {label: '1st Floor', value: '1'},
    {label: '2nd Floor', value: '2'},
    {label: '3rd Floor', value: '3'},
    {label: '4th Floor', value: '4'},
    {label: '5th Floor', value: '5'},
    {label: '6th Floor', value: '6'},
    {label: '7th Floor', value: '7'},
    {label: '8th Floor', value: '8'},
    {label: '9th Floor', value: '9'},
    {label: '10th Floor', value: '10'},
    {label: '11th Floor', value: '11'},
    {label: '12th Floor', value: '12'},
    {label: '13th Floor', value: '13'},
    {label: '14th Floor', value: '14'},
    {label: '15th Floor', value: '15'},
    {label: '16th Floor', value: '16'},
    {label: '17th Floor', value: '17'},
    {label: '18th Floor', value: '18'},
    {label: '19th Floor', value: '19'},
    {label: '20th Floor', value: '20'},
    {label: '21st Floor', value: '21'},
    {label: '22nd Floor', value: '22'},
    {label: '23rd Floor', value: '23'},
    {label: '24th Floor', value: '24'},
    {label: '25th Floor', value: '25'},
    {label: '26th Floor', value: '26'},
    {label: '27th Floor', value: '27'},
    {label: '28th Floor', value: '28'},
    {label: '29th Floor', value: '29'},
    {label: '30th Floor', value: '30'},
    {label: '31st Floor', value: '31'},
    {label: '32nd Floor', value: '32'},
    {label: '33rd Floor', value: '33'},
    {label: '34th Floor', value: '34'},
    {label: '35th Floor', value: '35'},
    {label: '36th Floor', value: '36'},
    {label: '37th Floor', value: '37'},
    {label: '38th Floor', value: '38'},
    {label: '39th Floor', value: '39'},
    {label: '40th Floor', value: '40'},
    {label: '41st Floor', value: '41'},
    {label: '42nd Floor', value: '42'},
    {label: '43rd Floor', value: '43'},
    {label: '44th Floor', value: '44'},
    {label: '45th Floor', value: '45'},
    {label: '46th Floor', value: '46'},
    {label: '47th Floor', value: '47'},
    {label: '48th Floor', value: '48'},
    {label: '49th Floor', value: '49'},
    {label: '50th Floor', value: '50'},
    {label: 'Top Floor', value: 'Top'},
  ],
  furnishedType: [
    {label: 'Fully Furnished', value: 'Fully Furnished'},
    {label: 'Semi Furnished', value: 'Semi Furnished'},
    {label: 'Unfurnished', value: 'Unfurnished'},
  ],
  facingDirection: [
    {label: 'North', value: 'North'},
    {label: 'South', value: 'South'},
    {label: 'East', value: 'East'},
    {label: 'West', value: 'West'},
    {label: 'North-East', value: 'North-East'},
    {label: 'North-West', value: 'North-West'},
    {label: 'South-East', value: 'South-East'},
    {label: 'South-West', value: 'South-West'},
  ],
  parkingType: [
    {label: 'Open Parking', value: 'Open'},
    {label: 'Covered Parking', value: 'Covered'},
  ],
  noOfParking: [
    {label: '1 Space', value: '1'},
    {label: '2 Spaces', value: '2'},
    {label: '3 Spaces', value: '3'},
    {label: '4+ Spaces', value: '4+'},
    {label: '5 Space', value: '5'},
    {label: '6 Spaces', value: '6'},
    {label: '7 Spaces', value: '7'},
    {label: '8 Spaces', value: '8'},
  ],
  tenantPreference: [
    {label: 'Family Only', value: 'Family'},
    {label: 'Bachelors Only', value: 'Bachelors'},
    {label: 'Both Family and Bachelors', value: 'Both Family and Bachelors'},
  ],
  pricenegotiable: [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'},
  ],
  featuresList: [
    {label: 'Lift', value: 'Lift'},
    {label: 'Power Backup', value: 'Power Backup'},
    {label: 'Swimming Pool', value: 'Swimming Pool'},
    {label: 'Gym', value: 'Gym'},
    {label: 'Park Facing', value: 'Park Facing'},
    {label: 'Corner Unit', value: 'Corner Unit'},
    {label: 'Servant Quarter', value: 'Servant Quarter'},
    {label: 'Store Room', value: 'Store Room'},
  ],
  amenitiesList: [
    {label: '24/7 Water Supply', value: '24/7 Water Supply'},
    {label: '24/7 Security', value: '24/7 Security'},
    {label: 'CCTV', value: 'CCTV'},
    {label: 'Intercom', value: 'Intercom'},
    {label: 'Fire Safety', value: 'Fire Safety'},
    {label: 'Rain Water Harvesting', value: 'Rain Water Harvesting'},
    {label: 'Club House', value: 'Club House'},
    {label: 'Children Play Area', value: 'Children Play Area'},
    {label: 'Landscaped Garden', value: 'Landscaped Garden'},
    {label: 'Shopping Center', value: 'Shopping Center'},
    {label: 'School Nearby', value: 'School Nearby'},
    {label: 'Hospital Nearby', value: 'Hospital Nearby'},
    {label: 'Public Transport', value: 'Public Transport'},
  ],
};

// Step Configuration
export const stepsMeta = [
  {
    key: 'step1',
    title: 'Owner Info',
    fields: ['ownername', 'owneremail', 'mobile', 'alternative', 'reference'],
  },
  {
    key: 'step2',
    title: 'Property Details',
    fields: [
      'propertyfor',
      'propertytype',
      'propertysubtype',
      'propertysource',
      'propertyage',
      'pricenegotiable',
      'superarea',
      'plotarea',
      'carpetarea',
      'constructionstatus',
      'possession',
      'brokerage',
      'configuration',
      'totalfloors',
      'floornumber',
      'expectedprice',
      'furnishedtype',
      'facingdirection',
      'parkingtype',
      'noofparking',
      'tenantpreference',
      'features',
      'amenities',
    ],
  },
  {
    key: 'step3',
    title: 'Location',
    fields: [
      'state',
      'city',
      'locality',
      'projectname',
      'buildername',
      'towername',
      'unitnumber',
      'blocknumber',
      'projectaddress',
      'propertyaddressmap',
    ],
  },
  {
    key: 'step4',
    title: 'Additional Info',
    fields: ['remarks', 'propertyimages', 'propertydocuments'],
  },
];

// Initial Form State
export const initialFormState = {
  // Owner Info
  ownername: '',
  owneremail: '',
  mobile: '',
  alternative: '',
  reference: '',

  // Property Details
  propertyfor: null,
  propertytype: null,
  propertysubtype: null,
  propertysource: null,
  propertyage: null,
  pricenegotiable: null,
  superarea: '',
  plotarea: '',
  carpetarea: '',
  constructionstatus: null,
  possession: null,
  brokerage: null,
  configuration: null,
  totalfloors: null,
  floornumber: null,
  expectedprice: '',
  furnishedtype: null,
  facingdirection: null,
  parkingtype: null,
  noofparking: null,
  tenantpreference: null,
  features: [],
  amenities: [],

  // Location
  state: null,
  city: null,
  locality: null,
  projectname: null,
  buildername: '',
  towername: '',
  unitnumber: '',
  blocknumber: '',
  projectaddress: '',
  propertyaddressmap: '',

  // Additional Info
  remarks: '',
  propertyimages: [],
  propertydocuments: [],
};

// Field Renderer Component
export const renderField = (
  key,
  form,
  updateField,
  errors,
  states = [],
  cities = [],
  localities = [],
  projects,
) => {
  const styles = fieldStyles;
  switch (key) {
    // ============== OWNER INFO ==============
    case 'ownername':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Owner Name</Text>
          <CustomTextInput
            placeholder="Enter owner name"
            value={form.ownername}
            onChangeText={val => updateField('ownername', val)}
            iconName="person"
            error={!!errors.ownername}
            errorMessage={errors.ownername}
          />
        </View>
      );

    case 'owneremail':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Owner Email</Text>
          <CustomTextInput
            placeholder="Enter owner email"
            value={form.owneremail}
            onChangeText={val => updateField('owneremail', val)}
            iconName="email"
            keyboardType="email-address"
            error={errors.owneremail}
          />
        </View>
      );

    case 'mobile':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Mobile Number</Text>
          <CustomTextInput
            placeholder="Enter mobile number"
            value={form.mobile}
            onChangeText={val => updateField('mobile', val)}
            keyboardType="numeric"
            iconName="phone"
            maxLength={10}
            error={!!errors.mobile}
            errorMessage={errors.mobile}
          />
        </View>
      );

    case 'alternative':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Alternative Number</Text>
          <CustomTextInput
            placeholder="Enter alternative number"
            value={form.alternative}
            onChangeText={val => updateField('alternative', val)}
            keyboardType="numeric"
            iconName="phone"
            maxLength={13}
            error={errors.alternative}
          />
        </View>
      );

    case 'reference':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Reference</Text>
          <CustomTextInput
            placeholder="Enter reference"
            value={form.reference}
            onChangeText={val => updateField('reference', val)}
            iconName="badge"
            error={errors.reference}
          />
        </View>
      );

    // ============== PROPERTY DETAILS ==============
    case 'propertyfor':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property For</Text>
          <CustomDropDown
            data={dropdownOptions.propertyFor}
            value={form.propertyfor}
            onSelect={item => updateField('propertyfor', item)}
            placeholder="Choose property for"
            error={!!errors.propertyfor}
            errorMessage={errors.propertyfor}
          />
        </View>
      );

    case 'propertytype':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property Type *</Text>
          <CustomDropDown
            data={dropdownOptions.propertyType}
            value={form.propertytype}
            onSelect={item => updateField('propertytype', item)}
            placeholder="Select Property Type"
            error={!!errors.propertytype}
            errorMessage={errors.propertytype}
          />
        </View>
      );

    case 'propertysubtype':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property Subtype *</Text>
          <CustomDropDown
            data={dropdownOptions.propertySubtype}
            value={form.propertysubtype}
            onSelect={item => updateField('propertysubtype', item)}
            placeholder="Select Property Subtype"
            error={!!errors.propertysubtype}
            errorMessage={errors.propertysubtype}
          />
        </View>
      );

    case 'propertysource':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property Source</Text>
          <CustomDropDown
            data={dropdownOptions.propertySource}
            value={form.propertysource}
            onSelect={item => updateField('propertysource', item)}
            placeholder="Select Property Source"
            error={!!errors.propertysource}
            errorMessage={errors.propertysource}
          />
        </View>
      );

    case 'propertyage':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property Age</Text>
          <CustomDropDown
            data={dropdownOptions.propertyAge}
            value={form.propertyage}
            onSelect={item => updateField('propertyage', item)}
            placeholder="Select Age"
            error={!!errors.propertyage}
            errorMessage={errors.propertyage}
          />
        </View>
      );

    case 'superarea':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Super Area</Text>
          <CustomTextInput
            placeholder="Enter Area value"
            value={form.superarea}
            onChangeText={val => updateField('superarea', val)}
            keyboardType="numeric"
            error={errors.superarea}
          />
        </View>
      );

    case 'plotarea':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Plot Area (Sq.Ft)</Text>
          <CustomTextInput
            placeholder="Enter plot area"
            value={form.plotarea}
            onChangeText={val => updateField('plotarea', val)}
            keyboardType="numeric"
            error={errors.plotarea}
          />
        </View>
      );

    case 'carpetarea':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Carpet Area (Sq.Ft)</Text>
          <CustomTextInput
            placeholder="Enter carpet area"
            value={form.carpetarea}
            onChangeText={val => updateField('carpetarea', val)}
            keyboardType="numeric"
            error={errors.carpetarea}
          />
        </View>
      );

    case 'constructionstatus':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Construction Status</Text>
          <CustomDropDown
            data={dropdownOptions.constructionStatus}
            value={form.constructionstatus}
            onSelect={item => updateField('constructionstatus', item)}
            placeholder="select Construction"
            error={!!errors.constructionstatus}
            errorMessage={errors.constructionstatus}
          />
        </View>
      );

    case 'possession':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Possession</Text>
          <CustomDropDown
            data={dropdownOptions.possession}
            value={form.possession}
            onSelect={item => updateField('possession', item)}
            placeholder="Select Possession"
            error={!!errors.possession}
            errorMessage={errors.possession}
          />
        </View>
      );

    case 'brokerage':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Brokerage</Text>
          <CustomDropDown
            data={dropdownOptions.brokerage}
            value={form.brokerage}
            onSelect={item => updateField('brokerage', item)}
            placeholder="Select Brokerage"
            error={!!errors.brokerage}
            errorMessage={errors.brokerage}
          />
        </View>
      );

    case 'configuration':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Configuration</Text>
          <CustomDropDown
            data={dropdownOptions.configuration}
            value={form.configuration}
            onSelect={item => updateField('configuration', item)}
            placeholder="Select Configuration"
            error={!!errors.configuration}
            errorMessage={errors.configuration}
          />
        </View>
      );

    case 'totalfloors':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Total Floors</Text>
          <CustomDropDown
            data={dropdownOptions.totalFloors}
            value={form.totalfloors}
            onSelect={item => updateField('totalfloors', item)}
            placeholder="select Floor"
            error={!!errors.totalfloors}
            errorMessage={errors.totalfloors}
          />
        </View>
      );

    case 'floornumber':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Floor Number</Text>
          <CustomDropDown
            data={dropdownOptions.floorNumber}
            value={form.floornumber}
            onSelect={item => updateField('floornumber', item)}
            placeholder="select Floor Number"
            error={!!errors.floornumber}
            errorMessage={errors.floornumber}
          />
        </View>
      );

    case 'expectedprice':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Expected Price (₹)</Text>
          <CustomTextInput
            placeholder="Enter expected price"
            value={form.expectedprice}
            onChangeText={val => updateField('expectedprice', val)}
            keyboardType="numeric"
            iconName="money"
            error={errors.expectedprice}
          />
        </View>
      );

    case 'furnishedtype':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Furnished Type</Text>
          <CustomDropDown
            data={dropdownOptions.furnishedType}
            value={form.furnishedtype}
            onSelect={item => updateField('furnishedtype', item)}
            placeholder="select Furnished Type"
            error={!!errors.furnishedtype}
            errorMessage={errors.furnishedtype}
          />
        </View>
      );

    case 'facingdirection':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Facing Direction</Text>
          <CustomDropDown
            data={dropdownOptions.facingDirection}
            value={form.facingdirection}
            onSelect={item => updateField('facingdirection', item)}
            placeholder="Select Direction"
            error={!!errors.facingdirection}
            errorMessage={errors.facingdirection}
          />
        </View>
      );

    case 'parkingtype':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Parking Type</Text>
          <CustomDropDown
            data={dropdownOptions.parkingType}
            value={form.parkingtype}
            onSelect={item => updateField('parkingtype', item)}
            placeholder="select Parking Type"
            error={!!errors.parkingtype}
            errorMessage={errors.parkingtype}
          />
        </View>
      );

    case 'noofparking':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>No. of Parking</Text>
          <CustomDropDown
            data={dropdownOptions.noOfParking}
            value={form.noOfParking}
            onSelect={item => updateField('noofparking', item)}
            placeholder="select parking Space"
            error={!!errors.noofparking}
            errorMessage={errors.noofparking}
          />
        </View>
      );

    case 'tenantpreference':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Tenant Preference</Text>
          <CustomDropDown
            data={dropdownOptions.tenantPreference}
            value={form.tenantpreference}
            onSelect={item => updateField('tenantpreference', item)}
            placeholder="select Preference Type"
            error={!!errors.tenantpreference}
            errorMessage={errors.tenantpreference}
          />
        </View>
      );

    case 'features':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Features</Text>

          <MultiSelectDropdown
            data={dropdownOptions.featuresList}
            selectedValues={form.features}
            onSelect={values => updateField('features', values)}
            placeholder="Select Features"
          />
        </View>
      );

    case 'amenities':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Amenities</Text>

          <MultiSelectDropdown
            data={dropdownOptions.amenitiesList}
            selectedValues={form.amenities}
            onSelect={values => updateField('amenities', values)}
            placeholder="Select Amenities"
          />
        </View>
      );

    case 'pricenegotiable':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Price Negotiable</Text>

          <CustomDropDown
            data={dropdownOptions.pricenegotiable}
            value={form.pricenegotiable}
            onSelect={item => updateField('pricenegotiable', item)}
            placeholder="Select Option"
          />
        </View>
      );

    case 'state':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>State *</Text>
          <CustomDropDown
            data={states} // Initially empty, aap async load kar sakte hain
            value={form.state}
            onSelect={async item => {
              updateField('state', item);
              // State select karne par city aur locality reset karen
              updateField('city', null);
              updateField('locality', null);
              // Cities load karen (agar aap real-time data chahte hain)
              // const cities = await getCitiesByState(item.value);
            }}
            placeholder="Select State"
            error={!!errors.state}
            errorMessage={errors.state}
          />
        </View>
      );

    case 'city':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>City *</Text>
          <CustomDropDown
            data={cities} // State ke based par load hoga
            value={form.city}
            onSelect={async item => {
              updateField('city', item);
              // City select karne par locality reset karen
              updateField('locality', null);
              // Localities load karen (agar aap real-time data chahte hain)
              // const localities = await getLocalitiesByCity(item.value);
            }}
            placeholder="Select City"
            disabled={!form.state} // Jab tak state na select ho, disabled rahe
            error={!!errors.city}
            errorMessage={errors.city}
          />
        </View>
      );

    case 'locality':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Locality *</Text>
          <CustomDropDown
            data={localities} // City ke based par load hoga
            value={form.locality}
            onSelect={item => updateField('locality', item)}
            placeholder="Select Locality"
            disabled={!form.city} // Jab tak city na select ho, disabled rahe
            error={!!errors.locality}
            errorMessage={errors.locality}
          />
        </View>
      );

    case 'projectname':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Project Name</Text>
          <CustomDropDown
            data={projects} // 👈 API se load hua data
            value={form.projectname}
            onSelect={item => updateField('projectname', item)}
            placeholder="Select Project"
            error={!!errors.projectname}
            errorMessage={errors.projectname}
          />
        </View>
      );

    case 'buildername':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Builder Name</Text>
          <CustomTextInput
            placeholder="Enter builder name"
            value={form.buildername}
            onChangeText={val => updateField('buildername', val)}
            error={errors.buildername}
          />
        </View>
      );

    case 'towername':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Tower Name</Text>
          <CustomTextInput
            placeholder="Enter tower name"
            value={form.towername}
            onChangeText={val => updateField('towername', val)}
            error={errors.towername}
          />
        </View>
      );

    case 'unitnumber':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Unit Number</Text>
          <CustomTextInput
            placeholder="Enter unit number"
            value={form.unitnumber}
            onChangeText={val => updateField('unitnumber', val)}
            error={errors.unitnumber}
          />
        </View>
      );

    case 'blocknumber':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Block Number</Text>
          <CustomTextInput
            placeholder="Enter block number"
            value={form.blocknumber}
            onChangeText={val => updateField('blocknumber', val)}
            error={errors.blocknumber}
          />
        </View>
      );

    case 'projectaddress':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Project Address</Text>
          <TextareaWithIcon
            value={form.projectaddress}
            onChangeText={val => updateField('projectaddress', val)}
            placeholder="Enter complete project address"
            error={errors.projectaddress}
          />
        </View>
      );

    case 'propertyaddressmap':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property Address (Map)</Text>
          <CustomTextInput
            placeholder="Start typing address..."
            value={form.propertyaddressmap}
            onChangeText={val => updateField('propertyaddressmap', val)}
            iconName="map"
            error={errors.propertyaddressmap}
          />
        </View>
      );

    // ============== ADDITIONAL INFO ==============
    case 'remarks':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Remarks</Text>
          <TextareaWithIcon
            value={form.remarks}
            onChangeText={val => updateField('remarks', val)}
            placeholder="Enter any additional remarks or notes"
            error={errors.remarks}
          />
        </View>
      );

    case 'propertyimages':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property Images</Text>

          <CustomButton
            title="+ Choose Files"
            onPress={async () => {
              const files = await pickImages(); // MULTI IMAGES
              if (files.length > 0) {
                updateField('propertyimages', [
                  ...form.propertyimages,
                  ...files, // ADD MULTIPLE
                ]);
              }
            }}
            style={styles.uploadButton}
          />

          {/* SHOW SELECTED IMAGES WITH REMOVE BUTTON */}
          {form.propertyimages.length > 0 && (
            <View style={styles.previewRow}>
              {form.propertyimages.map((img, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{uri: img.uri}} style={styles.previewImage} />

                  <CustomButton
                    title="✕"
                    onPress={() =>
                      updateField(
                        'propertyimages',
                        form.propertyimages.filter((_, i) => i !== index),
                      )
                    }
                    style={styles.removeButton}
                    textStyle={styles.removeButtonText}
                  />
                </View>
              ))}
            </View>
          )}

          <Text style={styles.helperText}>
            Supported: JPG, PNG, WEBP, GIF — Multi Select Allowed
          </Text>
        </View>
      );

    case 'propertydocuments':
      return (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>Property Documents</Text>

          <CustomButton
            title="+ Choose Documents"
            onPress={async () => {
              const files = await pickDocuments(); // MULTI DOCS
              if (files.length > 0) {
                updateField('propertydocuments', [
                  ...form.propertydocuments,
                  ...files, // ADD MULTIPLE
                ]);
              }
            }}
            style={styles.uploadButton}
          />

          {/* SHOW SELECTED DOC LIST WITH REMOVE BUTTON */}
          {form.propertydocuments.length > 0 &&
            form.propertydocuments.map((doc, index) => (
              <View key={index} style={styles.docContainer}>
                <Text style={styles.docItem}>📄 {doc.name}</Text>

                <CustomButton
                  title="✕"
                  onPress={() =>
                    updateField(
                      'propertydocuments',
                      form.propertydocuments.filter((_, i) => i !== index),
                    )
                  }
                  style={styles.removeButton}
                  textStyle={styles.removeButtonText}
                />
              </View>
            ))}

          <Text style={styles.helperText}>
            Supported: PDF, DOC, DOCX, JPG, PNG — Multi Select Allowed
          </Text>
        </View>
      );

    default:
      return null;
  }
};

const fieldStyles = StyleSheet.create({
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 0,
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4444',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  docContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  docItem: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
