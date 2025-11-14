import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlantSectionProps } from '../types';
import { plantSectionStyles as styles } from '../styles';

export const PlantSection: React.FC<PlantSectionProps> = ({ data, onUpdate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={20} color='#02217C' />
        </View>
        <Text style={styles.title}>Plant</Text>
      </View>

      <View style={styles.content}>
        {/* N/A Checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => onUpdate('N_A', !data.N_A)}
        >
          <View style={[styles.checkbox, data.N_A && styles.checkboxChecked]}>
            {data.N_A && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text style={styles.checkboxLabel}>N/A</Text>
        </TouchableOpacity>

        {/* Radio options */}
        <View style={[styles.radioSection, data.N_A && styles.disabledSection]}>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => !data.N_A && onUpdate('noSignificantImpact', true)}
            disabled={data.N_A}
          >
            <View style={[styles.radio, data.noSignificantImpact && !data.N_A && styles.radioChecked]}>
              {data.noSignificantImpact && !data.N_A && <View style={styles.radioInner} />}
            </View>
            <Text style={[styles.radioLabel, data.N_A && styles.disabledText]}>
              No significant impact to the environment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => !data.N_A && onUpdate('generateTable', true)}
            disabled={data.N_A}
          >
            <View style={[styles.radio, data.generateTable && !data.N_A && styles.radioChecked]}>
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

export default PlantSection;