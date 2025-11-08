// SectionHeader component
import React from 'react';
import { View, Text } from 'react-native';
import { SectionHeaderProps } from '../types';
import { sectionHeaderStyles as styles } from '../styles';

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  title,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.numberBadge}>
        <Text style={styles.number}>{number}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};