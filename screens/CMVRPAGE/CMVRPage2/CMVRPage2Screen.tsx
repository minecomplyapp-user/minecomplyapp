// CMVRPage2Screen.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, Alert } from "react-native";
import {
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
import { useCmvrStore } from "../../../store/cmvrStore";
import { ExecutiveSummarySection } from "./components/ExecutiveSummarySection";
import { ProcessDocumentationSection } from "./components/ProcessDocumentationSection";
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

  // **ZUSTAND STORE** - Single source of truth
  const {
    currentReport,
    fileName: storeFileName,
    submissionId: storeSubmissionId,
    projectId: storeProjectId,
    projectName: storeProjectName,
    updateSection,
    updateMultipleSections,
    saveDraft,
  } = useCmvrStore();

  const {
    submissionId = storeSubmissionId || "",
    projectName = storeProjectName || "",
    projectId = storeProjectId || "",
    fileName: routeFileName = storeFileName || "File_Name",
  } = route.params || {};

  const [fileName, setFileName] = useState(routeFileName);

  // Local state for UI - initialized from store
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary>(
    currentReport?.executiveSummaryOfCompliance || {
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
    }
  );

  const [processDoc, setProcessDoc] = useState<ProcessDocumentation>(
    currentReport?.processDocumentationOfActivitiesUndertaken || {
      dateConducted: "",
      sameDateForAll: false,
      eccMmtMembers: "",
      epepMmtMembers: "",
      ocularMmtMembers: "",
      ocularNA: false,
      methodologyRemarks: "",
      siteValidationApplicable: "",
      samplingDateConducted: "",
      samplingMmtMembers: "",
      samplingMethodologyRemarks: "",
    }
  );

  const [eccMmtAdditional, setEccMmtAdditional] = useState<string[]>(
    currentReport?.eccMmtAdditional || []
  );
  const [epepMmtAdditional, setEpepMmtAdditional] = useState<string[]>(
    currentReport?.epepMmtAdditional || []
  );
  const [ocularMmtAdditional, setOcularMmtAdditional] = useState<string[]>(
    currentReport?.ocularMmtAdditional || []
  );

  // Auto-sync local state to store
  useEffect(() => {
    updateMultipleSections({
      executiveSummaryOfCompliance: executiveSummary,
      processDocumentationOfActivitiesUndertaken: {
        ...processDoc,
        eccMmtAdditional,
        epepMmtAdditional,
        ocularMmtAdditional,
      },
      eccMmtAdditional,
      epepMmtAdditional,
      ocularMmtAdditional,
    });
  }, [
    executiveSummary,
    processDoc,
    eccMmtAdditional,
    epepMmtAdditional,
    ocularMmtAdditional,
  ]);

  // Fill with test data for quick testing
  const fillTestData = () => {
    setExecutiveSummary({
      epepCompliance: {
        safety: true,
        social: true,
        rehabilitation: false,
      },
      epepRemarks:
        "Safety and social commitments are being followed. Rehabilitation needs improvement.",
      sdmpCompliance: "Complied",
      sdmpRemarks: "SDMP requirements are being met according to schedule.",
      complaintsManagement: {
        complaintReceiving: true,
        caseInvestigation: true,
        implementationControl: true,
        communicationComplainant: true,
        complaintDocumentation: true,
        naForAll: false,
      },
      complaintsRemarks:
        "Comprehensive complaints management system is in place and functioning well.",
      accountability: "Complied",
      accountabilityRemarks:
        "Mining engineer is properly registered and active.",
      othersSpecify: "",
      othersNA: true,
    });

    setProcessDoc({
      dateConducted: "2025-03-15",
      sameDateForAll: true,
      eccMmtMembers: "John Smith - MMT Lead, Jane Doe - EMB Representative",
      epepMmtMembers:
        "Robert Johnson - EPEP Specialist, Maria Garcia - Community Rep",
      ocularMmtMembers:
        "Carlos Rodriguez - Site Inspector, Lisa Chen - Environmental Officer",
      ocularNA: false,
      methodologyRemarks:
        "Comprehensive site inspection conducted including all operational areas, waste management facilities, and rehabilitation sites. Weather conditions were favorable.",
      siteValidationApplicable: "Yes",
      samplingDateConducted: "2025-03-16",
      samplingMmtMembers:
        "Dr. Thomas Anderson - Laboratory Lead, Lisa Martinez - Sample Coordinator",
      samplingMethodologyRemarks:
        "Environmental sampling conducted per DENR standards. Water, soil, and air quality samples collected at designated monitoring points. Chain of custody protocols strictly followed.",
    });

    // Add 3 additional MMT members for each category
    setEccMmtAdditional([
      "David Wilson - Regional Director",
      "Sarah Thompson - Compliance Officer",
      "Michael Brown - Technical Advisor",
    ]);

    setEpepMmtAdditional([
      "Patricia Martinez - Safety Inspector",
      "James Anderson - Social Development Officer",
      "Jennifer Lee - Rehabilitation Specialist",
    ]);

    setOcularMmtAdditional([
      "Thomas White - Mining Engineer",
      "Elizabeth Harris - Geologist",
      "Christopher Martin - Environmental Scientist",
    ]);

    Alert.alert(
      "Test Data",
      "Page 2 filled with test data! (3 additional members per category)"
    );
  };

  const handleSave = async () => {
    try {
      console.log("Saving draft with additional MMT members:", {
        eccMmtAdditional,
        epepMmtAdditional,
        ocularMmtAdditional,
      });
      await saveDraft();
      Alert.alert("Success", "Draft saved successfully");

      // Navigate to Dashboard using reset
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      );
    } catch (error) {
      console.error("Error saving draft:", error);
      Alert.alert("Error", "Failed to save draft. Please try again.");
    }
  };

  const handleStay = () => {
    // Do nothing, just close the modal
    console.log("User chose to stay");
  };

  const handleSaveToDraft = async () => {
    try {
      console.log("Saving to draft with processDoc:", {
        ...processDoc,
        eccMmtAdditional,
        epepMmtAdditional,
        ocularMmtAdditional,
      });
      await saveDraft();
      Alert.alert("Success", "Draft saved successfully");

      // Navigate to Dashboard using reset
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      );
    } catch (error) {
      console.error("Error saving draft:", error);
      Alert.alert("Error", "Failed to save draft. Please try again.");
    }
  };

  const handleDiscard = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      })
    );
  };

  const handleGoToSummary = () => {
    (navigation as any).navigate("CMVRDocumentExport", {
      cmvrReportId: submissionId || storeSubmissionId || undefined,
      fileName: fileName || storeFileName || "File_Name",
      projectId: projectId || storeProjectId || undefined,
      projectName: projectName || storeProjectName || "",
    });
  };

  const handleSaveAndNext = () => {
    // Data is already in store via auto-sync useEffect
    // Just navigate with metadata
    const nextParams = {
      submissionId: submissionId || storeSubmissionId,
      projectId: projectId || storeProjectId,
      projectName: projectName || storeProjectName,
      fileName: fileName || storeFileName,
    } as any;

    console.log(
      "Navigating to ComplianceMonitoring with metadata:",
      Object.keys(nextParams)
    );
    navigation.navigate("ComplianceMonitoring", nextParams);
  };

  const updateExecutiveSummary = (field: string, value: any) => {
    setExecutiveSummary((prev) => ({ ...prev, [field]: value }));
  };

  const updateProcessDoc = (field: string, value: any) => {
    setProcessDoc((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEpepCompliance = (
    field: keyof ExecutiveSummary["epepCompliance"]
  ) => {
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
    Alert.alert(
      "Delete MMT Member",
      "Are you sure you want to delete this ECC MMT member?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setEccMmtAdditional(eccMmtAdditional.filter((_, i) => i !== index));
          },
        },
      ]
    );
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
          onStay={handleStay}
          onSaveToDraft={handleSaveToDraft}
          onDiscard={handleDiscard}
          onGoToSummary={handleGoToSummary}
        />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Test Data Button - Only show in development */}
        {__DEV__ && (
          <TouchableOpacity
            style={{
              backgroundColor: "#FFA500",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              marginHorizontal: 16,
              marginTop: 16,
              alignItems: "center",
            }}
            onPress={fillTestData}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              🧪 Fill Test Data (Page 2)
            </Text>
          </TouchableOpacity>
        )}
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
        {/* filler gap ts not advisable tbh*/}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default CMVRPage2Screen;
