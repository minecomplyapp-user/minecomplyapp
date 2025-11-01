import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from '../../components/CMSHeader';
import { ExecutiveSummarySection } from "../../components/CMVRPage2/ExecutiveSummarySection";
import { ProcessDocumentationSection } from "../../components/CMVRPage2/ProcessDocumentationSection";

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

  const removeEccMmtAdditional = (index: number) => {
    setEccMmtAdditional(eccMmtAdditional.filter((_, i) => i !== index));
  };

  const removeEpepMmtAdditional = (index: number) => {
    setEpepMmtAdditional(epepMmtAdditional.filter((_, i) => i !== index));
  };

  const removeOcularMmtAdditional = (index: number) => {
    setOcularMmtAdditional(ocularMmtAdditional.filter((_, i) => i !== index));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader
          fileName={fileName}
          onBack={() => navigation.goBack()}
          onSave={handleSave}
        />
      </View>
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
          removeEccMmtAdditional={removeEccMmtAdditional}
          removeEpepMmtAdditional={removeEpepMmtAdditional}
          removeOcularMmtAdditional={removeOcularMmtAdditional}
        />
        <TouchableOpacity style={styles.saveNextButton} onPress={handleSaveAndNext}>
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    zIndex: 1000,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  saveNextButton: {
     backgroundColor: '#02217C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16, 
    marginTop: 24,       
    marginBottom: 16,      
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: '#02217C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveNextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default CMVRPage2Screen;