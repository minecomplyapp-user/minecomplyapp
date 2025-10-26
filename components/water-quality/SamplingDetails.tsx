// components/water-quality/SamplingDetails.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { NACheckbox } from '../water-quality/NACheckbox';

type SamplingDetailsProps = {
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  onInputChange: (field: string, value: string) => void;
  onExplanationNAToggle: () => void;
};

export const SamplingDetails: React.FC<SamplingDetailsProps> = ({
  remarks,
  dateTime,
  weatherWind,
  explanation,
  isExplanationNA,
  onInputChange,
  onExplanationNAToggle,
}) => {
  return (
    <>
      <Text style={styles.sectionLabel}>REMARKS:</Text>
      <TextInput
        style={styles.textInput}
        value={remarks}
        onChangeText={(text) => onInputChange('remarks', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
        multiline
        numberOfLines={3}
      />

      <Text style={styles.fieldLabel}>Date/Time of Sampling:</Text>
      <TextInput
        style={styles.input}
        value={dateTime}
        onChangeText={(text) => onInputChange('dateTime', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
      />

      <Text style={styles.fieldLabel}>Weather and Wind Direction:</Text>
      <TextInput
        style={styles.input}
        value={weatherWind}
        onChangeText={(text) => onInputChange('weatherWind', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
      />

      <View style={styles.explanationHeader}>
        <Text style={styles.fieldLabel}>
          Explanation of why confirmatory{'\n'}sampling was conducted for specific{'\n'}parameter in this sampling station:
        </Text>
        <NACheckbox 
          checked={isExplanationNA} 
          onPress={onExplanationNAToggle} 
        />
      </View>
      <TextInput
        style={[styles.textInput, isExplanationNA && styles.disabledInput]}
        value={explanation}
        onChangeText={(text) => onInputChange('explanation', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        editable={!isExplanationNA}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderRadius: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
    borderRadius: 6,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
  },
});