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
          <Text style={styles.inputLabel}>Current:</Text>
          <TextInput
            style={[styles.input, isMMTNA && styles.disabledInput]}
            value={mmtCurrent}
            onChangeText={(text) => onInputChange('mmtCurrent', text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
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
            placeholderTextColor="#94A3B8"
            editable={!isMMTNA}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#02217C',
  },
  inputs: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    borderRadius: 6,
    color: '#1E293B',
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
  },
});
