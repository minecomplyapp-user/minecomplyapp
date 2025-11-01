import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExecutiveSummaryProps {
  executiveSummary: {
    epepCompliance: {
      safety: boolean;
      social: boolean;
      rehabilitation: boolean;
    };
    epepRemarks: string;
    sdmpCompliance: string;
    sdmpRemarks: string;
    complaintsManagement: {
      complaintReceiving: boolean;
      caseInvestigation: boolean;
      implementationControl: boolean;
      communicationComplainant: boolean;
      complaintDocumentation: boolean;
      naForAll: boolean;
    };
    complaintsRemarks: string;
    accountability: string;
    accountabilityRemarks: string;
    othersSpecify: string;
    othersNA: boolean;
  };
  updateExecutiveSummary: (field: string, value: any) => void;
  toggleEpepCompliance: (field: keyof ExecutiveSummaryProps['executiveSummary']['epepCompliance']) => void;
  toggleComplaintsManagement: (field: keyof ExecutiveSummaryProps['executiveSummary']['complaintsManagement']) => void;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummaryProps> = ({
  executiveSummary,
  updateExecutiveSummary,
  toggleEpepCompliance,
  toggleComplaintsManagement,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={24} color='#02217C' />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.sectionSubtitle}>Summary of Compliance Status</Text>
        </View>
      </View>

      <View style={styles.sectionContent}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color='#02217C' />
          <Text style={styles.infoText}>Unticked checkboxes are considered 'No' or 'Not Complied'.</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Compliance with EPEP Commitments</Text>
          <View style={styles.checkboxGroup}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleEpepCompliance("safety")}>
              <View style={[styles.checkbox, executiveSummary.epepCompliance.safety && styles.checkboxChecked]}>
                {executiveSummary.epepCompliance.safety && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Safety</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleEpepCompliance("social")}>
              <View style={[styles.checkbox, executiveSummary.epepCompliance.social && styles.checkboxChecked]}>
                {executiveSummary.epepCompliance.social && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Social</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleEpepCompliance("rehabilitation")}>
              <View style={[styles.checkbox, executiveSummary.epepCompliance.rehabilitation && styles.checkboxChecked]}>
                {executiveSummary.epepCompliance.rehabilitation && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Rehabilitation</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>EPEP REMARKS</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={executiveSummary.epepRemarks}
            onChangeText={(text) => updateExecutiveSummary("epepRemarks", text)}
            placeholder="Enter remarks for EPEP compliance..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Compliance with SDMP Commitments</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("sdmpCompliance", "complied")}>
              <View style={[styles.checkbox, executiveSummary.sdmpCompliance === "complied" && styles.checkboxChecked]}>
                {executiveSummary.sdmpCompliance === "complied" && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Complied</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("sdmpCompliance", "not-complied")}>
              <View style={[styles.checkbox, executiveSummary.sdmpCompliance === "not-complied" && styles.checkboxChecked]}>
                {executiveSummary.sdmpCompliance === "not-complied" && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Not Complied</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>SDMP REMARKS</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={executiveSummary.sdmpRemarks}
            onChangeText={(text) => updateExecutiveSummary("sdmpRemarks", text)}
            placeholder="Enter remarks for SDMP compliance..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <View style={styles.labelWithAction}>
            <Text style={styles.label}>Complaints Management</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => toggleComplaintsManagement("naForAll")}
            >
              <View style={[styles.checkboxSmall, executiveSummary.complaintsManagement.naForAll && styles.checkboxChecked]}>
                {executiveSummary.complaintsManagement.naForAll && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text style={styles.naButtonText}>N/A for all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.checkboxGroup}>
            {[
              { key: "complaintReceiving", label: "Complaint receiving set-up" },
              { key: "caseInvestigation", label: "Case investigation" },
              { key: "implementationControl", label: "Implementation of control" },
              { key: "communicationComplainant", label: "Communication with complainant/public" },
              { key: "complaintDocumentation", label: "Complaint documentation" },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.checkboxRow,
                  executiveSummary.complaintsManagement.naForAll && styles.disabledCheckboxRow
                ]}
                onPress={() => toggleComplaintsManagement(item.key as keyof typeof executiveSummary.complaintsManagement)}
                disabled={executiveSummary.complaintsManagement.naForAll}
              >
                <View style={[
                  styles.checkbox,
                  executiveSummary.complaintsManagement[item.key as keyof typeof executiveSummary.complaintsManagement] && !executiveSummary.complaintsManagement.naForAll && styles.checkboxChecked,
                  executiveSummary.complaintsManagement.naForAll && styles.disabledCheckbox
                ]}>
                  {executiveSummary.complaintsManagement[item.key as keyof typeof executiveSummary.complaintsManagement] && !executiveSummary.complaintsManagement.naForAll && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={[styles.checkboxLabel, executiveSummary.complaintsManagement.naForAll && styles.disabledCheckboxLabel]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>COMPLAINTS REMARKS</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={executiveSummary.complaintsRemarks}
            onChangeText={(text) => updateExecutiveSummary("complaintsRemarks", text)}
            placeholder="Enter remarks for complaints management..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Accountability</Text>
          <Text style={styles.sublabel}>
            Qualified personnel are charged with routine monitoring (education, training, knowledge, experience).
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("accountability", "complied")}>
              <View style={[styles.checkbox, executiveSummary.accountability === "complied" && styles.checkboxChecked]}>
                {executiveSummary.accountability === "complied" && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Complied</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("accountability", "not-complied")}>
              <View style={[styles.checkbox, executiveSummary.accountability === "not-complied" && styles.checkboxChecked]}>
                {executiveSummary.accountability === "not-complied" && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Not Complied</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelSmall}>ACCOUNTABILITY REMARKS</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={executiveSummary.accountabilityRemarks}
            onChangeText={(text) => updateExecutiveSummary("accountabilityRemarks", text)}
            placeholder="Enter remarks for accountability..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <View style={styles.labelWithAction}>
            <Text style={styles.label}>Others</Text>
            <TouchableOpacity
              style={styles.naButton}
              onPress={() => updateExecutiveSummary("othersNA", !executiveSummary.othersNA)}
            >
              <View style={[styles.checkboxSmall, executiveSummary.othersNA && styles.checkboxChecked]}>
                {executiveSummary.othersNA && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text style={styles.naButtonText}>N/A</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              executiveSummary.othersNA && styles.disabledInput
            ]}
            value={executiveSummary.othersSpecify}
            onChangeText={(text) => updateExecutiveSummary("othersSpecify", text)}
            placeholder="Specify other compliance matters..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            editable={!executiveSummary.othersNA}
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
    shadowColor: '#02217C',
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
    shadowColor: '#02217C',
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
    color: '#02217C',
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
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
  },
  infoText: {
    fontSize: 13,
    color: '#02217C',
    flex: 1,
    lineHeight: 18,
    fontWeight: "500",
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  labelWithAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  naButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  naButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  sublabel: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 12,
    fontStyle: "italic",
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
    minHeight: 90,
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
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  disabledCheckboxRow: {
    opacity: 0.5,
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
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  disabledCheckbox: {
    backgroundColor: "#E2E8F0",
    borderColor: "#CBD5E1",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#1E293B",
    flexShrink: 1,
  },
  disabledCheckboxLabel: {
    color: "#94A3B8",
  },
  divider: {
    height: 1.5,
    backgroundColor: "#E2E8F0",
    marginVertical: 24,
  },
});