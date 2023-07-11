import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { TicketContext } from '../../../context/TicketContext';
import CustomButton from '../../../components/CustomButton/CustomButton';
import moment from 'moment';

const TicketPage = ({ route }) => {
  const { id, desc, summary, createdOn, assignedTo, status } = route.params;

  const [ticket, setTicket] = useState({
    id,
    summary,
    desc,
    createdOn,
    assignedTo,
    status,
  });

  const onSave = editedTicket => {
    setTicket(editedTicket);
  };

  return (
    <ScrollView style={styles.root}>
      <TicketCard ticket={ticket} onSave={onSave} />
      <UpdatesCard ticket={ticket} />
    </ScrollView>
  );
};

const UpdatesCard = ({ ticket }) => {
  const { getTicketUpdates, ticketUpdates, updateTicket, updateTicketSuccess } = useContext(TicketContext);
  const [update, setUpdate] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    getTicketUpdates(ticket.id);
  }
    , []);

  useEffect(() => {
    if (updateTicketSuccess) {
      alert('Ticket updated successfully');
      navigation.navigate('MyTickets');
    }
  }, [updateTicketSuccess]);

  useEffect(() => {
    console.log(ticketUpdates);
  }, [ticketUpdates]);

  return (
    <View>
      <Text style={styles.updatesTitle}>Updates</Text>
      <View style={styles.createUpdateContainer}>
        <Text style={styles.createUpdateTitle}>Create Update</Text>
        <TextInput
          style={styles.createUpdateInput}
          placeholder="Enter update"
          value={update}
          onChangeText={text => setUpdate(text)}
        />
        <CustomButton
          text="Update"
          onPress={() => updateTicket(ticket.id, update)}
        />
      </View>
      {ticketUpdates.map(update => (
        <View
          key={update.Id}
          style={styles.updateContainer}
        >
          <Text style={styles.updateDate}>On {moment(update.UpdatedOn).format('DD/MM/YYYY')} at {moment(update.UpdatedOn).format('hh:mm A')}</Text>
          <Text style={styles.updateBy}>By ID:{update.UpdatedBy}</Text>
          <View style={styles.updateContent}>
            <Text style={styles.updateData}>{update.Update}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const TicketCard = ({ ticket, onSave }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTicket, setEditedTicket] = useState(ticket);

  const { closeTicket, closeTicketSuccess } = useContext(TicketContext);
  const navigation = useNavigation();

  const handleEdit = () => {
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
    setEditedTicket(ticket);
  };

  const handleSave = () => {
    setIsModalVisible(false);
    onSave(editedTicket);
  };

  const handleCloseTicket = () => {
    closeTicket(ticket.id);
  };

  useEffect(() => {
    if (closeTicketSuccess) {
      alert('Ticket closed successfully');
      navigation.navigate('MyTickets');
    }
  }, [closeTicketSuccess]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.summary}>{ticket.summary}</Text>
        <Text style={styles.desc}>{ticket.desc}</Text>
        <CustomButton onPress={handleEdit} text="Edit" disabled={
          ticket.status === 'Closed'
        }>
        </CustomButton>
        <CustomButton onPress={handleCloseTicket} bgColor={'#ff0050'} text={"Close Ticket"} disabled={
          ticket.status === 'Closed'
        }>
        </CustomButton>
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Ticket</Text>
            <Text style={styles.modalLabel}>Summary</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Summary"
              value={editedTicket.summary}
              onChangeText={text =>
                setEditedTicket({ ...editedTicket, summary: text })
              }
            />
            <Text style={styles.modalLabel}>Description</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={editedTicket.desc}
              onChangeText={text =>
                setEditedTicket({ ...editedTicket, desc: text })
              }
            />
            {/* <DropdownComponent
            style={styles.modalInput}
            placeholder="Status"
            value={editedTicket.status}
            setValue={changeStatus}
          /> */}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCancel} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.details}>
        <Text style={styles.summary}>Details</Text>
        <Text style={styles.createdOn}>Created on: {ticket.createdOn}</Text>
        <Text style={styles.assignedTo}>Assigned to: {ticket.assignedTo}</Text>
        <Text style={styles.status}>Status: {ticket.status}</Text>
      </View>
    </ScrollView>
  );
};

const styles = {
  root: {
    flex: 1,
    padding: 16,
  },
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  desc: {
    fontSize: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#eee',
  },
  details: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  summary: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  createdOn: {
    fontSize: 14,
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  updatesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  updateContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  updateData: {
    fontSize: 16,
    marginBottom: 8,
  },
  updateDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  updateBy: {
    fontSize: 14,
    marginBottom: 4,
  },
  updateContent: {
    margin: 8,
    padding: 8,
    backgroundColor: '#eee',
  },
  createUpdateContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  createUpdateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  createUpdateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
};

export default TicketPage;
