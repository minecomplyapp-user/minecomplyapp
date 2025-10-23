import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from './RadioButton';

interface ProjectImpactsProps {
  preConstruction: 'yes' | 'no' | null;
  construction: 'yes' | 'no' | null;
  onPreConstructionChange: (value: 'yes' | 'no' | null) => void;
  onConstructionChange: (value: 'yes' | 'no' | null) => void;
}

export const ProjectImpacts: React.FC<ProjectImpactsProps> = ({
  preConstruction,
  construction,
  onPreConstructionChange,
  onConstructionChange,
}) => {
  return (
    <>
      <Text style={styles.title}>PROJECT IMPACTS</Text>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Pre-Construction</Text>
          <View style={styles.radioWrapper}>
            <RadioButton
              selected={preConstruction === 'no'}
              onPress={() => onPreConstructionChange('no')}
            />
            <Text style={styles.radioLabel}>N/A</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Construction</Text>
          <View style={styles.radioWrapper}>
            <RadioButton
              selected={construction === 'no'}
              onPress={() => onConstructionChange('no')}
            />
            <Text style={styles.radioLabel}>N/A</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  container: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioLabel: {
    fontSize: 13,
  },
});