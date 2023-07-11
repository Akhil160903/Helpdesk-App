import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const CustomBox = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <Text
        value={value}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '90%',
    height: '20%',
    borderColor: '#e8e8e8',
    textAlignVertical: 'center',
    padding: '2.5%',
    borderWidth: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: '5%',
  },
  input: {},
});

export default CustomBox;
