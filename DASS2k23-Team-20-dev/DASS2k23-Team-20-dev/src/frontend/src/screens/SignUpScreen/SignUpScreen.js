import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import CustomInput from '../../components/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/core';
import {AuthContext} from '../../context/AuthContext';
import DropdownComponent from './Dropdown/selectUserType';

const SignUpScreen = () => {
  const {register} = useContext(AuthContext);

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [orgId, setOrgId] = useState(-9999);
  const [phoneNum, setPhoneNum] = useState('');
  const [userType, setUserType] = useState(''); // [user, service provider]

  const navigation = useNavigation();

  const onRegisterPressed = () => {
    console.log(userType);
    if (userType === '') {
      alert('Please select user type');
      return;
    }
    // check if passwords match
    if (password !== passwordRepeat) {
      alert('Passwords do not match');
      return;
    }
    register(email, password, fname, lname, phoneNum, orgId, userType);
    navigation.navigate('SignIn');
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };
  return (
    <KeyboardAwareScrollView
      style={styles.root}
      innerRef={ref => {
        this.scroll = ref
      }}
    >
      <View>
        <Text style={styles.title}>Create an account</Text>
        <CustomButton
          text="Have an account? Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
        <Text style={styles.subeheding}>Select User Type</Text>
        <DropdownComponent value={userType} setValue={setUserType} />
        <Text style={styles.subeheding}>Fill in your details</Text>
        <CustomInput placeholder="First Name" value={fname} setValue={setFname} />
        <CustomInput placeholder="Last Name" value={lname} setValue={setLname} />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <TextInput
          placeholder="Phone Number"
          value={phoneNum}
          onChangeText={setPhoneNum}
          keyboardType="numeric"
          style={styles.numericInput}
        />
        <TextInput
          placeholder="Organisation ID"
          value={orgId}
          onChangeText={setOrgId}
          keyboardType="numeric"
          style={styles.numericInput}
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder="Confirm Password"
          value={passwordRepeat}
          setValue={setPasswordRepeat}
          secureTextEntry
          onFocus={(event) => {
            // `bind` the function if you're using ES6 classes
            this._scrollToInput(ReactNative.findNodeHandle(event.target))
          }}
        />
        <CustomButton text="Register" onPress={onRegisterPressed} />
        <View style={{height: 100}} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  subeheding: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#051C60',
    marginVertical: 10,
  },
  numericInput: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  }
});

export default SignUpScreen;
