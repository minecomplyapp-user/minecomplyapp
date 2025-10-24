import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CMSHeader } from '../components/CMSHeader';
import { ProjectImpacts } from '../components/EIA/ProjectImpacts';
import { OperationSectionComponent, OperationSection } from '../components/EIA/OperationSection';
import { MitigatingMeasure } from '../components/EIA/MitigatingMeasureForm';
import { OverallCompliance } from '../components/EIA/OverallCompliance';

interface EIAComplianceScreenProps {
  navigation: any;
  route: any;
}

const EIAComplianceScreen: React.FC<EIAComplianceScreenProps> = ({ navigation, route }) => {
  const [preConstruction, setPreConstruction] = useState<'yes' | 'no' | null>(null);
  const [construction, setConstruction] = useState<'yes' | 'no' | null>(null);
  
  const [quarryOperation, setQuarryOperation] = useState<OperationSection>({
    title: 'Quarry Operation',
    isNA: false,
    measures: [
      {
        id: '1',
        planned: '',
        actualObservation: '',
        isEffective: null,
        recommendations: '',
      },
    ],
  });

  const [plantOperation, setPlantOperation] = useState<OperationSection>({
    title: 'Plant Operation',
    isNA: false,
    measures: [
      {
        id: '1',
        planned: '',
        actualObservation: '',
        isEffective: null,
        recommendations: '',
      },
    ],
  });

  const [portOperation, setPortOperation] = useState<OperationSection>({
    title: 'Port Operation',
    isNA: false,
    measures: [
      {
        id: '1',
        planned: '',
        actualObservation: '',
        isEffective: null,
        recommendations: '',
      },
    ],
  });

  const [overallCompliance, setOverallCompliance] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSave = () => {
    console.log('Saving EIA Compliance data...');
    // Implement save logic
  };

  const handleSaveAndNext = () => {
    console.log('Saving and proceeding to next page...');
    console.log({
      preConstruction,
      construction,
      quarryOperation,
      plantOperation,
      portOperation,
      overallCompliance,
    });
    navigation.navigate('EnvironmentalCompliance');
  };

  const addMeasure = (section: 'quarry' | 'plant' | 'port') => {
    const newMeasure: MitigatingMeasure = {
      id: Date.now().toString(),
      planned: '',
      actualObservation: '',
      isEffective: null,
      recommendations: '',
    };

    if (section === 'quarry') {
      setQuarryOperation({
        ...quarryOperation,
        measures: [...quarryOperation.measures, newMeasure],
      });
    } else if (section === 'plant') {
      setPlantOperation({
        ...plantOperation,
        measures: [...plantOperation.measures, newMeasure],
      });
    } else {
      setPortOperation({
        ...portOperation,
        measures: [...portOperation.measures, newMeasure],
      });
    }
  };

  const updateMeasure = (
    section: 'quarry' | 'plant' | 'port',
    measureId: string,
    field: keyof MitigatingMeasure,
    value: any
  ) => {
    const updateSection = (current: OperationSection) => ({
      ...current,
      measures: current.measures.map((m) =>
        m.id === measureId ? { ...m, [field]: value } : m
      ),
    });

    if (section === 'quarry') {
      setQuarryOperation(updateSection(quarryOperation));
    } else if (section === 'plant') {
      setPlantOperation(updateSection(plantOperation));
    } else {
      setPortOperation(updateSection(portOperation));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName="File_Name"
          onSave={handleSave}
          onBack={() => navigation.goBack()}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderText}>
            2. Compliance to Impact Management Commitments in EIA report & EPEP
          </Text>
        </View>

        <ProjectImpacts
          preConstruction={preConstruction}
          construction={construction}
          onPreConstructionChange={setPreConstruction}
          onConstructionChange={setConstruction}
        />

        <Text style={styles.mainTitle}>
          Implementation of Environmental Impact Control Strategies
        </Text>

        <OperationSectionComponent
          section={quarryOperation}
          onNAToggle={() => setQuarryOperation({ ...quarryOperation, isNA: !quarryOperation.isNA })}
          onMeasureUpdate={(measureId, field, value) => updateMeasure('quarry', measureId, field, value)}
          onAddMeasure={() => addMeasure('quarry')}
        />

        <OperationSectionComponent
          section={plantOperation}
          onNAToggle={() => setPlantOperation({ ...plantOperation, isNA: !plantOperation.isNA })}
          onMeasureUpdate={(measureId, field, value) => updateMeasure('plant', measureId, field, value)}
          onAddMeasure={() => addMeasure('plant')}
        />

        <OperationSectionComponent
          section={portOperation}
          onNAToggle={() => setPortOperation({ ...portOperation, isNA: !portOperation.isNA })}
          onMeasureUpdate={(measureId, field, value) => updateMeasure('port', measureId, field, value)}
          onAddMeasure={() => addMeasure('port')}
        />

        <OverallCompliance
          value={overallCompliance}
          onChangeText={setOverallCompliance}
        />

        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  pageHeader: {
    backgroundColor: '#fecaca',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  pageHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  saveNextButton: {
    backgroundColor: '#818cf8',
    marginBottom: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveNextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EIAComplianceScreen;