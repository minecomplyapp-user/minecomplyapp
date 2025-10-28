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
        {checked && <Ionicons name="checkmark" size={size * 0.7} color="#2563EB" />}
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  checkbox: {
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  label: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
});
