import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Checkbox } from './Checkbox';
import { MitigatingMeasure, MitigatingMeasureFormProps } from '../types/MitigatingMeasureForm.types';
import { styles } from '../styles/MitigatingMeasureForm.styles';

export type { MitigatingMeasure };

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
          <Checkbox
            checked={measure.isEffective === 'yes'}
            onPress={() => !disabled && onUpdate('isEffective', 'yes')}
            label="Yes"
            disabled={disabled}
          />
          <Checkbox
            checked={measure.isEffective === 'no'}
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