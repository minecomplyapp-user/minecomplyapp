// components/water-quality/ParameterForm.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Parameter } from '../../types/waterQuality.types';
import { ResultMonitoring } from './ResultMonitoring';
import { DENRStandardSection } from './DENRStandardSection';
import { SamplingDetails } from './SamplingDetails';

type ParameterFormProps = {
  parameter: Parameter;
  index?: number;
  isMain?: boolean;
  onUpdate: (field: keyof Omit<Parameter, 'id'>, value: string | boolean) => void;
  onDelete?: () => void;
};

export const ParameterForm: React.FC<ParameterFormProps> = ({
  parameter,
  index,
  isMain = false,
  onUpdate,
  onDelete,
}) => {
  // Wrapper to handle ResultMonitoring's string-based field types
  const handleTSSChange = (field: string, value: string) => {
    onUpdate(field as keyof Omit<Parameter, 'id'>, value);
  };

  return (
    <View style={!isMain && styles.additionalContainer}>
      {!isMain && onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={14} color="#B00020" />
        </TouchableOpacity>
      )}

      <View style={styles.parameterHeader}>
        <Text style={styles.parameterLabel}>
          {isMain ? 'Parameter:' : `Parameter ${index! + 1}:`}
        </Text>
      </View>
      
      <TextInput
        style={styles.parameterInput}
        value={parameter.parameter}
        onChangeText={(text) => onUpdate('parameter', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
      />

      <ResultMonitoring
        resultType={parameter.resultType}
        tssCurrent={parameter.tssCurrent}
        tssPrevious={parameter.tssPrevious}
        onResultTypeChange={(value) => onUpdate('resultType', value)}
        onTSSChange={handleTSSChange}
      />

      <DENRStandardSection
        redFlag={parameter.eqplRedFlag}
        action={parameter.action}
        limit={parameter.limit}
        onInputChange={(field, value) => onUpdate(field as keyof Omit<Parameter, 'id'>, value)}
      />

      <SamplingDetails
        remarks={parameter.remarks}
        dateTime={parameter.dateTime}
        weatherWind={parameter.weatherWind}
        explanation={parameter.explanation}
        isExplanationNA={parameter.isExplanationNA}
        onInputChange={(field, value) => onUpdate(field as keyof Omit<Parameter, 'id'>, value)}
        onExplanationNAToggle={() => onUpdate('isExplanationNA', !parameter.isExplanationNA)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  additionalContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#CDEFF7',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    zIndex: 10,
  },
  parameterHeader: {
    marginBottom: 8,
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  parameterInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
    borderRadius: 6,
  },
});