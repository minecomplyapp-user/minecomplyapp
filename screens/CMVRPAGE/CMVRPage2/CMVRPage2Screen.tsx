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
import { saveDraft } from "../../../lib/drafts";
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
    samplingDateConducted: "",
    samplingMmtMembers: "",
    samplingMethodologyRemarks: "",
  });

  const [eccMmtAdditional, setEccMmtAdditional] = useState<string[]>([]);
  const [epepMmtAdditional, setEpepMmtAdditional] = useState<string[]>([]);
  const [ocularMmtAdditional, setOcularMmtAdditional] = useState<string[]>([]);

  // Hydrate from route params when coming from a draft
  useEffect(() => {
    const params: any = route.params || {};
    if (params.executiveSummaryOfCompliance) {
      setExecutiveSummary({
        ...executiveSummary,
        ...params.executiveSummaryOfCompliance,
      });
    }
    if (params.processDocumentationOfActivitiesUndertaken) {
      setProcessDoc({
        ...processDoc,
        ...params.processDocumentationOfActivitiesUndertaken,
      });
    }
    if (Array.isArray(params.eccMmtAdditional)) {
      setEccMmtAdditional(params.eccMmtAdditional);
    }
    if (Array.isArray(params.epepMmtAdditional)) {
      setEpepMmtAdditional(params.epepMmtAdditional);
    }
    if (Array.isArray(params.ocularMmtAdditional)) {
      setOcularMmtAdditional(params.ocularMmtAdditional);
    }
  }, [route.params]);

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
      // Get all Page 1 data from route params
      const page1Data: any = route.params || {};

      // Combine all data from Page 1 and Page 2
      const draftData = {
        // Page 1 data
        generalInfo: page1Data.generalInfo,
        eccInfo: page1Data.eccInfo,
        eccAdditionalForms: page1Data.eccAdditionalForms,
        isagInfo: page1Data.isagInfo,
        isagAdditionalForms: page1Data.isagAdditionalForms,
        epepInfo: page1Data.epepInfo,
        epepAdditionalForms: page1Data.epepAdditionalForms,
        rcfInfo: page1Data.rcfInfo,
        rcfAdditionalForms: page1Data.rcfAdditionalForms,
        mtfInfo: page1Data.mtfInfo,
        mtfAdditionalForms: page1Data.mtfAdditionalForms,
        fmrdfInfo: page1Data.fmrdfInfo,
        fmrdfAdditionalForms: page1Data.fmrdfAdditionalForms,
        mmtInfo: page1Data.mmtInfo,
        fileName: fileName,
        // Page 2 data (use same keys as navigation)
        executiveSummaryOfCompliance: executiveSummary,
        processDocumentationOfActivitiesUndertaken: processDoc,
        eccMmtAdditional,
        epepMmtAdditional,
        ocularMmtAdditional,
        savedAt: new Date().toISOString(),
      };

      const success = await saveDraft(fileName || "Untitled", draftData);

      if (success) {
        Alert.alert("Success", "Draft saved successfully");
        // Navigate to Dashboard using reset
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          })
        );
      } else {
        Alert.alert("Error", "Failed to save draft. Please try again.");
      }
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
      // Get all Page 1 data from route params
      const page1Data: any = route.params || {};

      // Combine all data from Page 1 and Page 2
      const draftData = {
        // Page 1 data
        generalInfo: page1Data.generalInfo,
        eccInfo: page1Data.eccInfo,
        eccAdditionalForms: page1Data.eccAdditionalForms,
        isagInfo: page1Data.isagInfo,
        isagAdditionalForms: page1Data.isagAdditionalForms,
        epepInfo: page1Data.epepInfo,
        epepAdditionalForms: page1Data.epepAdditionalForms,
        rcfInfo: page1Data.rcfInfo,
        rcfAdditionalForms: page1Data.rcfAdditionalForms,
        mtfInfo: page1Data.mtfInfo,
        mtfAdditionalForms: page1Data.mtfAdditionalForms,
        fmrdfInfo: page1Data.fmrdfInfo,
        fmrdfAdditionalForms: page1Data.fmrdfAdditionalForms,
        mmtInfo: page1Data.mmtInfo,
        fileName: fileName,
        // Page 2 data (use same keys as navigation)
        executiveSummaryOfCompliance: executiveSummary,
        processDocumentationOfActivitiesUndertaken: processDoc,
        eccMmtAdditional,
        epepMmtAdditional,
        ocularMmtAdditional,
        savedAt: new Date().toISOString(),
      };

      const success = await saveDraft(fileName || "Untitled", draftData);

      if (success) {
        Alert.alert("Success", "Draft saved successfully");
        // Navigate to Dashboard using reset
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          })
        );
      } else {
        Alert.alert("Error", "Failed to save draft. Please try again.");
      }
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

  const handleSaveAndNext = () => {
    // Build Page 2 payloads
    const executiveSummaryOfCompliance = {
      ...executiveSummary,
    };

    const processDocumentationOfActivitiesUndertaken = {
      ...processDoc,
      eccMmtAdditional,
      epepMmtAdditional,
      ocularMmtAdditional,
    };

    const nextParams = {
      ...(route.params || {}),
      submissionId,
      projectId,
      projectName,
      fileName,
      executiveSummaryOfCompliance,
      processDocumentationOfActivitiesUndertaken,
    } as any;

    console.log("Navigating with Page2 params keys:", Object.keys(nextParams));
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
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setEccMmtAdditional(eccMmtAdditional.filter((_, i) => i !== index));
          }
        }
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
      </ScrollView>
    </View>
  );
};

export default CMVRPage2Screen;
