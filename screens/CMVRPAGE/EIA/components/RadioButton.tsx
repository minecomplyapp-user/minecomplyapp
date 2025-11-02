import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { RadioButtonProps } from '../types/RadioButton.types';
import { styles } from '../styles/RadioButton.styles';

export const RadioButton: React.FC<RadioButtonProps> = ({ 
  selected, 
  onPress, 
  label,
  disabled = false 
}) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={styles.container}
    disabled={disabled}
  >
    <View style={[
      styles.radioOuter,
      disabled && styles.radioOuterDisabled
    ]}>
      {selected && <View style={[
        styles.radioInner,
        disabled && styles.radioInnerDisabled
      ]} />}
    </View>
    {label && <Text style={[
      styles.label,
      disabled && styles.labelDisabled
    ]}>{label}</Text>}
  </TouchableOpacity>
);