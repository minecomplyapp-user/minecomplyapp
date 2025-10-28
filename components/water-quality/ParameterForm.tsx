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
  const handleTSSChange = (field: string, value: string) => {
    onUpdate(field as keyof Omit<Parameter, 'id'>, value);
  };

  return (
    <View style={!isMain && styles.additionalContainer}>
      {!isMain && onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
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
        placeholderTextColor="#94A3B8"
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
    borderTopWidth: 2,
    borderTopColor: '#BFDBFE',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#DC2626',
    zIndex: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  parameterHeader: {
    marginBottom: 8,
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  parameterInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
    borderRadius: 6,
    color: '#1E293B',
  },
});