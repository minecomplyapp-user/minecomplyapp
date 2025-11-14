import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ChemicalSafetyData,
  YesNoNull,
  ChemicalCategory,
} from '../../types/ChemicalSafetyScreen.types';
import { ChemicalSafetySectionProps } from '../types/ChemicalSafetySection.types';
import { styles } from '../styles/ChemicalSafetySection.styles';

export const ChemicalSafetySection: React.FC<ChemicalSafetySectionProps> = ({
  chemicalSafety,
  updateChemicalSafety,
}) => {
  const renderRadioRow = (
    label: string,
    field: keyof Omit<ChemicalSafetyData, 'isNA' | 'remarks'>,
    currentValue: YesNoNull
  ) => (
    <View style={styles.radioRow}>
      <Text
        style={[styles.radioLabel, chemicalSafety.isNA && styles.disabledText]}
      >
        {label}
      </Text>
      <View style={styles.radioGroupYesNo}>
        <TouchableOpacity
          style={styles.radioOptionYesNo}
          onPress={() => updateChemicalSafety(field, 'YES')}
          disabled={chemicalSafety.isNA}
        >
          <View
            style={[
              styles.radio,
              currentValue === 'YES' && styles.radioSelected,
              chemicalSafety.isNA && styles.disabledRadio,
            ]}
          >
            {currentValue === 'YES' && <View style={styles.radioDot} />}
          </View>
          <Text
            style={[styles.optionLabel, chemicalSafety.isNA && styles.disabledText]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOptionYesNo}
          onPress={() => updateChemicalSafety(field, 'NO')}
          disabled={chemicalSafety.isNA}
        >
          <View
            style={[
              styles.radio,
              currentValue === 'NO' && styles.radioSelected,
              chemicalSafety.isNA && styles.disabledRadio,
            ]}
          >
            {currentValue === 'NO' && <View style={styles.radioDot} />}
          </View>
          <Text
            style={[styles.optionLabel, chemicalSafety.isNA && styles.disabledText]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="flask" size={24} color="#02217C" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionNumber}>4.</Text>
            <Text style={styles.sectionTitle}>Chemical Safety Management</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Chemicals in PCL and COO</Text>
          <TouchableOpacity
            style={styles.naButton}
            onPress={() => updateChemicalSafety('isNA', !chemicalSafety.isNA)}
          >
            <View
              style={[
                styles.checkbox,
                chemicalSafety.isNA && styles.checkboxChecked,
              ]}
            >
              {chemicalSafety.isNA && (
                <Ionicons name="checkmark" size={14} color="white" />
              )}
            </View>
            <Text style={styles.naButtonText}>N/A</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.fieldGroup,
            chemicalSafety.isNA && styles.disabledContent,
          ]}
        >
          <Text style={styles.labelSmall}>CHEMICAL CATEGORY</Text>
          <View style={styles.radioGroup}>
            {(['PCL', 'COO', 'Others'] as const).map((loc) => (
              <TouchableOpacity
                key={loc}
                style={styles.radioOption}
                onPress={() =>
                  updateChemicalSafety('chemicalCategory', loc)
                }
                disabled={chemicalSafety.isNA}
              >
                <View
                  style={[
                    styles.radio,
                    chemicalSafety.chemicalCategory === loc &&
                      styles.radioSelected,
                    chemicalSafety.isNA && styles.disabledRadio,
                  ]}
                >
                  {chemicalSafety.chemicalCategory === loc && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    chemicalSafety.isNA && styles.disabledText,
                  ]}
                >
                  {loc === 'Others' ? 'Others, specify' : loc}
                </Text>
                
                {loc === 'Others' && (
                  <TextInput
                    style={[
                      styles.inlineInput,
                      chemicalSafety.isNA && styles.disabledInput,
                    ]}
                    value={chemicalSafety.othersSpecify}
                    onChangeText={(text) =>
                      updateChemicalSafety('othersSpecify', text)
                    }
                    placeholder="Type here..."
                    placeholderTextColor="#94A3B8"
                    editable={!chemicalSafety.isNA}
                    onFocus={() => {
                      if (chemicalSafety.chemicalCategory !== 'Others') {
                        updateChemicalSafety('chemicalCategory', 'Others');
                      }
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text
          style={[
            styles.adequateLabel,
            chemicalSafety.isNA && styles.disabledText,
          ]}
        >
          Is it Adequate?
        </Text>

        <View
          style={[
            styles.contentWrapper,
            chemicalSafety.isNA && styles.disabledContent,
          ]}
        >
          {renderRadioRow(
            'Risk Management',
            'riskManagement',
            chemicalSafety.riskManagement
          )}
          {renderRadioRow('Training', 'training', chemicalSafety.training)}
          {renderRadioRow('Handling', 'handling', chemicalSafety.handling)}
          {renderRadioRow(
            'Emergency Preparedness',
            'emergencyPreparedness',
            chemicalSafety.emergencyPreparedness
          )}

          <View style={styles.remarksSection}>
            <Text
              style={[
                styles.labelSmall,
                chemicalSafety.isNA && styles.disabledText,
              ]}
            >
              REMARKS
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                chemicalSafety.isNA && styles.disabledInput,
              ]}
              value={chemicalSafety.remarks}
              onChangeText={(text) => updateChemicalSafety('remarks', text)}
              placeholder="Enter remarks..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              editable={!chemicalSafety.isNA}
            />
          </View>
        </View>
      </View>
    </View>
  );
};