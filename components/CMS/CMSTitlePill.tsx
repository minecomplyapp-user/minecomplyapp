import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CMSTitlePillProps {
  title: string;
}

export const CMSTitlePill: React.FC<CMSTitlePillProps> = ({ title }) => {
  return (
    <View style={styles.titlePill}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titlePill: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleText: {
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 0.3,
  },
});