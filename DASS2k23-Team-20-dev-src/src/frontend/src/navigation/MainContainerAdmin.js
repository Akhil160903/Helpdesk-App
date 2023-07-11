import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
// Screens
import HomeScreen from '../screens/Admin/HomeScreen';
import DetailsScreen from '../screens/Admin/DetailsScreen/DetailsScreen';
import TicketDetailsPage from '../screens/Admin/TicketDetailsPage/TicketDetailsPage';
import SettingsScreen from '../screens/Admin/SettingsScreen';
import TicketPage from '../screens/Admin/TicketPage/TicketPage';
import NewTicketScreen from '../screens/Admin/NewTicket/NewTicket';
// import HomeNav from './HomeNav';
//Screen names
const homeName = 'Home';
const detailsName = 'MyTickets';
const ticketDetailsName = 'TicketDetailsPage';
const settingsName = 'Settings';
const ticketPage = 'TicketPage';
const newTicket = 'NewTicket';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TicketStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={detailsName} component={DetailsScreen} />
      <Stack.Screen name={ticketDetailsName} component={TicketDetailsPage} />
      <Stack.Screen name={ticketPage} component={TicketPage} />
    </Stack.Navigator>
  );
}

function MainContainerAdmin() {
  return (
    <Tab.Navigator initialRouteName={homeName}>
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen
        name={detailsName}
        options={{headerShown: false}}
        component={TicketStack}
      />
      <Tab.Screen name={newTicket} component={NewTicketScreen} />
      <Tab.Screen name={settingsName} component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default MainContainerAdmin;
