import React, {Key, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {_get} from '../api/apiClient';
import {showError, showSuccess} from './FlashMessage';
import {useFocusEffect} from '@react-navigation/native';

const LeadCard = ({navigation}) => {
  const [box, setBoxes] = useState([Object]);
  // const boxes = [
  //   {color: '#231f20', label: 'Contact', number: '228268', badge: '6'},
  //   {color: '#231f20', label: 'Intrested', number: '74', badge: '8'},
  //   {color: '#231f20', label: 'Opportunity', number: '9', badge: '10'},
  //   {color: '#231f20', label: 'Missed', number: '622', badge: '99'},
  //   {color: '#231f20', label: 'Callback', number: '1163', badge: '5'},
  //   {color: '#231f20', label: 'Sales', number: '17', badge: '7'},
  // ];

  const [apiCalled, setApiCalled] = useState(false);
  const[totalLeads, setTotalLeads] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!apiCalled) {
        fetchData(); // Call the API
        setApiCalled(true); // Set the flag
      }
    }, [apiCalled]),
  );

  useEffect(() => {
    getTotalLeads();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchData();
    }, 3000); // Run every 1 second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, [apiCalled]);

  const getTotalLeads = async () => {
    try {
      const response = await _get('/gettotalleads');
      const result = await response.data.data.TotalLead;
      setTotalLeads(result);
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await _get('/getdashboard');
      const result = await response.data;
      const finalData = result.data;
      let res = [];
      for (let key in finalData) {
        res.push({
          label: key,
          count: finalData[key],
          color: '#231f20',
          badge: 10,
        });
      }

      setBoxes([...res]);
      if (response.status == 200) {
      } else {
        showSuccess(response.data.message || 'Login failed');
      }
    } catch (error) {
      //showError('Something went wrong, please try again');
    }
  };

  const gridOnpress = labelName => {
    const boxName = box.filter(it => it.label === labelName);
    const path = `/screens/Contacts/${boxName[0].label}`;

    switch (boxName[0].label) {
      case 'Missed':
        navigation.navigate('MissedLead');
        break;
      case 'Interested':
        navigation.navigate('InterestedLead');
        break;
      case 'Fresh':
        navigation.navigate('PendingLead');
        break;
      case 'Opportunity':
        navigation.navigate('Opportunity');
        break;
      case 'Callback':
        navigation.navigate('CallBackLead');
        break;
      case 'Won':
        navigation.navigate('WonLead');
      default:
        break;
    }
  };
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
        <View style={{flexDirection: 'row-reverse'}}>
          <Text>Total Leads:{totalLeads}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.row}>
        {box.map((bo, index) => (
          <View key={index} style={styles.wrapper}>
            {/* Label behind the box */}
            {/* <TouchableOpacity
                            key={box.label}
                            style={styles.box}
                            onpress={onBoxPress(box.label)}
                            label={label}
                        > */}
            {/* Box Container */}
            <Pressable
              style={[styles.box, {borderColor: bo.color}]}
              onPress={() => gridOnpress(bo.label)}>
              {/* Colored start part */}
              <View style={[styles.startPart, {backgroundColor: bo.color}]} />
              {/* Number in the middle */}
              <Text style={styles.number}>{bo.count}</Text>

              {/* Badge */}
              {/* <View style={styles.badge}>
                <Text style={styles.badgeText}>{bo.badge}</Text>
              </View> */}
            </Pressable>
            {/* </TouchableOpacity> */}
            <Text style={[styles.label]}>{bo.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    //margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wrapper: {
    width: '30%', // 3 boxes per row
    aspectRatio: 1, // Keep it square
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#231f20',
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
  box: {
    width: '100%',
    height: '65%',
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  startPart: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '5%', // Colored start part width
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0389ca',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LeadCard;
