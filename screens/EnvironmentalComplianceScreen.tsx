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
import { CMSHeader } from '../components/CMSHeader';
import { CheckboxField } from '../components/EnvironmentalCompliance/CheckboxField';
import { LocationCheckboxRow } from '../components/EnvironmentalCompliance/LocationCheckboxRow';
import { ParameterForm } from '../components/EnvironmentalCompliance/ParameterForm';
import { SectionHeader } from '../components/EnvironmentalCompliance/SectionHeader';
import { FormInputField } from '../components/EnvironmentalCompliance/FormInputField';


type ParameterData = {
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
  const [isEccChecked, setIsEccChecked] = useState(false);
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

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [naChecked, setNaChecked] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const updateField = (field: keyof ComplianceData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEccCheckbox = () => {
    const newCheckedState = !isEccChecked;
    setIsEccChecked(newCheckedState);
    if (newCheckedState) {
      Alert.alert('Loading ECC', 'Loading ECC conditions from CMVR...');
      setData((prev) => ({
        ...prev,
        eccConditions: 'ECC conditions from CMVR',
      }));
    } else {
      setData((prev) => ({
        ...prev,
        eccConditions: '',
      }));
    }
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
    setData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
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
        },
      ],
    }));
  };

  const updateParameterField = (
    index: number,
    field: keyof ParameterData,
    value: string
  ) => {
    setData((prev) => {
      const newParams = prev.parameters.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      );
      return { ...prev, parameters: newParams };
    });
  };

  const removeParameter = (index: number) => {
    setData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSaveNext = () => {
    console.log('Save & Next pressed', data);
    navigation.navigate('WaterQuality');
  };

  const toggleLocation = (location: string) => {
    setSelectedLocation(selectedLocation === location ? null : location);
  };

  const mainParameterData: ParameterData = {
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

  const updateMainParameter = (field: keyof ParameterData, value: string) => {
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

        {/* Upload ECC Conditions Checkbox */}
        <CheckboxField
          checked={isEccChecked}
          onPress={handleEccCheckbox}
          label="Use ECC Conditions from CMVR"
        />

        {/* B.3 Section */}
        <SectionHeader number="B.3." title="Air Quality Impact Assessment" />

        {/* Location Checkboxes Section */}
        <View style={styles.formSection}>
          <LocationCheckboxRow
            label="Quarry"
            value={data.quarry}
            onChangeText={(text) => updateField('quarry', text)}
            isSelected={selectedLocation === 'quarry'}
            onCheckboxPress={() => toggleLocation('quarry')}
          />

          <LocationCheckboxRow
            label="Plant"
            value={data.plant}
            onChangeText={(text) => updateField('plant', text)}
            isSelected={selectedLocation === 'plant'}
            onCheckboxPress={() => toggleLocation('plant')}
          />

          <LocationCheckboxRow
            label="Port"
            value={data.port}
            onChangeText={(text) => updateField('port', text)}
            isSelected={selectedLocation === 'port'}
            onCheckboxPress={() => toggleLocation('port')}
          />

          <LocationCheckboxRow
            label={`Quarry/Plant\n(For Mobile Crusher)`}
            value={data.quarryPlant}
            onChangeText={(text) => updateField('quarryPlant', text)}
            isSelected={selectedLocation === 'quarryPlant'}
            onCheckboxPress={() => toggleLocation('quarryPlant')}
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
          {data.parameters.map((param, idx) => (
            <View key={`param-${idx}`} style={styles.additionalParameterContainer}>
              <ParameterForm
                data={param}
                onUpdate={(field, value) => updateParameterField(idx, field, value)}
                showDelete={true}
                onDelete={() => removeParameter(idx)}
                index={idx}
              />
            </View>
          ))}

          {/* Add New Parameter Button */}
          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Text style={styles.addButtonText}>+ Add New Parameter</Text>
          </TouchableOpacity>
        </View>

        {/* Overall Compliance */}
        <View style={styles.overallSection}>
          <Text style={styles.overallLabel}>Overall Compliance Assessment:</Text>
          <FormInputField
            label=""
            value={data.overallCompliance}
            onChangeText={(text) => updateField('overallCompliance', text)}
          />
        </View>

        {/* Save & Next Button */}
        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveNext}>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    backgroundColor: '#F5FFEC',
    padding: 14,
    borderRadius: 0,
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'gray',
  },
  additionalParameterContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#D0D0D0',
  },
  addButton: {
    backgroundColor: '#E8E4FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 14,
    color: '#6B5FDB',
    fontWeight: '500',
  },
  overallSection: {
    backgroundColor: '#ba3f48',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  overallLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  saveNextButton: {
    backgroundColor: '#9B8FDB',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveNextText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});