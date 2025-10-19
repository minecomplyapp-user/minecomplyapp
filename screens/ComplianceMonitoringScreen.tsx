import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Upload } from 'lucide-react-native';

interface FormField {
  label: string;
  specification: string;
  remarks: string;
  withinSpecs: boolean | null;
  subFields?: { label: string; specification: string }[];
}

export default function ComplianceMonitoringScreen({ navigation, route }: any) {
  const [formData, setFormData] = useState<{ [key: string]: FormField }>({
    projectLocation: {
      label: 'Project Location',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    projectArea: {
      label: 'Project Area (ha)',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    capitalCost: {
      label: 'Capital Cost (Php)',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    typeOfMinerals: {
      label: 'Type of Minerals',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    miningMethod: {
      label: 'Mining Method',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    production: {
      label: 'Production',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    mineLife: {
      label: 'Mine Life',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    mineralReserves: {
      label: 'Mineral Reserves/ Resources',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    accessTransportation: {
      label: 'Access/ Transportation',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
    powerSupply: {
      label: 'Power Supply',
      specification: '',
      remarks: '',
      withinSpecs: null,
      subFields: [
        { label: 'Plant:', specification: '' },
        { label: 'Port:', specification: '' },
      ],
    },
    miningEquipment: {
      label: 'Mining Equipment',
      specification: '',
      remarks: '',
      withinSpecs: null,
      subFields: [
        { label: 'Quarry/Plant:', specification: '' },
        { label: 'Port:', specification: '' },
      ],
    },
    workForce: {
      label: 'Work Force',
      specification: '',
      remarks: '',
      withinSpecs: null,
      subFields: [{ label: 'Employees:', specification: '' }],
    },
    developmentSchedule: {
      label: 'Development/ Utilization Schedule',
      specification: '',
      remarks: '',
      withinSpecs: null,
    },
  });

  const [otherComponents, setOtherComponents] = useState<
    Array<{ specification: string; remarks: string; withinSpecs: boolean | null }>
  >([]);

  const updateField = (
    key: string,
    field: 'specification' | 'remarks' | 'withinSpecs',
    value: string | boolean | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const updateSubField = (key: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        subFields: prev[key].subFields?.map((field, i) =>
          i === index ? { ...field, specification: value } : field
        ),
      },
    }));
  };

  const addOtherComponent = () => {
    setOtherComponents([
      ...otherComponents,
      { specification: '', remarks: '', withinSpecs: null },
    ]);
  };

  const handleSaveAndNext = () => {
    console.log('Form data:', formData);
    console.log('Other components:', otherComponents);
    // Add your save logic here
  };

  const renderFormField = (
    key: string,
    field: FormField,
    showUploadImage = false
  ) => (
    <View key={key} style={styles.formField}>
      <View style={styles.labelPill}>
        <Text style={styles.labelText}>{field.label}</Text>
      </View>
      {field.subFields ? (
        field.subFields.map((subField, index) => (
          <View key={index} style={styles.subFieldContainer}>
            <View style={styles.subFieldHeader}>
              <View style={styles.bullet} />
              <Text style={styles.subFieldLabel}>{subField.label}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Specification Type here..."
              placeholderTextColor="#999"
              value={subField.specification}
              onChangeText={(text) => updateSubField(key, index, text)}
            />
          </View>
        ))
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Specification Type here..."
          placeholderTextColor="#999"
          value={field.specification}
          onChangeText={(text) => updateField(key, 'specification', text)}
        />
      )}
      <View style={styles.remarksHeader}>
        <Text style={styles.remarksLabel}>
          Remarks- Description of Actual Implementation
        </Text>
        {showUploadImage && (
          <TouchableOpacity style={styles.uploadButton}>
            <Upload size={16} color="#666" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Type here..."
        placeholderTextColor="#999"
        value={field.remarks}
        onChangeText={(text) => updateField(key, 'remarks', text)}
        multiline
        numberOfLines={3}
      />
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Within specs?</Text>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => updateField(key, 'withinSpecs', true)}
        >
          <View style={styles.radioOuter}>
            {field.withinSpecs === true && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => updateField(key, 'withinSpecs', false)}
        >
          <View style={styles.radioOuter}>
            {field.withinSpecs === false && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>File_Name</Text>
        <TouchableOpacity>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titlePill}>
          <Text style={styles.titleText}>
            COMPLIANCE MONITORING REPORT AND DISCUSSIONS
          </Text>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>1. </Text>
            Compliance to Project Location and Coverage Limits (As specified in
            ECC and/ or EPEP)
          </Text>
        </View>
        <View style={styles.parametersHeader}>
          <Text style={styles.parametersText}>PARAMETERS:</Text>
        </View>
        {Object.entries(formData).map(([key, field]) =>
          renderFormField(key, field, key === 'projectLocation')
        )}
        <View style={styles.formField}>
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>Other Components:</Text>
          </View>
          {otherComponents.map((component, index) => (
            <View key={index} style={styles.otherComponentItem}>
              <View style={styles.subFieldHeader}>
                <View style={styles.bullet} />
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  placeholder="Specification Type here..."
                  placeholderTextColor="#999"
                  value={component.specification}
                  onChangeText={(text) => {
                    const updated = [...otherComponents];
                    updated[index].specification = text;
                    setOtherComponents(updated);
                  }}
                />
              </View>
              <Text style={styles.remarksLabel}>
                Remarks- Description of Actual Implementation
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Type here..."
                placeholderTextColor="#999"
                value={component.remarks}
                onChangeText={(text) => {
                  const updated = [...otherComponents];
                  updated[index].remarks = text;
                  setOtherComponents(updated);
                }}
                multiline
                numberOfLines={3}
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={addOtherComponent}
          >
            <Text style={styles.addButtonText}>+ Add More Components</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndNext}
        >
          <Text style={styles.saveNextText}>Save & Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  titlePill: {
    backgroundColor: '#c7d2fe',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleText: {
    color: '#312e81',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#000',
  },
  sectionNumber: {
    color: '#dc2626',
    fontWeight: '600',
  },
  parametersHeader: {
    marginBottom: 12,
  },
  parametersText: {
    fontWeight: '600',
    fontSize: 14,
  },
  formField: {
    backgroundColor: '#fce7f3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  labelPill: {
    backgroundColor: '#c7d2fe',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  labelText: {
    color: '#312e81',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  subFieldContainer: {
    marginBottom: 8,
  },
  subFieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginRight: 8,
  },
  subFieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  remarksLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  uploadText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#374151',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
    marginRight: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4b5563',
  },
  radioText: {
    fontSize: 14,
    color: '#374151',
  },
  otherComponentItem: {
    marginBottom: 12,
  },
  flexInput: {
    flex: 1,
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 13,
    color: '#374151',
  },
  saveNextButton: {
    backgroundColor: '#818cf8',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  saveNextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
