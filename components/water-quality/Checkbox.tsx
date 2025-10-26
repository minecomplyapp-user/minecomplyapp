// components/common/Checkbox.tsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  size?: number;
};

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked, 
  onPress, 
  size = 16 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.checkbox, { width: size, height: size }]}
      onPress={onPress}
    >
      {checked && <View style={styles.checkboxFill} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxFill: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
  },
});