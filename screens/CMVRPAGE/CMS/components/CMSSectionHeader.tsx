import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { CMSSectionHeaderProps } from '../types/CMSSectionHeader.types';
import { styles } from '../styles/CMSSectionHeader.styles';

export const CMSSectionHeader: React.FC<CMSSectionHeaderProps> = ({
  title,
  sectionNumber,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="document-text-outline" size={20} color='#02217C' />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {sectionNumber && <Text style={styles.sectionNumber}>{sectionNumber} </Text>}
          {title}
        </Text>
      </View>
    </View>
  );
};