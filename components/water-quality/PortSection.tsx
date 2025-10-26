// components/water-quality/PortSection.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ParameterForm } from './ParameterForm';
import { MMTSection } from './MMTSection';
import { Parameter } from '../../types/waterQuality.types';

type PortData = {
  id: string;
  portName: string;
  parameter: string;
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  eqplRedFlag: string;
  action: string;
  limit: string;
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  additionalParameters: Parameter[];
};

type PortSectionProps = {
  port: PortData;
  index: number;
  onUpdate: (portId: string, field: string, value: any) => void;
  onDelete: (portId: string) => void;
  onAddParameter: (portId: string) => void;
  onUpdateParameter: (portId: string, parameterId: string, field: keyof Omit<Parameter, 'id'>, value: string | boolean) => void;
  onDeleteParameter: (portId: string, parameterIndex: number) => void;
};

export const PortSection: React.FC<PortSectionProps> = ({
  port,
  index,
  onUpdate,
  onDelete,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
}) => {
  const mainParameter: Parameter = {
    id: 'main',
    parameter: port.parameter,
    resultType: port.resultType,
    tssCurrent: port.tssCurrent,
    tssPrevious: port.tssPrevious,
    eqplRedFlag: port.eqplRedFlag,
    action: port.action,
    limit: port.limit,
    remarks: port.remarks,
    dateTime: port.dateTime,
    weatherWind: port.weatherWind,
    explanation: port.explanation,
    isExplanationNA: port.isExplanationNA,
  };

  const handleMainParameterUpdate = (field: keyof Omit<Parameter, 'id'>, value: string | boolean) => {
    onUpdate(port.id, field, value);
  };

  const handleMMTInputChange = (field: string, value: string) => {
    onUpdate(port.id, field, value);
  };

  return (
    <View style={styles.container}>
      {/* Port Header with Input */}
      <View style={styles.portHeaderContainer}>
        <View style={styles.portLabelContainer}>
          <Ionicons name="radio-button-on-outline" size={14} color="#000" style={styles.radioIcon} />
          <Text style={styles.portLabel}>Port</Text>
        </View>
        <TextInput
          style={styles.portInput}
          value={port.portName}
          onChangeText={(text) => onUpdate(port.id, 'portName', text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.deletePortButton}
          onPress={() => onDelete(port.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#B00020" />
        </TouchableOpacity>
      </View>

      {/* Parameter Section */}
      <View style={styles.parameterSection}>
        <ParameterForm
          parameter={mainParameter}
          isMain={true}
          onUpdate={handleMainParameterUpdate}
        />

        <MMTSection
          mmtCurrent={port.mmtCurrent}
          mmtPrevious={port.mmtPrevious}
          isMMTNA={port.isMMTNA}
          onInputChange={handleMMTInputChange}
          onNAToggle={() => onUpdate(port.id, 'isMMTNA', !port.isMMTNA)}
        />

        {/* Additional Parameters */}
        {port.additionalParameters.map((param, idx) => (
          <ParameterForm
            key={param.id}
            parameter={param}
            index={idx}
            isMain={false}
            onUpdate={(field, value) => onUpdateParameter(port.id, param.id, field, value)}
            onDelete={() => onDeleteParameter(port.id, idx)}
          />
        ))}

        {/* Add More Parameter Button */}
        <TouchableOpacity
          style={styles.addParameterButton}
          onPress={() => onAddParameter(port.id)}
        >
          <Text style={styles.addParameterText}>+ Add More Parameter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  portHeaderContainer: {
    backgroundColor: '#D4F1F4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#75E6DA',
    borderRadius: 6,
    gap: 8,
  },
  portLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioIcon: {
    marginRight: 4,
  },
  portLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  portInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#B0E0E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    color: '#000',
    borderRadius: 4,
  },
  deletePortButton: {
    padding: 2,
  },
  parameterSection: {
    backgroundColor: '#E6F8FF',
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
  },
  addParameterButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 16,
  },
  addParameterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
});