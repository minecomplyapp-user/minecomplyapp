import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CMSTitlePillProps {
  title: string;
}

export const CMSTitlePill: React.FC<CMSTitlePillProps> = ({ title }) => {
  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleAccent} />
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#02217C',
  },
  titleAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#02217C',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  titleText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#02217C',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
});