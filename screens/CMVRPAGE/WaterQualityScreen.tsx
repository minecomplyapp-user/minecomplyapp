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
import { LocationSection } from '../../components/water-quality/LocationSection';
import { ParameterForm } from '../../components/water-quality/ParameterForm';
import { MMTSection } from '../../components/water-quality/MMTSection';
import { OverallComplianceSection } from '../../components/water-quality/OverallComplianceSection';
import { PortSection } from '../../components/water-quality/PortSection';
import { Parameter, LocationState, WaterQualityData } from '../../types/waterQuality.types';

type PortData = {
  id: string;
  portName: string;
  parameter: string;
  resultType: string;
  tssCurrent: string;
  tssPrevious: string;
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  eqplRedFlag: string;
  action: string;
  limit: string;
  remarks: string;
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  additionalParameters: Parameter[];
};

export default function WaterQualityScreen({ navigation }: any) {
  const [selectedLocations, setSelectedLocations] = useState<LocationState>({
    quarry: false,
    plant: false,
    quarryPlant: false,
  });

  const [data, setData] = useState<WaterQualityData>({
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
  const [ports, setPorts] = useState<PortData[]>([]);

  const handleLocationToggle = (location: keyof LocationState) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  const handleInputChange = (field: keyof WaterQualityData, value: string | boolean) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationInputChange = (field: string, value: string) => {
    handleInputChange(field as keyof WaterQualityData, value);
  };

  const handleMMTInputChange = (field: string, value: string) => {
    handleInputChange(field as keyof WaterQualityData, value);
  };

  const addParameter = () => {
    const newId = (parameters.length + 1).toString();
    setParameters((prev) => [
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
      },
    ]);
  };

  const updateParameter = (id: string, field: keyof Omit<Parameter, 'id'>, value: string | boolean) => {
    setParameters(
      parameters.map((param) => (param.id === id ? { ...param, [field]: value } : param))
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
            setParameters(parameters.filter((param) => param.id !== id));
          },
        },
      ]
    );
  };

  const addPort = () => {
    const newId = `port-${Date.now()}`;
    setPorts((prev) => [
      ...prev,
      {
        id: newId,
        portName: '',
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
        additionalParameters: [],
      },
    ]);
  };

  const updatePort = (portId: string, field: string, value: any) => {
    setPorts(
      ports.map((port) => (port.id === portId ? { ...port, [field]: value } : port))
    );
  };

  const deletePort = (portId: string) => {
    setPorts((prev) => prev.filter((port) => port.id !== portId));
  };

  const addPortParameter = (portId: string) => {
    setPorts(
      ports.map((port) => {
        if (port.id === portId) {
          const newId = `param-${Date.now()}`;
          return {
            ...port,
            additionalParameters: [
              ...port.additionalParameters,
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
              },
            ],
          };
        }
        return port;
      })
    );
  };

  const updatePortParameter = (
    portId: string,
    parameterId: string,
    field: keyof Omit<Parameter, 'id'>,
    value: string | boolean
  ) => {
    setPorts(
      ports.map((port) => {
        if (port.id === portId) {
          return {
            ...port,
            additionalParameters: port.additionalParameters.map((param) =>
              param.id === parameterId ? { ...param, [field]: value } : param
            ),
          };
        }
        return port;
      })
    );
  };

  const deletePortParameter = (portId: string, parameterIndex: number) => {
    setPorts(
      ports.map((port) => {
        if (port.id === portId) {
          return {
            ...port,
            additionalParameters: port.additionalParameters.filter(
              (_, i) => i !== parameterIndex
            ),
          };
        }
        return port;
      })
    );
  };

  const mainParameter: Parameter = {
    id: 'main',
    parameter: data.parameter,
    resultType: data.resultType,
    tssCurrent: data.tssCurrent,
    tssPrevious: data.tssPrevious,
    eqplRedFlag: data.eqplRedFlag,
    action: data.action,
    limit: data.limit,
    remarks: data.remarks,
    dateTime: data.dateTime,
    weatherWind: data.weatherWind,
    explanation: data.explanation,
    isExplanationNA: data.isExplanationNA,
  };

  const handleMainParameterUpdate = (field: keyof Omit<Parameter, 'id'>, value: string | boolean) => {
    handleInputChange(field as keyof WaterQualityData, value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumberBadge}>
            <Text style={styles.sectionNumber}>B.4.</Text>
          </View>
          <Text style={styles.sectionTitle}>Water Quality Impact Assessment</Text>
        </View>

        <LocationSection
          selectedLocations={selectedLocations}
          quarryInput={data.quarryInput}
          plantInput={data.plantInput}
          quarryPlantInput={data.quarryPlantInput}
          onLocationToggle={handleLocationToggle}
          onInputChange={handleLocationInputChange}
        />

        <View style={styles.parameterSection}>
          <ParameterForm
            parameter={mainParameter}
            isMain={true}
            onUpdate={handleMainParameterUpdate}
          />
          
          <MMTSection
            mmtCurrent={data.mmtCurrent}
            mmtPrevious={data.mmtPrevious}
            isMMTNA={data.isMMTNA}
            onInputChange={handleMMTInputChange}
            onNAToggle={() => handleInputChange('isMMTNA', !data.isMMTNA)}
          />

          {parameters.map((param) => (
            <ParameterForm
              key={param.id}
              parameter={param}
              isMain={false}
              onUpdate={(field, value) => updateParameter(param.id, field, value)}
              onDelete={() => removeParameter(param.id)}
            />
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Ionicons name="add-circle-outline" size={18} color="#2563EB" />
            <Text style={styles.addButtonText}>Add More Parameter</Text>
          </TouchableOpacity>
        </View>

        {ports.map((port, idx) => (
          <PortSection
            key={port.id}
            index={idx}
            port={port}
            onUpdate={updatePort}
            onDelete={deletePort}
            onAddParameter={addPortParameter}
            onUpdateParameter={updatePortParameter}
            onDeleteParameter={deletePortParameter}
          />
        ))}

        <OverallComplianceSection
          value={data.overallCompliance}
          onChangeText={(text) => handleInputChange('overallCompliance', text)}
        />

        <TouchableOpacity style={styles.addPortButton} onPress={addPort}>
          <Ionicons name="add" size={20} color="#2563EB" />
          <Text style={styles.addPortText}>Add PORT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={() => navigation.navigate('NoiseQuality')}
        >
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
  sectionHeader: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    gap: 12,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionNumberBadge: {
    backgroundColor: '#02217C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  sectionNumber: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#FFFFFF',
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color:'#02217C', 
    flex: 1,
  },
  parameterSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addButtonText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#02217C',
  },
  addPortButton: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor:'#02217C',
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addPortText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#02217C',
  },
  saveNextButton: {
    backgroundColor: '#02217C',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveNextText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});