import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {  WasteEntryCardProps } from '../types';
import { WasteEntryCardStyles as styles } from '../styles';


export const WasteEntryCard: React.FC<WasteEntryCardProps> = ({
  entry,
  selectedQuarter,
  index,
  canDelete,
  onUpdate,
  onDelete,
}) => {
   const getPreviousQuarter = (quarter: string) => {
    if (quarter === 'Q1 2025') return 'Q4 2024';
    if (quarter === 'Q2 2025') return 'Q1 2025';
    if (quarter === 'Q3 2025') return 'Q2 2025';
    if (quarter === 'Q4 2025') return 'Q3 2025';
    return 'Previous';
  };

  const prevValue = parseFloat(entry.previousRecord) || 0;
  const currValue = parseFloat(entry.currentQuarterWaste) || 0;
  const totalWaste = prevValue + currValue;

  const previousQuarterLabel = getPreviousQuarter(selectedQuarter);
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
        <Text style={styles.label}>Type of Waste</Text>
        <TextInput
          style={styles.input}
          value={entry.typeOfWaste}
          onChangeText={(text) => onUpdate(entry.id, 'typeOfWaste', text)}
          placeholder="Enter waste type"
          placeholderTextColor="#94A3B8"
        />

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

      
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Is it Adequate?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onUpdate(entry.id,'isAdequate', 'YES')}
            >
              <View
                style={[
                  styles.radio,
                  entry.isAdequate === 'YES' && styles.radioChecked,
                ]}
              >
                {entry.isAdequate === 'YES' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>YES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onUpdate(entry.id,'isAdequate', 'NO')}
            >
              <View
                style={[
                  styles.radio,
                  entry.isAdequate === 'NO' && styles.radioChecked,
                ]}
              >
                {entry.isAdequate === 'NO' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Total Waste Generated ({previousQuarterLabel})
          </Text>
          <TextInput
            style={styles.input}
            value={entry.previousRecord}
            onChangeText={(text) => {
              onUpdate(entry.id, 'previousRecord', text);

          
              onUpdate(entry.id, 'totalWaste', totalWaste.toString());
            }}
            placeholder={`Enter total for ${previousQuarterLabel}`}
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Total Waste Generated ({selectedQuarter})
          </Text>
          <TextInput
            style={styles.input}
            value={entry.currentQuarterWaste}
            onChangeText={(text) => {
              onUpdate(entry.id, 'currentQuarterWaste', text);

             
              onUpdate(entry.id, 'totalWaste',totalWaste.toString());
            }}
            placeholder={`Enter total for ${selectedQuarter}`}
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.totalLabel}>Total (Previous + Current)</Text>
          <View style={styles.totalValueContainer}>
            <Text style={styles.totalValueText}>
              {totalWaste.toLocaleString()
              }
            </Text>
          </View>
        </View>
    </View>
  );
};



export default WasteEntryCard;