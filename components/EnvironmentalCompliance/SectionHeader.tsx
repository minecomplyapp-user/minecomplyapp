import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SectionHeaderProps = {
  number: string;
  title: string;
  backgroundColor?: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  title,
  backgroundColor = '#FFB3BA',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 0,
    marginTop: 0,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  number: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
});