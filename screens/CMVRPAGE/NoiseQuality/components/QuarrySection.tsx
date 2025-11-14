import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuarrySectionProps } from '../types';
import { quarrySectionStyles as styles } from '../styles';

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

export default QuarrySection;