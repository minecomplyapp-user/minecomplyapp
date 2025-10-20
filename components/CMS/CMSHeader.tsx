import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface CMSHeaderProps {
  fileName: string;
  onBack: () => void;
  onSave: () => void;
  onEditFileName?: () => void;
}

export const CMSHeader: React.FC<CMSHeaderProps> = ({
  fileName,
  onBack,
  onSave,
  onEditFileName,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ChevronLeft size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onEditFileName}>
        <Text style={styles.headerTitle}>{fileName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSave}>
        <Text style={styles.saveButton}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});