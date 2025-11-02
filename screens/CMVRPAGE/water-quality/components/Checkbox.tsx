import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckboxProps } from '../types/Checkbox.types';
import { styles } from '../styles/Checkbox.styles';

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked, 
  onPress, 
  size = 20 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.checkbox, { width: size, height: size }]}
      onPress={onPress}
    >
      {checked && <Ionicons name="checkmark" size={size * 0.7} color='#02217C' />}
    </TouchableOpacity>
  );
};