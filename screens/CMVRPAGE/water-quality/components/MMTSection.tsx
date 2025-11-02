import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { NACheckbox } from '../components/NACheckbox';
import { MMTSectionProps } from '../types/MMTSection.types';
import { styles } from '../styles/MMTSection.styles';

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