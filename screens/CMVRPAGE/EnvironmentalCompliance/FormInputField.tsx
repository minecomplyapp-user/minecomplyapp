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

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: '#1E293B',
  },
  multilineInput: {
    minHeight: 80,
  },
});