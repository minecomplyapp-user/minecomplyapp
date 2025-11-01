import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { CMSHeader } from '../../components/CMSHeader';
import { CheckboxField } from '../../components/EnvironmentalCompliance/CheckboxField';
import { LocationCheckboxRow } from '../../components/EnvironmentalCompliance/LocationCheckboxRow';
import { ParameterForm } from '../../components/EnvironmentalCompliance/ParameterForm';
import { SectionHeader } from '../../components/EnvironmentalCompliance/SectionHeader';
import { FormInputField } from '../../components/EnvironmentalCompliance/FormInputField';

type ParameterData = {
  id: string;
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  thirdPartyTesting: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
};

type LocationState = {
  quarry: boolean;
  plant: boolean;
  port: boolean;
  quarryPlant: boolean;
};

type ComplianceData = {
  eccConditions: string;
  quarry: string;
  plant: string;
  port: string;
  quarryPlant: string;
  parameter: string;
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  thirdPartyTesting: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;
  parameters: ParameterData[];
  dateTime: string;
  weatherWind: string;
  explanation: string;
  overallCompliance: string;
};

export default function EnvironmentalComplianceScreen({ navigation, route }: any) {
  const [uploadedEccFile, setUploadedEccFile] = useState<any>(null);
  const [selectedLocations, setSelectedLocations] = useState<LocationState>({
    quarry: false,
    plant: false,
    port: false,
    quarryPlant: false,
  });
  const [naChecked, setNaChecked] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [data, setData] = useState<ComplianceData>({
    eccConditions: '',
    quarry: '',
    plant: '',
    port: '',
    quarryPlant: '',
    parameter: '',
    currentSMR: '',
    previousSMR: '',
    currentMMT: '',
    previousMMT: '',
    thirdPartyTesting: '',
    eqplRedFlag: '',
    action: '',
    limitPM25: '',
    remarks: '',
    parameters: [],
    dateTime: '',
    weatherWind: '',
    explanation: '',
    overallCompliance: '',
  });

  const updateField = (field: keyof ComplianceData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadEccFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadedEccFile(result.assets[0]);
        Alert.alert('File Uploaded', `File "${result.assets[0].name}" uploaded successfully!`);
        setData((prev) => ({
          ...prev,
          eccConditions: result.assets[0].name,
        }));
      }
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload file. Please try again.');
      console.error('Document picker error:', error);
    }
  };

  const removeEccFile = () => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setUploadedEccFile(null);
            setData((prev) => ({
              ...prev,
              eccConditions: '',
            }));
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Sorry, we need camera roll permissions to upload images.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  const addParameter = () => {
    const newId = Date.now().toString();
    const newParameter: ParameterData = {
      id: newId,
      parameter: '',
      currentSMR: '',
      previousSMR: '',
      currentMMT: '',
      previousMMT: '',
      thirdPartyTesting: '',
      eqplRedFlag: '',
      action: '',
      limitPM25: '',
      remarks: '',
    };
    setData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, newParameter],
    }));
  };

  const updateParameterField = (
    id: string,
    field: keyof Omit<ParameterData, 'id'>,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
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
            setData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handleLocationToggle = (location: keyof LocationState) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSaveNext = () => {
    console.log('Save & Next pressed', data);
    navigation.navigate('WaterQuality');
  };

  const mainParameterData: ParameterData = {
    id: 'main',
    parameter: data.parameter,
    currentSMR: data.currentSMR,
    previousSMR: data.previousSMR,
    currentMMT: data.currentMMT,
    previousMMT: data.previousMMT,
    thirdPartyTesting: data.thirdPartyTesting,
    eqplRedFlag: data.eqplRedFlag,
    action: data.action,
    limitPM25: data.limitPM25,
    remarks: data.remarks,
  };

  const updateMainParameter = (field: keyof Omit<ParameterData, 'id'>, value: string) => {
    updateField(field, value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader onBack={handleBack} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* B.2 Section */}
        <SectionHeader
          number="B.2."
          title="Compliance to Environmental Compliance Certificate Conditions"
        />
        
        {/* Upload ECC Conditions File */}
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>Upload ECC Conditions Document</Text>
          {!uploadedEccFile ? (
            <TouchableOpacity style={styles.uploadButton} onPress={uploadEccFile}>
              <Ionicons name="cloud-upload-outline" size={24} color='#02217C' />
              <Text style={styles.uploadButtonText}>Choose File</Text>
              <Text style={styles.uploadHint}>PDF, DOC, or Image</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedFileContainer}>
              <View style={styles.fileInfo}>
                <Ionicons name="document-text" size={24} color="#10B981" />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {uploadedEccFile.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {uploadedEccFile.size ? `${(uploadedEccFile.size / 1024).toFixed(2)} KB` : 'Size unknown'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={removeEccFile} style={styles.removeButton}>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* B.3 Section */}
        <SectionHeader number="B.3." title="Air Quality Impact Assessment" />
        
        {/* Location Checkboxes Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Location Selection</Text>
          <LocationCheckboxRow
            label="Quarry"
            value={data.quarry}
            onChangeText={(text) => updateField('quarry', text)}
            isSelected={selectedLocations.quarry}
            onCheckboxPress={() => handleLocationToggle('quarry')}
          />
          <LocationCheckboxRow
            label="Plant"
            value={data.plant}
            onChangeText={(text) => updateField('plant', text)}
            isSelected={selectedLocations.plant}
            onCheckboxPress={() => handleLocationToggle('plant')}
          />
          <LocationCheckboxRow
            label="Port"
            value={data.port}
            onChangeText={(text) => updateField('port', text)}
            isSelected={selectedLocations.port}
            onCheckboxPress={() => handleLocationToggle('port')}
          />
          <LocationCheckboxRow
            label={`Quarry/Plant\n(For Mobile Crusher)`}
            value={data.quarryPlant}
            onChangeText={(text) => updateField('quarryPlant', text)}
            isSelected={selectedLocations.quarryPlant}
            onCheckboxPress={() => handleLocationToggle('quarryPlant')}
          />
        </View>
        
        {/* Main Parameter Form */}
        <View style={styles.formSection}>
          <ParameterForm
            data={mainParameterData}
            onUpdate={updateMainParameter}
            showNA={true}
            naChecked={naChecked}
            onNAChange={() => setNaChecked(!naChecked)}
            showAdditionalFields={true}
            dateTime={data.dateTime}
            weatherWind={data.weatherWind}
            explanation={data.explanation}
            onDateTimeChange={(text) => updateField('dateTime', text)}
            onWeatherWindChange={(text) => updateField('weatherWind', text)}
            onExplanationChange={(text) => updateField('explanation', text)}
          />
          
          {/* Additional Parameters */}
          {data.parameters.map((param, index) => (
            <View key={param.id} style={styles.additionalParameterContainer}>
              <ParameterForm
                data={param}
                onUpdate={(field, value) => updateParameterField(param.id, field, value)}
                showDelete={true}
                onDelete={() => removeParameter(param.id)}
                index={index}
              />
            </View>
          ))}
          
          {/* Add New Parameter Button */}
          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Ionicons name="add-circle-outline" size={20} color='#02217C' />
            <Text style={styles.addButtonText}>Add New Parameter</Text>
          </TouchableOpacity>
        </View>
        
        {/* Overall Compliance */}
        <View style={styles.overallSection}>
          <View style={styles.overallHeader}>
            <View style={styles.overallIconCircle}>
              <Text style={styles.overallIcon}>✓</Text>
            </View>
            <Text style={styles.overallLabel}>Overall Compliance Assessment</Text>
          </View>
          <FormInputField
            label=""
            value={data.overallCompliance}
            onChangeText={(text) => updateField('overallCompliance', text)}
          />
        </View>
        
        {/* Save & Next Button */}
        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveNext}>
          <Text style={styles.saveNextText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#02217C',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uploadSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#02217C',
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  uploadedFileContainer: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#16A34A',
  },
  removeButton: {
    padding: 4,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  additionalParameterContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#BFDBFE',
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
  overallSection: {
    backgroundColor: '#02217C',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  overallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  overallIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  overallIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#02217C',
  },
  overallLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  saveNextButton: {
    backgroundColor:  '#02217C',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor:  '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveNextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});