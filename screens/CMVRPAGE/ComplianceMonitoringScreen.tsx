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
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from '../../components/CMSHeader';
import { CMSTitlePill } from '../../components/CMS/CMSTitlePill';
import { CMSSectionHeader } from '../../components/CMS/CMSSectionHeader';
import { CMSFormField } from '../../components/CMS/CMSFormField';
import { CMSOtherComponents } from '../../components/CMS/CMSOtherComponents';
import { FormData, OtherComponent } from '../../components/CMS/types';

export default function ComplianceMonitoringScreen({ navigation, route }: any) {
  const [formData, setFormData] = useState<FormData>({
    projectLocation: { label: 'Project Location', specification: '', remarks: '', withinSpecs: null },
    projectArea: { label: 'Project Area (ha)', specification: '', remarks: '', withinSpecs: null },
    capitalCost: { label: 'Capital Cost (Php)', specification: '', remarks: '', withinSpecs: null },
    typeOfMinerals: { label: 'Type of Minerals', specification: '', remarks: '', withinSpecs: null },
    miningMethod: { label: 'Mining Method', specification: '', remarks: '', withinSpecs: null },
    production: { label: 'Production', specification: '', remarks: '', withinSpecs: null },
    mineLife: { label: 'Mine Life', specification: '', remarks: '', withinSpecs: null },
    mineralReserves: { label: 'Mineral Reserves/ Resources', specification: '', remarks: '', withinSpecs: null },
    accessTransportation: { label: 'Access/ Transportation', specification: '', remarks: '', withinSpecs: null },
    powerSupply: { label: 'Power Supply', specification: '', remarks: '', withinSpecs: null, subFields: [{ label: 'Plant:', specification: '' }, { label: 'Port:', specification: '' }] },
    miningEquipment: { label: 'Mining Equipment', specification: '', remarks: '', withinSpecs: null, subFields: [{ label: 'Quarry/Plant:', specification: '' }, { label: 'Port:', specification: '' }] },
    workForce: { label: 'Work Force', specification: '', remarks: '', withinSpecs: null, subFields: [{ label: 'Employees:', specification: '' }] },
    developmentSchedule: { label: 'Development/ Utilization Schedule', specification: '', remarks: '', withinSpecs: null },
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
    if (!result.canceled && result.assets && result.assets.length > 0) {
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
    key: keyof FormData,
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

   const updateSubField = (key: keyof FormData, index: number, value: string) => {
        setFormData((prev) => {
            const currentField = prev[key];
            const updatedSubFields = currentField?.subFields?.map((field, i) =>
                i === index ? { ...field, specification: value } : field
            );
            return {
                ...prev,
                [key]: {
                    ...currentField,
                    subFields: updatedSubFields,
                },
            };
        });
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
    setOtherComponents((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
   };

   const handleWithinSpecsChange = (index: number, value: boolean) => {
    setOtherComponents((prev) => {
      const updated = [...prev];
       if (updated[index]) {
           updated[index].withinSpecs = value;
       }
      return updated;
    });
   };

   const handleDeleteComponent = (index: number) => {
    setOtherComponents((prev) => prev.filter((_, i) => i !== index));
   };

   const handleSave = () => {
    console.log('Form data:', JSON.stringify(formData, null, 2));
    console.log('Other components:', JSON.stringify(otherComponents, null, 2));
    console.log('Uploaded images:', uploadedImages);
   };

   const handleSaveAndNext = () => {
    console.log("Saving and navigating...");
    handleSave();
    navigation.navigate('EIACompliance');
   };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        <CMSTitlePill title="COMPLIANCE MONITORING REPORT AND DISCUSSIONS" />

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
            onSpecificationChange={(text) => updateField(key as keyof FormData, 'specification', text)}
            onRemarksChange={(text) => updateField(key as keyof FormData, 'remarks', text)}
            onWithinSpecsChange={(value) => updateField(key as keyof FormData, 'withinSpecs', value)}
            onSubFieldChange={(index, value) => updateSubField(key as keyof FormData, index, value)}
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

        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  headerContainer: {
     paddingHorizontal: 16,
     paddingTop: Platform.OS === 'ios' ? 12 : 12,
     paddingBottom: 12,
     backgroundColor: "white",
     zIndex: 1,
     shadowColor: '#1E40AF',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.05,
     shadowRadius: 3,
     elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  parametersHeader: {
    marginBottom: 14,
    marginTop: -6,
    paddingHorizontal: 4,
  },
  parametersText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  saveNextButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});