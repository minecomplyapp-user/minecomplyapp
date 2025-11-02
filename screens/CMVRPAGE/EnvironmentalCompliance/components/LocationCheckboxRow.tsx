import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationCheckboxRowProps } from '../types';
import { locationCheckboxRowStyles as styles } from '../styles';

export const LocationCheckboxRow: React.FC<LocationCheckboxRowProps> = ({
  label,
  value,
  onChangeText,
  isSelected,
  onCheckboxPress,
}) => {
  return (
    <View style={styles.formRow}>
      <TouchableOpacity 
        style={[styles.checkbox, isSelected && styles.checkboxSelected]} 
        onPress={onCheckboxPress}
      >
        {isSelected && <Ionicons name="checkmark" size={14} color='#02217C' />}
      </TouchableOpacity>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={[
          styles.formInput,
          !isSelected && styles.formInputDisabled
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        editable={isSelected}
      />
    </View>
  );
};