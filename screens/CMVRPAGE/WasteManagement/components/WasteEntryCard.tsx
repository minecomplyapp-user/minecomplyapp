import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {  WasteEntryCardProps } from '../types';
import { WasteEntryCardStyles as styles } from '../styles';


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
            <Ionicons name="trash-outline" size={16} color="#DC2626" />

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



export default WasteEntryCard;