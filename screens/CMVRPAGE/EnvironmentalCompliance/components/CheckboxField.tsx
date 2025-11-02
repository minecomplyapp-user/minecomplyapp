import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckboxFieldProps } from '../types';
import { checkboxFieldStyles as styles } from '../styles';

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  checked,
  onPress,
  label,
  size = 22,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          { width: size, height: size },
          checked && styles.checkboxChecked,
        ]}
        onPress={onPress}
      >
        {checked && <Ionicons name="checkmark" size={size * 0.7} color="#2563EB" />}
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};