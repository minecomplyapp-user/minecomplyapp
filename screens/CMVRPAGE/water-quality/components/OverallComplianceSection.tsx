import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { OverallComplianceSectionProps } from '../types/OverallComplianceSection.types';
import { styles } from '../styles/OverallComplianceSection.styles';

export const OverallComplianceSection: React.FC<OverallComplianceSectionProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✓</Text>
        </View>
        <Text style={styles.label}>Overall Compliance Assessment</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="TYPE HERE..."
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
};