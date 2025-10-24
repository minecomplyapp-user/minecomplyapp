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
          <Ionicons name="trash-outline" size={14} color="#B00020" />
        </TouchableOpacity>
      )}

      <View style={styles.parameterRow}>
        <Text style={styles.parameterLabel}>
          Parameter{index !== undefined ? ` ${index + 1}` : ''}:
        </Text>
        {showNA && (
          <View style={styles.naContainer}>
            <TouchableOpacity style={styles.naCheckbox} onPress={onNAChange}>
              {naChecked && <Ionicons name="checkmark" size={14} color="#000" />}
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
        placeholderTextColor="#B0B0B0"
      />

      {/* Results Section */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Results:</Text>

        <View style={styles.resultsGrid}>
          <View style={styles.resultColumn}>
            <Text style={styles.columnHeader}>in SMR</Text>
            <Text style={styles.fieldLabel}>Current:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.currentSMR}
              onChangeText={(text) => onUpdate('currentSMR', text)}
              placeholder="Type here..."
              placeholderTextColor="#B0B0B0"
            />
            <Text style={styles.fieldLabel}>Previous:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.previousSMR}
              onChangeText={(text) => onUpdate('previousSMR', text)}
              placeholder="Type here..."
              placeholderTextColor="#B0B0B0"
            />
          </View>

          <View style={styles.resultColumn}>
            <Text style={styles.columnHeader}>MMT Confirmatory{'\n'}Sampling</Text>
            <Text style={styles.fieldLabel}>Current:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.currentMMT}
              onChangeText={(text) => onUpdate('currentMMT', text)}
              placeholder="Type here..."
              placeholderTextColor="#B0B0B0"
            />
            <Text style={styles.fieldLabel}>Previous:</Text>
            <TextInput
              style={styles.resultInput}
              value={data.previousMMT}
              onChangeText={(text) => onUpdate('previousMMT', text)}
              placeholder="Type here..."
              placeholderTextColor="#B0B0B0"
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
        placeholderTextColor="#B0B0B0"
        multiline
        numberOfLines={3}
      />

      {/* EQPL Section */}
      <Text style={styles.sectionLabel}>
        EQPL (Environmental Quality Performance Level):
      </Text>

      <Text style={styles.fieldLabel}>Red Flag:</Text>
      <TextInput
        style={styles.input}
        value={data.eqplRedFlag}
        onChangeText={(text) => onUpdate('eqplRedFlag', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
      />

      <Text style={styles.fieldLabel}>Action:</Text>
      <TextInput
        style={styles.input}
        value={data.action}
        onChangeText={(text) => onUpdate('action', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
      />

      <Text style={styles.fieldLabel}>Limit{'\n'}(DENR DAO PM 2.5):</Text>
      <TextInput
        style={styles.input}
        value={data.limitPM25}
        onChangeText={(text) => onUpdate('limitPM25', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
      />

      {/* Remarks */}
      <Text style={styles.sectionLabel}>REMARKS:</Text>
      <TextInput
        style={styles.textInput}
        value={data.remarks}
        onChangeText={(text) => onUpdate('remarks', text)}
        placeholder="Type here..."
        placeholderTextColor="#B0B0B0"
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
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    zIndex: 10,
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  naContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  naCheckbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  naLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  parameterInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: 'row',
  },
  resultColumn: {
    flex: 1,
    marginRight: 8,
  },
  columnHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
    marginBottom: 6,
  },
  resultInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    marginTop: 8,
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});