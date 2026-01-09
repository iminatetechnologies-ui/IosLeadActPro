import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

const ActivityCard = ({ title1, title2, title3, createdAt }) => {
  return (
    <Card style={styles.cardContainer}>
 
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleColor1]}>Lead Status:<Text style={{color:'#000',fontSize:12}}> {title1}</Text></Text>
          <Text style={[styles.title, styles.titleColor1]}>Lead Sub Status: <Text style={{color:'#000',fontSize:14}}>{title2}</Text></Text>
          <Text style={[styles.title, styles.titleColor1]}>Notes: <Text style={{color:'#000',fontSize:14}}>{title2}</Text></Text>
        </View>
    
      <Text style={styles.dateText}><Text style={{color:"#0389ca"}}>Created at: </Text>{createdAt}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
  },
  contentContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'column',
    width:'auto'
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    //padding: 4,
    marginRight:200
  },
  titleColor1: {
    color: '#0389ca',
  },
  dateText: {
    textAlign: 'right',
    color: '#757575',
    fontSize: 14,
  },
});

export default ActivityCard;