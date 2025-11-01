import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NoiseParameter = {
  id: string;
  parameter: string;
  isParameterNA: boolean;
  currentInSABR: string;
  previousInSABR: string;
  mmtCurrent: string;
  mmtPrevious: string;
  redFlag: string;
  isRedFlagChecked: boolean;
  action: string;
  isActionChecked: boolean;
  limit: string;
  isLimitChecked: boolean;
};

type NoiseParameterCardProps = {
  parameter: NoiseParameter;
  index: number;
  canDelete: boolean;
  onUpdate: (id: string, field: keyof Omit<NoiseParameter, 'id'>, value: string | boolean) => void;
  onDelete: (id: string) => void;
};

export const NoiseParameterCard: React.FC<NoiseParameterCardProps> = ({
  parameter,
  index,
  canDelete,
  onUpdate,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{index + 1}</Text>
          </View>
          <Text style={styles.title}>Parameter</Text>
        </View>
        {canDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(parameter.id)}>
            <Ionicons name="trash" size={20} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>

      {/* Parameter Name with N/A */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelWithAction}>
          <Text style={styles.label}>Parameter Name</Text>
          <TouchableOpacity
            style={styles.naButton}
            onPress={() => onUpdate(parameter.id, 'isParameterNA', !parameter.isParameterNA)}
          >
            <View style={[styles.checkbox, parameter.isParameterNA && styles.checkboxChecked]}>
              {parameter.isParameterNA && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text style={styles.naText}>N/A</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, parameter.isParameterNA && styles.disabledInput]}
          value={parameter.parameter}
          onChangeText={(text) => onUpdate(parameter.id, 'parameter', text)}
          placeholder="Enter parameter name"
          placeholderTextColor="#94A3B8"
          editable={!parameter.isParameterNA}
        />
      </View>

      {/* Results Section */}
      <View style={styles.subsectionHeader}>
        <Text style={styles.subsectionTitle}>Results</Text>
      </View>

      <View style={styles.resultsRow}>
        <View style={styles.resultColumn}>
          <Text style={styles.columnLabel}>IN SABR</Text>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Current</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.currentInSABR}
              onChangeText={(text) => onUpdate(parameter.id, 'currentInSABR', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Previous</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.previousInSABR}
              onChangeText={(text) => onUpdate(parameter.id, 'previousInSABR', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
        </View>

        <View style={styles.resultColumn}>
          <Text style={styles.columnLabel}>MMT SAMPLING</Text>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Current</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.mmtCurrent}
              onChangeText={(text) => onUpdate(parameter.id, 'mmtCurrent', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
          <View style={styles.resultField}>
            <Text style={styles.resultLabel}>Previous</Text>
            <TextInput
              style={[styles.smallInput, parameter.isParameterNA && styles.disabledInput]}
              value={parameter.mmtPrevious}
              onChangeText={(text) => onUpdate(parameter.id, 'mmtPrevious', text)}
              placeholder="Value"
              placeholderTextColor="#94A3B8"
              editable={!parameter.isParameterNA}
            />
          </View>
        </View>
      </View>

      {/* EQPL Section */}
      <View style={styles.subsectionHeader}>
        <Text style={styles.subsectionTitle}>EQPL (Environmental Quality Performance Level)</Text>
      </View>

      {/* Red Flag */}
      <View style={styles.eqplField}>
        <View style={styles.eqplRow}>
          <TouchableOpacity
            style={styles.eqplCheckbox}
            disabled={parameter.isParameterNA}
            onPress={() => onUpdate(parameter.id, 'isRedFlagChecked', !parameter.isRedFlagChecked)}
          >
            <View style={[styles.checkbox, parameter.isRedFlagChecked && styles.checkboxChecked]}>
              {parameter.isRedFlagChecked && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text style={styles.eqplLabel}>Red Flag</Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              (!parameter.isRedFlagChecked || parameter.isParameterNA) && styles.disabledInput,
            ]}
            value={parameter.redFlag}
            onChangeText={(text) => onUpdate(parameter.id, 'redFlag', text)}
            placeholder="Enter value"
            placeholderTextColor="#94A3B8"
            editable={parameter.isRedFlagChecked && !parameter.isParameterNA}
          />
        </View>
      </View>

      {/* Action */}
      <View style={styles.eqplField}>
        <View style={styles.eqplRow}>
          <TouchableOpacity
            style={styles.eqplCheckbox}
            disabled={parameter.isParameterNA}
            onPress={() => onUpdate(parameter.id, 'isActionChecked', !parameter.isActionChecked)}
          >
            <View style={[styles.checkbox, parameter.isActionChecked && styles.checkboxChecked]}>
              {parameter.isActionChecked && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text style={styles.eqplLabel}>Action</Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              (!parameter.isActionChecked || parameter.isParameterNA) && styles.disabledInput,
            ]}
            value={parameter.action}
            onChangeText={(text) => onUpdate(parameter.id, 'action', text)}
            placeholder="Enter value"
            placeholderTextColor="#94A3B8"
            editable={parameter.isActionChecked && !parameter.isParameterNA}
          />
        </View>
      </View>

      {/* Limit */}
      <View style={styles.eqplField}>
        <View style={styles.eqplRow}>
          <TouchableOpacity
            style={styles.eqplCheckbox}
            disabled={parameter.isParameterNA}
            onPress={() => onUpdate(parameter.id, 'isLimitChecked', !parameter.isLimitChecked)}
          >
            <View style={[styles.checkbox, parameter.isLimitChecked && styles.checkboxChecked]}>
              {parameter.isLimitChecked && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text style={styles.eqplLabel}>Limit (DENR std.)</Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              styles.flexInput,
              (!parameter.isLimitChecked || parameter.isParameterNA) && styles.disabledInput,
            ]}
            value={parameter.limit}
            onChangeText={(text) => onUpdate(parameter.id, 'limit', text)}
            placeholder="Enter value"
            placeholderTextColor="#94A3B8"
            editable={parameter.isLimitChecked && !parameter.isParameterNA}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: '#02217C',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#02217C',
  },
  deleteButton: {
    padding: 6,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  labelWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  naButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  naText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
    borderColor: '#E2E8F0',
  },
  subsectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  resultColumn: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultField: {
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  smallInput: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  eqplField: {
    marginBottom: 12,
  },
  eqplRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eqplCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 140,
  },
  eqplLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  flexInput: {
    flex: 1,
  },
});

export default NoiseParameterCard;
