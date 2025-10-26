import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type OverallComplianceSectionProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export const OverallComplianceSection: React.FC<OverallComplianceSectionProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Overall Compliance Assessment:</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="TYPE HERE..."
        placeholderTextColor="#B0B0B0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ba3f48',
    marginBottom: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '500',
    borderRadius: 8,
  },
});
