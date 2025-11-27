import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WasteEntryCard } from './WasteEntryCard';
import { PlantPortSectionProps } from '../types';
import { plantPortSectionStyles as styles } from '../styles';

export const PlantPortSection: React.FC<PlantPortSectionProps> = ({
  title,
  icon,
  data,
  selectedQuarter,
  onUpdateData,
  onAddWaste,
  onUpdateWaste,
  onRemoveWaste,
}) => {
  const getPreviousQuarter = (quarter: string) => {
    if (quarter === 'Q1 2025') return 'Q4 2024';
    if (quarter === 'Q2 2025') return 'Q1 2025';
    if (quarter === 'Q3 2025') return 'Q2 2025';
    if (quarter === 'Q4 2025') return 'Q3 2025';
    return 'Previous';
  };

  const previousQuarterLabel = getPreviousQuarter(selectedQuarter);

  const prevValue = parseFloat(data.previousRecord) || 0;
  const currValue = parseFloat(data.currentQuarterWaste) || 0;
  const totalWaste = prevValue + currValue;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#02217C" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
        {/* <View style={styles.fieldGroup}>
          <Text style={styles.label}>Type of Waste</Text>
          <TextInput
            style={styles.input}
            value={data.typeOfWaste}
            onChangeText={(text) => onUpdateData('typeOfWaste', text)}
            placeholder="Select or enter waste type"
            placeholderTextColor="#94A3B8"
          />
        </View> */}

        <View style={styles.subsectionHeader}>
          <Text style={styles.subsectionTitle}>ECC/EPEP Commitments</Text>
        </View>

        {data.eccEpepCommitments.map((entry, index) => (
          <WasteEntryCard
            key={entry.id}
            entry={entry}
            selectedQuarter={selectedQuarter}
            index={index}
            canDelete={data.eccEpepCommitments.length > 1}
            onUpdate={onUpdateWaste}
            onDelete={onRemoveWaste}
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={onAddWaste}>
          <Ionicons name="add-circle" size={20} color="#02217C" />
          <Text style={styles.addButtonText}>Add More Waste</Text>
        </TouchableOpacity>
{/* 
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Is it Adequate?</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onUpdateData('isAdequate', 'YES')}
            >
              <View
                style={[
                  styles.radio,
                  data.isAdequate === 'YES' && styles.radioChecked,
                ]}
              >
                {data.isAdequate === 'YES' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>YES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => onUpdateData('isAdequate', 'NO')}
            >
              <View
                style={[
                  styles.radio,
                  data.isAdequate === 'NO' && styles.radioChecked,
                ]}
              >
                {data.isAdequate === 'NO' && <View style={styles.radioInner} />}
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
            value={data.previousRecord}
            onChangeText={(text) => onUpdateData('previousRecord', text)}
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
            value={data.currentQuarterWaste}
            onChangeText={(text) => onUpdateData('currentQuarterWaste', text)}
            placeholder={`Enter total for ${selectedQuarter}`}
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.totalLabel}>Total (Previous + Current)</Text>
          <View style={styles.totalValueContainer}>
            <Text style={styles.totalValueText}>
              {totalWaste.toLocaleString()}
            </Text>
          </View>
        </View> */}
      </View>
    </View>
  );
};

export default PlantPortSection;