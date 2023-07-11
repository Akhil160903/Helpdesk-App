import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const data = [
  {label: 'Category 1', value: '1'},
  {label: 'Category 2', value: '2'},
  {label: 'Category 3', value: '3'},
  {label: 'Category 4', value: '4'},
  {label: 'Category 5', value: '5'},
  {label: 'Category 6', value: '6'},
  {label: 'Category 7', value: '7'},
  {label: 'Category 8', value: '8'},
];

const DropdownComponent = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          {/* Category */}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        //   iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Category' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
        //   renderLeftIcon={() => (
        //     <AntDesign
        //       style={styles.icon}
        //       color={isFocus ? 'blue' : 'black'}
        //       name="Safety"
        //       size={20}
        //     />
        //   )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      borderRadius: 5,
      borderColor: 'black',
      borderWidth: 1,
      marginVertical: 10,
  },
  dropdown: {
      height: 50,
      width: 330,
      paddingHorizontal: 8,
  },
  icon: {
      marginRight: 5,
  },
  label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
  },
  placeholderStyle: {
      fontSize: 14,
  },
  selectedTextStyle: {
      fontSize: 14,
  },
  iconStyle: {
      width: 20,
      height: 20,
  },
  inputSearchStyle: {
      height: 30,
      fontSize: 16,
  },
});