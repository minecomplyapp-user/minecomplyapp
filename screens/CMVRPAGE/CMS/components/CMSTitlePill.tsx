import React from 'react';
import { View, Text } from 'react-native';
import { CMSTitlePillProps } from '../types/CMSTitlePill.types';
import { styles } from '../styles/CMSTitlePill.styles';

export const CMSTitlePill: React.FC<CMSTitlePillProps> = ({ title }) => {
  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleAccent} />
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};