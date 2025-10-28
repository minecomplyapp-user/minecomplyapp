// src/screens/ecc/components/RecommendationsSection.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function RecommendationsSection({ ecc }) {
  const { formData, updateFormData } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Recommendations</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={formData.recommendations}
        onChangeText={v => updateFormData('recommendations', v)}
        placeholder="Write your recommendations..."
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
