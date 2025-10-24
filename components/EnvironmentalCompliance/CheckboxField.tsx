import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CheckboxFieldProps = {
  checked: boolean;
  onPress: () => void;
  label: string;
  size?: number;
};

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
        {checked && <Ionicons name="checkmark" size={size * 0.7} color="#000" />}
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    borderWidth: 1.5,
    borderColor: '#666',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#E8E8E8',
    borderColor: '#000',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
});