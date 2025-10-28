// src/screens/ecc/components/ActionButtons.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActionButtons({ ecc }) {
  const { saveAsDraft, generateReport } = ecc;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.draft]} onPress={saveAsDraft}>
        <Ionicons name="save-outline" color="#fff" size={18} />
        <Text style={styles.text}>Save as Draft</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.generate]} onPress={generateReport}>
        <Ionicons name="document-text-outline" color="#fff" size={18} />
        <Text style={styles.text}>Generate Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 20 },
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, flex: 1, marginHorizontal: 4,
  },
  draft: { backgroundColor: '#6b7280' },
  generate: { backgroundColor: '#16a34a' },
  text: { color: '#fff', fontWeight: '600', marginLeft: 6 },
});
