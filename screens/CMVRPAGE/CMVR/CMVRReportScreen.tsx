// CMVRReportScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from "react-native";
import {
  useNavigation,
  useRoute,
  CommonActions,
} from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
import GeneralInfoSection from "./components/GeneralInfoSection";
import CombinedECCISAGSection from "./components/CombinedECCISAGSection";
import EPEPSection from "./components/EPEPSection";
import RCFSection from "./components/RCFSection";
import MMTSection from "./components/MMTSection";
import type { MMTInfo } from "./types/mmt.types";
import { Ionicons } from "@expo/vector-icons";
import { useFileName } from "../../../contexts/FileNameContext";
import { createCMVRReport } from "../../../lib/cmvr";
import { saveDraft } from "../../../lib/drafts";
import {
  CMVRReportScreenNavigationProp,
  CMVRReportScreenRouteProp,
  GeneralInfo,
  ECCInfo,
  ECCAdditionalForm,
  ISAGInfo,
  ISAGAdditionalForm,
  EPEPInfo,
  RCFInfo,
  CreateCMVRDto,
} from "../types/CMVRReportScreen.types";
import { styles } from "../styles/CMVRReportScreen.styles";
import ConfirmationDialog from "../components/ConfirmationDialog";

// Helper function to transform frontend data to backend DTO
const transformToBackendDTO = (
  generalInfo: GeneralInfo,
  eccInfo: ECCInfo,
  eccAdditionalForms: ECCAdditionalForm[],
  isagInfo: ISAGInfo,
  isagAdditionalForms: ISAGAdditionalForm[],
  epepInfo: EPEPInfo,
  epepAdditionalForms: Array<Omit<EPEPInfo, "isNA">>,
  rcfInfo: RCFInfo,
  rcfAdditionalForms: Array<Omit<RCFInfo, "isNA">>,
  mtfInfo: RCFInfo,
  mtfAdditionalForms: Array<Omit<RCFInfo, "isNA">>,
  fmrdfInfo: RCFInfo,
  fmrdfAdditionalForms: Array<Omit<RCFInfo, "isNA">>,
  mmtInfo: MMTInfo
): CreateCMVRDto => {
  return {
    // General Info mapping
    companyName: generalInfo.companyName,
    location: [
      generalInfo.location,
      generalInfo.municipality,
      generalInfo.province,
      generalInfo.region,
    ]
      .filter(Boolean)
      .join(", "),
    quarter: generalInfo.quarter,
    year: parseInt(generalInfo.year) || new Date().getFullYear(),
    dateOfComplianceMonitoringAndValidation: generalInfo.dateOfCompliance,
    monitoringPeriodCovered: generalInfo.monitoringPeriod,
    dateOfCmrSubmission: generalInfo.dateOfCMRSubmission,

    // ECC array - combine main form and additional forms
    ecc: [
      ...(eccInfo.isNA
        ? []
        : [
            {
              permitHolderName: eccInfo.permitHolder,
              eccNumber: eccInfo.eccNumber,
              dateOfIssuance: eccInfo.dateOfIssuance,
            },
          ]),
      ...eccAdditionalForms.map((form) => ({
        permitHolderName: form.permitHolder,
        eccNumber: form.eccNumber,
        dateOfIssuance: form.dateOfIssuance,
      })),
    ],

    // ISAG/MPP array - combine main form and additional forms
    isagMpp: [
      ...(isagInfo.isNA
        ? []
        : [
            {
              permitHolderName: isagInfo.permitHolder,
              isagPermitNumber: isagInfo.isagNumber,
              dateOfIssuance: isagInfo.dateOfIssuance,
            },
          ]),
      ...isagAdditionalForms.map((form) => ({
        permitHolderName: form.permitHolder,
        isagPermitNumber: form.isagNumber,
        dateOfIssuance: form.dateOfIssuance,
      })),
    ],

    // Project info from ISAG section
    projectCurrentName: isagInfo.currentName || generalInfo.projectName,
    projectNameInEcc: isagInfo.nameInECC || generalInfo.projectName,
    projectStatus: isagInfo.projectStatus,
    projectGeographicalCoordinates:
      isagInfo.gpsX && isagInfo.gpsY
        ? `X: ${isagInfo.gpsX}, Y: ${isagInfo.gpsY}`
        : "",

    // Proponent info from ISAG section
    proponent: {
      contactPersonAndPosition: isagInfo.proponentContact,
      mailingAddress: isagInfo.proponentAddress,
      telephoneFax: isagInfo.proponentPhone,
      emailAddress: isagInfo.proponentEmail,
    },

    // MMT info
    mmt: {
      contactPersonAndPosition: mmtInfo.contactPerson,
      mailingAddress: mmtInfo.mailingAddress,
      telephoneFax: mmtInfo.phoneNumber,
      emailAddress: mmtInfo.emailAddress,
    },

    // EPEP status and array
    epepFmrdpStatus: epepInfo.isNA ? "N/A" : "Approved",
    epep: [
      ...(epepInfo.isNA
        ? []
        : [
            {
              permitHolderName: epepInfo.permitHolder,
              epepNumber: epepInfo.epepNumber,
              dateOfApproval: epepInfo.dateOfApproval,
            },
          ]),
      ...epepAdditionalForms.map((form) => ({
        permitHolderName: form.permitHolder,
        epepNumber: form.epepNumber,
        dateOfApproval: form.dateOfApproval,
      })),
    ],

    // Rehabilitation Cash Fund array
    rehabilitationCashFund: [
      ...(rcfInfo.isNA
        ? []
        : [
            {
              permitHolderName: rcfInfo.permitHolder,
              savingsAccountNumber: rcfInfo.savingsAccount,
              amountDeposited: rcfInfo.amountDeposited,
              dateUpdated: rcfInfo.dateUpdated,
            },
          ]),
      ...rcfAdditionalForms.map((form) => ({
        permitHolderName: form.permitHolder,
        savingsAccountNumber: form.savingsAccount,
        amountDeposited: form.amountDeposited,
        dateUpdated: form.dateUpdated,
      })),
    ],

    // Monitoring Trust Fund array
    monitoringTrustFundUnified: [
      ...(mtfInfo.isNA
        ? []
        : [
            {
              permitHolderName: mtfInfo.permitHolder,
              savingsAccountNumber: mtfInfo.savingsAccount,
              amountDeposited: mtfInfo.amountDeposited,
              dateUpdated: mtfInfo.dateUpdated,
            },
          ]),
      ...mtfAdditionalForms.map((form) => ({
        permitHolderName: form.permitHolder,
        savingsAccountNumber: form.savingsAccount,
        amountDeposited: form.amountDeposited,
        dateUpdated: form.dateUpdated,
      })),
    ],

    // Final Mine Rehabilitation and Decommissioning Fund array
    finalMineRehabilitationAndDecommissioningFund: [
      ...(fmrdfInfo.isNA
        ? []
        : [
            {
              permitHolderName: fmrdfInfo.permitHolder,
              savingsAccountNumber: fmrdfInfo.savingsAccount,
              amountDeposited: fmrdfInfo.amountDeposited,
              dateUpdated: fmrdfInfo.dateUpdated,
            },
          ]),
      ...fmrdfAdditionalForms.map((form) => ({
        permitHolderName: form.permitHolder,
        savingsAccountNumber: form.savingsAccount,
        amountDeposited: form.amountDeposited,
        dateUpdated: form.dateUpdated,
      })),
    ],

    // Note: These sections will be added in Page 2
    // executiveSummaryOfCompliance - optional, will be added later
    // processDocumentationOfActivitiesUndertaken - optional, will be added later
    // complianceMonitoringReport - optional, will be added later
  };
};

