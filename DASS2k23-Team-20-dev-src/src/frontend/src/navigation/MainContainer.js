import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
// Screens
import HomeScreen from '../screens/User/HomeScreen';
import DetailsScreen from '../screens/User/DetailsScreen';
import SettingsScreen from '../screens/User/SettingsScreen';
import NewTicket from '../screens/User/NewTicket';
import TicketPage from '../screens/User/TicketPage/TicketPage';
// import HomeNav from './HomeNav';
//Screen names
const homeName = 'Home';
const detailsName = 'MyTickets';
const settingsName = 'Settings';
const newTicket = 'NewTicket';
const ticketPage = 'TicketPage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TicketStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={detailsName} component={DetailsScreen} />
      <Stack.Screen name={ticketPage} component={TicketPage} />
    </Stack.Navigator>
  );
}

function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
    >
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={detailsName} options={{headerShown: false}} component={TicketStack} />
      <Tab.Screen name={newTicket} component={NewTicket} />
      <Tab.Screen name={settingsName} component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default MainContainer;
