import React, { useState } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { CMSHeader } from '../../../components/CMSHeader';
import { ChemicalSafetySection } from './components/ChemicalSafetySection';
import { ComplianceCheckboxSection } from './components/ComplianceCheckboxSection';
import { ComplaintsSection } from './components/ComplaintsSection';
import {
  ChemicalSafetyData,
  Complaint,
  YesNoNull,
  ChemicalCategory,
} from '../types/ChemicalSafetyScreen.types';
import { styles } from '../styles/ChemicalSafetyScreen.styles';

export default function ChemicalSafetyScreen({ navigation }: any) {
  const [chemicalSafety, setChemicalSafety] = useState<ChemicalSafetyData>({
    isNA: false,
    riskManagement: null,
    training: null,
    handling: null,
    emergencyPreparedness: null,
    remarks: '',
    chemicalCategory: null,
    othersSpecify: '',
  });
  const [healthSafetyChecked, setHealthSafetyChecked] = useState(false);
  const [socialDevChecked, setSocialDevChecked] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: `complaint-${Date.now()}`,
      isNA: false,
      dateFiled: '',
      filedLocation: null,
      othersSpecify: '',
      nature: '',
      resolutions: '',
    },
  ]);

  const updateChemicalSafety = (
    field: keyof ChemicalSafetyData,
    value: YesNoNull | string | boolean | ChemicalCategory
  ) => {
    setChemicalSafety((prev) => {
      const newState = { ...prev };
      if (field === 'isNA') {
        newState.isNA = value as boolean;
        if (newState.isNA) {
          newState.riskManagement = null;
          newState.training = null;
          newState.handling = null;
          newState.emergencyPreparedness = null;
          newState.remarks = '';
          newState.chemicalCategory = null;
          newState.othersSpecify = '';
        }
      } else {
        newState.isNA = false;
        (newState[field] as any) = value;
        if (field === 'chemicalCategory' && value !== 'Others') {
          newState.othersSpecify = '';
        }
      }
      return newState;
    });
  };

  const addComplaint = () => {
    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}`,
      isNA: false,
      dateFiled: '',
      filedLocation: null,
      othersSpecify: '',
      nature: '',
      resolutions: '',
    };
    setComplaints((prev) => [...prev, newComplaint]);
  };

  const updateComplaint = (
    id: string,
    field: keyof Omit<Complaint, 'id'>,
    value: string | boolean | Complaint['filedLocation']
  ) => {
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          const updatedComplaint = { ...complaint };
          if (field === 'isNA') {
            updatedComplaint.isNA = value as boolean;
            if (updatedComplaint.isNA) {
              updatedComplaint.dateFiled = '';
              updatedComplaint.filedLocation = null;
              updatedComplaint.othersSpecify = '';
              updatedComplaint.nature = '';
              updatedComplaint.resolutions = '';
            }
          } else {
            updatedComplaint.isNA = false;
            (updatedComplaint[field] as any) = value;
            if (field === 'filedLocation' && value !== 'Others') {
              updatedComplaint.othersSpecify = '';
            }
          }
          return updatedComplaint;
        }
        return complaint;
      })
    );
  };

  const removeComplaint = (id: string) => {
    Alert.alert(
      'Remove Complaint',
      'Are you sure you want to remove this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (complaints.length > 1) {
              setComplaints((prev) => prev.filter((c) => c.id !== id));
            } else {
              Alert.alert(
                'Cannot Remove',
                'At least one complaint entry is required.'
              );
            }
          },
        },
      ]
    );
  };

  const handleSave = () => {
    console.log('Saving Chemical Safety data...');
    console.log('Chemical Safety Data:', chemicalSafety);
    console.log('Health/Safety Checked:', healthSafetyChecked);
    console.log('Social Dev Checked:', socialDevChecked);
    console.log('Complaints:', complaints);
  };

  const handleSaveNext = () => {
    handleSave();
    console.log('Navigating to Recommendations screen...');
    navigation.navigate('Recommendations');
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader
        fileName="Chemical Safety"
        onBack={() => navigation.goBack()}
        onSave={handleSave}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ChemicalSafetySection
          chemicalSafety={chemicalSafety}
          updateChemicalSafety={updateChemicalSafety}
        />
        <ComplianceCheckboxSection
          sectionNumber="5"
          title="Health and Safety Program"
          subtitle="Independent Monitoring c/o TSHES Team"
          icon="shield-checkmark"
          checked={healthSafetyChecked}
          onToggle={() => setHealthSafetyChecked(!healthSafetyChecked)}
        />
        <ComplianceCheckboxSection
          sectionNumber="6"
          title="Social Development Plan"
          subtitle="Independent Monitoring c/o TSHES Team"
          icon="people"
          checked={socialDevChecked}
          onToggle={() => setSocialDevChecked(!socialDevChecked)}
        />
        <ComplaintsSection
          complaints={complaints}
          updateComplaint={updateComplaint}
          addComplaint={addComplaint}
          removeComplaint={removeComplaint}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNext}>
          <Text style={styles.saveButtonText}>Save & Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}