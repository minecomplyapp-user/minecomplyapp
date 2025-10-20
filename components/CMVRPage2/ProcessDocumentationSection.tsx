import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface ProcessDocumentationProps {
  processDoc: {
    dateConducted: string;
    sameDateForAll: boolean;
    eccMmtMembers: string;
    epepMmtMembers: string;
    ocularMmtMembers: string;
    ocularNA: boolean;
    methodologyRemarks: string;
    siteValidationApplicable: string;
  };
  updateProcessDoc: (field: string, value: any) => void;
  eccMmtAdditional: string[];
  epepMmtAdditional: string[];
  ocularMmtAdditional: string[];
  addEccMmtMember: () => void;
  addEpepMmtMember: () => void;
  addOcularMmtMember: () => void;
  updateEccMmtAdditional: (index: number, value: string) => void;
  updateEpepMmtAdditional: (index: number, value: string) => void;
  updateOcularMmtAdditional: (index: number, value: string) => void;
}

export const ProcessDocumentationSection: React.FC<ProcessDocumentationProps> = ({
  processDoc,
  updateProcessDoc,
  eccMmtAdditional,
  epepMmtAdditional,
  ocularMmtAdditional,
  addEccMmtMember,
  addEpepMmtMember,
  addOcularMmtMember,
  updateEccMmtAdditional,
  updateEpepMmtAdditional,
  updateOcularMmtAdditional,
}) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PROCESS DOCUMENTATION OF ACTIVITIES UNDERTAKEN</Text>
      </View>
      <View style={styles.dateRow}>
        <Text style={styles.label}>Date Conducted:</Text>
        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.dateInput}
            value={processDoc.dateConducted}
            onChangeText={(text) => updateProcessDoc("dateConducted", text)}
            placeholder="Month/Date/Year"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sameDateCheckbox} onPress={() => updateProcessDoc("sameDateForAll", !processDoc.sameDateForAll)}>
            <View style={styles.checkbox}>
              {processDoc.sameDateForAll && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Same date for all activities</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Document Review of:</Text>
      </View>
      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Activity: Compliance with ECC Conditions/ Commitments</Text>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>MMT Members Involved:</Text>
        <TextInput
          style={styles.input}
          value={processDoc.eccMmtMembers}
          onChangeText={(text) => updateProcessDoc("eccMmtMembers", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity style={styles.addMoreButton} onPress={addEccMmtMember}>
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {eccMmtAdditional.map((member, index) => (
        <View key={index} style={styles.additionalInput}>
          <TextInput
            style={styles.input}
            value={member}
            onChangeText={(text) => updateEccMmtAdditional(index, text)}
            placeholder="Type here..."
            placeholderTextColor="#999"
          />
        </View>
      ))}

      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Activity: Compliance with EPEP/ AEPEP Conditions</Text>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>MMT Members Involved:</Text>
        <TextInput
          style={styles.input}
          value={processDoc.epepMmtMembers}
          onChangeText={(text) => updateProcessDoc("epepMmtMembers", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity style={styles.addMoreButton} onPress={addEpepMmtMember}>
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {epepMmtAdditional.map((member, index) => (
        <View key={index} style={styles.additionalInput}>
          <TextInput
            style={styles.input}
            value={member}
            onChangeText={(text) => updateEpepMmtAdditional(index, text)}
            placeholder="Type here..."
            placeholderTextColor="#999"
          />
        </View>
      ))}

      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Activity: Site Ocular Validation</Text>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>MMT Members Involved:</Text>
        <TextInput
          style={styles.input}
          value={processDoc.ocularMmtMembers}
          onChangeText={(text) => updateProcessDoc("ocularMmtMembers", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity style={[styles.checkboxRow, { marginBottom: 8 }]} onPress={() => updateProcessDoc("ocularNA", !processDoc.ocularNA)}>
        <View style={styles.checkbox}>
          {processDoc.ocularNA && <View style={styles.checkboxChecked} />}
        </View>
        <Text style={styles.checkboxLabel}>N/A</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addMoreButton} onPress={addOcularMmtMember}>
        <Text style={styles.addMoreText}>+ Add more names</Text>
      </TouchableOpacity>
      {ocularMmtAdditional.map((member, index) => (
        <View key={index} style={styles.additionalInput}>
          <TextInput
            style={styles.input}
            value={member}
            onChangeText={(text) => updateOcularMmtAdditional(index, text)}
            placeholder="Type here..."
            placeholderTextColor="#999"
          />
        </View>
      ))}

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Methodology/ Other Remarks:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={processDoc.methodologyRemarks}
          onChangeText={(text) => updateProcessDoc("methodologyRemarks", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Activity: Site Validation – Confirmatory Sampling (if needed)</Text>
        </View>
      </View>
      <View style={styles.checkboxGroup}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => updateProcessDoc("siteValidationApplicable", "applicable")}>
          <View style={styles.checkbox}>
            {processDoc.siteValidationApplicable === "applicable" && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>Applicable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => updateProcessDoc("siteValidationApplicable", "none")}>
          <View style={styles.checkbox}>
            {processDoc.siteValidationApplicable === "none" && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>None</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 20,
  },
  sectionHeader: {
    backgroundColor: "#D8D8FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#000",
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  dateRow: {
    marginBottom: 16,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateInput: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
  },
  sameDateCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fieldRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#333",
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  checkboxGroup: {
    gap: 10,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#333",
  },
  activitySection: {
    marginBottom: 16,
  },
  activityHeader: {
    backgroundColor: "#FFD4D4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B0000",
  },
  addMoreButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 8,
  },
  addMoreText: {
    fontSize: 12,
    color: "#666",
  },
  additionalInput: {
    marginBottom: 8,
  },
});
