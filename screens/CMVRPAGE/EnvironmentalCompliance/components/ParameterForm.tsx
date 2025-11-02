import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ParameterFormProps } from '../types';
import { parameterFormStyles as styles } from '../styles';

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
          <Ionicons name="trash-outline" size={20} color="#DC2626" />
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
        style={[styles.parameterInput, naChecked && styles.disabledInput]}
        value={data.parameter}
        onChangeText={(text) => onUpdate('parameter', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        editable={!naChecked}
      />

      {/* Results Section */}
      <View style={[styles.resultsContainer, naChecked && styles.disabledSection]}>
        <Text style={styles.resultsTitle}>Results:</Text>

        <View style={styles.resultsGrid}>
          <View style={styles.resultColumn}>
            <View style={styles.columnHeaderContainer}>
              <Text style={styles.columnHeader}>in SMR</Text>
            </View>
            <Text style={styles.fieldLabel}>Current:</Text>
            <TextInput
              style={[styles.resultInput, naChecked && styles.disabledInput]}
              value={data.currentSMR}
              onChangeText={(text) => onUpdate('currentSMR', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              editable={!naChecked}
            />
            <Text style={styles.fieldLabel}>Previous:</Text>
            <TextInput
              style={[styles.resultInput, naChecked && styles.disabledInput]}
              value={data.previousSMR}
              onChangeText={(text) => onUpdate('previousSMR', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              editable={!naChecked}
            />
          </View>

          <View style={styles.resultColumn}>
            <View style={styles.columnHeaderContainer}>
              <Text style={styles.columnHeader}>MMT Confirmatory{'\n'}Sampling</Text>
            </View>
            <Text style={styles.fieldLabel}>Current:</Text>
            <TextInput
              style={[styles.resultInput, naChecked && styles.disabledInput]}
              value={data.currentMMT}
              onChangeText={(text) => onUpdate('currentMMT', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              editable={!naChecked}
            />
            <Text style={styles.fieldLabel}>Previous:</Text>
            <TextInput
              style={[styles.resultInput, naChecked && styles.disabledInput]}
              value={data.previousMMT}
              onChangeText={(text) => onUpdate('previousMMT', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              editable={!naChecked}
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
        style={[styles.textInput, naChecked && styles.disabledInput]}
        value={data.thirdPartyTesting}
        onChangeText={(text) => onUpdate('thirdPartyTesting', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        editable={!naChecked}
      />

      {/* EQPL Section */}
      <View style={[styles.eqplSection, naChecked && styles.disabledSection]}>
        <Text style={styles.eqplTitle}>
          EQPL (Environmental Quality Performance Level)
        </Text>

        <Text style={styles.fieldLabel}>Red Flag:</Text>
        <TextInput
          style={[styles.input, naChecked && styles.disabledInput]}
          value={data.eqplRedFlag}
          onChangeText={(text) => onUpdate('eqplRedFlag', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
          editable={!naChecked}
        />

        <Text style={styles.fieldLabel}>Action:</Text>
        <TextInput
          style={[styles.input, naChecked && styles.disabledInput]}
          value={data.action}
          onChangeText={(text) => onUpdate('action', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
          editable={!naChecked}
        />

        <Text style={styles.fieldLabel}>Limit{'\n'}(DENR DAO PM 2.5):</Text>
        <TextInput
          style={[styles.input, naChecked && styles.disabledInput]}
          value={data.limitPM25}
          onChangeText={(text) => onUpdate('limitPM25', text)}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
          editable={!naChecked}
        />
      </View>

      {/* Remarks */}
      <Text style={styles.sectionLabel}>REMARKS:</Text>
      <TextInput
        style={[styles.textInput, naChecked && styles.disabledInput]}
        value={data.remarks}
        onChangeText={(text) => onUpdate('remarks', text)}
        placeholder="Type here..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        editable={!naChecked}
      />
    </View>
  );
};