// components/water-quality/ResultMonitoring.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TSSItem = {
  id: string;
  name: string;
  current: string;
  previous: string;
  isChecked: boolean;
};

type ResultMonitoringProps = {
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  onResultTypeChange: (value: string) => void;
  onTSSChange: (field: 'tssCurrent' | 'tssPrevious', value: string) => void;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ResultMonitoring: React.FC<ResultMonitoringProps> = ({
  resultType,
  tssCurrent,
  tssPrevious,
  onResultTypeChange,
  onTSSChange,
}) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [additionalTSS, setAdditionalTSS] = useState<TSSItem[]>([]);
  const [mainTSSChecked, setMainTSSChecked] = useState(false);

  const addTSS = () => {
    const newId = Date.now().toString();
    const tssNumber = additionalTSS.length + 2;
    setAdditionalTSS([
      ...additionalTSS,
      {
        id: newId,
        name: `TSS ${tssNumber.toString().padStart(2, '0')}`,
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

  const toggleTSSCheckbox = (id: string) => {
    setAdditionalTSS(
      additionalTSS.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isChecked: !item.isChecked,
            current: !item.isChecked ? item.current : '',
            previous: !item.isChecked ? item.previous : '',
          };
        }
        return item;
      })
    );
  };

  const toggleMainTSSCheckbox = () => {
    setMainTSSChecked(!mainTSSChecked);
    if (mainTSSChecked) {
      onTSSChange('tssCurrent', '');
      onTSSChange('tssPrevious', '');
    }
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
            <TouchableOpacity
              style={[styles.tssCheckbox, mainTSSChecked && styles.tssCheckboxChecked]}
              onPress={toggleMainTSSCheckbox}
            >
              {mainTSSChecked && <Ionicons name="checkmark" size={14} color='#02217C' />}
            </TouchableOpacity>
            <Text style={styles.tssName}>TSS 01</Text>
          </View>
        </View>
        <View style={styles.tssInputs}>
          <View style={styles.tssInputGroup}>
            <Text style={styles.tssInputLabel}>Current:</Text>
            <TextInput
              style={[styles.tssInput, !mainTSSChecked && styles.tssInputDisabled]}
              value={tssCurrent}
              onChangeText={(text) => onTSSChange('tssCurrent', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              editable={mainTSSChecked}
            />
          </View>
          <View style={styles.tssInputGroup}>
            <Text style={styles.tssInputLabel}>Previous:</Text>
            <TextInput
              style={[styles.tssInput, !mainTSSChecked && styles.tssInputDisabled]}
              value={tssPrevious}
              onChangeText={(text) => onTSSChange('tssPrevious', text)}
              placeholder="Type here..."
              placeholderTextColor="#94A3B8"
              editable={mainTSSChecked}
            />
          </View>
        </View>
      </View>

      {/* Additional TSS Items */}
      {additionalTSS.map((tss) => (
        <View key={tss.id} style={styles.tssContainer}>
          <View style={styles.tssHeaderRow}>
            <View style={styles.tssNameRow}>
              <TouchableOpacity
                style={[styles.tssCheckbox, tss.isChecked && styles.tssCheckboxChecked]}
                onPress={() => toggleTSSCheckbox(tss.id)}
              >
                {tss.isChecked && <Ionicons name="checkmark" size={14} color='#02217C' />}
              </TouchableOpacity>
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
                style={[styles.tssInput, !tss.isChecked && styles.tssInputDisabled]}
                value={tss.current}
                onChangeText={(text) => updateAdditionalTSS(tss.id, 'current', text)}
                placeholder="Type here..."
                placeholderTextColor="#94A3B8"
                editable={tss.isChecked}
              />
            </View>
            <View style={styles.tssInputGroup}>
              <Text style={styles.tssInputLabel}>Previous:</Text>
              <TextInput
                style={[styles.tssInput, !tss.isChecked && styles.tssInputDisabled]}
                value={tss.previous}
                onChangeText={(text) => updateAdditionalTSS(tss.id, 'previous', text)}
                placeholder="Type here..."
                placeholderTextColor="#94A3B8"
                editable={tss.isChecked}
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabelItalic: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#02217C',
    marginRight: 6,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },
  monthSelector: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 140,
  },
  monthText: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color:'#02217C',
  },
  monthList: {
    maxHeight: 400,
  },
  monthOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  monthOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  monthOptionText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  monthOptionTextSelected: {
    color:'#02217C',
    fontWeight: '700',
  },
  tssContainer: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tssName: {
    fontSize: 13,
    fontWeight: '700',
    color:'#02217C',
  },
  tssInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  tssInputGroup: {
    flex: 1,
  },
  tssInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  tssHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tssNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tssCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#02217C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tssCheckboxChecked: {
    backgroundColor: '#EFF6FF',
  },
  deleteTSSButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  tssInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    borderRadius: 6,
    color: '#1E293B',
  },
  tssInputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
    borderColor: '#E2E8F0',
  },
  addTSSButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addTSSText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#02217C',
  },
});