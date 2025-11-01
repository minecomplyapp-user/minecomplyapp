import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  size?: number;
};

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

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    borderColor: '#02217C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});