const CMVRReportScreen: React.FC = () => {
  const navigation = useNavigation<CMVRReportScreenNavigationProp>();
  const route = useRoute<CMVRReportScreenRouteProp>();
  const routeParams = route.params || {};
  const draftData = routeParams.draftData;
  const submissionId = routeParams.submissionId ?? null;
  const projectId = routeParams.projectId ?? null;
  const projectName =
    (typeof routeParams.projectName === "string" && routeParams.projectName) ||
    draftData?.generalInfo?.projectName ||
    draftData?.generalInfo?.projectNameCurrent ||
    "";
  const routeFileName =
    routeParams.fileName || draftData?.fileName || undefined;

  const { fileName, setFileName } = useFileName();

  useEffect(() => {
    if (routeFileName && routeFileName !== fileName) {
      setFileName(routeFileName);
    } else if (!fileName || fileName.trim() === "") {
      // Set default fileName to "Untitled" if not provided
      setFileName("Untitled");
    }
  }, [routeFileName, fileName, setFileName]);

  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>(() => ({
    companyName: draftData?.generalInfo?.companyName || "",
    projectName:
      draftData?.generalInfo?.projectName ||
      draftData?.generalInfo?.projectNameCurrent ||
      projectName ||
      "",
    location: draftData?.generalInfo?.location || "",
    region: draftData?.generalInfo?.region || "",
    province: draftData?.generalInfo?.province || "",
    municipality: draftData?.generalInfo?.municipality || "",
    quarter: draftData?.generalInfo?.quarter || "",
    year: draftData?.generalInfo?.year || "",
    dateOfCompliance: draftData?.generalInfo?.dateOfCompliance || "",
    monitoringPeriod: draftData?.generalInfo?.monitoringPeriod || "",
    dateOfCMRSubmission: draftData?.generalInfo?.dateOfCMRSubmission || "",
  }));

  const handleGeneralInfoChange = (field: string, value: string) => {
    if (field === "fileName") {
      setFileName(value);
    } else {
      setGeneralInfo((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const [eccInfo, setEccInfo] = useState<ECCInfo>({
    isNA: draftData?.eccInfo?.isNA ?? false,
    permitHolder: draftData?.eccInfo?.permitHolder || "",
    eccNumber: draftData?.eccInfo?.eccNumber || "",
    dateOfIssuance: draftData?.eccInfo?.dateOfIssuance || "",
  });

  const [eccAdditionalForms, setEccAdditionalForms] = useState<
    ECCAdditionalForm[]
  >(draftData?.eccAdditionalForms || []);

  const [isagInfo, setIsagInfo] = useState<ISAGInfo>({
    isNA: draftData?.isagInfo?.isNA ?? false,
    permitHolder: draftData?.isagInfo?.permitHolder || "",
    isagNumber: draftData?.isagInfo?.isagNumber || "",
    dateOfIssuance: draftData?.isagInfo?.dateOfIssuance || "",
    currentName: draftData?.isagInfo?.currentName || "",
    nameInECC: draftData?.isagInfo?.nameInECC || "",
    projectStatus: draftData?.isagInfo?.projectStatus || "",
    gpsX: draftData?.isagInfo?.gpsX || "",
    gpsY: draftData?.isagInfo?.gpsY || "",
    proponentName: draftData?.isagInfo?.proponentName || "",
    proponentContact: draftData?.isagInfo?.proponentContact || "",
    proponentAddress: draftData?.isagInfo?.proponentAddress || "",
    proponentPhone: draftData?.isagInfo?.proponentPhone || "",
    proponentEmail: draftData?.isagInfo?.proponentEmail || "",
  });

  const [isagAdditionalForms, setIsagAdditionalForms] = useState<
    ISAGAdditionalForm[]
  >(draftData?.isagAdditionalForms || []);

  const [epepInfo, setEpepInfo] = useState<EPEPInfo>({
    isNA: draftData?.epepInfo?.isNA ?? false,
    permitHolder: draftData?.epepInfo?.permitHolder || "",
    epepNumber: draftData?.epepInfo?.epepNumber || "",
    dateOfApproval: draftData?.epepInfo?.dateOfApproval || "",
  });

  const [epepAdditionalForms, setEpepAdditionalForms] = useState<
    Array<Omit<EPEPInfo, "isNA">>
  >(draftData?.epepAdditionalForms || []);

  const [rcfInfo, setRcfInfo] = useState<RCFInfo>({
    isNA: draftData?.rcfInfo?.isNA ?? false,
    permitHolder: draftData?.rcfInfo?.permitHolder || "",
    savingsAccount: draftData?.rcfInfo?.savingsAccount || "",
    amountDeposited: draftData?.rcfInfo?.amountDeposited || "",
    dateUpdated: draftData?.rcfInfo?.dateUpdated || "",
  });

  const [rcfAdditionalForms, setRcfAdditionalForms] = useState<
    Array<Omit<RCFInfo, "isNA">>
  >(draftData?.rcfAdditionalForms || []);

  const [mtfInfo, setMtfInfo] = useState<RCFInfo>({
    isNA: draftData?.mtfInfo?.isNA ?? false,
    permitHolder: draftData?.mtfInfo?.permitHolder || "",
    savingsAccount: draftData?.mtfInfo?.savingsAccount || "",
    amountDeposited: draftData?.mtfInfo?.amountDeposited || "",
    dateUpdated: draftData?.mtfInfo?.dateUpdated || "",
  });

  const [mtfAdditionalForms, setMtfAdditionalForms] = useState<
    Array<Omit<RCFInfo, "isNA">>
  >(draftData?.mtfAdditionalForms || []);

  const [fmrdfInfo, setFmrdfInfo] = useState<RCFInfo>({
    isNA: draftData?.fmrdfInfo?.isNA ?? false,
    permitHolder: draftData?.fmrdfInfo?.permitHolder || "",
    savingsAccount: draftData?.fmrdfInfo?.savingsAccount || "",
    amountDeposited: draftData?.fmrdfInfo?.amountDeposited || "",
    dateUpdated: draftData?.fmrdfInfo?.dateUpdated || "",
  });

  const [fmrdfAdditionalForms, setFmrdfAdditionalForms] = useState<
    Array<Omit<RCFInfo, "isNA">>
  >(draftData?.fmrdfAdditionalForms || []);

  const [mmtInfo, setMmtInfo] = useState<MMTInfo>({
    isNA: draftData?.mmtInfo?.isNA ?? false,
    contactPerson: draftData?.mmtInfo?.contactPerson || "",
    mailingAddress: draftData?.mmtInfo?.mailingAddress || "",
    phoneNumber: draftData?.mmtInfo?.phoneNumber || "",
    emailAddress: draftData?.mmtInfo?.emailAddress || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes to show unsaved warning
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    generalInfo,
    eccInfo,
    isagInfo,
    epepInfo,
    rcfInfo,
    mtfInfo,
    fmrdfInfo,
    mmtInfo,
  ]);

  // Fill with test data for quick testing
  const fillTestData = () => {
    setGeneralInfo({
      companyName: "Test Mining Company",
      projectName: projectName || "Test Project",
      location: "123 Mining Street",
      region: "Region 1",
      province: "Test Province",
      municipality: "Test Municipality",
      quarter: "1st",
      year: "2025",
      dateOfCompliance: "2025-03-31",
      monitoringPeriod: "2025-01-01 to 2025-03-31",
      dateOfCMRSubmission: "2025-04-15",
    });

    setEccInfo({
      isNA: false,
      permitHolder: "First ECC Permit Holder",
      eccNumber: "ECC-2025-001",
      dateOfIssuance: "2025-01-15",
    });

    // Add 2 more ECC entries
    setEccAdditionalForms([
      {
        permitHolder: "Second ECC Permit Holder",
        eccNumber: "ECC-2025-002",
        dateOfIssuance: "2025-01-20",
      },
      {
        permitHolder: "Third ECC Permit Holder",
        eccNumber: "ECC-2025-003",
        dateOfIssuance: "2025-01-25",
      },
    ]);

    setIsagInfo({
      isNA: false,
      permitHolder: "First ISAG Holder",
      isagNumber: "ISAG-2025-001",
      dateOfIssuance: "2025-01-20",
      currentName: "Current Test Project",
      nameInECC: "Test Project in ECC",
      projectStatus: "Active",
      gpsX: "120.5678",
      gpsY: "14.1234",
      proponentName: "Test Proponent",
      proponentContact: "John Doe, CEO",
      proponentAddress: "456 Business Ave",
      proponentPhone: "+63-912-345-6789",
      proponentEmail: "test@mining.com",
    });

    // Add 2 more ISAG entries
    setIsagAdditionalForms([
      {
        permitHolder: "Second ISAG Holder",
        isagNumber: "ISAG-2025-002",
        dateOfIssuance: "2025-01-25",
      },
      {
        permitHolder: "Third ISAG Holder",
        isagNumber: "ISAG-2025-003",
        dateOfIssuance: "2025-01-30",
      },
    ]);

    setEpepInfo({
      isNA: false,
      permitHolder: "First EPEP Holder",
      epepNumber: "EPEP-2025-001",
      dateOfApproval: "2025-02-01",
    });

    // Add 2 more EPEP entries
    setEpepAdditionalForms([
      {
        permitHolder: "Second EPEP Holder",
        epepNumber: "EPEP-2025-002",
        dateOfApproval: "2025-02-05",
      },
      {
        permitHolder: "Third EPEP Holder",
        epepNumber: "EPEP-2025-003",
        dateOfApproval: "2025-02-10",
      },
    ]);

    setRcfInfo({
      isNA: false,
      permitHolder: "First RCF Holder",
      savingsAccount: "RCF-1234-5678-90",
      amountDeposited: "500,000.00",
      dateUpdated: "2025-03-01",
    });

    // Add 2 more RCF entries
    setRcfAdditionalForms([
      {
        permitHolder: "Second RCF Holder",
        savingsAccount: "RCF-2345-6789-01",
        amountDeposited: "750,000.00",
        dateUpdated: "2025-03-05",
      },
      {
        permitHolder: "Third RCF Holder",
        savingsAccount: "RCF-3456-7890-12",
        amountDeposited: "1,000,000.00",
        dateUpdated: "2025-03-10",
      },
    ]);

    setMtfInfo({
      isNA: false,
      permitHolder: "First MTF Holder",
      savingsAccount: "MTF-1234-5678-90",
      amountDeposited: "2,500,000.00",
      dateUpdated: "2025-03-01",
    });

    // Add 2 more MTF entries
    setMtfAdditionalForms([
      {
        permitHolder: "Second MTF Holder",
        savingsAccount: "MTF-2345-6789-01",
        amountDeposited: "3,000,000.00",
        dateUpdated: "2025-03-05",
      },
      {
        permitHolder: "Third MTF Holder",
        savingsAccount: "MTF-3456-7890-12",
        amountDeposited: "3,500,000.00",
        dateUpdated: "2025-03-10",
      },
    ]);

    setFmrdfInfo({
      isNA: false,
      permitHolder: "First FMRDF Holder",
      savingsAccount: "FMRDF-1234-5678-90",
      amountDeposited: "1,500,000.00",
      dateUpdated: "2025-03-01",
    });

    // Add 2 more FMRDF entries
    setFmrdfAdditionalForms([
      {
        permitHolder: "Second FMRDF Holder",
        savingsAccount: "FMRDF-2345-6789-01",
        amountDeposited: "2,000,000.00",
        dateUpdated: "2025-03-05",
      },
      {
        permitHolder: "Third FMRDF Holder",
        savingsAccount: "FMRDF-3456-7890-12",
        amountDeposited: "2,500,000.00",
        dateUpdated: "2025-03-10",
      },
    ]);

    setMmtInfo({
      isNA: false,
      contactPerson: "Jane Smith, MMT Head",
      mailingAddress: "789 Government St",
      phoneNumber: "+63-912-987-6543",
      emailAddress: "mmt@denr.gov",
    });

    Alert.alert(
      "Test Data",
      "Form filled with test data! (3 entries per array)"
    );
  };

  const handleSave = async () => {
    if (isSaving) {
      console.log("Save already in progress...");
      return;
    }

    try {
      setIsSaving(true);

      // Save as draft to AsyncStorage
      const draftData = {
        generalInfo,
        eccInfo,
        eccAdditionalForms,
        isagInfo,
        isagAdditionalForms,
        epepInfo,
        epepAdditionalForms,
        rcfInfo,
        rcfAdditionalForms,
        mtfInfo,
        mtfAdditionalForms,
        fmrdfInfo,
        fmrdfAdditionalForms,
        mmtInfo,
        fileName,
        savedAt: new Date().toISOString(),
      };

      const success = await saveDraft(fileName || "Untitled", draftData);

      if (success) {
        setHasUnsavedChanges(false);
        Alert.alert("Success", "Draft saved successfully");

        // Navigate to Dashboard using reset to ensure we go to the root
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          })
        );
      } else {
        throw new Error("Failed to save draft");
      }

      return success;
    } catch (error: any) {
      console.error("Error saving draft:", error);
      Alert.alert("Error", "Failed to save draft. Please try again.", [
        { text: "OK" },
      ]);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    // Validate fileName before proceeding
    if (!fileName || fileName.trim() === "") {
      Alert.alert(
        "File Name Required",
        "Please enter a file name before continuing.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      console.log("Continuing to next page...");
      setHasUnsavedChanges(false); // Reset flag
      // Pass all collected Page 1 data forward so later pages and export can use it
      navigation.navigate("CMVRPage2", {
        ...(route.params || {}),
        ...(routeParams?.draftData || {}),
        submissionId: submissionId,
        projectName: projectName,
        projectId: projectId,
        fileName: fileName,
        generalInfo,
        eccInfo,
        eccAdditionalForms,
        isagInfo,
        isagAdditionalForms,
        epepInfo,
        epepAdditionalForms,
        rcfInfo,
        rcfAdditionalForms,
        mtfInfo,
        mtfAdditionalForms,
        fmrdfInfo,
        fmrdfAdditionalForms,
        mmtInfo,
      } as any);
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowBackDialog(true);
    } else {
      navigation.goBack();
    }
  };

  const confirmBack = () => {
    setShowBackDialog(false);
    setHasUnsavedChanges(false);
    navigation.goBack();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader onBack={handleBack} onSave={handleSave} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Test Data Button - Only show in development */}
        {__DEV__ && (
          <TouchableOpacity
            style={{
              backgroundColor: "#FFA500",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              alignItems: "center",
            }}
            onPress={fillTestData}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              🧪 Fill Test Data
            </Text>
          </TouchableOpacity>
        )}

        <GeneralInfoSection
          fileName={fileName}
          {...generalInfo}
          onChange={handleGeneralInfoChange}
        />
        <View style={styles.divider} />
        <CombinedECCISAGSection
          eccInfo={eccInfo}
          setEccInfo={setEccInfo}
          eccAdditionalForms={eccAdditionalForms}
          setEccAdditionalForms={setEccAdditionalForms}
          isagInfo={isagInfo}
          setIsagInfo={setIsagInfo}
          isagAdditionalForms={isagAdditionalForms}
          setIsagAdditionalForms={setIsagAdditionalForms}
        />
        <View style={styles.divider} />
        <EPEPSection
          epepInfo={epepInfo}
          setEpepInfo={setEpepInfo}
          epepAdditionalForms={epepAdditionalForms}
          setEpepAdditionalForms={setEpepAdditionalForms}
        />
        <View style={styles.divider} />
        <RCFSection
          rcfInfo={rcfInfo}
          setRcfInfo={setRcfInfo}
          rcfAdditionalForms={rcfAdditionalForms}
          setRcfAdditionalForms={setRcfAdditionalForms}
          mtfInfo={mtfInfo}
          setMtfInfo={setMtfInfo}
          mtfAdditionalForms={mtfAdditionalForms}
          setMtfAdditionalForms={setMtfAdditionalForms}
          fmrdfInfo={fmrdfInfo}
          setFmrdfInfo={setFmrdfInfo}
          fmrdfAdditionalForms={fmrdfAdditionalForms}
          setFmrdfAdditionalForms={setFmrdfAdditionalForms}
        />
        <View style={styles.divider} />
        <MMTSection mmtInfo={mmtInfo} setMmtInfo={setMmtInfo} />
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndContinue}
        >
          <Text style={styles.saveNextButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>

      <ConfirmationDialog
        visible={showBackDialog}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to go back? All unsaved data will be lost."
        confirmText="Discard"
        cancelText="Stay"
        onConfirm={confirmBack}
        onCancel={() => setShowBackDialog(false)}
        type="warning"
      />
    </View>
  );
};

export default CMVRReportScreen;
