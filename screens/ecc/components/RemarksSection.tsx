// src/screens/ecc/components/RemarksSection.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function RemarksSection({ ecc }) {
  const { formData, updateFormData } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Remarks</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={formData.remarks}
        onChangeText={v => updateFormData('remarks', v)}
        placeholder="Enter remarks or observations..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  textArea: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, fontSize: 14, textAlignVertical: 'top',
  },
});
