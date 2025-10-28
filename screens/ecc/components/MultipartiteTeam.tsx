import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function MultipartiteTeam({ ecc }) {
  const { formData, updateFormData } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Multipartite Team</Text>

      <Text style={styles.label}>Contact Person</Text>
      <TextInput
        value={formData.contactPerson}
        onChangeText={v => updateFormData('contactPerson', v)}
        style={styles.input}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        value={formData.email}
        onChangeText={v => updateFormData('email', v)}
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
