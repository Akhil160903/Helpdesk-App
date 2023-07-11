import React, {useContext} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainContainer from './MainContainer';
import MainContainerService from './MainContainerService';
import MainContainerAdmin from './MainContainerAdmin';
import { AuthContext } from '../context/AuthContext';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {isLoadingAuth, userToken, userType} = useContext(AuthContext);
  
  if (isLoadingAuth) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  console.log('userType-',userType);
  return (
    <NavigationContainer>
      {userToken ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {userType === 'User' ? (
            <Stack.Screen name="MainContainer" component={MainContainer} />
          ) : userType === 'ServiceProvider' ? (
            <Stack.Screen name="MainContainerService" component={MainContainerService} />
          ) : userType === 'Admin' ? (
            <Stack.Screen name="MainContainerAdmin" component={MainContainerAdmin} />
          ) : (
            <Stack.Screen name="SignIn" component={SignInScreen} />
          )
        }
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
