import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NACheckboxProps } from '../types/NACheckbox.types';
import { styles } from '../styles/NACheckbox.styles';

export const NACheckbox: React.FC<NACheckboxProps> = ({ checked, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.checkbox, checked && styles.checkboxChecked]} 
        onPress={onPress}
      >
        {checked && <Ionicons name="checkmark" size={14} color='#02217C' />}
      </TouchableOpacity>
      <Text style={styles.label}>N/A</Text>
    </View>
  );
};