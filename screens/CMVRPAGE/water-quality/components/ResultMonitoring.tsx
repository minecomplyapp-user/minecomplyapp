import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TSSItem, ResultMonitoringProps } from '../types/ResultMonitoring.types';
import { styles } from '../styles/ResultMonitoring.styles';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ResultMonitoringComponent: React.FC<ResultMonitoringProps> = ({
  parameter,
  resultType,
  tssCurrent,
  tssPrevious,
  onResultTypeChange,
  onTSSChange,
}) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [additionalTSS, setAdditionalTSS] = useState<TSSItem[]>([]);

  const addTSS = () => {
    const newId = Date.now().toString();
    const tssNumber = additionalTSS.length + 2;
    setAdditionalTSS([
      ...additionalTSS,
      {
        id: newId,
        name: `${parameter} ${tssNumber.toString().padStart(2, '0')}`,
        current: '',
        previous: '',
        isChecked: false,
      },
    ]);
  };

  const deleteTSS = (id: string) => {
    Alert.alert(
      'Delete TSS',
      'Are you sure you want to delete this TSS item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAdditionalTSS(additionalTSS.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const updateAdditionalTSS = (id: string, field: 'current' | 'previous', value: string) => {
    setAdditionalTSS(
      additionalTSS.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.resultLabelItalic}>Result:</Text>
        <Text style={styles.resultLabel}>Internal Monitoring</Text>
        <TouchableOpacity 
          style={styles.monthSelector}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.monthText}>
            {resultType || 'Select Month'}
          </Text>
          <Ionicons name="chevron-down" size={16} color='#02217C' />
        </TouchableOpacity>
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Month</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.monthList}>
              {MONTHS.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthOption,
                    resultType === month && styles.monthOptionSelected
                  ]}
                  onPress={() => {
                    onResultTypeChange(month);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={[
                    styles.monthOptionText,
                    resultType === month && styles.monthOptionTextSelected
                  ]}>
                    {month}
                  </Text>
                  {resultType === month && (
                    <Ionicons name="checkmark" size={20} color='#02217C' />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* TSS 01 - Main */}
      <View style={styles.tssContainer}>
        <View style={styles.tssHeaderRow}>
          <View style={styles.tssNameRow}>
            <View style={styles.bullet} />
            <Text style={styles.tssName}>{parameter} 01</Text>
          </View>
        </View>
        <View style={styles.tssInputs}>
          <View style={styles.tssInputGroup}>
            <Text style={styles.tssInputLabel}>Current:</Text>
            <TextInput
              style={styles.tssInput}
              value={tssCurrent}
              onChangeText={(text) => onTSSChange('tssCurrent', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.tssInputGroup}>
            <Text style={styles.tssInputLabel}>Previous:</Text>
            <TextInput
              style={styles.tssInput}
              value={tssPrevious}
              onChangeText={(text) => onTSSChange('tssPrevious', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>

      {/* Additional TSS Items */}
      {additionalTSS.map((tss) => (
        <View key={tss.id} style={styles.tssContainer}>
          <View style={styles.tssHeaderRow}>
            <View style={styles.tssNameRow}>
              <View style={styles.bullet} />
              <Text style={styles.tssName}>{tss.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteTSSButton}
              onPress={() => deleteTSS(tss.id)}
            >
              <Ionicons name="trash-outline" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
          <View style={styles.tssInputs}>
            <View style={styles.tssInputGroup}>
              <Text style={styles.tssInputLabel}>Current:</Text>
              <TextInput
                style={styles.tssInput}
                value={tss.current}
                onChangeText={(text) => updateAdditionalTSS(tss.id, 'current', text)}
                placeholder="Type here..."
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={styles.tssInputGroup}>
              <Text style={styles.tssInputLabel}>Previous:</Text>
              <TextInput
                style={styles.tssInput}
                value={tss.previous}
                onChangeText={(text) => updateAdditionalTSS(tss.id, 'previous', text)}
                placeholder="Type here..."
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>
      ))}

      {/* Add More TSS Button */}
      <TouchableOpacity style={styles.addTSSButton} onPress={addTSS}>
        <Ionicons name="add-circle-outline" size={16} color='#02217C' />
        <Text style={styles.addTSSText}>Add More TSS</Text>
      </TouchableOpacity>
    </> 
  );
};

export const ResultMonitoring = React.memo(ResultMonitoringComponent);