import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckboxProps } from '../types/Checkbox.types';
import { styles } from '../styles/Checkbox.styles';

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked, 
  onPress, 
  label,
  disabled = false 
}) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={styles.container}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <View style={[
      styles.checkboxOuter,
      checked && styles.checkboxOuterChecked,
      disabled && styles.checkboxOuterDisabled,
      checked && disabled && styles.checkboxOuterCheckedDisabled
    ]}>
      {checked && (
        <Ionicons 
          name="checkmark" 
          size={14} 
          color={disabled ? '#94A3B8' : '#FFFFFF'} 
        />
      )}
    </View>
    {label && (
      <Text style={[
        styles.label,
        disabled && styles.labelDisabled
      ]}>
        {label}
      </Text>
    )}
  </TouchableOpacity>
);

export default Checkbox;