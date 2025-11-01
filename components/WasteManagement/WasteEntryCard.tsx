import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type WasteEntry = {
  id: string;
  handling: string;
  storage: string;
  disposal: string;
};

type WasteEntryCardProps = {
  entry: WasteEntry;
  index: number;
  canDelete: boolean;
  onUpdate: (id: string, field: keyof Omit<WasteEntry, 'id'>, value: string) => void;
  onDelete: (id: string) => void;
};

export const WasteEntryCard: React.FC<WasteEntryCardProps> = ({
  entry,
  index,
  canDelete,
  onUpdate,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{index + 1}</Text>
          </View>
          <Text style={styles.title}>Waste Entry</Text>
        </View>
        {canDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(entry.id)}>
            <Ionicons name="trash" size={20} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Handling</Text>
        <TextInput
          style={styles.input}
          value={entry.handling}
          onChangeText={(text) => onUpdate(entry.id, 'handling', text)}
          placeholder="Enter handling method"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Storage</Text>
        <TextInput
          style={styles.input}
          value={entry.storage}
          onChangeText={(text) => onUpdate(entry.id, 'storage', text)}
          placeholder="Enter storage method"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Disposal</Text>
        <TextInput
          style={styles.input}
          value={entry.disposal}
          onChangeText={(text) => onUpdate(entry.id, 'disposal', text)}
          placeholder="Enter disposal method"
          placeholderTextColor="#94A3B8"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: '#02217C',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#02217C',
  },
  deleteButton: {
    padding: 6,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
});

export default WasteEntryCard;