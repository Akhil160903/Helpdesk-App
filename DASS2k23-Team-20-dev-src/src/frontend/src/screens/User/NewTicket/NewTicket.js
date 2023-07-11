import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import { useNavigation } from '@react-navigation/core';
// import HomeNav from '../../navigation/HomeNav';
import { TicketContext } from '../../../context/TicketContext';

const NewTicketScreen = () => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  const { createTicket } = useContext(TicketContext);
  const { createTicketSuccess, setCreateTicketSuccess } = useContext(TicketContext);

  const createPressed = () => {
    createTicket(summary, description);
  };

  useEffect(() => {
    if (createTicketSuccess) {
      // clear the input fields
      setSummary('');
      setDescription('');

      alert('Ticket created successfully!');
      navigation.navigate('MyTickets');
      console.log('success');
      setCreateTicketSuccess(false);
    }
  }, [createTicketSuccess]);
  return (
    <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.root}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create a new ticket</Text>
        <CustomInput
          placeholder="Summary"
          value={summary}
          setValue={setSummary}
        />
        <TextInput
          placeholder='Description'
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: 80,
            borderColor: 'black',
            textAlignVertical: 'center',
            padding: '2.5%',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginVertical: 5,
          }}
        />
        <View>
          <CustomButton
            text="Create Ticket"
            onPress={createPressed}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
  card: {
    padding: 16,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
});

export default NewTicketScreen;
