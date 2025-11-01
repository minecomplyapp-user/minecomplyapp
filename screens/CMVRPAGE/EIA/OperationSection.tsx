import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
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
    <View style={[styles.container, section.isNA && styles.containerDisabled]}>
      <View style={styles.header}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{section.title}</Text>
        </View>
        <View style={styles.naContainer}>
          <RadioButton selected={section.isNA} onPress={onNAToggle} />
          <Text style={styles.naText}>N/A</Text>
        </View>
      </View>

      <Text style={[styles.subsectionTitle, section.isNA && styles.textDisabled]}>
        Mitigating Measures / Control Strategies
      </Text>

      {section.measures.map((measure, index) => (
        <MitigatingMeasureForm
          key={measure.id}
          measure={measure}
          index={index}
          onUpdate={(field, value) => onMeasureUpdate(measure.id, field, value)}
          disabled={section.isNA}
        />
      ))}

      <TouchableOpacity 
        style={[styles.addButton, section.isNA && styles.addButtonDisabled]} 
        onPress={onAddMeasure}
        disabled={section.isNA}
      >
        <Plus size={16} color={section.isNA ? '#94A3B8' : '#02217C'} />
        <Text style={[styles.addButtonText, section.isNA && styles.textDisabled]}>Add More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  containerDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color:'#02217C',
  },
  naContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  naText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
    color: '#1E293B',
    textDecorationLine: 'underline',
    textDecorationColor: '#BFDBFE',
  },
  textDisabled: {
    color: '#94A3B8',
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addButtonDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  addButtonText: {
    fontSize: 13,
    color: '#02217C',
    fontWeight: '700',
  },
});