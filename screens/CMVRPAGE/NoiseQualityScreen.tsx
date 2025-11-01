import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CMSHeader } from '../../components/CMSHeader';
import * as DocumentPicker from 'expo-document-picker';
import { NoiseParameterCard } from '../../components/NoiseQuality/NoiseParameterCard';
import { FileUploadSection } from '../../components/NoiseQuality/FileUploadSection';

type UploadedFile = DocumentPicker.DocumentPickerAsset;

type QuarterData = {
  first: string;
  isFirstChecked: boolean;
  second: string;
  isSecondChecked: boolean;
  third: string;
  isThirdChecked: boolean;
  fourth: string;
  isFourthChecked: boolean;
};

type NoiseParameter = {
  id: string;
  parameter: string;
  isParameterNA: boolean;
  currentInSABR: string;
  previousInSABR: string;
  mmtCurrent: string;
  mmtPrevious: string;
  redFlag: string;
  isRedFlagChecked: boolean;
  action: string;
  isActionChecked: boolean;
  limit: string;
  isLimitChecked: boolean;
};

export default function NoiseQualityScreen({ navigation }: any) {
  const [hasInternalNoise, setHasInternalNoise] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [parameters, setParameters] = useState<NoiseParameter[]>([
    {
      id: `param-${Date.now()}`,
      parameter: '',
      isParameterNA: false,
      currentInSABR: '',
      previousInSABR: '',
      mmtCurrent: '',
      mmtPrevious: '',
      redFlag: '',
      isRedFlagChecked: false,
      action: '',
      isActionChecked: false,
      limit: '',
      isLimitChecked: false,
    },
  ]);

  const [remarks, setRemarks] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [weatherWind, setWeatherWind] = useState('');
  const [explanation, setExplanation] = useState('');
  const [explanationNA, setExplanationNA] = useState(false);

  const [quarters, setQuarters] = useState<QuarterData>({
    first: '',
    isFirstChecked: false,
    second: '',
    isSecondChecked: false,
    third: '',
    isThirdChecked: false,
    fourth: '',
    isFourthChecked: false,
  });

  const addParameter = () => {
    const newId = `param-${Date.now()}`;
    setParameters([
      ...parameters,
      {
        id: newId,
        parameter: '',
        isParameterNA: false,
        currentInSABR: '',
        previousInSABR: '',
        mmtCurrent: '',
        mmtPrevious: '',
        redFlag: '',
        isRedFlagChecked: false,
        action: '',
        isActionChecked: false,
        limit: '',
        isLimitChecked: false,
      },
    ]);
  };

  const updateParameter = (
    id: string,
    field: keyof Omit<NoiseParameter, 'id'>,
    value: string | boolean
  ) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const removeParameter = (id: string) => {
    Alert.alert(
      'Remove Parameter',
      'Are you sure you want to remove this parameter?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (parameters.length > 1) {
              setParameters(parameters.filter((param) => param.id !== id));
            } else {
              Alert.alert('Cannot Remove', 'At least one parameter is required.');
            }
          },
        },
      ]
    );
  };

  const updateQuarter = (field: keyof QuarterData, value: string | boolean) => {
    setQuarters((prevQuarters) => ({
      ...prevQuarters,
      [field]: value,
    }));
  };

  const handleSaveAndNext = () => {
    console.log('Saving Noise Quality data...');
    navigation.navigate('WasteManagement');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName="Noise Quality Assessment"
          onBack={() => navigation.goBack()}
          onSave={() => Alert.alert('Saved', 'Data saved successfully')}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeaderContent}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>B.4</Text>
            </View>
            <Text style={styles.sectionTitle}>Noise Quality Impact Assessment</Text>
          </View>
        </View>

        <FileUploadSection
          hasInternalNoise={hasInternalNoise}
          uploadedFiles={uploadedFiles}
          onToggleInternalNoise={() => setHasInternalNoise(!hasInternalNoise)}
          onFilesChange={setUploadedFiles}
        />

        <View style={styles.parametersSection}>
          {parameters.map((param, index) => (
            <NoiseParameterCard
              key={param.id}
              parameter={param}
              index={index}
              canDelete={parameters.length > 1}
              onUpdate={updateParameter}
              onDelete={removeParameter}
            />
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Ionicons name="add-circle" size={20} color='#02217C' />
            <Text style={styles.addButtonText}>Add More Parameter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.additionalFieldsContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Enter remarks..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date/Time of Sampling</Text>
            <TextInput
              style={styles.input}
              value={dateTime}
              onChangeText={setDateTime}
              placeholder="MM/DD/YYYY HH:MM"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Weather and Wind Direction</Text>
            <TextInput
              style={styles.input}
              value={weatherWind}
              onChangeText={setWeatherWind}
              placeholder="Enter weather conditions..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelWithAction}>
              <Text style={styles.label}>Explanation of Confirmatory Sampling</Text>
              <TouchableOpacity
                style={styles.naButton}
                onPress={() => setExplanationNA(!explanationNA)}
              >
                <View style={[styles.checkbox, explanationNA && styles.checkboxChecked]}>
                  {explanationNA && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text style={styles.naText}>N/A</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.textArea, explanationNA && styles.disabledInput]}
              value={explanation}
              onChangeText={setExplanation}
              placeholder="Explain why confirmatory sampling was conducted..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              editable={!explanationNA}
            />
          </View>
        </View>

        <View style={styles.overallAssessmentContainer}>
          <View style={styles.overallHeader}>
            <Ionicons name="analytics" size={20} color='#02217C' />
            <Text style={styles.overallTitle}>Overall Noise Quality Impact Assessment</Text>
          </View>
        </View>

        <View style={styles.quartersContainer}>
          {[
            { key: 'first', label: '1st Quarter', checked: 'isFirstChecked' },
            { key: 'second', label: '2nd Quarter', checked: 'isSecondChecked' },
            { key: 'third', label: '3rd Quarter', checked: 'isThirdChecked' },
            { key: 'fourth', label: '4th Quarter', checked: 'isFourthChecked' },
          ].map((quarter) => (
            <View key={quarter.key} style={styles.quarterRow}>
              <TouchableOpacity
                style={styles.quarterCheckbox}
                onPress={() =>
                  updateQuarter(
                    quarter.checked as keyof QuarterData,
                    !quarters[quarter.checked as keyof QuarterData]
                  )
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    quarters[quarter.checked as keyof QuarterData] && styles.checkboxChecked,
                  ]}
                >
                  {quarters[quarter.checked as keyof QuarterData] && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={styles.quarterLabel}>{quarter.label}</Text>
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.quarterInput,
                  !quarters[quarter.checked as keyof QuarterData] && styles.disabledInput,
                ]}
                value={quarters[quarter.key as keyof QuarterData] as string}
                onChangeText={(text) => updateQuarter(quarter.key as keyof QuarterData, text)}
                placeholder="Enter assessment"
                placeholderTextColor="#94A3B8"
                editable={quarters[quarter.checked as keyof QuarterData] as boolean}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeaderContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#BFDBFE',
  },
  sectionBadge: {
    backgroundColor: '#02217C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  sectionBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#02217C',
    flex: 1,
    letterSpacing: -0.3,
  },
  parametersSection: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: '#02217C',
    fontWeight: '600',
  },
  additionalFieldsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  labelWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  naButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  naText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
    borderColor: '#E2E8F0',
  },
  overallAssessmentContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  overallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    gap: 12,
  },
  overallTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#02217C',
    flex: 1,
  },
  quartersContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  quarterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  quarterCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 140,
  },
  quarterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  quarterInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  saveNextButton: {
    backgroundColor: '#02217C',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveNextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 32,
  },
});