import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NACheckboxProps = {
  checked: boolean;
  onPress: () => void;
};

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#02217C',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#EFF6FF',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
});
