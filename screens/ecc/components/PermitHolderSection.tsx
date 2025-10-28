// src/screens/ecc/components/PermitHolderSection.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function PermitHolderSection({ ecc }) {
  const { formData, updateFormData } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Permit Holder’s Details</Text>

      <Text style={styles.label}>Name of Permit Holder</Text>
      <TextInput
        value={formData.permitHolderName}
        onChangeText={v => updateFormData('permitHolderName', v)}
        style={styles.input}
      />

      <Text style={styles.label}>Designation</Text>
      <TextInput
        value={formData.permitHolderDesignation}
        onChangeText={v => updateFormData('permitHolderDesignation', v)}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  label: { fontSize: 14, fontWeight: '500', marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 8, fontSize: 14,
  },
});
