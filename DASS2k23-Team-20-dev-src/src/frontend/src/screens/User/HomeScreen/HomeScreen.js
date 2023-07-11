import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import CustomBox from '../../../components/CustomBox';
import { TicketContext } from '../../../context/TicketContext';
const HomeScreen = () => {
  const [fname, setFname] = useState('');

  const { getTickets, userTickets } = useContext(TicketContext);

  const getEmail = async () => {
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      let parsed = JSON.parse(userInfo);
      setFname(parsed.FirstName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmail();
  }, []);

  useEffect(() => {
    getTickets();
  }, []);

  useEffect(() => {
    if (userTickets) {
      console.log(numOfWIP());
      console.log(numOfAssigned());
    }
  }, [userTickets]);

  const numOfOpen = () => {
    let count = 0;
    userTickets.forEach(ticket => {
      if (ticket.Status === 'Open') {
        count++;
      }
    });
    return count;
  };

  const numOfWIP = () => {
    let count = 0;
    userTickets.forEach(ticket => {
      if (ticket.Status === 'WIP') {
        count++;
      }
    });
    return count;
  };

  const numOfAssigned = () => {
    let count = 0;
    userTickets.forEach(ticket => {
      if (ticket.Status === 'Assigned') {
        count++;
      }
    });
    return count;
  };


  return (
    <ScrollView
      contentContainerStyle={styles.root}
    >
      <View style={styles.welcomeCard}>
        <Text style={styles.headingWelc}>Welcome,</Text>
        <Text style={styles.name}>{fname}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Open Tickets</Text>
        <Text style={styles.num}>{numOfOpen()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Assigned Tickets</Text>
        <Text style={styles.num}>{numOfAssigned()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>In Progress Tickets</Text>
        <Text style={styles.num}>{numOfWIP()}</Text>
      </View>

    </ScrollView>
  );
};

styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    // less darkish blue
    color: '#1e90ff',
  },
  welcomeCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: 'black',
    margin: 12,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
  },
  headingWelc: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "black",
    margin: 12,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
  },
  num: {
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e90ff',
  }
});

export default HomeScreen;