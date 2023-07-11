import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import { AuthContext } from '../../../context/AuthContext';

export default function SettingsScreen({navigation}) {
  const {logout} = useContext(AuthContext);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text onPress={() => logout()} style={{fontSize: 26, fontWeight: 'bold'}}>
        Logout
      </Text>
    </View>
  );
}
