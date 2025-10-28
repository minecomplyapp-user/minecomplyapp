import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DENRStandardSectionProps = {
  redFlag: string;
  action: string;
  limit: string;
  onInputChange: (field: 'eqplRedFlag' | 'action' | 'limit', value: string) => void;
};

export const DENRStandardSection: React.FC<DENRStandardSectionProps> = ({
  redFlag,
  action,
  limit,
  onInputChange,
}) => {
  const [redFlagEnabled, setRedFlagEnabled] = useState(false);
  const [actionEnabled, setActionEnabled] = useState(false);
  const [limitEnabled, setLimitEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DENR Standard</Text>
      
      <View style={styles.inputRow}>
        {/* Red Flag */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, redFlagEnabled && styles.checkboxChecked]} 
              onPress={() => {
                setRedFlagEnabled(!redFlagEnabled);
                if (redFlagEnabled) {
                  onInputChange('eqplRedFlag', '');
                }
              }}
            >
              {redFlagEnabled && <Ionicons name="checkmark" size={14} color="#2563EB" />}
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Red Flag:</Text>
          </View>
          <TextInput
            style={[styles.input, !redFlagEnabled && styles.inputDisabled]}
            value={redFlag}
            onChangeText={(text) => onInputChange('eqplRedFlag', text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
            editable={redFlagEnabled}
          />
        </View>

        {/* Action */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, actionEnabled && styles.checkboxChecked]} 
              onPress={() => {
                setActionEnabled(!actionEnabled);
                if (actionEnabled) {
                  onInputChange('action', '');
                }
              }}
            >
              {actionEnabled && <Ionicons name="checkmark" size={14} color="#2563EB" />}
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Action:</Text>
          </View>
          <TextInput
            style={[styles.input, !actionEnabled && styles.inputDisabled]}
            value={action}
            onChangeText={(text) => onInputChange('action', text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
            editable={actionEnabled}
          />
        </View>

        {/* Limit */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, limitEnabled && styles.checkboxChecked]} 
              onPress={() => {
                setLimitEnabled(!limitEnabled);
                if (limitEnabled) {
                  onInputChange('limit', '');
                }
              }}
            >
              {limitEnabled && <Ionicons name="checkmark" size={14} color="#2563EB" />}
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Limit (mg/L):</Text>
          </View>
          <TextInput
            style={[styles.input, !limitEnabled && styles.inputDisabled]}
            value={limit}
            onChangeText={(text) => onInputChange('limit', text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
            editable={limitEnabled}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    minWidth: 150,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#EFF6FF',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    borderRadius: 6,
    color: '#1E293B',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
    borderColor: '#E2E8F0',
  },
});
