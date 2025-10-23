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
        <Text style={styles.number}>{index + 1}.</Text>
        <View style={styles.inputsRow}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Planned</Text>
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
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
          placeholderTextColor="#999"
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  number: {
    fontSize: 14,
    fontWeight: '400',
    marginRight: 12,
    marginTop: 28,
  },
  inputsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  effectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 26,
  },
  effectiveLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  recommendationsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 26,
  },
  recommendationsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 12,
    minWidth: 120,
  },
  recommendationsInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    minHeight: 40,
    textAlignVertical: 'top',
  },
});