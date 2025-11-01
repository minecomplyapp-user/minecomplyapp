// CMVRPage2Screen.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
import { ExecutiveSummarySection } from "./ExecutiveSummarySection";
import { ProcessDocumentationSection } from "./ProcessDocumentationSection";
import {
  CMVRPage2ScreenNavigationProp,
  CMVRPage2ScreenRouteProp,
  ExecutiveSummary,
  ProcessDocumentation,
} from "../types/CMVRPage2Screen.types";
import { styles } from "../styles/CMVRPage2Screen.styles";

const CMVRPage2Screen = () => {
  const navigation = useNavigation<CMVRPage2ScreenNavigationProp>();
  const route = useRoute<CMVRPage2ScreenRouteProp>();
  const {
    submissionId = "",
    projectName = "",
    projectId = "",
    fileName: routeFileName = "File_Name",
  } = route.params || {};

  const [fileName, setFileName] = useState(routeFileName);

  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary>({
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

  const [processDoc, setProcessDoc] = useState<ProcessDocumentation>({
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

  const toggleEpepCompliance = (field: keyof ExecutiveSummary["epepCompliance"]) => {
    setExecutiveSummary((prev) => ({
      ...prev,
      epepCompliance: {
        ...prev.epepCompliance,
        [field]: !prev.epepCompliance[field],
      },
    }));
  };

  const toggleComplaintsManagement = (
    field: keyof ExecutiveSummary["complaintsManagement"]
  ) => {
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
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndNext}
        >
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CMVRPage2Screen;
