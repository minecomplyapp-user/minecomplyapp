import React from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from './Checkbox';
import { ProjectImpactsProps } from '../types/ProjectImpacts.types';
import { styles } from '../styles/ProjectImpacts.styles';

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
            <Checkbox
              checked={preConstruction === 'no'}
              onPress={() => onPreConstructionChange('no')}
            />
            <Text style={styles.radioLabel}>N/A</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Construction</Text>
          <View style={styles.radioWrapper}>
            <Checkbox
              checked={construction === 'no'}
              onPress={() => onConstructionChange('no')}
            />
            <Text style={styles.radioLabel}>N/A</Text>
          </View>
        </View>
      </View>
    </>
  );
};