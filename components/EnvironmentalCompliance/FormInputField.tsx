import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

type FormInputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  subLabel?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText'>;

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
      <Text style={styles.label}>
        {label}
        {subLabel && (
          <>
            {'\n'}
            <Text style={styles.subLabel}>{subLabel}</Text>
          </>
        )}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 80,
  },
});