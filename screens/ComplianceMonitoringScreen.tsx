import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CMSHeader } from '../components/CMSHeader';
import { CMSSectionHeader } from '../components/CMS/CMSSectionHeader';
import { CMSFormField } from '../components/CMS/CMSFormField';
import { CMSOtherComponents } from '../components/CMS/CMSOtherComponents';
import { FormData, OtherComponent } from '../components/CMS/types';

export default function ComplianceMonitoringScreen({ navigation, route }: any) {
  const [formData, setFormData] = useState<FormData>({
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

  const [otherComponents, setOtherComponents] = useState<OtherComponent[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});

  const pickImage = async (fieldKey: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setUploadedImages((prev) => ({
        ...prev,
        [fieldKey]: result.assets[0].uri,
      }));
    }
  };

  const removeImage = (fieldKey: string) => {
    setUploadedImages((prev) => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });
  };

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

  const updateOtherComponent = (
    index: number,
    field: 'specification' | 'remarks',
    value: string
  ) => {
    const updated = [...otherComponents];
    updated[index][field] = value;
    setOtherComponents(updated);
  };

  const handleWithinSpecsChange = (index: number, value: boolean) => {
    setOtherComponents((prev) => {
      const updated = [...prev];
      updated[index].withinSpecs = value;
      return updated;
    });
  };

  const handleDeleteComponent = (index: number) => {
    setOtherComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Your report has been saved successfully.');
  };

  const handleSaveAndNext = () => {
    console.log('Form data:', formData);
    console.log('Other components:', otherComponents);
    console.log('Uploaded images:', uploadedImages);
    // Add your navigation logic here
    navigation.navigate('EIACompliance');

  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName="File_Name"
          onBack={() => navigation.goBack()}
          onSave={handleSave}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- Updated Title Pill --- */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>COMPLIANCE MONITORING REPORT AND DISCUSSIONS</Text>
        </View>

        <CMSSectionHeader
          sectionNumber="1."
          title="Compliance to Project Location and Coverage Limits (As specified in ECC and/ or EPEP)"
        />

        <View style={styles.parametersHeader}>
          <Text style={styles.parametersText}>PARAMETERS:</Text>
        </View>

        {Object.entries(formData).map(([key, field]) => (
          <CMSFormField
            key={key}
            label={field.label}
            specification={field.specification}
            remarks={field.remarks}
            withinSpecs={field.withinSpecs}
            subFields={field.subFields}
            showUploadImage={key === 'projectLocation'}
            uploadedImage={uploadedImages[key]}
            onSpecificationChange={(text) => updateField(key, 'specification', text)}
            onRemarksChange={(text) => updateField(key, 'remarks', text)}
            onWithinSpecsChange={(value) => updateField(key, 'withinSpecs', value)}
            onSubFieldChange={(index, value) => updateSubField(key, index, value)}
            onUploadImage={() => pickImage(key)}
            onRemoveImage={() => removeImage(key)}
          />
        ))}

        <CMSOtherComponents
          components={otherComponents}
          onComponentChange={updateOtherComponent}
          onWithinSpecsChange={handleWithinSpecsChange}
          onAddComponent={addOtherComponent}
          onDeleteComponent={handleDeleteComponent}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
            <Text style={styles.saveNextText}>Save & Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    zIndex: 1000,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  /* --- Title Pill Styles --- */
  titleContainer: {
    backgroundColor: '#D8D8FF',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontWeight: '700',
    fontSize: 11,
    color: '#000',
  },
  parametersHeader: {
    marginBottom: 8,
    marginTop: 4,
  },
  parametersText: {
    fontWeight: '700',
    fontSize: 11,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  saveNextButton: {
    backgroundColor: '#7C6FDB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveNextText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
