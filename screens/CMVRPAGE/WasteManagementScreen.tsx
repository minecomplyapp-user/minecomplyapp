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
import { Ionicons } from '@expo/vector-icons';
import { CMSHeader } from '../../components/CMSHeader';
import { QuarrySection } from '../../components/WasteManagement/QuarrySection';
// --- 1. Import the new PlantSection ---
import { PlantSection } from '../../components/WasteManagement/PlantSection';
import { PlantPortSection } from '../../components/WasteManagement/PlantPortSection';
import { PortSection } from '../../components/WasteManagement/PortSection';

type WasteEntry = {
  id: string;
  handling: string;
  storage: string;
  disposal: string;
};

type PlantPortSectionData = {
  typeOfWaste: string;
  eccEpepCommitments: WasteEntry[];
  isAdequate: 'YES' | 'NO' | null;
  previousRecord: string;
  q22025GeneratedHazardWastes: string;
};

type QuarrySectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
};

type PortSectionData = {
  noSignificantImpact: boolean;
  generateTable: boolean;
  N_A: boolean;
};

export default function WasteManagementScreen({ navigation }: any) {
  const [quarryData, setQuarryData] = useState<QuarrySectionData>({
    noSignificantImpact: false,
    generateTable: false,
  });

  // --- 2. Add state for the new PlantSection ---
  // (Using QuarrySectionData type as the structure is identical)
  const [plantSimpleData, setPlantSimpleData] = useState<QuarrySectionData>({
    noSignificantImpact: false,
    generateTable: false,
  });

  const [plantData, setPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: '',
    eccEpepCommitments: [
      { id: `waste-${Date.now()}-1`, handling: '', storage: '', disposal: '' },
    ],
    isAdequate: null,
    previousRecord: '',
    q22025GeneratedHazardWastes: '',
  });

  const [portData, setPortData] = useState<PortSectionData>({
    noSignificantImpact: false,
    generateTable: false,
    N_A: false,
  });

  const [portPlantData, setPortPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: '',
    eccEpepCommitments: [
      { id: `waste-${Date.now()}-2`, handling: '', storage: '', disposal: '' },
    ],
    isAdequate: null,
    previousRecord: '',
    q22025GeneratedHazardWastes: '',
  });

  const updateQuarryData = (field: keyof QuarrySectionData, value: boolean) => {
    setQuarryData((prev) => {
      if (field === 'noSignificantImpact') {
        return { ...prev, noSignificantImpact: value, generateTable: value ? false : prev.generateTable };
      } else if (field === 'generateTable') {
        return { ...prev, generateTable: value, noSignificantImpact: value ? false : prev.noSignificantImpact };
      }
      return prev;
    });
  };

  // --- 3. Add update handler for the new PlantSection ---
  const updatePlantSimpleData = (field: keyof QuarrySectionData, value: boolean) => {
    setPlantSimpleData((prev) => {
      if (field === 'noSignificantImpact') {
        return { ...prev, noSignificantImpact: value, generateTable: value ? false : prev.generateTable };
      } else if (field === 'generateTable') {
        return { ...prev, generateTable: value, noSignificantImpact: value ? false : prev.noSignificantImpact };
      }
      return prev;
    });
  };

  const updatePortData = (field: keyof PortSectionData, value: boolean) => {
    setPortData((prev) => {
      if (field === 'noSignificantImpact') {
        return { ...prev, noSignificantImpact: value, generateTable: value ? false : prev.generateTable, N_A: value ? false : prev.N_A };
      } else if (field === 'generateTable') {
        return { ...prev, generateTable: value, noSignificantImpact: value ? false : prev.noSignificantImpact, N_A: value ? false : prev.N_A };
      } else if (field === 'N_A') {
        return {
          ...prev,
          N_A: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          generateTable: value ? false : prev.generateTable,
        };
      }
      return prev;
    });
  };

  const addWasteEntry = (section: 'plant' | 'port') => {
    const newEntry = {
      id: `waste-${Date.now()}-${section}`,
      handling: '',
      storage: '',
      disposal: '',
    };
    if (section === 'plant') {
      setPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    } else {
      setPortPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    }
  };

  const updateWasteEntry = (
    section: 'plant' | 'port',
    id: string,
    field: keyof Omit<WasteEntry, 'id'>,
    value: string
  ) => {
    if (section === 'plant') {
      setPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    } else {
      setPortPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    }
  };

  const removeWasteEntry = (section: 'plant' | 'port', id: string) => {
    if (section === 'plant') {
      if (plantData.eccEpepCommitments.length > 1) {
        setPlantData((prev) => ({
          ...prev,
          eccEpepCommitments: prev.eccEpepCommitments.filter((entry) => entry.id !== id),
        }));
      } else {
        Alert.alert('Cannot Remove', 'At least one waste entry is required.');
      }
    } else {
      if (portPlantData.eccEpepCommitments.length > 1) {
        setPortPlantData((prev) => ({
          ...prev,
          eccEpepCommitments: prev.eccEpepCommitments.filter((entry) => entry.id !== id),
        }));
      } else {
        Alert.alert('Cannot Remove', 'At least one waste entry is required.');
      }
    }
  };

  const updatePlantData = (field: keyof PlantPortSectionData, value: any) => {
    setPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePortPlantData = (field: keyof PlantPortSectionData, value: any) => {
    setPortPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndNext = () => {
    console.log('Saving Waste Management data...');
    navigation.navigate('ChemicalSafety');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName="Waste Management"
          onBack={() => navigation.goBack()}
          onSave={() => Alert.alert('Saved', 'Data saved successfully')}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeaderContent}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>
              Compliance with Good Practice in Solid and Hazardous Waste Management
            </Text>
          </View>
        </View>

        <QuarrySection data={quarryData} onUpdate={updateQuarryData} />

        {/* --- 4. Add the new PlantSection component --- */}
        <PlantSection data={plantSimpleData} onUpdate={updatePlantSimpleData} />

        <PlantPortSection
          title="PLANT"
          icon="business"
          data={plantData}
          onUpdateData={updatePlantData}
          onAddWaste={() => addWasteEntry('plant')}
          onUpdateWaste={(id, field, value) => updateWasteEntry('plant', id, field, value)}
          onRemoveWaste={(id) => removeWasteEntry('plant', id)}
        />

        <PortSection data={portData} onUpdate={updatePortData} />

        {!portData.N_A && (
          <PlantPortSection
            title="PORT DETAILS"
            icon="boat"
            data={portPlantData}
            onUpdateData={updatePortPlantData}
            onAddWaste={() => addWasteEntry('port')}
            onUpdateWaste={(id, field, value) => updateWasteEntry('port', id, field, value)}
            onRemoveWaste={(id) => removeWasteEntry('port', id)}
          />
        )}

        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeaderContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#BFDBFE',
  },
  sectionBadge: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  sectionBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    flex: 1,
    letterSpacing: -0.3,
  },
  saveNextButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveNextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 32,
  },
});