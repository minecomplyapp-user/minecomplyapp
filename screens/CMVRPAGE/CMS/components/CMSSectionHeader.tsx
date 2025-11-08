import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CMSSectionHeaderProps } from '../types/CMSSectionHeader.types';
import { styles } from '../styles/CMSSectionHeader.styles';

export const CMSSectionHeader: React.FC<CMSSectionHeaderProps> = ({
  sectionNumber,
  title,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="document-text" size={18} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          <Text style={styles.sectionNumber}>{sectionNumber}</Text> {title}
        </Text>
      </View>
    </View>
  );
};