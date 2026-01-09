import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CustomCard = ({ leftImage, logoImage, title, subtitle, style } : 
  {leftImage: any, logoImage: any, title: String, subtitle: String, style: any}) => {
  return (
    <View style={[styles.card, style]}>
      {/* Left Image */}
      <Image source={leftImage} style={styles.leftImage} resizeMode="cover" />
      
      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {/* Logo Image */}
      <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Align items vertically in the center
    backgroundColor: '#fff', // White background
    borderRadius: 12, // Rounded corners
    padding: 12, // Internal padding,
    marginTop: 10, // Space between cards
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 3, // Android shadow
    marginHorizontal: 10, // Space on the sides
  },
  leftImage: {
    width: 50, // Fixed width for the left image
    height: 50, // Fixed height for the left image
    borderRadius: 25, // Circular image
    marginRight: 12, // Space between image and content
  },
  content: {
    flex: 1, // Take up remaining space between images
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoImage: {
    width: 40, // Fixed width for the logo
    height: 40, // Fixed height for the logo
    marginLeft: 12, // Space between content and logo
  },
});

export default CustomCard;