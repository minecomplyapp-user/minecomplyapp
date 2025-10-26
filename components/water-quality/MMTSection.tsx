// components/water-quality/MMTSection.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { NACheckbox } from '../water-quality/NACheckbox';

type MMTSectionProps = {
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  onInputChange: (field: string, value: string) => void;
  onNAToggle: () => void;
};

export const MMTSection: React.FC<MMTSectionProps> = ({
  mmtCurrent,
  mmtPrevious,
  isMMTNA,
  onInputChange,
  onNAToggle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>MMT Confirmatory Sampling</Text>
        <NACheckbox checked={isMMTNA} onPress={onNAToggle} />
      </View>

      <View style={styles.inputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current :</Text>
          <TextInput
            style={[styles.input, isMMTNA && styles.disabledInput]}
            value={mmtCurrent}
            onChangeText={(text) => onInputChange('mmtCurrent', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
            editable={!isMMTNA}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Previous:</Text>
          <TextInput
            style={[styles.input, isMMTNA && styles.disabledInput]}
            value={mmtPrevious}
            onChangeText={(text) => onInputChange('mmtPrevious', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
            editable={!isMMTNA}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  inputs: {
    flexDirection: 'row',
  },
  inputGroup: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    borderRadius: 6,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
  },
});