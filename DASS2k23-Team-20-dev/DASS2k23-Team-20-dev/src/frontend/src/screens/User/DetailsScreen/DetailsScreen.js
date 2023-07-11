import React, { Component, useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { TicketContext } from '../../../context/TicketContext';
import moment from 'moment';

export default function DetailsScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTickets();
    setRefreshing(false);
  }, []);

  const { getTickets, createTicketSuccess, setCreateTicketSuccess, closeTicketSuccess, setCloseTicketSuccess, updateTicketSuccess, setUpdateTicketSuccess } = useContext(TicketContext);
  const { userTickets } = useContext(TicketContext);

  const displayTickets = () => {
    console.log(userTickets);
  }

  useEffect(() => {
    getTickets();
  }, []);

  useEffect(() => {
    if (createTicketSuccess) {
      getTickets();
      setCreateTicketSuccess(false);
    }
  }, [createTicketSuccess]);

  useEffect(() => {
    if (closeTicketSuccess) {
      getTickets();
      setCloseTicketSuccess(false);
    }
  }, [closeTicketSuccess]);

  useEffect(() => {
    if (updateTicketSuccess) {
      getTickets();
      setUpdateTicketSuccess(false);
    }
  }, [updateTicketSuccess]);

  useEffect(() => {
    if (userTickets) {
      displayTickets();
    }
  }, [userTickets]);

  return (
    <View style={styles.container}>
      <CustomButton
        text="Create New Ticket"
        onPress={() => navigation.navigate('NewTicket')}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userTickets && userTickets.map((ticket, index) => (
          <TouchableOpacity key={index} onPress={() => {
            navigation.navigate('TicketPage', {
              id: ticket["TicketId"],
              summary: ticket["Summary"],
              desc: ticket["Description"],
              createdOn: moment(ticket["CreatedOn"]).format("MMMM Do YYYY"),
              assignedTo: ticket["AssignedTo"],
              status: ticket["Status"]
            });
          }}>
            <View style={styles.card} >
              {/* <Text>ID: {ticket[0]}</Text> */}
              <Text>Summary: {ticket["Summary"]}</Text>
              <Text>Created On: {moment(ticket["CreatedOn"]).format('MM/DD/YYYY')}</Text>
              <Text>Status: {ticket["Status"]}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 6,
    padding: 12,
    borderRadius: 5
  },
});
