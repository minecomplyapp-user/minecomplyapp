import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type YesNoNull = 'YES' | 'NO' | null;

interface ChemicalSafetyData {
  isNA: boolean;
  riskManagement: YesNoNull;
  training: YesNoNull;
  handling: YesNoNull;
  emergencyPreparedness: YesNoNull;
  remarks: string;
}

interface ChemicalSafetySectionProps {
  chemicalSafety: ChemicalSafetyData;
  updateChemicalSafety: (field: keyof ChemicalSafetyData, value: YesNoNull | string | boolean) => void;
}

export const ChemicalSafetySection: React.FC<ChemicalSafetySectionProps> = ({
  chemicalSafety,
  updateChemicalSafety,
}) => {
  const renderRadioRow = (
    label: string,
    field: keyof Omit<ChemicalSafetyData, 'isNA' | 'remarks'>,
    currentValue: YesNoNull
  ) => (
    <View style={styles.radioRow}>
      <Text style={[styles.radioLabel, chemicalSafety.isNA && styles.disabledText]}>{label}</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => updateChemicalSafety(field, 'YES')}
          disabled={chemicalSafety.isNA}
        >
          <View style={[
            styles.radio,
            currentValue === 'YES' && styles.radioSelected,
            chemicalSafety.isNA && styles.disabledRadio
          ]}>
            {currentValue === 'YES' && <View style={styles.radioDot} />}
          </View>
          <Text style={[styles.optionLabel, chemicalSafety.isNA && styles.disabledText]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => updateChemicalSafety(field, 'NO')}
          disabled={chemicalSafety.isNA}
        >
          <View style={[
            styles.radio,
            currentValue === 'NO' && styles.radioSelected,
            chemicalSafety.isNA && styles.disabledRadio
          ]}>
            {currentValue === 'NO' && <View style={styles.radioDot} />}
          </View>
          <Text style={[styles.optionLabel, chemicalSafety.isNA && styles.disabledText]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="flask" size={24} color='#02217C' />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionNumber}>4.</Text>
            <Text style={styles.sectionTitle}>Chemical Safety Management</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Chemicals in PCL and COO</Text>
          <TouchableOpacity
            style={styles.naButton}
            onPress={() => updateChemicalSafety('isNA', !chemicalSafety.isNA)}
          >
            <View style={[styles.checkbox, chemicalSafety.isNA && styles.checkboxChecked]}>
              {chemicalSafety.isNA && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text style={styles.naButtonText}>N/A</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.adequateLabel}>Is it Adequate?</Text>

        <View style={[styles.contentWrapper, chemicalSafety.isNA && styles.disabledContent]}>
          {renderRadioRow('Risk Management', 'riskManagement', chemicalSafety.riskManagement)}
          {renderRadioRow('Training', 'training', chemicalSafety.training)}
          {renderRadioRow('Handling', 'handling', chemicalSafety.handling)}
          {renderRadioRow('Emergency Preparedness', 'emergencyPreparedness', chemicalSafety.emergencyPreparedness)}

          <View style={styles.remarksSection}>
            <Text style={styles.labelSmall}>REMARKS</Text>
            <TextInput
              style={[styles.input, styles.textArea, chemicalSafety.isNA && styles.disabledInput]}
              value={chemicalSafety.remarks}
              onChangeText={(text) => updateChemicalSafety('remarks', text)}
              placeholder="Enter remarks..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              editable={!chemicalSafety.isNA}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    overflow: 'hidden',
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#EFF6FF",
    borderBottomWidth: 1,
    borderBottomColor: "#DBEAFE",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionNumber: {
    fontSize: 22,
    fontWeight: "700",
    color:'#02217C',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: '#02217C',
    flexShrink: 1,
  },
  sectionContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    flexShrink: 1,
  },
  naButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
  },
  naButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  adequateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 16,
  },
  contentWrapper: {
    gap: 12,
  },
  disabledContent: {
    opacity: 0.5,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
    flex: 1,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 24,
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor:'#02217C',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor:'#02217C',
  },
  disabledRadio: {
    borderColor: "#E2E8F0",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  disabledText: {
    color: "#94A3B8",
  },
  remarksSection: {
    marginTop: 8,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    color: "#94A3B8",
    borderColor: "#E2E8F0",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 14,
  },
});