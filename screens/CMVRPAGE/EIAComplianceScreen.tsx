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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from '../../components/CMSHeader';
import { ProjectImpacts } from '../../components/EIA/ProjectImpacts';
import { OperationSectionComponent, OperationSection } from '../../components/EIA/OperationSection';
import { MitigatingMeasure } from '../../components/EIA/MitigatingMeasureForm';
import { OverallCompliance } from '../../components/EIA/OverallCompliance';

type RootStackParamList = {
  EIACompliance: undefined;
  EnvironmentalCompliance: undefined;
};

type EIAComplianceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EIACompliance'>;

interface EIAComplianceScreenProps {
  navigation: EIAComplianceScreenNavigationProp;
  route: any;
}

const EIAComplianceScreen: React.FC<EIAComplianceScreenProps> = ({ navigation, route }) => {
  const [preConstruction, setPreConstruction] = useState<'yes' | 'no' | null>(null);
  const [construction, setConstruction] = useState<'yes' | 'no' | null>(null);

  const [quarryOperation, setQuarryOperation] = useState<OperationSection>({
    title: 'Quarry Operation',
    isNA: false,
    measures: [
      { id: '1', planned: '', actualObservation: '', isEffective: null, recommendations: '' },
    ],
  });

  const [plantOperation, setPlantOperation] = useState<OperationSection>({
    title: 'Plant Operation',
    isNA: false,
    measures: [
      { id: '1', planned: '', actualObservation: '', isEffective: null, recommendations: '' },
    ],
  });

  const [portOperation, setPortOperation] = useState<OperationSection>({
    title: 'Port Operation',
    isNA: false,
    measures: [
      { id: '1', planned: '', actualObservation: '', isEffective: null, recommendations: '' },
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
    const allData = {
        preConstruction,
        construction,
        quarryOperation,
        plantOperation,
        portOperation,
        overallCompliance,
    };
    console.log(JSON.stringify(allData, null, 2));
  };

  const handleSaveAndNext = () => {
    console.log('Saving and proceeding to next page...');
    handleSave();
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.titleText}>
            2. Compliance to Impact Management Commitments in EIA report & EPEP
          </Text>
        </View>

        <ProjectImpacts
          preConstruction={preConstruction}
          construction={construction}
          onPreConstructionChange={setPreConstruction}
          onConstructionChange={setConstruction}
        />

         <View style={styles.divider} />

        <Text style={styles.mainTitle}>
          Implementation of Environmental Impact Control Strategies
        </Text>

        <OperationSectionComponent
          section={quarryOperation}
          onNAToggle={() => setQuarryOperation({ ...quarryOperation, isNA: !quarryOperation.isNA })}
          onMeasureUpdate={(measureId, field, value) => updateMeasure('quarry', measureId, field, value)}
          onAddMeasure={() => addMeasure('quarry')}
        />
         <View style={styles.dividerSmall} />

        <OperationSectionComponent
          section={plantOperation}
          onNAToggle={() => setPlantOperation({ ...plantOperation, isNA: !plantOperation.isNA })}
          onMeasureUpdate={(measureId, field, value) => updateMeasure('plant', measureId, field, value)}
          onAddMeasure={() => addMeasure('plant')}
        />
         <View style={styles.dividerSmall} />

        <OperationSectionComponent
          section={portOperation}
          onNAToggle={() => setPortOperation({ ...portOperation, isNA: !portOperation.isNA })}
          onMeasureUpdate={(measureId, field, value) => updateMeasure('port', measureId, field, value)}
          onAddMeasure={() => addMeasure('port')}
        />

        <View style={styles.divider} />

        <OverallCompliance
          value={overallCompliance}
          onChangeText={setOverallCompliance}
        />

        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
           <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
     shadowColor: '#02217C',
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
  titleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#02217C',
  },
  titleAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#02217C',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  titleText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#02217C',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
   divider: {
    height: 1.5,
    backgroundColor: "#BFDBFE",
    marginVertical: 24,
  },
   dividerSmall: {
    height: 8,
    backgroundColor: "transparent",
    marginVertical: 8,
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#02217C',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  saveNextButton: {
    backgroundColor: '#02217C',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: '#02217C',
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

export default EIAComplianceScreen;