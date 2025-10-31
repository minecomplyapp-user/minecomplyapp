import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { CMSHeader } from '../../components/CMSHeader';
import { ChemicalSafetySection } from '../../components/chemical/ChemicalSafetySection';
import { ComplianceCheckboxSection } from '../../components/chemical/ComplianceCheckboxSection';
import { ComplaintsSection, Complaint } from '../../components/chemical/ComplaintsSection';

type YesNoNull = 'YES' | 'NO' | null;

type ChemicalSafetyData = {
  isNA: boolean;
  riskManagement: YesNoNull;
  training: YesNoNull;
  handling: YesNoNull;
  emergencyPreparedness: YesNoNull;
  remarks: string;
};

export default function ChemicalSafetyScreen({ navigation }: any) {
  // --- State Variables ---
  const [chemicalSafety, setChemicalSafety] = useState<ChemicalSafetyData>({
    isNA: false,
    riskManagement: null,
    training: null,
    handling: null,
    emergencyPreparedness: null,
    remarks: '',
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

  // --- Handlers ---
  const updateChemicalSafety = (
    field: keyof ChemicalSafetyData,
    value: YesNoNull | string | boolean
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
        }
      } else {
        newState.isNA = false;
        (newState[field] as any) = value;
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
              Alert.alert('Cannot Remove', 'At least one complaint entry is required.');
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

  // --- UPDATED THIS FUNCTION ---
  const handleSaveNext = () => {
    handleSave(); // Save data first
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
        {/* Chemical Safety Management Section */}
        <ChemicalSafetySection
          chemicalSafety={chemicalSafety}
          updateChemicalSafety={updateChemicalSafety}
        />

        {/* Health and Safety Program Section */}
        <ComplianceCheckboxSection
          sectionNumber="5"
          title="Health and Safety Program"
          subtitle="Independent Monitoring c/o TSHES Team"
          icon="shield-checkmark"
          checked={healthSafetyChecked}
          onToggle={() => setHealthSafetyChecked(!healthSafetyChecked)}
        />

        {/* Social Development Plan Section */}
        <ComplianceCheckboxSection
          sectionNumber="6"
          title="Social Development Plan"
          subtitle="Independent Monitoring c/o TSHES Team"
          icon="people"
          checked={socialDevChecked}
          onToggle={() => setSocialDevChecked(!socialDevChecked)}
        />

        {/* Complaints Section */}
        <ComplaintsSection
          complaints={complaints}
          updateComplaint={updateComplaint}
          addComplaint={addComplaint}
          removeComplaint={removeComplaint}
        />

        {/* Save & Next Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNext}>
          <Text style={styles.saveButtonText}>Save & Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Screen background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 32,
    paddingHorizontal: 16, // Add horizontal padding for content
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    // marginHorizontal: 16, // Removed, now handled by scrollContent
    marginTop: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});