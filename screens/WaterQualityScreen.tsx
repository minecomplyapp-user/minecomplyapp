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
import { CMSHeader } from '../components/CMSHeader';
import { LocationSection } from '../components/water-quality/LocationSection';
import { ParameterForm } from '../components/water-quality/ParameterForm';
import { MMTSection } from '../components/water-quality/MMTSection';
import { OverallComplianceSection } from '../components/water-quality/OverallComplianceSection';
import { PortSection } from '../components/water-quality/PortSection';
import { Parameter, LocationState, WaterQualityData } from '../types/waterQuality.types';

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

  // Port Management Functions
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
          <Text style={styles.sectionNumber}>B.4.</Text>
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
            <Text style={styles.addButtonText}>+ Add More Parameter</Text>
          </TouchableOpacity>
        </View>
        {/* Render Ports */}
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
          <Text style={styles.addPortText}>+ Add PORT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={() => navigation.navigate('NoiseQuality')}
        >
          <Text style={styles.saveNextText}>Save & Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  sectionHeader: {
    backgroundColor: '#FFB3BA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#000',
  },
  sectionNumber: { fontSize: 14, fontWeight: '700', color: '#000', marginRight: 6 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#000', flex: 1 },
  parameterSection: {
    backgroundColor: '#E6F8FF',
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000',
  },
  addButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 16,
  },
  addButtonText: { fontSize: 12, fontWeight: '500', color: '#000' },
  addPortButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  addPortText: { fontSize: 13, fontWeight: '500', color: '#000' },
  saveNextButton: {
    backgroundColor: '#7C6FDB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveNextText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
