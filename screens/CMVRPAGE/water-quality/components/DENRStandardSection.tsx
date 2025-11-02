import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { DENRStandardSectionProps } from '../types/DENRStandardSection.types';
import { styles } from '../styles/DENRStandardSection.styles';

export const DENRStandardSection: React.FC<DENRStandardSectionProps> = ({
  redFlag,
  action,
  limit,
  onInputChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DENR Standard</Text>
      
      <View style={styles.inputRow}>
        {/* Red Flag */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.bullet} />
            <Text style={styles.inputLabel}>Red Flag:</Text>
          </View>
          <TextInput
            style={styles.input}
            value={redFlag}
            onChangeText={(text) => onInputChange('eqplRedFlag', text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Action */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.bullet} />
            <Text style={styles.inputLabel}>Action:</Text>
          </View>
          <TextInput
            style={styles.input}
            value={action}
            onChangeText={(text) => onInputChange('action', text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Limit */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.bullet} />
            <Text style={styles.inputLabel}>Limit (mg/L):</Text>
          </View>
          <TextInput
            style={styles.input}
            value={limit}
            onChangeText={(text) => onInputChange('limit', text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>
    </View>
  );
};