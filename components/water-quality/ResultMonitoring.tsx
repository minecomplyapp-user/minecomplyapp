// components/water-quality/ResultMonitoring.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type ResultMonitoringProps = {
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  onResultTypeChange: (value: string) => void;
  onTSSChange: (field: 'tssCurrent' | 'tssPrevious', value: string) => void;
};

export const ResultMonitoring: React.FC<ResultMonitoringProps> = ({
  resultType,
  tssCurrent,
  tssPrevious,
  onResultTypeChange,
  onTSSChange,
}) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.resultLabelItalic}>Result:</Text>
        <Text style={styles.resultLabel}>Internal Monitoring</Text>
        <TextInput
          style={styles.monthInput}
          value={resultType}
          onChangeText={onResultTypeChange}
          placeholder="Month..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.tssRow}>
        <TouchableOpacity style={styles.checkbox}>
          <View style={styles.checkboxEmpty} />
        </TouchableOpacity>
        <View style={styles.tssContent}>
          <Text style={styles.tssName}>TSS 01</Text>
          <View style={styles.tssInputs}>
            <View style={styles.tssInputGroup}>
              <Text style={styles.tssInputLabel}>Current :</Text>
              <TextInput
                style={styles.tssInput}
                value={tssCurrent}
                onChangeText={(text) => onTSSChange('tssCurrent', text)}
                placeholder="Type here..."
                placeholderTextColor="#B0B0B0"
              />
            </View>
            <View style={styles.tssInputGroup}>
              <Text style={styles.tssInputLabel}>Previous:</Text>
              <TextInput
                style={styles.tssInput}
                value={tssPrevious}
                onChangeText={(text) => onTSSChange('tssPrevious', text)}
                placeholder="Type here..."
                placeholderTextColor="#B0B0B0"
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabelItalic: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#000',
    marginRight: 6,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginRight: 6,
  },
  monthInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    width: 70,
    borderRadius: 6,
  },
  tssRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxEmpty: {
    width: 0,
    height: 0,
  },
  tssContent: {
    flex: 1,
    marginLeft: 8,
  },
  tssName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  tssInputs: {
    flexDirection: 'row',
  },
  tssInputGroup: {
    flex: 1,
    marginRight: 12,
  },
  tssInputLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  tssInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    borderRadius: 6,
  },
});