import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type QuarrySectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
};

type QuarrySectionProps = {
  data: QuarrySectionData;
  onUpdate: (field: keyof QuarrySectionData, value: boolean) => void;
};

export const QuarrySection: React.FC<QuarrySectionProps> = ({ data, onUpdate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="hammer" size={20} color='#02217C' />
        </View>
        <Text style={styles.title}>Quarry</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.radioRow}
          onPress={() => onUpdate('noSignificantImpact', true)}
        >
          <View style={[styles.radio, data.noSignificantImpact && styles.radioChecked]}>
            {data.noSignificantImpact && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>No significant impact to the environment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioRow}
          onPress={() => onUpdate('generateTable', true)}
        >
          <View style={[styles.radio, data.generateTable && styles.radioChecked]}>
            {data.generateTable && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>Generate table</Text>
        </TouchableOpacity>
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
});

export default QuarrySection;