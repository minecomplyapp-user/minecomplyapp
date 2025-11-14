import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Checkbox } from './Checkbox';
import { MitigatingMeasureForm } from '../components/MitigatingMeasureForm';
import { OperationSectionProps } from '../types/OperationSection.types';
import { styles } from '../styles/OperationSection.styles';
import { Ionicons } from "@expo/vector-icons";


export const OperationSectionComponent: React.FC<OperationSectionProps> = ({
  section,
  onNAToggle,
  onMeasureUpdate,
  onAddMeasure,
  onDeleteMeasure,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{section.title}</Text>
        </View>
        <View style={styles.naContainer}>
          <Checkbox checked={section.isNA} onPress={onNAToggle} />
          <Text style={styles.naText}>N/A</Text>
        </View>
      </View>

      <Text style={styles.subsectionTitle}>
        Mitigating Measures / Control Strategies
      </Text>

      {section.measures.map((measure, index) => (
        <View key={measure.id} style={styles.measureContainer}>
          <View style={styles.measureContent}>
            <MitigatingMeasureForm
              measure={measure}
              index={index}
              onUpdate={(field, value) => onMeasureUpdate(measure.id, field, value)}
              disabled={section.isNA}
            />
          </View>
          {section.measures.length > 1 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteMeasure?.(measure.id)}
              disabled={section.isNA}
            >
               <Ionicons name="trash-outline" size={16} color="#DC2626" />

            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={onAddMeasure}
        disabled={section.isNA}
      >
        <Plus size={16} color={section.isNA ? '#CBD5E1' : '#02217C'} />
        <Text style={[styles.addButtonText, section.isNA && styles.addButtonTextDisabled]}>
          Add More
        </Text>
      </TouchableOpacity>
    </View>
  );
};