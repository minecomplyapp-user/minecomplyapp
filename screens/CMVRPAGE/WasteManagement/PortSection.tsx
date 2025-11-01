import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PortSectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
  N_A: boolean;
};

type PortSectionProps = {
  data: PortSectionData;
  onUpdate: (field: keyof PortSectionData, value: boolean) => void;
};

export const PortSection: React.FC<PortSectionProps> = ({ data, onUpdate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="boat" size={20} color='#02217C' />
        </View>
        <Text style={styles.title}>Port</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => onUpdate('N_A', !data.N_A)}
        >
          <View style={[styles.checkbox, data.N_A && styles.checkboxChecked]}>
            {data.N_A && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.checkboxLabel}>N/A</Text>
        </TouchableOpacity>

        <View style={[styles.radioSection, data.N_A && styles.disabledSection]}>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => onUpdate('noSignificantImpact', true)}
            disabled={data.N_A}
          >
            <View style={[
              styles.radio,
              data.noSignificantImpact && !data.N_A && styles.radioChecked
            ]}>
              {data.noSignificantImpact && !data.N_A && <View style={styles.radioInner} />}
            </View>
            <Text style={[styles.radioLabel, data.N_A && styles.disabledText]}>
              No significant impact to the environment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => onUpdate('generateTable', true)}
            disabled={data.N_A}
          >
            <View style={[
              styles.radio,
              data.generateTable && !data.N_A && styles.radioChecked
            ]}>
              {data.generateTable && !data.N_A && <View style={styles.radioInner} />}
            </View>
            <Text style={[styles.radioLabel, data.N_A && styles.disabledText]}>
              Generate table
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#BFDBFE',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#02217C',
  },
  content: {
    padding: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  radioSection: {
    marginTop: 8,
  },
  disabledSection: {
    opacity: 0.5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioChecked: {
    borderColor: '#02217C',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#02217C',
  },
  radioLabel: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
    fontWeight: '500',
  },
  disabledText: {
    color: '#94A3B8',
  },
});

export default PortSection;