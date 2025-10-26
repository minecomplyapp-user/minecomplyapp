// components/water-quality/DENRStandardSection.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type DENRStandardSectionProps = {
  redFlag: string;
  action: string;
  limit: string;
  onInputChange: (field: 'eqplRedFlag' | 'action' | 'limit', value: string) => void;
};

export const DENRStandardSection: React.FC<DENRStandardSectionProps> = ({
  redFlag,
  action,
  limit,
  onInputChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DENR Standard:</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <TouchableOpacity style={styles.checkbox}>
              <View style={styles.checkboxEmpty} />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Red Flag:</Text>
          </View>
          <TextInput
            style={styles.input}
            value={redFlag}
            onChangeText={(text) => onInputChange('eqplRedFlag', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <TouchableOpacity style={styles.checkbox}>
              <View style={styles.checkboxEmpty} />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Action:</Text>
          </View>
          <TextInput
            style={styles.input}
            value={action}
            onChangeText={(text) => onInputChange('action', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <TouchableOpacity style={styles.checkbox}>
              <View style={styles.checkboxEmpty} />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Limit (mg/L):</Text>
          </View>
          <TextInput
            style={styles.input}
            value={limit}
            onChangeText={(text) => onInputChange('limit', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputGroup: {
    flex: 1,
    minWidth: 200,
    marginRight: 12,
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    borderRadius: 6,
  },
});