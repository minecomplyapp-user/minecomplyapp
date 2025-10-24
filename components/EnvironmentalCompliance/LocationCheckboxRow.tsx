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
      <TouchableOpacity style={styles.checkbox} onPress={onCheckboxPress}>
        {isSelected && <Ionicons name="checkmark" size={11} color="#000" />}
      </TouchableOpacity>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type here..."
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#000',
    width: 100,
  },
  formInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    marginLeft: 8,
  },
});