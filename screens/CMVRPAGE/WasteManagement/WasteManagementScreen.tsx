import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { CMSHeader } from '../../../components/CMSHeader';
import { QuarrySection } from './components/QuarrySection';
import { PlantSection } from './components/PlantSection';
import { PlantPortSection } from './components/PlantPortSection';
import { PortSection } from './components/PortSection';
import {
  WasteEntry,
  PlantPortSectionData,
  QuarrySectionData,
  PortSectionData,
  PlantSectionData,
} from '../types/WasteManagementScreen.types';
import {
  styles,
  pickerSelectStyles,
} from '../styles/WasteManagementScreen.styles';

export default function WasteManagementScreen({ navigation }: any) {
  const [quarryData, setQuarryData] = useState<QuarrySectionData>({
    noSignificantImpact: false,
    generateTable: false,
    N_A: false,
  });

  const [plantSimpleData, setPlantSimpleData] = useState<PlantSectionData>({
    noSignificantImpact: false,
    generateTable: false,
    N_A: false,
  });

  const [selectedQuarter, setSelectedQuarter] = useState('Q2 2025');

  const quarterItems = [
    { label: 'Q1 2025', value: 'Q1 2025' },
    { label: 'Q2 2025', value: 'Q2 2025' },
    { label: 'Q3 2025', value: 'Q3 2025' },
    { label: 'Q4 2025', value: 'Q4 2025' },
  ];

  const [quarryPlantData, setQuarryPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: '',
    eccEpepCommitments: [
      {
        id: `waste-${Date.now()}-quarry`,
        handling: '',
        storage: '',
        disposal: '',
      },
    ],
    isAdequate: null,
    previousRecord: '',
    currentQuarterWaste: '',
  });

  const [plantData, setPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: '',
    eccEpepCommitments: [
      { id: `waste-${Date.now()}-1`, handling: '', storage: '', disposal: '' },
    ],
    isAdequate: null,
    previousRecord: '',
    currentQuarterWaste: '',
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
    currentQuarterWaste: '',
  });

  const updateQuarryData = (field: keyof QuarrySectionData, value: boolean) => {
    setQuarryData((prev) => {
      if (field === 'N_A') {
        return {
          ...prev,
          N_A: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === 'noSignificantImpact') {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === 'generateTable') {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
        };
      }
      return prev;
    });
  };

  const updatePlantSimpleData = (
    field: keyof PlantSectionData,
    value: boolean
  ) => {
    setPlantSimpleData((prev) => {
      if (field === 'N_A') {
        return {
          ...prev,
          N_A: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === 'noSignificantImpact') {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === 'generateTable') {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
        };
      }
      return prev;
    });
  };

  const updatePortData = (field: keyof PortSectionData, value: boolean) => {
    setPortData((prev) => {
      if (field === 'noSignificantImpact') {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
          N_A: value ? false : prev.N_A,
        };
      } else if (field === 'generateTable') {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          N_A: value ? false : prev.N_A,
        };
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

  const addWasteEntry = (section: 'quarry' | 'plant' | 'port') => {
    const newEntry = {
      id: `waste-${Date.now()}-${section}`,
      handling: '',
      storage: '',
      disposal: '',
    };

    if (section === 'quarry') {
      setQuarryPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    } else if (section === 'plant') {
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
    section: 'quarry' | 'plant' | 'port',
    id: string,
    field: keyof Omit<WasteEntry, 'id'>,
    value: string
  ) => {
    if (section === 'quarry') {
      setQuarryPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    } else if (section === 'plant') {
      setPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    } else if (section === 'port') {
      setPortPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    }
  };

  const removeWasteEntry = (
    section: 'quarry' | 'plant' | 'port',
    id: string
  ) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this waste entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (section === 'quarry') {
              if (quarryPlantData.eccEpepCommitments.length > 1) {
                setQuarryPlantData((prev) => ({
                  ...prev,
                  eccEpepCommitments: prev.eccEpepCommitments.filter(
                    (entry) => entry.id !== id
                  ),
                }));
              } else {
                Alert.alert(
                  'Cannot Remove',
                  'At least one waste entry is required.'
                );
              }
            } else if (section === 'plant') {
              if (plantData.eccEpepCommitments.length > 1) {
                setPlantData((prev) => ({
                  ...prev,
                  eccEpepCommitments: prev.eccEpepCommitments.filter(
                    (entry) => entry.id !== id
                  ),
                }));
              } else {
                Alert.alert(
                  'Cannot Remove',
                  'At least one waste entry is required.'
                );
              }
            } else if (section === 'port') {
              if (portPlantData.eccEpepCommitments.length > 1) {
                setPortPlantData((prev) => ({
                  ...prev,
                  eccEpepCommitments: prev.eccEpepCommitments.filter(
                    (entry) => entry.id !== id
                  ),
                }));
              } else {
                Alert.alert(
                  'Cannot Remove',
                  'At least one waste entry is required.'
                );
              }
            }
          },
        },
      ]
    );
  };

  const updateQuarryPlantData = (
    field: keyof PlantPortSectionData,
    value: any
  ) => {
    setQuarryPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePlantData = (field: keyof PlantPortSectionData, value: any) => {
    setPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePortPlantData = (field: keyof PlantPortSectionData, value: any) => {
    setPortPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndNext = () => {
    console.log('Saving Waste Management data...');
    console.log('Selected Quarter:', selectedQuarter);
    console.log('Quarry Checkboxes:', quarryData);
    console.log('Quarry Table:', quarryPlantData);
    console.log('Plant Checkboxes:', plantSimpleData);
    console.log('Plant Table:', plantData);
    console.log('Port Checkboxes:', portData);
    console.log('Port Table:', portPlantData);
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
              Compliance with Good Practice in Solid and Hazardous Waste
              Management
            </Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Quarter</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              if (value) {
                setSelectedQuarter(value);
              }
            }}
            items={quarterItems}
            style={pickerSelectStyles}
            value={selectedQuarter}
            placeholder={{}}
          />
        </View>

        <QuarrySection data={quarryData} onUpdate={updateQuarryData} />

        {quarryData.generateTable && !quarryData.N_A && (
          <PlantPortSection
            title="QUARRY DETAILS"
            icon="hammer"
            data={quarryPlantData}
            selectedQuarter={selectedQuarter}
            onUpdateData={updateQuarryPlantData}
            onAddWaste={() => addWasteEntry('quarry')}
            onUpdateWaste={(id, field, value) =>
              updateWasteEntry('quarry', id, field, value)
            }
            onRemoveWaste={(id) => removeWasteEntry('quarry', id)}
          />
        )}

        <PlantSection data={plantSimpleData} onUpdate={updatePlantSimpleData} />

        {plantSimpleData.generateTable && !plantSimpleData.N_A && (
          <PlantPortSection
            title="PLANT DETAILS"
            icon="business"
            data={plantData}
            selectedQuarter={selectedQuarter}
            onUpdateData={updatePlantData}
            onAddWaste={() => addWasteEntry('plant')}
            onUpdateWaste={(id, field, value) =>
              updateWasteEntry('plant', id, field, value)
            }
            onRemoveWaste={(id) => removeWasteEntry('plant', id)}
          />
        )}

        <PortSection data={portData} onUpdate={updatePortData} />

        {portData.generateTable && !portData.N_A && (
          <PlantPortSection
            title="PORT DETAILS"
            icon="boat"
            data={portPlantData}
            selectedQuarter={selectedQuarter}
            onUpdateData={updatePortPlantData}
            onAddWaste={() => addWasteEntry('port')}
            onUpdateWaste={(id, field, value) =>
              updateWasteEntry('port', id, field, value)
            }
            onRemoveWaste={(id) => removeWasteEntry('port', id)}
          />
        )}

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndNext}
        >
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}