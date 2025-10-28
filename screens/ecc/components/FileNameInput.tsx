import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FileNameInput({ ecc }) {
  const { fileName, handleSetFileName, errors } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.label}>File Name</Text>
      <TextInput
        value={fileName}
        onChangeText={handleSetFileName}
        placeholder="Enter file name"
        style={[styles.input, errors.fileName && styles.error]}
      />
      {errors.fileName && <Text style={styles.errorText}>File name is required</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 8, fontSize: 14,
  },
  error: { borderColor: '#e11d48' },
  errorText: { color: '#e11d48', fontSize: 12, marginTop: 4 },
});
