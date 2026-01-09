import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomTextInput = ({
  placeholder,
  value,
  iconName = 'input',
  keyboardType,
  onChangeText,
  maxLength,
  defaultValue,
  error,
  errorMessage,
  ...props
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, error ? styles.errorBorder : null]}>
        <Icon name={iconName} size={20} color="#666" style={styles.icon} />
        <TextInput
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={styles.input}
          defaultValue={defaultValue}
          {...props}
        />
      </View>
      {error && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 5,
    marginHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
   backgroundColor: '#ebedf0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  errorBorder: {
    borderWidth: 0.5,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 5,
  },
});

export default CustomTextInput;
