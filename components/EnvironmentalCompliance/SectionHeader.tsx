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
  backgroundColor = '#EFF6FF',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.numberBadge}>
        <Text style={styles.number}>{number}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  numberBadge: {
    backgroundColor: '#02217C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  number: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#02217C',
    flex: 1,
  },
});