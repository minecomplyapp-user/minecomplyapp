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
  disabled?: boolean;
}

export const MitigatingMeasureForm: React.FC<MitigatingMeasureFormProps> = ({
  measure,
  index,
  onUpdate,
  disabled = false,
}) => {
  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <View style={styles.row}>
        <View style={[styles.numberBadge, disabled && styles.numberBadgeDisabled]}>
          <Text style={[styles.number, disabled && styles.textDisabled]}>{index + 1}</Text>
        </View>
        <View style={styles.inputsRow}>
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, disabled && styles.textDisabled]}>Planned</Text>
            <TextInput
              style={[styles.input, disabled && styles.inputDisabled]}
              placeholder="Type here..."
              placeholderTextColor={disabled ? '#CBD5E1' : '#94A3B8'}
              value={measure.planned}
              onChangeText={(text) => onUpdate('planned', text)}
              multiline
              editable={!disabled}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.label, disabled && styles.textDisabled]}>Actual Observation</Text>
            <TextInput
              style={[styles.input, disabled && styles.inputDisabled]}
              placeholder="Type here..."
              placeholderTextColor={disabled ? '#CBD5E1' : '#94A3B8'}
              value={measure.actualObservation}
              onChangeText={(text) => onUpdate('actualObservation', text)}
              multiline
              editable={!disabled}
            />
          </View>
        </View>
      </View>

      <View style={[styles.effectiveRow, disabled && styles.effectiveRowDisabled]}>
        <Text style={[styles.effectiveLabel, disabled && styles.textDisabled]}>Is it Effective?</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            selected={measure.isEffective === 'yes'}
            onPress={() => !disabled && onUpdate('isEffective', 'yes')}
            label="Yes"
            disabled={disabled}
          />
          <RadioButton
            selected={measure.isEffective === 'no'}
            onPress={() => !disabled && onUpdate('isEffective', 'no')}
            label="No"
            disabled={disabled}
          />
        </View>
      </View>

      <View style={styles.recommendationsRow}>
        <Text style={[styles.recommendationsLabel, disabled && styles.textDisabled]}>Recommendations</Text>
        <TextInput
          style={[styles.recommendationsInput, disabled && styles.inputDisabled]}
          placeholder="Type here..."
          placeholderTextColor={disabled ? '#CBD5E1' : '#94A3B8'}
          value={measure.recommendations}
          onChangeText={(text) => onUpdate('recommendations', text)}
          multiline
          editable={!disabled}
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
  containerDisabled: {
    backgroundColor: '#FAFAFA',
    opacity: 0.7,
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
  numberBadgeDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
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
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    color: '#94A3B8',
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
  effectiveRowDisabled: {
    backgroundColor: '#F8FAFC',
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
  textDisabled: {
    color: '#94A3B8',
  },
});