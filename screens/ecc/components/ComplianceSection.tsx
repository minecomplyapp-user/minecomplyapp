// src/screens/ecc/components/ComplianceSection.tsx
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function ComplianceSection({ ecc }) {
  const { complianceConditions, updateFormData } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Compliance Evaluation</Text>
      {complianceConditions.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.label}>{item.condition}</Text>
          <Switch
            value={item.compliant}
            onValueChange={v => {
              const updated = [...complianceConditions];
              updated[index].compliant = v;
              updateFormData('complianceConditions', updated);
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 6,
  },
  label: { fontSize: 14, fontWeight: '500' },
});
