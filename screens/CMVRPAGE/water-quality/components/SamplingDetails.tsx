import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { NACheckbox } from '../components/NACheckbox';
import { SamplingDetailsProps } from '../types/SamplingDetails.types';
import { styles } from '../styles/SamplingDetails.styles';

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
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
      />

      <Text style={styles.fieldLabel}>Date/Time of Sampling:</Text>
      <TextInput
        style={styles.input}
        value={dateTime}
        onChangeText={(text) => onInputChange('dateTime', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
      />

      <Text style={styles.fieldLabel}>Weather and Wind Direction:</Text>
      <TextInput
        style={styles.input}
        value={weatherWind}
        onChangeText={(text) => onInputChange('weatherWind', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
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
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        editable={!isExplanationNA}
      />
    </>
  );
};