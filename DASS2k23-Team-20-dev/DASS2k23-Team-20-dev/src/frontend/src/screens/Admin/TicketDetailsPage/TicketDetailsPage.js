import React, { Component, useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { TicketContext } from '../../../context/TicketContext';
import moment from 'moment';

export default function TicketDetailsPage({ navigation, route }) {
  const { tickets } = route.params;

  console.log(tickets);
  return (
    <View style={styles.container}>
      <ScrollView>
      {tickets && tickets.map((ticket, index) => (
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
