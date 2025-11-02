import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { FormInputFieldProps } from '../types';
import { formInputFieldStyles as styles } from '../styles';

export const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  subLabel,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {subLabel && (
            <>
              {'\n'}
              <Text style={styles.subLabel}>{subLabel}</Text>
            </>
          )}
        </Text>
      )}
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
};