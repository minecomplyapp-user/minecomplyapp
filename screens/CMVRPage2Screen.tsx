import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  CMVRReport: {
    submissionId: string;
    projectName: string;
    projectId: string;
    fileName?: string;
  };
  CMVRPage2: {
    submissionId?: string;
    projectName?: string;
    projectId?: string;
    fileName?: string;
  };
};

type CMVRPage2ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CMVRPage2'>;
type CMVRPage2ScreenRouteProp = RouteProp<RootStackParamList, 'CMVRPage2'>;

const CMVRPage2Screen = () => {
  const navigation = useNavigation<CMVRPage2ScreenNavigationProp>();
  const route = useRoute<CMVRPage2ScreenRouteProp>();

  // Default values if params are missing
  const { submissionId = "", projectName = "", projectId = "", fileName: routeFileName = "File_Name" } = route.params || {};

  // File Name State
  const [fileName, setFileName] = useState(routeFileName);
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [tempFileName, setTempFileName] = useState(routeFileName);

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
    othersNA: false,
  });

  // Process Documentation State
  const [processDoc, setProcessDoc] = useState({
    dateConducted: "",
    sameDateForAll: false,
    eccMmtMembers: "",
    epepMmtMembers: "",
    ocularMmtMembers: "",
    ocularNA: false,
    methodologyRemarks: "",
    siteValidationApplicable: "",
  });

  const [eccMmtAdditional, setEccMmtAdditional] = useState<string[]>([]);
  const [epepMmtAdditional, setEpepMmtAdditional] = useState<string[]>([]);
  const [ocularMmtAdditional, setOcularMmtAdditional] = useState<string[]>([]);

  const handleSave = () => {
    Alert.alert("Saved", "Your report has been saved successfully.");
  };

  const handleEditFileName = () => {
    setTempFileName(fileName);
    setIsEditingFileName(true);
  };

  const handleSaveFileName = () => {
    if (tempFileName.trim()) {
      setFileName(tempFileName.trim());
      setIsEditingFileName(false);
    } else {
      Alert.alert("Error", "File name cannot be empty.");
    }
  };

  const handleCancelEdit = () => {
    setTempFileName(fileName);
    setIsEditingFileName(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        height: 50,
      },
      headerTintColor: 'black',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerTitle: () => (
        <TouchableOpacity onPress={handleEditFileName}>
          <Text style={styles.headerTitleText}>{fileName}</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={styles.headerSaveButton}>
          <Text style={styles.headerSaveButtonText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, fileName]);

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        {/* Process Documentation Section */}
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
          <TouchableOpacity style={styles.saveNextButton}>
            <Text style={styles.saveNextButtonText}>Save & Next</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* File Name Edit Modal */}
      <Modal
        visible={isEditingFileName}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit File Name</Text>
            <TextInput
              style={styles.modalInput}
              value={tempFileName}
              onChangeText={setTempFileName}
              placeholder="Enter file name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={handleCancelEdit}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={handleSaveFileName}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
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
  saveNextButton: {
    backgroundColor: "#8B7FDB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  headerSaveButton: {
    marginRight: 10,
  },
  headerSaveButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#F0F0F0",
  },
  modalSaveButton: {
    backgroundColor: "#007AFF",
  },
  modalCancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  modalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CMVRPage2Screen;
