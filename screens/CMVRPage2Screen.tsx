import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import {ExecutiveSummarySection} from "../components/CMVRPage2/ExecutiveSummarySection";
import {FileNameModal} from "../components/CMVRPage2/FileNameModal";
import {ProcessDocumentationSection} from "../components/CMVRPage2/ProcessDocumentationSection";




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
  ComplianceMonitoring: {
    submissionId?: string;
    projectName?: string;
    projectId?: string;
    fileName?: string;
  };
};

type CMVRPage2ScreenNavigationProp = StackNavigationProp<RootStackParamList, "CMVRPage2">;
type CMVRPage2ScreenRouteProp = RouteProp<RootStackParamList, "CMVRPage2">;

const CMVRPage2Screen = () => {
  const navigation = useNavigation<CMVRPage2ScreenNavigationProp>();
  const route = useRoute<CMVRPage2ScreenRouteProp>();
  const { submissionId = "", projectName = "", projectId = "", fileName: routeFileName = "File_Name" } = route.params || {};
  const [fileName, setFileName] = useState(routeFileName);
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [tempFileName, setTempFileName] = useState(routeFileName);
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

  const handleSaveAndNext = () => {
    navigation.navigate("ComplianceMonitoring", {
      submissionId,
      projectId,
      projectName,
      fileName,
    });
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: "black",
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontWeight: "600",
        fontSize: 17,
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ExecutiveSummarySection
          executiveSummary={executiveSummary}
          updateExecutiveSummary={updateExecutiveSummary}
          toggleEpepCompliance={toggleEpepCompliance}
          toggleComplaintsManagement={toggleComplaintsManagement}
        />
        <ProcessDocumentationSection
          processDoc={processDoc}
          updateProcessDoc={updateProcessDoc}
          eccMmtAdditional={eccMmtAdditional}
          epepMmtAdditional={epepMmtAdditional}
          ocularMmtAdditional={ocularMmtAdditional}
          addEccMmtMember={addEccMmtMember}
          addEpepMmtMember={addEpepMmtMember}
          addOcularMmtMember={addOcularMmtMember}
          updateEccMmtAdditional={updateEccMmtAdditional}
          updateEpepMmtAdditional={updateEpepMmtAdditional}
          updateOcularMmtAdditional={updateOcularMmtAdditional}
        />
        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
      <FileNameModal
        isEditingFileName={isEditingFileName}
        tempFileName={tempFileName}
        setTempFileName={setTempFileName}
        handleCancelEdit={handleCancelEdit}
        handleSaveFileName={handleSaveFileName}
      />
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
  headerTitleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  headerSaveButton: {
    marginRight: 10,
  },
  headerSaveButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  saveNextButton: {
    backgroundColor: "#8B7FDB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 20,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default CMVRPage2Screen;
