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
import { CMSHeader } from '../components/CMSHeader';

type QuarterData = {
  first: string;
  second: string;
  third: string;
  fourth: string;
};

type NoiseParameter = {
  id: string;
  parameter: string;
  currentInSABR: string;
  previousInSABR: string;
  mmtCurrent: string;
  mmtPrevious: string;
  redFlag: string;
  action: string;
  limit: string;
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
};

export default function NoiseQualityScreen({ navigation }: any) {
  const [hasInternalNoise, setHasInternalNoise] = useState(false);
  
  // Main parameter fields
  const [parameter, setParameter] = useState('');
  const [parameterNA, setParameterNA] = useState(false);
  const [currentInSABR, setCurrentInSABR] = useState('');
  const [previousInSABR, setPreviousInSABR] = useState('');
  const [mmtCurrent, setMMTCurrent] = useState('');
  const [mmtPrevious, setMMTPrevious] = useState('');
  const [redFlag, setRedFlag] = useState('');
  const [action, setAction] = useState('');
  const [limit, setLimit] = useState('');
  const [remarks, setRemarks] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [weatherWind, setWeatherWind] = useState('');
  const [explanation, setExplanation] = useState('');
  const [explanationNA, setExplanationNA] = useState(false);
  
  // Additional parameters
  const [additionalParameters, setAdditionalParameters] = useState<NoiseParameter[]>([]);
  
  const [quarters, setQuarters] = useState<QuarterData>({
    first: '',
    second: '',
    third: '',
    fourth: '',
  });

  // Parameter Management Functions
  const addParameter = () => {
    const newId = `param-${Date.now()}`;
    setAdditionalParameters([
      ...additionalParameters,
      {
        id: newId,
        parameter: '',
        currentInSABR: '',
        previousInSABR: '',
        mmtCurrent: '',
        mmtPrevious: '',
        redFlag: '',
        action: '',
        limit: '',
        remarks: '',
        dateTime: '',
        weatherWind: '',
        explanation: '',
        isExplanationNA: false,
      },
    ]);
  };

  const updateParameter = (id: string, field: keyof Omit<NoiseParameter, 'id'>, value: string | boolean) => {
    setAdditionalParameters(
      additionalParameters.map((param) =>
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
            setAdditionalParameters(additionalParameters.filter((param) => param.id !== id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionNumber}>B.4.</Text>
          <Text style={styles.sectionTitle}>Noise Quality Impact Assessment</Text>
        </View>

        {/* Internal Noise Checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setHasInternalNoise(!hasInternalNoise)}
        >
          <Ionicons
            name={hasInternalNoise ? 'checkbox' : 'square-outline'}
            size={18}
            color="#000"
          />
          <Text style={styles.checkboxLabel}>
            Attach internal noise level monitoring line graphs
          </Text>
        </TouchableOpacity>

        {/* Upload File/Image */}
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="cloud-upload-outline" size={18} color="#000" />
          <Text style={styles.uploadText}>Upload File/ Image</Text>
        </TouchableOpacity>

        {/* Main Form Container */}
        <View style={styles.formContainer}>
          {/* Parameter Section */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Parameter:</Text>
            <TextInput
              style={styles.input}
              value={parameter}
              onChangeText={setParameter}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.naCheckbox}
              onPress={() => setParameterNA(!parameterNA)}
            >
              <Ionicons
                name={parameterNA ? 'checkbox' : 'square-outline'}
                size={18}
                color="#000"
              />
              <Text style={styles.naText}>N/A</Text>
            </TouchableOpacity>
          </View>

          {/* Results Section */}
          <Text style={styles.subsectionLabel}>Results:</Text>
          <View style={styles.resultsContainer}>
            <View style={styles.resultColumn}>
              <Text style={styles.columnLabel}>In SABR</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Current :</Text>
                <TextInput
                  style={styles.smallInput}
                  value={currentInSABR}
                  onChangeText={setCurrentInSABR}
                  placeholder="Type here..."
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Previous:</Text>
                <TextInput
                  style={styles.smallInput}
                  value={previousInSABR}
                  onChangeText={setPreviousInSABR}
                  placeholder="Type here..."
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.resultColumn}>
              <Text style={styles.columnLabel}>MMT Confirmatory Sampling</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Current :</Text>
                <TextInput
                  style={styles.smallInput}
                  value={mmtCurrent}
                  onChangeText={setMMTCurrent}
                  placeholder="Type here..."
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Previous:</Text>
                <TextInput
                  style={styles.smallInput}
                  value={mmtPrevious}
                  onChangeText={setMMTPrevious}
                  placeholder="Type here..."
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* EQPL Standard Section */}
          <Text style={styles.subsectionLabel}>
            EQPL (Environmental Quality Performance Level):
          </Text>
          <View style={styles.eqplRow}>
            <Text style={styles.eqplLabel}>Red Flag:</Text>
            <TextInput
              style={styles.mediumInput}
              value={redFlag}
              onChangeText={setRedFlag}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.eqplRow}>
            <Text style={styles.eqplLabel}>Action:</Text>
            <TextInput
              style={styles.mediumInput}
              value={action}
              onChangeText={setAction}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.eqplRow}>
            <Text style={styles.eqplLabel}>Limit (DENR std. PM 2.5):</Text>
            <TextInput
              style={styles.mediumInput}
              value={limit}
              onChangeText={setLimit}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Remarks */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>REMARKS:</Text>
            <TextInput
              style={styles.wideInput}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Add More Parameter Button */}
          <TouchableOpacity style={styles.addMoreButton} onPress={addParameter}>
            <Text style={styles.addMoreText}>+ Add More Parameter</Text>
          </TouchableOpacity>

          {/* Date/Time of Sampling */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date/Time of Sampling:</Text>
            <TextInput
              style={styles.wideInput}
              value={dateTime}
              onChangeText={setDateTime}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Weather and Wind Direction */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Weather and Wind Direction:</Text>
            <TextInput
              style={styles.wideInput}
              value={weatherWind}
              onChangeText={setWeatherWind}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Explanation */}
          <View style={styles.explanationRow}>
            <Text style={styles.explanationLabel}>
              Explanation of why confirmatory sampling was conducted for specific
              parameter or identified:
            </Text>
            <TouchableOpacity
              style={styles.naCheckbox}
              onPress={() => setExplanationNA(!explanationNA)}
            >
              <Ionicons
                name={explanationNA ? 'checkbox' : 'square-outline'}
                size={18}
                color="#000"
              />
              <Text style={styles.naText}>N/A</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.wideInput}
            value={explanation}
            onChangeText={setExplanation}
            placeholder="Type here..."
            placeholderTextColor="#999"
            editable={!explanationNA}
          />
        </View>

        {/* Additional Parameters */}
        {additionalParameters.map((param, index) => (
          <View key={param.id} style={styles.formContainer}>
            <View style={styles.parameterHeader}>
              <Text style={styles.parameterNumber}>Parameter {index + 2}:</Text>
              <TouchableOpacity
                style={styles.deleteParameterButton}
                onPress={() => removeParameter(param.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#B00020" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Parameter:</Text>
              <TextInput
                style={styles.input}
                value={param.parameter}
                onChangeText={(text) => updateParameter(param.id, 'parameter', text)}
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
            </View>

            {/* Results Section */}
            <Text style={styles.subsectionLabel}>Results:</Text>
            <View style={styles.resultsContainer}>
              <View style={styles.resultColumn}>
                <Text style={styles.columnLabel}>In SABR</Text>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Current :</Text>
                  <TextInput
                    style={styles.smallInput}
                    value={param.currentInSABR}
                    onChangeText={(text) => updateParameter(param.id, 'currentInSABR', text)}
                    placeholder="Type here..."
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Previous:</Text>
                  <TextInput
                    style={styles.smallInput}
                    value={param.previousInSABR}
                    onChangeText={(text) => updateParameter(param.id, 'previousInSABR', text)}
                    placeholder="Type here..."
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.resultColumn}>
                <Text style={styles.columnLabel}>MMT Confirmatory Sampling</Text>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Current :</Text>
                  <TextInput
                    style={styles.smallInput}
                    value={param.mmtCurrent}
                    onChangeText={(text) => updateParameter(param.id, 'mmtCurrent', text)}
                    placeholder="Type here..."
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Previous:</Text>
                  <TextInput
                    style={styles.smallInput}
                    value={param.mmtPrevious}
                    onChangeText={(text) => updateParameter(param.id, 'mmtPrevious', text)}
                    placeholder="Type here..."
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>

            {/* EQPL Standard Section */}
            <Text style={styles.subsectionLabel}>
              EQPL (Environmental Quality Performance Level):
            </Text>
            <View style={styles.eqplRow}>
              <Text style={styles.eqplLabel}>Red Flag:</Text>
              <TextInput
                style={styles.mediumInput}
                value={param.redFlag}
                onChangeText={(text) => updateParameter(param.id, 'redFlag', text)}
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.eqplRow}>
              <Text style={styles.eqplLabel}>Action:</Text>
              <TextInput
                style={styles.mediumInput}
                value={param.action}
                onChangeText={(text) => updateParameter(param.id, 'action', text)}
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.eqplRow}>
              <Text style={styles.eqplLabel}>Limit (DENR std. PM 2.5):</Text>
              <TextInput
                style={styles.mediumInput}
                value={param.limit}
                onChangeText={(text) => updateParameter(param.id, 'limit', text)}
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
            </View>

            {/* Remarks */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>REMARKS:</Text>
              <TextInput
                style={styles.wideInput}
                value={param.remarks}
                onChangeText={(text) => updateParameter(param.id, 'remarks', text)}
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
            </View>

            {/* Date/Time of Sampling */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Date/Time of Sampling:</Text>
              <TextInput
                style={styles.wideInput}
                value={param.dateTime}
                onChangeText={(text) => updateParameter(param.id, 'dateTime', text)}
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
            </View>

            {/* Weather and Wind Direction */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Weather and Wind Direction:</Text>
              <TextInput
                style={styles.wideInput}
                value={param.weatherWind}
                onChangeText={(text) => updateParameter(param.id, 'weatherWind', text)}
                placeholder="Type here..."
                placeholderTextColor="#999"
              />
            </View>

            {/* Explanation */}
            <View style={styles.explanationRow}>
              <Text style={styles.explanationLabel}>
                Explanation of why confirmatory sampling was conducted for specific
                parameter or identified:
              </Text>
              <TouchableOpacity
                style={styles.naCheckbox}
                onPress={() => updateParameter(param.id, 'isExplanationNA', !param.isExplanationNA)}
              >
                <Ionicons
                  name={param.isExplanationNA ? 'checkbox' : 'square-outline'}
                  size={18}
                  color="#000"
                />
                <Text style={styles.naText}>N/A</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.wideInput}
              value={param.explanation}
              onChangeText={(text) => updateParameter(param.id, 'explanation', text)}
              placeholder="Type here..."
              placeholderTextColor="#999"
              editable={!param.isExplanationNA}
            />
          </View>
        ))}

        {/* Overall Noise Quality Assessment */}
        <View style={styles.overallSection}>
          <Text style={styles.overallTitle}>
            Overall Noise Quality Impact Assessment
          </Text>
        </View>

        {/* Quarters Section */}
        <View style={styles.quartersContainer}>
          <View style={styles.quarterRow}>
            <View style={styles.quarterCheckbox}>
              <Ionicons name="radio-button-on-outline" size={18} color="#000" />
              <Text style={styles.quarterLabel}>1st Quarter:</Text>
            </View>
            <TextInput
              style={styles.quarterInput}
              value={quarters.first}
              onChangeText={(text) => setQuarters({ ...quarters, first: text })}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.quarterRow}>
            <View style={styles.quarterCheckbox}>
              <Ionicons name="radio-button-on-outline" size={18} color="#000" />
              <Text style={styles.quarterLabel}>3rd Quarter:</Text>
            </View>
            <TextInput
              style={styles.quarterInput}
              value={quarters.third}
              onChangeText={(text) => setQuarters({ ...quarters, third: text })}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.quarterRow}>
            <View style={styles.quarterCheckbox}>
              <Ionicons name="radio-button-on-outline" size={18} color="#000" />
              <Text style={styles.quarterLabel}>2nd Quarter:</Text>
            </View>
            <TextInput
              style={styles.quarterInput}
              value={quarters.second}
              onChangeText={(text) => setQuarters({ ...quarters, second: text })}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.quarterRow}>
            <View style={styles.quarterCheckbox}>
              <Ionicons name="radio-button-on-outline" size={18} color="#000" />
              <Text style={styles.quarterLabel}>4th Quarter:</Text>
            </View>
            <TextInput
              style={styles.quarterInput}
              value={quarters.fourth}
              onChangeText={(text) => setQuarters({ ...quarters, fourth: text })}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Save & Next Button */}
        <TouchableOpacity style={styles.saveNextButton}>
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
  sectionHeader: {
    backgroundColor: '#E8A5A5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#000',
  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#000',
    marginLeft: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 13,
    color: '#000',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  formContainer: {
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    marginBottom: 16,
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameterNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  deleteParameterButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    borderRadius: 4,
  },
  naCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  naText: {
    fontSize: 11,
    color: '#000',
    marginLeft: 4,
  },
  subsectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 4,
  },
  resultsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  resultColumn: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  resultRow: {
    marginBottom: 6,
  },
  resultLabel: {
    fontSize: 10,
    color: '#000',
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    borderRadius: 4,
  },
  eqplRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eqplLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    width: 160,
  },
  mediumInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    borderRadius: 4,
  },
  wideInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    borderRadius: 4,
  },
  addMoreButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 12,
  },
  addMoreText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
  },
  explanationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  overallSection: {
    backgroundColor: '#C8A5A5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    marginBottom: 16,
  },
  overallTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  quartersContainer: {
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    marginBottom: 16,
  },
  quarterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quarterCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  quarterLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    marginLeft: 6,
  },
  quarterInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    borderRadius: 4,
  },
  saveNextButton: {
    backgroundColor: '#7C6FDB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveNextText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});