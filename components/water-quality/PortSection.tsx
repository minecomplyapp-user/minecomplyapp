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
      {/* Port Header */}
      <View style={styles.portHeaderContainer}>
        <View style={styles.portLabelContainer}>
          <Ionicons name="location" size={16} color="#2563EB" style={styles.icon} />
          <Text style={styles.portLabel}>Port</Text>
        </View>
        <TextInput
          style={styles.portInput}
          value={port.portName}
          onChangeText={(text) => onUpdate(port.id, 'portName', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity
          style={styles.deletePortButton}
          onPress={() => onDelete(port.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
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
          <Ionicons name="add-circle-outline" size={18} color="#2563EB" />
          <Text style={styles.addParameterText}>Add More Parameter</Text>
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
    backgroundColor: '#DBEAFE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 10,
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  portLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: 2,
  },
  portLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  portInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1E293B',
    borderRadius: 6,
  },
  deletePortButton: {
    padding: 4,
  },
  parameterSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addParameterButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addParameterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});
