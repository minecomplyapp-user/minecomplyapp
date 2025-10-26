// components/common/NACheckbox.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type NACheckboxProps = {
  checked: boolean;
  onPress: () => void;
};

export const NACheckbox: React.FC<NACheckboxProps> = ({ checked, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkbox} onPress={onPress}>
        {checked && <View style={styles.checkboxFill} />}
      </TouchableOpacity>
      <Text style={styles.label}>N/A</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  checkboxFill: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
});