import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ParameterData = {
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  thirdPartyTesting: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
};

type ParameterFormProps = {
  data: ParameterData;
  onUpdate: (field: keyof ParameterData, value: string) => void;
  showNA?: boolean;
  naChecked?: boolean;
  onNAChange?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  index?: number;
  showAdditionalFields?: boolean;
  dateTime?: string;
  weatherWind?: string;
  explanation?: string;
  onDateTimeChange?: (text: string) => void;
  onWeatherWindChange?: (text: string) => void;
  onExplanationChange?: (text: string) => void;
};

export const ParameterForm: React.FC<ParameterFormProps> = ({
  data,
  onUpdate,
  showNA = false,
  naChecked = false,
  onNAChange,
  showDelete = false,
  onDelete,
  index,
  showAdditionalFields = false,
  dateTime = '',
  weatherWind = '',
  explanation = '',
  onDateTimeChange,
  onWeatherWindChange,
  onExplanationChange,
}) => {
  return (
    <View style={styles.container}>
      {showDelete && onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          accessibilityLabel={`Delete parameter ${index !== undefined ? index + 1 : ''}`}
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
        </TouchableOpacity>
      )}

      <View style={styles.parameterRow}>
        <Text style={styles.parameterLabel}>
          Parameter{index !== undefined ? ` ${index + 1}` : ''}:
        </Text>
        {showNA && (
          <View style={styles.naContainer}>
            <TouchableOpacity 
              style={[styles.naCheckbox, naChecked && styles.naCheckboxChecked]} 
              onPress={onNAChange}
            >
              {naChecked && <Ionicons name="checkmark" size={16} color="#2563EB" />}
            </TouchableOpacity>
            <Text style={styles.naLabel}>N/A</Text>
          </View>
        )}
      </View>

      <TextInput
        style={styles.parameterInput}
        value={data.parameter}
        onChangeText={(text) => onUpdate('parameter', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
      />

      {/* Results Section */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Results:</Text>

        <View style={styles.resultsGrid}>
          <View style={styles.resultColumn}>
            <View style={styles.columnHeaderContainer}>
              <Text style={styles.columnHeader}>in SMR</Text>
            </View>
            <Text style={styles.fieldLabel}>Current:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.currentSMR}
              onChangeText={(text) => onUpdate('currentSMR', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.fieldLabel}>Previous:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.previousSMR}
              onChangeText={(text) => onUpdate('previousSMR', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.resultColumn}>
            <View style={styles.columnHeaderContainer}>
              <Text style={styles.columnHeader}>MMT Confirmatory{'\n'}Sampling</Text>
            </View>
            <Text style={styles.fieldLabel}>Current:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.currentMMT}
              onChangeText={(text) => onUpdate('currentMMT', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.fieldLabel}>Previous:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.previousMMT}
              onChangeText={(text) => onUpdate('previousMMT', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>

      {/* Third Party Testing */}
      <Text style={styles.sectionLabel}>
        Third Party Testing:{'\n'}
        <Text style={styles.subLabel}>(If applicable)</Text>
      </Text>
      <TextInput
        style={styles.textInput}
        value={data.thirdPartyTesting}
        onChangeText={(text) => onUpdate('thirdPartyTesting', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
      />

      {/* EQPL Section */}
      <View style={styles.eqplSection}>
        <Text style={styles.eqplTitle}>
          EQPL (Environmental Quality Performance Level)
        </Text>

        <Text style={styles.fieldLabel}>Red Flag:</Text>
        <TextInput
          style={styles.input}
          value={data.eqplRedFlag}
          onChangeText={(text) => onUpdate('eqplRedFlag', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.fieldLabel}>Action:</Text>
        <TextInput
          style={styles.input}
          value={data.action}
          onChangeText={(text) => onUpdate('action', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.fieldLabel}>Limit{'\n'}(DENR DAO PM 2.5):</Text>
        <TextInput
          style={styles.input}
          value={data.limitPM25}
          onChangeText={(text) => onUpdate('limitPM25', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Remarks */}
      <Text style={styles.sectionLabel}>REMARKS:</Text>
      <TextInput
        style={styles.textInput}
        value={data.remarks}
        onChangeText={(text) => onUpdate('remarks', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
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
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  parameterLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#02217C',
  },
  naContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  naCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#02217C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  naCheckboxChecked: {
    backgroundColor: '#EFF6FF',
  },
  naLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  parameterInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    marginBottom: 20,
    color: '#1E293B',
  },
  resultsContainer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#02217C',
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  resultColumn: {
    flex: 1,
  },
  columnHeaderContainer: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  columnHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#02217C',
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8,
    marginBottom: 6,
  },
  resultInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 8,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  eqplSection: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eqplTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#02217C',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    marginBottom: 12,
    color: '#1E293B',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
    color: '#1E293B',
  },
});