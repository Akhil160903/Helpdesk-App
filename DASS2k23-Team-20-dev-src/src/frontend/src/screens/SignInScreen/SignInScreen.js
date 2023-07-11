import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

const SignInScreen = () => {
  const { login } = useContext(AuthContext);
  const { loginSuccess } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState(-9999);

  const navigation = useNavigation();

  const onSignInPressed = () => {
    // validate user
    login(email, password, orgId);
    console.log('login success: ', loginSuccess);
  };

  useEffect(() => {
    if (loginSuccess) {
      navigation.navigate('Home');
    }
  }, [loginSuccess]);

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Welcome to</Text>
          <Text style={styles.logoHead}>HELPDESK</Text>
        </View>
        <CustomInput
          placeholder="Email"
          value={email}
          setValue={setEmail}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Organization ID"
          value={orgId}
          onChangeText={setOrgId}
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: 40,
            borderColor: 'black',
            textAlignVertical: 'center',
            padding: '2.5%',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginVertical: 5,
          }}
          keyboardType='numeric'
        />
        <CustomButton text="Sign In" onPress={onSignInPressed} />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    // height : 10
    // fontSize : 20,
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
  logoContainer: {
      width: "100%",
      backgroundColor: "#fff",
      margin: 12,
      padding: 12,
      borderRadius: 8,
      shadowColor: "#000",
      alignItems: "center",
  },
  logoHead: {
    fontSize: 30,
    fontWeight: "bold"
  }
});

export default SignInScreen;
