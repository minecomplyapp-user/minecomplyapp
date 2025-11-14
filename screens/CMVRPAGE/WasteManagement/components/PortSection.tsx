import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PortSectionProps } from '../types';
import { PortSectionStyles as styles } from '../styles';


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


export default PortSection;