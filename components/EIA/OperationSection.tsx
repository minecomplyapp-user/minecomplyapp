import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from './RadioButton';
import { MitigatingMeasureForm, MitigatingMeasure } from './MitigatingMeasureForm';

export interface OperationSection {
  title: string;
  isNA: boolean;
  measures: MitigatingMeasure[];
}

interface OperationSectionProps {
  section: OperationSection;
  onNAToggle: () => void;
  onMeasureUpdate: (measureId: string, field: keyof MitigatingMeasure, value: any) => void;
  onAddMeasure: () => void;
}

export const OperationSectionComponent: React.FC<OperationSectionProps> = ({
  section,
  onNAToggle,
  onMeasureUpdate,
  onAddMeasure,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{section.title}</Text>
        </View>
        <View style={styles.naContainer}>
          <RadioButton selected={section.isNA} onPress={onNAToggle} />
          <Text style={styles.naText}>N/A</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>Mitigating Measures/ Control Strategies</Text>

      {section.measures.map((measure, index) => (
        <MitigatingMeasureForm
          key={measure.id}
          measure={measure}
          index={index}
          onUpdate={(field, value) => onMeasureUpdate(measure.id, field, value)}
        />
      ))}

      <TouchableOpacity style={styles.addButton} onPress={onAddMeasure}>
        <Text style={styles.addButtonText}>+ Add More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5E7E7',
    borderWidth: 1,
    borderColor: '#E5C7C7',
    borderRadius: 0,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleBadge: {
    backgroundColor: '#D8D8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  naContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  naText: {
    fontSize: 14,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#d1d5db',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 12,
    color: '#374151',
  },
});