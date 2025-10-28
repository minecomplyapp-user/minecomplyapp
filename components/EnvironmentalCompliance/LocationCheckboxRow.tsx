import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type LocationCheckboxRowProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isSelected: boolean;
  onCheckboxPress: () => void;
};

export const LocationCheckboxRow: React.FC<LocationCheckboxRowProps> = ({
  label,
  value,
  onChangeText,
  isSelected,
  onCheckboxPress,
}) => {
  return (
    <View style={styles.formRow}>
      <TouchableOpacity 
        style={[styles.checkbox, isSelected && styles.checkboxSelected]} 
        onPress={onCheckboxPress}
      >
        {isSelected && <Ionicons name="checkmark" size={14} color="#2563EB" />}
      </TouchableOpacity>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#EFF6FF',
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
    width: 100,
  },
  formInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginLeft: 8,
    color: '#1E293B',
  },
});