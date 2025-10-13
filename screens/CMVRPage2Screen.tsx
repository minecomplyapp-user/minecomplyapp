import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CMVRPage2Screen = ({ route, navigation }: any) => {
  // Executive Summary State
  const [executiveSummary, setExecutiveSummary] = useState({
    epepCompliance: {
      safety: false,
      social: false,
      rehabilitation: false,
    },
    epepRemarks: "",
    sdmpCompliance: "",
    sdmpRemarks: "",
    complaintsManagement: {
      complaintReceiving: false,
      caseInvestigation: false,
      implementationControl: false,
      communicationComplainant: false,
      complaintDocumentation: false,
      naForAll: false,
    },
    complaintsRemarks: "",
    accountability: "",
    accountabilityRemarks: "",
    othersSpecify: "",
  });

  // Process Documentation State
  const [processDoc, setProcessDoc] = useState({
    dateConducted: "",
    sameDateForAll: false,
    eccMmtMembers: "",
    epepMmtMembers: "",
    ocularMmtMembers: "",
    methodologyRemarks: "",
    siteValidationApplicable: "",
  });

  const [eccMmtAdditional, setEccMmtAdditional] = useState<string[]>([]);
  const [epepMmtAdditional, setEpepMmtAdditional] = useState<string[]>([]);
  const [ocularMmtAdditional, setOcularMmtAdditional] = useState<string[]>([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'File_Name',
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 16, color: '#007AFF', fontWeight: '500' }}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSave = () => {
    console.log("Saving...");
  };

  const updateExecutiveSummary = (field: string, value: any) => {
    setExecutiveSummary((prev) => ({ ...prev, [field]: value }));
  };

  const updateProcessDoc = (field: string, value: any) => {
    setProcessDoc((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEpepCompliance = (field: keyof typeof executiveSummary.epepCompliance) => {
    setExecutiveSummary((prev) => ({
      ...prev,
      epepCompliance: {
        ...prev.epepCompliance,
        [field]: !prev.epepCompliance[field],
      },
    }));
  };

  const toggleComplaintsManagement = (field: keyof typeof executiveSummary.complaintsManagement) => {
    setExecutiveSummary((prev) => ({
      ...prev,
      complaintsManagement: {
        ...prev.complaintsManagement,
        [field]: !prev.complaintsManagement[field],
      },
    }));
  };

  const addEccMmtMember = () => {
    setEccMmtAdditional([...eccMmtAdditional, ""]);
  };

  const addEpepMmtMember = () => {
    setEpepMmtAdditional([...epepMmtAdditional, ""]);
  };

  const addOcularMmtMember = () => {
    setOcularMmtAdditional([...ocularMmtAdditional, ""]);
  };

  const updateEccMmtAdditional = (index: number, value: string) => {
    const updated = [...eccMmtAdditional];
    updated[index] = value;
    setEccMmtAdditional(updated);
  };

  const updateEpepMmtAdditional = (index: number, value: string) => {
    const updated = [...epepMmtAdditional];
    updated[index] = value;
    setEpepMmtAdditional(updated);
  };

  const updateOcularMmtAdditional = (index: number, value: string) => {
    const updated = [...ocularMmtAdditional];
    updated[index] = value;
    setOcularMmtAdditional(updated);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Executive Summary Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EXECUTIVE SUMMARY OF COMPLIANCE</Text>
          </View>

          <Text style={styles.noteText}>
            Any unticked boxes will automatically be counted as 'No.'
          </Text>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Compliance with EPEP Commitments:</Text>
            <View style={styles.checkboxGroup}>
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => toggleEpepCompliance("safety")}
              >
                <View style={styles.checkbox}>
                  {executiveSummary.epepCompliance.safety && (
                    <View style={styles.checkboxChecked} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Safety</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => toggleEpepCompliance("social")}
              >
                <View style={styles.checkbox}>
                  {executiveSummary.epepCompliance.social && (
                    <View style={styles.checkboxChecked} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Social</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => toggleEpepCompliance("rehabilitation")}
              >
                <View style={styles.checkbox}>
                  {executiveSummary.epepCompliance.rehabilitation && (
                    <View style={styles.checkboxChecked} />
                  )}
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
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Compliance with SDMP Commitments:</Text>
            <View style={styles.checkboxGroup}>
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => updateExecutiveSummary("sdmpCompliance", "complied")}
              >
                <View style={styles.checkbox}>
                  {executiveSummary.sdmpCompliance === "complied" && (
                    <View style={styles.checkboxChecked} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Complied</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => updateExecutiveSummary("sdmpCompliance", "not-complied")}
              >
                <View style={styles.checkbox}>
                  {executiveSummary.sdmpCompliance === "not-complied" && (
                    <View style={styles.checkboxChecked} />
                  )}
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
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Complaints Management:</Text>
            <Text style={styles.sublabel}>N/A for all</Text>
          </View>

          <View style={styles.checkboxGroup}>
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => toggleComplaintsManagement("complaintReceiving")}
            >
              <View style={styles.checkbox}>
                {executiveSummary.complaintsManagement.complaintReceiving && (
                  <View style={styles.checkboxChecked} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Complaint receiving set-up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => toggleComplaintsManagement("caseInvestigation")}
            >
              <View style={styles.checkbox}>
                {executiveSummary.complaintsManagement.caseInvestigation && (
                  <View style={styles.checkboxChecked} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Case investigation</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => toggleComplaintsManagement("implementationControl")}
            >
              <View style={styles.checkbox}>
                {executiveSummary.complaintsManagement.implementationControl && (
                  <View style={styles.checkboxChecked} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Implementation of control</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => toggleComplaintsManagement("communicationComplainant")}
            >
              <View style={styles.checkbox}>
                {executiveSummary.complaintsManagement.communicationComplainant && (
                  <View style={styles.checkboxChecked} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Communication with the complainant/ public</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => toggleComplaintsManagement("complaintDocumentation")}
            >
              <View style={styles.checkbox}>
                {executiveSummary.complaintsManagement.complaintDocumentation && (
                  <View style={styles.checkboxChecked} />
                )}
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
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Accountability:</Text>
            <Text style={styles.sublabel}>
              Qualified and competent person for routine monitoring of the project activities in terms of education, training, knowledge and experience of the environmental team
            </Text>
            <View style={styles.checkboxGroup}>
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => updateExecutiveSummary("accountability", "complied")}
              >
                <View style={styles.checkbox}>
                  {executiveSummary.accountability === "complied" && (
                    <View style={styles.checkboxChecked} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Complied</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => updateExecutiveSummary("accountability", "not-complied")}
              >
                <View style={styles.checkbox}>
                  {executiveSummary.accountability === "not-complied" && (
                    <View style={styles.checkboxChecked} />
                  )}
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
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Others, please specify:</Text>
            <TextInput
              style={styles.input}
              value={executiveSummary.othersSpecify}
              onChangeText={(text) => updateExecutiveSummary("othersSpecify", text)}
              placeholder="Type here..."
            />
          </View>
        </View>

        {/* Process Documentation Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROCESS DOCUMENTATION OF ACTIVITIES UNDERTAKEN</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date Conducted:</Text>
            <TextInput
              style={styles.input}
              value={processDoc.dateConducted}
              onChangeText={(text) => updateProcessDoc("dateConducted", text)}
              placeholder="Month/Date/Year"
            />
          </View>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => updateProcessDoc("sameDateForAll", !processDoc.sameDateForAll)}
          >
            <View style={styles.checkbox}>
              {processDoc.sameDateForAll && (
                <View style={styles.checkboxChecked} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Same date for all activities</Text>
          </TouchableOpacity>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Document Review of:</Text>
          </View>

          {/* Activity: ECC Conditions */}
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Activity: Compliance with ECC Conditions/ Commitments</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>MMT Members Involved:</Text>
              <TextInput
                style={styles.input}
                value={processDoc.eccMmtMembers}
                onChangeText={(text) => updateProcessDoc("eccMmtMembers", text)}
                placeholder="Type here..."
              />
            </View>

            <TouchableOpacity 
              style={styles.addMoreButton}
              onPress={addEccMmtMember}
            >
              <Text style={styles.addMoreText}>+ Add more names</Text>
            </TouchableOpacity>

            {eccMmtAdditional.map((member, index) => (
              <View key={index} style={styles.additionalInput}>
                <TextInput
                  style={styles.input}
                  value={member}
                  onChangeText={(text) => updateEccMmtAdditional(index, text)}
                  placeholder="Type here..."
                />
              </View>
            ))}
          </View>

          {/* Activity: EPEP Conditions */}
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Activity: Compliance with EPEP/ AEPEP Conditions</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>MMT Members Involved:</Text>
              <TextInput
                style={styles.input}
                value={processDoc.epepMmtMembers}
                onChangeText={(text) => updateProcessDoc("epepMmtMembers", text)}
                placeholder="Type here..."
              />
            </View>

            <TouchableOpacity 
              style={styles.addMoreButton}
              onPress={addEpepMmtMember}
            >
              <Text style={styles.addMoreText}>+ Add more names</Text>
            </TouchableOpacity>

            {epepMmtAdditional.map((member, index) => (
              <View key={index} style={styles.additionalInput}>
                <TextInput
                  style={styles.input}
                  value={member}
                  onChangeText={(text) => updateEpepMmtAdditional(index, text)}
                  placeholder="Type here..."
                />
              </View>
            ))}
          </View>

          {/* Activity: Site Ocular Validation */}
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Activity: Site Ocular Validation</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>MMT Members Involved:</Text>
              <TextInput
                style={styles.input}
                value={processDoc.ocularMmtMembers}
                onChangeText={(text) => updateProcessDoc("ocularMmtMembers", text)}
                placeholder="Type here..."
              />
            </View>

            <TouchableOpacity 
              style={styles.addMoreButton}
              onPress={addOcularMmtMember}
            >
              <Text style={styles.addMoreText}>+ Add more names</Text>
            </TouchableOpacity>

            {ocularMmtAdditional.map((member, index) => (
              <View key={index} style={styles.additionalInput}>
                <TextInput
                  style={styles.input}
                  value={member}
                  onChangeText={(text) => updateOcularMmtAdditional(index, text)}
                  placeholder="Type here..."
                />
              </View>
            ))}
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Methodology/ Other Remarks:</Text>
            <TextInput
              style={styles.input}
              value={processDoc.methodologyRemarks}
              onChangeText={(text) => updateProcessDoc("methodologyRemarks", text)}
              placeholder="Type here..."
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Site Validation - Confirmatory Sampling */}
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Activity: Site Validation – Confirmatory Sampling (if needed)</Text>
            </View>

            <View style={styles.checkboxGroup}>
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => updateProcessDoc("siteValidationApplicable", "applicable")}
              >
                <View style={styles.checkbox}>
                  {processDoc.siteValidationApplicable === "applicable" && (
                    <View style={styles.checkboxChecked} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Applicable</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => updateProcessDoc("siteValidationApplicable", "none")}
              >
                <View style={styles.checkbox}>
                  {processDoc.siteValidationApplicable === "none" && (
                    <View style={styles.checkboxChecked} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>None</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveNextButton}>
            <Text style={styles.saveNextButtonText}>Save & Next</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  sectionCard: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: "#E8E3FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#000",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  noteText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 16,
  },
  fieldRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  sublabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
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
    fontSize: 14,
    color: "#333",
  },
  activitySection: {
    backgroundColor: "#FFE8E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  activityHeader: {
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8B0000",
  },
  addMoreButton: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 8,
  },
  addMoreText: {
    fontSize: 13,
    color: "#666",
  },
  additionalInput: {
    marginBottom: 8,
  },
  saveNextButton: {
    backgroundColor: "#7C6FDB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CMVRPage2Screen;