import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress, label }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <View style={styles.radioOuter}>
      {selected && <View style={styles.radioInner} />}
    </View>
    {label && <Text style={styles.label}>{label}</Text>}
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
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  label: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
});