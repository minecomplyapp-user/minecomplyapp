import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { RadioButton } from './RadioButton';

export interface MitigatingMeasure {
  id: string;
  planned: string;
  actualObservation: string;
  isEffective: 'yes' | 'no' | null;
  recommendations: string;
}

interface MitigatingMeasureFormProps {
  measure: MitigatingMeasure;
  index: number;
  onUpdate: (field: keyof MitigatingMeasure, value: any) => void;
}

export const MitigatingMeasureForm: React.FC<MitigatingMeasureFormProps> = ({
  measure,
  index,
  onUpdate,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.numberBadge}>
          <Text style={styles.number}>{index + 1}</Text>
        </View>
        <View style={styles.inputsRow}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Planned</Text>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              value={measure.planned}
              onChangeText={(text) => onUpdate('planned', text)}
              multiline
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Actual Observation</Text>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              value={measure.actualObservation}
              onChangeText={(text) => onUpdate('actualObservation', text)}
              multiline
            />
          </View>
        </View>
      </View>

      <View style={styles.effectiveRow}>
        <Text style={styles.effectiveLabel}>Is it Effective?</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            selected={measure.isEffective === 'yes'}
            onPress={() => onUpdate('isEffective', 'yes')}
            label="Yes"
          />
          <RadioButton
            selected={measure.isEffective === 'no'}
            onPress={() => onUpdate('isEffective', 'no')}
            label="No"
          />
        </View>
      </View>

      <View style={styles.recommendationsRow}>
        <Text style={styles.recommendationsLabel}>Recommendations</Text>
        <TextInput
          style={styles.recommendationsInput}
          placeholder="Type here..."
          placeholderTextColor="#94A3B8"
          value={measure.recommendations}
          onChangeText={(text) => onUpdate('recommendations', text)}
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  number: {
    fontSize: 13,
    fontWeight: '700',
    color: '#02217C',
  },
  inputsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: '#475569',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    minHeight: 45,
    textAlignVertical: 'top',
    color: '#1E293B',
  },
  effectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 40,
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingRight: 12,
    borderRadius: 6,
  },
  effectiveLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 16,
    color: '#1E293B',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  recommendationsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 40,
  },
  recommendationsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 12,
    minWidth: 120,
    color: '#1E293B',
  },
  recommendationsInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    minHeight: 45,
    textAlignVertical: 'top',
    color: '#1E293B',
  },
});
