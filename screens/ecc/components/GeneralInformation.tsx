import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GeneralInformation({ ecc }) {
  const { formData, updateFormData, captureGPS } = ecc;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>General Information</Text>

      <Text style={styles.label}>Company Name</Text>
      <TextInput
        value={formData.companyName}
        onChangeText={v => updateFormData('companyName', v)}
        style={styles.input}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        value={formData.location}
        onChangeText={v => updateFormData('location', v)}
        style={styles.input}
      />

      <TouchableOpacity style={styles.gpsButton} onPress={captureGPS}>
        <Ionicons name="location-outline" color="#fff" size={18} />
        <Text style={styles.gpsText}>Capture GPS</Text>
      </TouchableOpacity>

      {formData.gps ? <Text style={styles.gpsCoord}>{formData.gps}</Text> : null}
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
  gpsButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#3b82f6', borderRadius: 8, padding: 10, marginTop: 10,
  },
  gpsText: { color: '#fff', fontWeight: '600', marginLeft: 6 },
  gpsCoord: { color: '#333', marginTop: 6, fontSize: 13 },
});
