import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#02217C',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioOuterDisabled: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#02217C',
  },
  radioInnerDisabled: {
    backgroundColor: '#94A3B8',
  },
  label: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  labelDisabled: {
    color: '#94A3B8',
  },
});