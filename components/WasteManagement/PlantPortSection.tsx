import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WasteEntryCard } from './WasteEntryCard';

type WasteEntry = {
  id: string;
  handling: string;
  storage: string;
  disposal: string;
};

type PlantPortSectionData = {
  typeOfWaste: string;
  eccEpepCommitments: WasteEntry[];
  isAdequate: 'YES' | 'NO' | null;
  previousRecord: string;
  q22025GeneratedHazardWastes: string;
};

type PlantPortSectionProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  data: PlantPortSectionData;
  onUpdateData: (field: keyof PlantPortSectionData, value: any) => void;
  onAddWaste: () => void;
  onUpdateWaste: (id: string, field: keyof Omit<WasteEntry, 'id'>, value: string) => void;
  onRemoveWaste: (id: string) => void;
};

export const PlantPortSection: React.FC<PlantPortSectionProps> = ({
  title,
  icon,
  data,
  onUpdateData,
  onAddWaste,
  onUpdateWaste,
  onRemoveWaste,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#1E40AF" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Type of Waste</Text>
          <TextInput
            style={styles.input}
            value={data.typeOfWaste}
            onChangeText={(text) => onUpdateData('typeOfWaste', text)}
            placeholder="Select or enter waste type"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.subsectionHeader}>
          <Text style={styles.subsectionTitle}>ECC/EPEP Commitments</Text>
        </View>

        {data.eccEpepCommitments.map((entry, index) => (
          <WasteEntryCard
            key={entry.id}
            entry={entry}
            index={index}
            canDelete={data.eccEpepCommitments.length > 1}
            onUpdate={onUpdateWaste}
            onDelete={onRemoveWaste}
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={onAddWaste}>
          <Ionicons name="add-circle" size={20} color="#1E40AF" />
          <Text style={styles.addButtonText}>Add More Waste</Text>
        </TouchableOpacity>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Is it Adequate?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onUpdateData('isAdequate', 'YES')}
            >
              <View style={[styles.radio, data.isAdequate === 'YES' && styles.radioChecked]}>
                {data.isAdequate === 'YES' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>YES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onUpdateData('isAdequate', 'NO')}
            >
              <View style={[styles.radio, data.isAdequate === 'NO' && styles.radioChecked]}>
                {data.isAdequate === 'NO' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Previous Record</Text>
          <TextInput
            style={styles.input}
            value={data.previousRecord}
            onChangeText={(text) => onUpdateData('previousRecord', text)}
            placeholder="Enter previous record"
            placeholderTextColor="#94A3B8"
          />
          <Text style={styles.helperText}>Total</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Q2 2025 Generated Hazard Wastes</Text>
          <TextInput
            style={styles.input}
            value={data.q22025GeneratedHazardWastes}
            onChangeText={(text) => onUpdateData('q22025GeneratedHazardWastes', text)}
            placeholder="Enter generated hazard wastes"
            placeholderTextColor="#94A3B8"
          />
          <Text style={styles.helperText}>Prev record + Q2 2025 Generated HW</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#BFDBFE',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
  },
  content: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    fontStyle: 'italic',
  },
  subsectionHeader: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioChecked: {
    borderColor: '#1E40AF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E40AF',
  },
  radioLabel: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
});

export default PlantPortSection;