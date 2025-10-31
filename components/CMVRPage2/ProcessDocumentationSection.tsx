import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  removeEccMmtAdditional: (index: number) => void;
  removeEpepMmtAdditional: (index: number) => void;
  removeOcularMmtAdditional: (index: number) => void;
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
  removeEccMmtAdditional,
  removeEpepMmtAdditional,
  removeOcularMmtAdditional,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="clipboard" size={24} color="#1E40AF" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>Process Documentation</Text>
          <Text style={styles.sectionSubtitle}>Details of Monitoring Activities</Text>
        </View>
      </View>

      <View style={styles.sectionContent}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date Conducted</Text>
          <TextInput
            style={styles.input}
            value={processDoc.dateConducted}
            onChangeText={(text) => updateProcessDoc("dateConducted", text)}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => updateProcessDoc("sameDateForAll", !processDoc.sameDateForAll)}
          >
            <View style={[styles.checkbox, processDoc.sameDateForAll && styles.checkboxChecked]}>
              {processDoc.sameDateForAll && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>Same date for all activities</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.subsectionHeader}>
          <View style={styles.subsectionIconContainer}>
            <Ionicons name="folder-open" size={18} color="#1E40AF" />
          </View>
          <Text style={styles.subsectionTitle}>Document Review Activities</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Ionicons name="document" size={18} color="#1E40AF" />
            <Text style={styles.activityTitle}>ECC Conditions/Commitments</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.labelSmall}>MMT MEMBERS INVOLVED</Text>
            <TextInput
              style={styles.input}
              value={processDoc.eccMmtMembers}
              onChangeText={(text) => updateProcessDoc("eccMmtMembers", text)}
              placeholder="Enter primary member name"
              placeholderTextColor="#94A3B8"
            />
          </View>
          {eccMmtAdditional.map((member, index) => (
            <View key={`ecc-${index}`} style={styles.additionalMemberRow}>
              <TextInput
                style={[styles.input, styles.additionalInput]}
                value={member}
                onChangeText={(text) => updateEccMmtAdditional(index, text)}
                placeholder={`Enter member #${index + 2}`}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeEccMmtAdditional(index)}
              >
                <Ionicons name="trash" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addEccMmtMember}>
            <Ionicons name="add-circle" size={20} color="#1E40AF" />
            <Text style={styles.addButtonText}>Add more members</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Ionicons name="leaf" size={18} color="#1E40AF" />
            <Text style={styles.activityTitle}>EPEP/AEPEP Conditions</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.labelSmall}>MMT MEMBERS INVOLVED</Text>
            <TextInput
              style={styles.input}
              value={processDoc.epepMmtMembers}
              onChangeText={(text) => updateProcessDoc("epepMmtMembers", text)}
              placeholder="Enter primary member name"
              placeholderTextColor="#94A3B8"
            />
          </View>
          {epepMmtAdditional.map((member, index) => (
            <View key={`epep-${index}`} style={styles.additionalMemberRow}>
              <TextInput
                style={[styles.input, styles.additionalInput]}
                value={member}
                onChangeText={(text) => updateEpepMmtAdditional(index, text)}
                placeholder={`Enter member #${index + 2}`}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeEpepMmtAdditional(index)}
              >
                <Ionicons name="trash" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addEpepMmtMember}>
            <Ionicons name="add-circle" size={20} color="#1E40AF" />
            <Text style={styles.addButtonText}>Add more members</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.subsectionHeader}>
          <View style={styles.subsectionIconContainer}>
            <Ionicons name="eye" size={18} color="#1E40AF" />
          </View>
          <Text style={styles.subsectionTitle}>Site Validation Activities</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Ionicons name="walk" size={18} color="#1E40AF" />
            <Text style={styles.activityTitle}>Site Ocular Validation</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => updateProcessDoc("ocularNA", !processDoc.ocularNA)}
            >
              <View style={[styles.checkboxSmall, processDoc.ocularNA && styles.checkboxChecked]}>
                {processDoc.ocularNA && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text style={styles.naButtonText}>N/A</Text>
            </TouchableOpacity>
          </View>

          <View style={[processDoc.ocularNA && styles.disabledContent]}>
            <View style={styles.fieldGroup}>
              <Text style={styles.labelSmall}>MMT MEMBERS INVOLVED</Text>
              <TextInput
                style={[styles.input, processDoc.ocularNA && styles.disabledInput]}
                value={processDoc.ocularMmtMembers}
                onChangeText={(text) => updateProcessDoc("ocularMmtMembers", text)}
                placeholder="Enter primary member name"
                placeholderTextColor="#94A3B8"
                editable={!processDoc.ocularNA}
              />
            </View>
            {ocularMmtAdditional.map((member, index) => (
              <View key={`ocular-${index}`} style={styles.additionalMemberRow}>
                <TextInput
                  style={[styles.input, styles.additionalInput, processDoc.ocularNA && styles.disabledInput]}
                  value={member}
                  onChangeText={(text) => updateOcularMmtAdditional(index, text)}
                  placeholder={`Enter member #${index + 2}`}
                  placeholderTextColor="#94A3B8"
                  editable={!processDoc.ocularNA}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeOcularMmtAdditional(index)}
                  disabled={processDoc.ocularNA}
                >
                  <Ionicons name="trash" size={20} color={processDoc.ocularNA ? "#CBD5E1" : "#DC2626"} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addButton, processDoc.ocularNA && styles.disabledButton]}
              onPress={addOcularMmtMember}
              disabled={processDoc.ocularNA}
            >
              <Ionicons name="add-circle" size={20} color={processDoc.ocularNA ? "#94A3B8" : "#1E40AF"} />
              <Text style={[styles.addButtonText, processDoc.ocularNA && styles.disabledButtonText]}>Add more members</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Ionicons name="flask" size={18} color="#1E40AF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Confirmatory Sampling</Text>
              <Text style={styles.activitySubtitle}>(if needed)</Text>
            </View>
          </View>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => updateProcessDoc("siteValidationApplicable", "applicable")}
            >
              <View style={[styles.checkbox, processDoc.siteValidationApplicable === "applicable" && styles.checkboxChecked]}>
                {processDoc.siteValidationApplicable === "applicable" && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Applicable</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => updateProcessDoc("siteValidationApplicable", "none")}
            >
              <View style={[styles.checkbox, processDoc.siteValidationApplicable === "none" && styles.checkboxChecked]}>
                {processDoc.siteValidationApplicable === "none" && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>None</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Methodology / Other Remarks</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={processDoc.methodologyRemarks}
            onChangeText={(text) => updateProcessDoc("methodologyRemarks", text)}
            placeholder="Enter methodology details or any other relevant remarks..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#EFF6FF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#BFDBFE",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E40AF",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  sectionContent: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 10,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
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
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  checkboxGroup: {
    gap: 14,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSmall: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1E40AF",
    borderColor: "#1E40AF",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#1E293B",
    flexShrink: 1,
  },
  naButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  naButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  divider: {
    height: 1.5,
    backgroundColor: "#E2E8F0",
    marginVertical: 24,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  subsectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  activityCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E2E8F0",
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
    flexShrink: 1,
  },
  activitySubtitle: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#94A3B8",
    marginTop: 2,
  },
  additionalMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  additionalInput: {
    flex: 1,
  },
  deleteButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#BFDBFE",
    borderStyle: "dashed",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "600",
  },
  disabledContent: {
    opacity: 0.5,
  },
  disabledButton: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#94A3B8",
  },
});