// src/screens/ecc/components/MonitoringData.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function MonitoringData({ ecc }) {
  const { monitoringConditions, updateFormData } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Monitoring Data</Text>
      {monitoringConditions.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.label}>{item.parameter}</Text>
          <TextInput
            style={styles.input}
            placeholder="Result"
            value={item.result}
            onChangeText={v => {
              const updated = [...monitoringConditions];
              updated[index].result = v;
              updateFormData('monitoringConditions', updated);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks"
            value={item.remarks}
            onChangeText={v => {
              const updated = [...monitoringConditions];
              updated[index].remarks = v;
              updateFormData('monitoringConditions', updated);
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
  row: { marginBottom: 8 },
  label: { fontWeight: '600', fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 8, fontSize: 13, marginBottom: 6,
  },
});
