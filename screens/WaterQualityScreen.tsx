import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CMSHeader } from '../components/CMSHeader';

type Parameter = {
  id: string;
  parameter: string;
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  eqplRedFlag: string;
  action: string;
  limit: string;
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
};

export default function WaterQualityScreen({ navigation }: any) {
  const [selectedLocations, setSelectedLocations] = useState({
    quarry: false,
    plant: false,
    quarryPlant: false,
  });
  
  const [data, setData] = useState({
    quarryInput: '',
    plantInput: '',
    quarryPlantInput: '',
    parameter: '',
    resultType: 'Month',
    tssCurrent: '',
    tssPrevious: '',
    mmtCurrent: '',
    mmtPrevious: '',
    isMMTNA: false,
    eqplRedFlag: '',
    action: '',
    limit: '',
    remarks: '',
    dateTime: '',
    weatherWind: '',
    explanation: '',
    isExplanationNA: false,
    overallCompliance: '',
  });

  const [parameters, setParameters] = useState<Parameter[]>([]);

  const handleLocationToggle = (location: keyof typeof selectedLocations) => {
    setSelectedLocations(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };

  const handleInputChange = (field: keyof typeof data, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addParameter = () => {
    const newId = (parameters.length + 1).toString();
    setParameters(prev => [
      ...prev,
      {
        id: newId,
        parameter: '',
        resultType: 'Month',
        tssCurrent: '',
        tssPrevious: '',
        eqplRedFlag: '',
        action: '',
        limit: '',
        remarks: '',
        dateTime: '',
        weatherWind: '',
        explanation: '',
        isExplanationNA: false,
      }
    ]);
  };

  const updateParameter = (id: string, field: keyof Omit<Parameter, 'id'>, value: string | boolean) => {
    setParameters(parameters.map(param =>
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeParameter = (index: number) => {
    setParameters(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionNumber}>B.4.</Text>
          <Text style={styles.sectionTitle}>Water Quality Impact Assessment</Text>
        </View>

        {/* Location Section */}
        <View style={styles.formSection}>
          <View style={styles.formRow}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => handleLocationToggle('quarry')}
            >
              {selectedLocations.quarry && <View style={styles.checkboxFill} />}
            </TouchableOpacity>
            <Text style={styles.formLabel}>Quarry</Text>
            <TextInput
              style={styles.formInput}
              value={data.quarryInput}
              onChangeText={(text) => handleInputChange('quarryInput', text)}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formRow}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => handleLocationToggle('plant')}
            >
              {selectedLocations.plant && <View style={styles.checkboxFill} />}
            </TouchableOpacity>
            <Text style={styles.formLabel}>Plant</Text>
            <TextInput
              style={styles.formInput}
              value={data.plantInput}
              onChangeText={(text) => handleInputChange('plantInput', text)}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formRow}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => handleLocationToggle('quarryPlant')}
            >
              {selectedLocations.quarryPlant && <View style={styles.checkboxFill} />}
            </TouchableOpacity>
            <Text style={styles.formLabel}>Quarry/Plant</Text>
            <TextInput
              style={styles.formInput}
              value={data.quarryPlantInput}
              onChangeText={(text) => handleInputChange('quarryPlantInput', text)}
              placeholder="Type here..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Parameter Section - ALL IN ONE BOX */}
        <View style={styles.parameterSection}>
          {/* MAIN PARAMETER */}
          <View style={styles.parameterHeader}>
            <Text style={styles.parameterLabel}>Parameter:</Text>
          </View>
          
          <TextInput
            style={styles.parameterInput}
            value={data.parameter}
            onChangeText={(text) => handleInputChange('parameter', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
          />

          {/* MMT - ONLY IN MAIN */}
          <View style={styles.mmtSection}>
            <View style={styles.mmtHeader}>
              <Text style={styles.mmtLabel}>MMT Confirmatory Sampling</Text>
              <View style={styles.naContainer}>
                <TouchableOpacity
                  style={styles.naCheckbox}
                  onPress={() => handleInputChange('isMMTNA', !data.isMMTNA)}
                >
                  {data.isMMTNA && <View style={styles.checkboxFill} />}
                </TouchableOpacity>
                <Text style={styles.naLabel}>N/A</Text>
              </View>
            </View>

            <View style={styles.mmtInputs}>
              <View style={styles.mmtInputGroup}>
                <Text style={styles.mmtInputLabel}>Current :</Text>
                <TextInput
                  style={[styles.mmtInput, data.isMMTNA && styles.disabledInput]}
                  value={data.mmtCurrent}
                  onChangeText={(text) => handleInputChange('mmtCurrent', text)}
                  placeholder="Type here..."
                  placeholderTextColor="#B0B0B0"
                  editable={!data.isMMTNA}
                />
              </View>
              <View style={styles.mmtInputGroup}>
                <Text style={styles.mmtInputLabel}>Previous:</Text>
                <TextInput
                  style={[styles.mmtInput, data.isMMTNA && styles.disabledInput]}
                  value={data.mmtPrevious}
                  onChangeText={(text) => handleInputChange('mmtPrevious', text)}
                  placeholder="Type here..."
                  placeholderTextColor="#B0B0B0"
                  editable={!data.isMMTNA}
                />
              </View>
            </View>
          </View>

          {/* Result Internal Monitoring */}
          <View style={styles.resultHeader}>
            <Text style={styles.resultLabelItalic}>Result:</Text>
            <Text style={styles.resultLabel}>Internal Monitoring</Text>
            <TextInput
              style={styles.monthInput}
              value={data.resultType}
              onChangeText={(text) => handleInputChange('resultType', text)}
              placeholder="Month"
              placeholderTextColor="#999"
            />
          </View>

          {/* TSS */}
          <View style={styles.tssRow}>
            <TouchableOpacity style={styles.checkbox}>
              <View style={styles.checkboxEmpty} />
            </TouchableOpacity>
            <View style={styles.tssContent}>
              <Text style={styles.tssName}>TSS 01</Text>
              <View style={styles.tssInputs}>
                <View style={styles.tssInputGroup}>
                  <Text style={styles.tssInputLabel}>Current :</Text>
                  <TextInput
                    style={styles.tssInput}
                    value={data.tssCurrent}
                    onChangeText={(text) => handleInputChange('tssCurrent', text)}
                    placeholder="Type here..."
                    placeholderTextColor="#B0B0B0"
                  />
                </View>
                <View style={styles.tssInputGroup}>
                  <Text style={styles.tssInputLabel}>Previous:</Text>
                  <TextInput
                    style={styles.tssInput}
                    value={data.tssPrevious}
                    onChangeText={(text) => handleInputChange('tssPrevious', text)}
                    placeholder="Type here..."
                    placeholderTextColor="#B0B0B0"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* DENR Standard */}
          <View style={styles.denrSection}>
            <Text style={styles.denrTitle}>DENR Standard:</Text>
            
            <View style={styles.denrInputRow}>
              <View style={styles.denrInputGroup}>
                <View style={styles.denrLabelContainer}>
                  <TouchableOpacity style={styles.checkbox}>
                    <View style={styles.checkboxEmpty} />
                  </TouchableOpacity>
                  <Text style={styles.denrInputLabel}>Red Flag:</Text>
                </View>
                <TextInput
                  style={styles.denrStandardInput}
                  value={data.eqplRedFlag}
                  onChangeText={(text) => handleInputChange('eqplRedFlag', text)}
                  placeholder="Type here..."
                  placeholderTextColor="#B0B0B0"
                />
              </View>

              <View style={styles.denrInputGroup}>
                <View style={styles.denrLabelContainer}>
                  <TouchableOpacity style={styles.checkbox}>
                    <View style={styles.checkboxEmpty} />
                  </TouchableOpacity>
                  <Text style={styles.denrInputLabel}>Action:</Text>
                </View>
                <TextInput
                  style={styles.denrStandardInput}
                  value={data.action}
                  onChangeText={(text) => handleInputChange('action', text)}
                  placeholder="Type here..."
                  placeholderTextColor="#B0B0B0"
                />
              </View>

              <View style={styles.denrInputGroup}>
                <View style={styles.denrLabelContainer}>
                  <TouchableOpacity style={styles.checkbox}>
                    <View style={styles.checkboxEmpty} />
                  </TouchableOpacity>
                  <Text style={styles.denrInputLabel}>Limit (mg/L):</Text>
                </View>
                <TextInput
                  style={styles.denrStandardInput}
                  value={data.limit}
                  onChangeText={(text) => handleInputChange('limit', text)}
                  placeholder="Type here..."
                  placeholderTextColor="#B0B0B0"
                />
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>REMARKS:</Text>
          <TextInput
            style={styles.textInput}
            value={data.remarks}
            onChangeText={(text) => handleInputChange('remarks', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.fieldLabel}>Date/Time of Sampling:</Text>
          <TextInput
            style={styles.input}
            value={data.dateTime}
            onChangeText={(text) => handleInputChange('dateTime', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
          />

          <Text style={styles.fieldLabel}>Weather and Wind Direction:</Text>
          <TextInput
            style={styles.input}
            value={data.weatherWind}
            onChangeText={(text) => handleInputChange('weatherWind', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
          />

          <View style={styles.explanationHeader}>
            <Text style={styles.fieldLabel}>
              Explanation of why confirmatory{'\n'}sampling was conducted for specific{'\n'}parameter in this sampling station:
            </Text>
            <View style={styles.naContainer}>
              <TouchableOpacity
                style={styles.naCheckbox}
                onPress={() => handleInputChange('isExplanationNA', !data.isExplanationNA)}
              >
                {data.isExplanationNA && <View style={styles.checkboxFill} />}
              </TouchableOpacity>
              <Text style={styles.naLabel}>N/A</Text>
            </View>
          </View>
          <TextInput
            style={[styles.textInput, data.isExplanationNA && styles.disabledInput]}
            value={data.explanation}
            onChangeText={(text) => handleInputChange('explanation', text)}
            placeholder="Type here..."
            placeholderTextColor="#B0B0B0"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!data.isExplanationNA}
          />

          {/* ADDITIONAL PARAMETERS */}
          {parameters.map((p, idx) => (
            <View key={p.id} style={styles.additionalParameterContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeParameter(idx)}
              >
                <Ionicons name="trash-outline" size={14} color="#B00020" />
              </TouchableOpacity>

              <View style={styles.parameterHeader}>
                <Text style={styles.parameterLabel}>Parameter {idx + 1}:</Text>
              </View>
              
              <TextInput
                style={styles.parameterInput}
                value={p.parameter}
                onChangeText={(text) => updateParameter(p.id, 'parameter', text)}
                placeholder="Type here..."
                placeholderTextColor="#B0B0B0"
              />

              <View style={styles.resultHeader}>
                <Text style={styles.resultLabelItalic}>Result:</Text>
                <Text style={styles.resultLabel}>Internal Monitoring</Text>
                <TextInput
                  style={styles.monthInput}
                  value={p.resultType}
                  onChangeText={(text) => updateParameter(p.id, 'resultType', text)}
                  placeholder="Month"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.tssRow}>
                <TouchableOpacity style={styles.checkbox}>
                  <View style={styles.checkboxEmpty} />
                </TouchableOpacity>
                <View style={styles.tssContent}>
                  <Text style={styles.tssName}>TSS 01</Text>
                  <View style={styles.tssInputs}>
                    <View style={styles.tssInputGroup}>
                      <Text style={styles.tssInputLabel}>Current :</Text>
                      <TextInput
                        style={styles.tssInput}
                        value={p.tssCurrent}
                        onChangeText={(text) => updateParameter(p.id, 'tssCurrent', text)}
                        placeholder="Type here..."
                        placeholderTextColor="#B0B0B0"
                      />
                    </View>
                    <View style={styles.tssInputGroup}>
                      <Text style={styles.tssInputLabel}>Previous:</Text>
                      <TextInput
                        style={styles.tssInput}
                        value={p.tssPrevious}
                        onChangeText={(text) => updateParameter(p.id, 'tssPrevious', text)}
                        placeholder="Type here..."
                        placeholderTextColor="#B0B0B0"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.denrSection}>
                <Text style={styles.denrTitle}>DENR Standard:</Text>
                
                <View style={styles.denrInputRow}>
                  <View style={styles.denrInputGroup}>
                    <View style={styles.denrLabelContainer}>
                      <TouchableOpacity style={styles.checkbox}>
                        <View style={styles.checkboxEmpty} />
                      </TouchableOpacity>
                      <Text style={styles.denrInputLabel}>Red Flag:</Text>
                    </View>
                    <TextInput
                      style={styles.denrStandardInput}
                      value={p.eqplRedFlag}
                      onChangeText={(text) => updateParameter(p.id, 'eqplRedFlag', text)}
                      placeholder="Type here..."
                      placeholderTextColor="#B0B0B0"
                    />
                  </View>

                  <View style={styles.denrInputGroup}>
                    <View style={styles.denrLabelContainer}>
                      <TouchableOpacity style={styles.checkbox}>
                        <View style={styles.checkboxEmpty} />
                      </TouchableOpacity>
                      <Text style={styles.denrInputLabel}>Action:</Text>
                    </View>
                    <TextInput
                      style={styles.denrStandardInput}
                      value={p.action}
                      onChangeText={(text) => updateParameter(p.id, 'action', text)}
                      placeholder="Type here..."
                      placeholderTextColor="#B0B0B0"
                    />
                  </View>

                  <View style={styles.denrInputGroup}>
                    <View style={styles.denrLabelContainer}>
                      <TouchableOpacity style={styles.checkbox}>
                        <View style={styles.checkboxEmpty} />
                      </TouchableOpacity>
                      <Text style={styles.denrInputLabel}>Limit (mg/L):</Text>
                    </View>
                    <TextInput
                      style={styles.denrStandardInput}
                      value={p.limit}
                      onChangeText={(text) => updateParameter(p.id, 'limit', text)}
                      placeholder="Type here..."
                      placeholderTextColor="#B0B0B0"
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.sectionLabel}>REMARKS:</Text>
              <TextInput
                style={styles.textInput}
                value={p.remarks}
                onChangeText={(text) => updateParameter(p.id, 'remarks', text)}
                placeholder="Type here..."
                placeholderTextColor="#B0B0B0"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.fieldLabel}>Date/Time of Sampling:</Text>
              <TextInput
                style={styles.input}
                value={p.dateTime}
                onChangeText={(text) => updateParameter(p.id, 'dateTime', text)}
                placeholder="Type here..."
                placeholderTextColor="#B0B0B0"
              />

              <Text style={styles.fieldLabel}>Weather and Wind Direction:</Text>
              <TextInput
                style={styles.input}
                value={p.weatherWind}
                onChangeText={(text) => updateParameter(p.id, 'weatherWind', text)}
                placeholder="Type here..."
                placeholderTextColor="#B0B0B0"
              />

              <View style={styles.explanationHeader}>
                <Text style={styles.fieldLabel}>
                  Explanation of why confirmatory{'\n'}sampling was conducted for specific{'\n'}parameter in this sampling station:
                </Text>
                <View style={styles.naContainer}>
                  <TouchableOpacity
                    style={styles.naCheckbox}
                    onPress={() => updateParameter(p.id, 'isExplanationNA', !p.isExplanationNA)}
                  >
                    {p.isExplanationNA && <View style={styles.checkboxFill} />}
                  </TouchableOpacity>
                  <Text style={styles.naLabel}>N/A</Text>
                </View>
              </View>
              <TextInput
                style={[styles.textInput, p.isExplanationNA && styles.disabledInput]}
                value={p.explanation}
                onChangeText={(text) => updateParameter(p.id, 'explanation', text)}
                placeholder="Type here..."
                placeholderTextColor="#B0B0B0"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!p.isExplanationNA}
              />
            </View>
          ))}

          {/* ADD BUTTON - INSIDE BOX */}
          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Text style={styles.addButtonText}>+ Add More Parameter</Text>
          </TouchableOpacity>
        </View>

        {/* Overall Compliance */}
        <View style={styles.overallSection}>
          <Text style={styles.overallLabel}>Overall Compliance Assessment:</Text>
          <TextInput
            style={styles.overallInput}
            value={data.overallCompliance}
            onChangeText={(text) => handleInputChange('overallCompliance', text)}
            placeholder="TYPE HERE..."
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <TouchableOpacity style={styles.addPortButton}>
          <Text style={styles.addPortText}>+ Add PORT</Text>
        </TouchableOpacity>

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
    backgroundColor: '#FFB3BA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
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
    flex: 1,
  },
  formSection: {
    backgroundColor: '#E6F8FF',
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'gray',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  checkboxFill: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
  },
  checkboxEmpty: {
    width: 0,
    height: 0,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    width: 90,
  },
  formInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    borderRadius: 6,
  },
  parameterSection: {
    backgroundColor: '#E6F8FF',
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000',
  },
  additionalParameterContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#CDEFF7',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    zIndex: 10,
  },
  parameterHeader: {
    marginBottom: 8,
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  parameterInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
    borderRadius: 6,
  },
  mmtSection: {
    marginBottom: 16,
  },
  mmtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mmtLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  naContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  naCheckbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  naLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  mmtInputs: {
    flexDirection: 'row',
  },
  mmtInputGroup: {
    flex: 1,
    marginRight: 12,
  },
  mmtInputLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  mmtInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    borderRadius: 6,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabelItalic: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#000',
    marginRight: 6,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginRight: 6,
  },
  monthInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    width: 70,
    borderRadius: 6,
  },
  tssRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tssContent: {
    flex: 1,
    marginLeft: 8,
  },
  tssName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  tssInputs: {
    flexDirection: 'row',
  },
  tssInputGroup: {
    flex: 1,
    marginRight: 12,
  },
  tssInputLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  tssInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    borderRadius: 6,
  },
  denrSection: {
    marginBottom: 16,
  },
  denrTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  denrInputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  denrInputGroup: {
    flex: 1,
    minWidth: 200,
    marginRight: 12,
    marginBottom: 12,
  },
  denrLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  denrInputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
  },
  denrStandardInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    borderRadius: 6,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderRadius: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
    borderRadius: 6,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  overallSection: {
    backgroundColor: '#ba3f48',
    marginBottom: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overallLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  overallInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDEFF7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '500',
    borderRadius: 8,
  },
  addPortButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  addPortText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
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