import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

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
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EXECUTIVE SUMMARY OF COMPLIANCE</Text>
      </View>
      <Text style={styles.noteText}>Any unticked boxes will automatically be counted as 'No.'</Text>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Compliance with EPEP Commitments:</Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleEpepCompliance("safety")}>
            <View style={styles.checkbox}>
              {executiveSummary.epepCompliance.safety && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleEpepCompliance("social")}>
            <View style={styles.checkbox}>
              {executiveSummary.epepCompliance.social && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Social</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleEpepCompliance("rehabilitation")}>
            <View style={styles.checkbox}>
              {executiveSummary.epepCompliance.rehabilitation && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Rehabilitation</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Remarks:</Text>
        <TextInput
          style={styles.input}
          value={executiveSummary.epepRemarks}
          onChangeText={(text) => updateExecutiveSummary("epepRemarks", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Compliance with SDMP Commitments:</Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("sdmpCompliance", "complied")}>
            <View style={styles.checkbox}>
              {executiveSummary.sdmpCompliance === "complied" && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Complied</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("sdmpCompliance", "not-complied")}>
            <View style={styles.checkbox}>
              {executiveSummary.sdmpCompliance === "not-complied" && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Not Complied</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Remarks:</Text>
        <TextInput
          style={styles.input}
          value={executiveSummary.sdmpRemarks}
          onChangeText={(text) => updateExecutiveSummary("sdmpRemarks", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.fieldRow}>
        <View style={styles.labelWithCheckbox}>
          <Text style={styles.label}>Complaints Management:</Text>
          <View style={styles.naCheckboxContainer}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleComplaintsManagement("naForAll")}>
              <View style={styles.checkbox}>
                {executiveSummary.complaintsManagement.naForAll && <View style={styles.checkboxChecked} />}
              </View>
              <Text style={styles.checkboxLabel}>N/A for all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.checkboxGroup}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleComplaintsManagement("complaintReceiving")}>
          <View style={styles.checkbox}>
            {executiveSummary.complaintsManagement.complaintReceiving && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>Complaint receiving set-up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleComplaintsManagement("caseInvestigation")}>
          <View style={styles.checkbox}>
            {executiveSummary.complaintsManagement.caseInvestigation && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>Case investigation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleComplaintsManagement("implementationControl")}>
          <View style={styles.checkbox}>
            {executiveSummary.complaintsManagement.implementationControl && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>Implementation of control</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleComplaintsManagement("communicationComplainant")}>
          <View style={styles.checkbox}>
            {executiveSummary.complaintsManagement.communicationComplainant && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>Communication with the complainant/ public</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleComplaintsManagement("complaintDocumentation")}>
          <View style={styles.checkbox}>
            {executiveSummary.complaintsManagement.complaintDocumentation && <View style={styles.checkboxChecked} />}
          </View>
          <Text style={styles.checkboxLabel}>Complaint documentation</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Remarks:</Text>
        <TextInput
          style={styles.input}
          value={executiveSummary.complaintsRemarks}
          onChangeText={(text) => updateExecutiveSummary("complaintsRemarks", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Accountability:</Text>
        <Text style={styles.sublabel}>
          Qualified personnel are charged with the routine monitoring of the project activities in terms of education, training, knowledge and experience of the environmental team
        </Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("accountability", "complied")}>
            <View style={styles.checkbox}>
              {executiveSummary.accountability === "complied" && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Complied</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("accountability", "not-complied")}>
            <View style={styles.checkbox}>
              {executiveSummary.accountability === "not-complied" && <View style={styles.checkboxChecked} />}
            </View>
            <Text style={styles.checkboxLabel}>Not Complied</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.label}>Remarks:</Text>
        <TextInput
          style={styles.input}
          value={executiveSummary.accountabilityRemarks}
          onChangeText={(text) => updateExecutiveSummary("accountabilityRemarks", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.fieldRow}>
        <View style={styles.labelWithCheckbox}>
          <Text style={styles.label}>Others, please specify:</Text>
          <View style={styles.naCheckboxContainer}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => updateExecutiveSummary("othersNA", !executiveSummary.othersNA)}>
              <View style={styles.checkbox}>
                {executiveSummary.othersNA && <View style={styles.checkboxChecked} />}
              </View>
              <Text style={styles.checkboxLabel}>N/A</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.input}
          value={executiveSummary.othersSpecify}
          onChangeText={(text) => updateExecutiveSummary("othersSpecify", text)}
          placeholder="Type here..."
          placeholderTextColor="#999"
        />
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
  noteText: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
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
  labelWithCheckbox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  naCheckboxContainer: {
    marginLeft: 12,
  },
  sublabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
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
});