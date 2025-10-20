import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CMSSectionHeaderProps {
  title: string;
  sectionNumber?: string;
}

export const CMSSectionHeader: React.FC<CMSSectionHeaderProps> = ({
  title,
  sectionNumber,
}) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {sectionNumber && <Text style={styles.sectionNumber}>{sectionNumber} </Text>}
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#fecaca',
    padding: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    color: '#000',
    fontWeight: '400',
  },
  sectionNumber: {
    color: '#000',
    fontWeight: '700',
  },
});