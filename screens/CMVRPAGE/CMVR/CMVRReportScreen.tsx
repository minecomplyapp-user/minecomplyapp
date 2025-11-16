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
import { useCmvrStore } from "../../../store/cmvrStore";
import { createCMVRReport } from "../../../lib/cmvr";

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
    projectCurrentName: isagInfo.currentName || generalInfo.projectName,
    projectNameInEcc: isagInfo.nameInECC || generalInfo.projectName,
    projectStatus: isagInfo.projectStatus,
    projectGeographicalCoordinates:
      isagInfo.gpsX && isagInfo.gpsY
        ? `X: ${isagInfo.gpsX}, Y: ${isagInfo.gpsY}`
        : "",
    proponent: {
      contactPersonAndPosition: isagInfo.proponentContact,
      mailingAddress: isagInfo.proponentAddress,
      telephoneFax: isagInfo.proponentPhone,
      emailAddress: isagInfo.proponentEmail,
    },
    mmt: {
      contactPersonAndPosition: mmtInfo.contactPerson,
      mailingAddress: mmtInfo.mailingAddress,
      telephoneFax: mmtInfo.phoneNumber,
      emailAddress: mmtInfo.emailAddress,
    },
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
  };
};

const CMVRReportScreen: React.FC = () => {
  const navigation = useNavigation<CMVRReportScreenNavigationProp>();
  const route = useRoute<CMVRReportScreenRouteProp>();
  const routeParams = route.params || {};
  const routeDraftData =
    routeParams.draftData && typeof routeParams.draftData === "object"
      ? routeParams.draftData
      : null;

  useEffect(() => {
    if (routeParams.submissionId) {
      console.warn(
        `[CMVR] Opening existing submission ${routeParams.submissionId} on CMVRReportScreen`
      );
    }
  }, [routeParams.submissionId]);

  // **ZUSTAND STORE** - Single source of truth
  const {
    currentReport,
    fileName: storeFileName,
    submissionId: storeSubmissionId,
    projectId: storeProjectId,
    projectName: storeProjectName,
    isDirty,
    updateSection,
    updateMultipleSections,
    updateMetadata,
    saveDraft,
    loadDraft,
    initializeNewReport,
    loadReport,
    clearReport,
  } = useCmvrStore();

  // Local UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [permitHolderList, setPermitHolderList] = useState<string[]>([]);

  // Legacy fileName context (keep for compatibility with other screens)
  const { fileName: contextFileName, setFileName: setContextFileName } =
    useFileName();

  // **INITIALIZATION** - Load from draft or route params on mount
  useEffect(() => {
    const initialize = async () => {
      // Priority: route draft payload > submission params > stored draft > new report
      if (routeDraftData) {
        loadReport(routeDraftData);

        const derivedFileName =
          routeParams.fileName ||
          routeDraftData.fileName ||
          contextFileName ||
          "Untitled";

        updateMetadata({
          fileName: derivedFileName,
          submissionId:
            routeParams.submissionId ?? routeDraftData.submissionId ?? null,
          projectId: routeParams.projectId ?? routeDraftData.projectId ?? null,
          projectName:
            routeParams.projectName ||
            routeDraftData.projectName ||
            routeDraftData.generalInfo?.projectName ||
            "",
        });

        setContextFileName(derivedFileName);
        return;
      }

      if (routeParams.submissionId) {
        // Loading existing submission or draft from route
        const reportData = {
          generalInfo:
            routeParams.draftData?.generalInfo || currentReport?.generalInfo,
          eccInfo: routeParams.draftData?.eccInfo || currentReport?.eccInfo,
          eccAdditionalForms:
            routeParams.draftData?.eccAdditionalForms ||
            currentReport?.eccAdditionalForms,
          isagInfo: routeParams.draftData?.isagInfo || currentReport?.isagInfo,
          isagAdditionalForms:
            routeParams.draftData?.isagAdditionalForms ||
            currentReport?.isagAdditionalForms,
          epepInfo: routeParams.draftData?.epepInfo || currentReport?.epepInfo,
          epepAdditionalForms:
            routeParams.draftData?.epepAdditionalForms ||
            currentReport?.epepAdditionalForms,
          rcfInfo: routeParams.draftData?.rcfInfo || currentReport?.rcfInfo,
          rcfAdditionalForms:
            routeParams.draftData?.rcfAdditionalForms ||
            currentReport?.rcfAdditionalForms,
          mtfInfo: routeParams.draftData?.mtfInfo || currentReport?.mtfInfo,
          mtfAdditionalForms:
            routeParams.draftData?.mtfAdditionalForms ||
            currentReport?.mtfAdditionalForms,
          fmrdfInfo:
            routeParams.draftData?.fmrdfInfo || currentReport?.fmrdfInfo,
          fmrdfAdditionalForms:
            routeParams.draftData?.fmrdfAdditionalForms ||
            currentReport?.fmrdfAdditionalForms,
          mmtInfo: routeParams.draftData?.mmtInfo || currentReport?.mmtInfo,
        };

        loadReport(reportData);

        const fileName =
          routeParams.fileName || routeParams.draftData?.fileName || "Untitled";
        const projectName =
          routeParams.projectName ||
          routeParams.draftData?.generalInfo?.projectName ||
          "";

        updateMetadata({
          fileName,
          submissionId: routeParams.submissionId ?? null,
          projectId: routeParams.projectId ?? null,
          projectName,
        });

        setContextFileName(fileName);
      } else {
        // Always start fresh for new CMVR entries
        const newFileName = contextFileName || "Untitled";
        initializeNewReport(newFileName);
        setContextFileName(newFileName);
      }
    };

    initialize();
  }, []); // Run once on mount

  // **DERIVED STATE** - Get current values from store
  const generalInfo = currentReport?.generalInfo || {
    companyName: "",
    projectName: "",
    location: "",
    region: "",
    province: "",
    municipality: "",
    quarter: "",
    year: "",
    dateOfCompliance: "",
    monitoringPeriod: "",
    dateOfCMRSubmission: "",
  };

  const eccInfo = currentReport?.eccInfo || {
    isNA: false,
    permitHolder: "",
    eccNumber: "",
    dateOfIssuance: "",
  };
  // Ensure isNA is properly read from store
  if (
    currentReport?.eccInfo &&
    typeof currentReport.eccInfo.isNA === "boolean"
  ) {
    eccInfo.isNA = currentReport.eccInfo.isNA;
  }

  const eccAdditionalForms = currentReport?.eccAdditionalForms || [];
  const isagInfo = currentReport?.isagInfo || {
    isNA: false,
    permitHolder: "",
    isagNumber: "",
    dateOfIssuance: "",
    currentName: "",
    nameInECC: "",
    projectStatus: "",
    gpsX: "",
    gpsY: "",
    proponentName: "",
    proponentContact: "",
    proponentAddress: "",
    proponentPhone: "",
    proponentEmail: "",
  };
  // Ensure isNA is properly read from store
  if (
    currentReport?.isagInfo &&
    typeof currentReport.isagInfo.isNA === "boolean"
  ) {
    isagInfo.isNA = currentReport.isagInfo.isNA;
  }

  const isagAdditionalForms = currentReport?.isagAdditionalForms || [];
  const epepInfo = currentReport?.epepInfo || {
    isNA: false,
    permitHolder: "",
    epepNumber: "",
    dateOfApproval: "",
  };
  if (
    currentReport?.epepInfo &&
    typeof currentReport.epepInfo.isNA === "boolean"
  ) {
    epepInfo.isNA = currentReport.epepInfo.isNA;
  }

  const epepAdditionalForms = currentReport?.epepAdditionalForms || [];
  const rcfInfo = currentReport?.rcfInfo || {
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  };
  if (
    currentReport?.rcfInfo &&
    typeof currentReport.rcfInfo.isNA === "boolean"
  ) {
    rcfInfo.isNA = currentReport.rcfInfo.isNA;
  }

  const rcfAdditionalForms = currentReport?.rcfAdditionalForms || [];
  const mtfInfo = currentReport?.mtfInfo || {
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  };
  if (
    currentReport?.mtfInfo &&
    typeof currentReport.mtfInfo.isNA === "boolean"
  ) {
    mtfInfo.isNA = currentReport.mtfInfo.isNA;
  }

  const mtfAdditionalForms = currentReport?.mtfAdditionalForms || [];
  const fmrdfInfo = currentReport?.fmrdfInfo || {
    isNA: false,
    permitHolder: "",
    savingsAccount: "",
    amountDeposited: "",
    dateUpdated: "",
  };
  if (
    currentReport?.fmrdfInfo &&
    typeof currentReport.fmrdfInfo.isNA === "boolean"
  ) {
    fmrdfInfo.isNA = currentReport.fmrdfInfo.isNA;
  }

  const fmrdfAdditionalForms = currentReport?.fmrdfAdditionalForms || [];
  const mmtInfo = currentReport?.mmtInfo || {
    isNA: false,
    contactPerson: "",
    mailingAddress: "",
    phoneNumber: "",
    emailAddress: "",
  };

  const isExistingSubmission = Boolean(
    routeParams.submissionId ?? storeSubmissionId
  );
  const statusLabel = isExistingSubmission
    ? "Editing Submitted CMVR"
    : "New CMVR Report";
  const statusSubtext = isExistingSubmission
    ? `Submission ID: ${routeParams.submissionId || storeSubmissionId}`
    : "All sections start blank without previous data.";

  // **HANDLERS** - Update store instead of local state
  const handleGeneralInfoChange = (field: string, value: string) => {
    if (field === "fileName") {
      updateMetadata({ fileName: value });
      setContextFileName(value);
    } else {
      updateSection("generalInfo", { ...generalInfo, [field]: value });
    }
  };

  // **SETTER FUNCTIONS** - Wrappers to update store sections
  const setEccInfo = (value: ECCInfo | ((prev: ECCInfo) => ECCInfo)) => {
    const newValue = typeof value === "function" ? value(eccInfo) : value;
    updateSection("eccInfo", newValue);
  };

  const setEccAdditionalForms = (
    value:
      | ECCAdditionalForm[]
      | ((prev: ECCAdditionalForm[]) => ECCAdditionalForm[])
  ) => {
    const newValue =
      typeof value === "function" ? value(eccAdditionalForms) : value;
    updateSection("eccAdditionalForms", newValue);
  };

  const setIsagInfo = (value: ISAGInfo | ((prev: ISAGInfo) => ISAGInfo)) => {
    const newValue = typeof value === "function" ? value(isagInfo) : value;
    updateSection("isagInfo", newValue);
  };

  const setIsagAdditionalForms = (
    value:
      | ISAGAdditionalForm[]
      | ((prev: ISAGAdditionalForm[]) => ISAGAdditionalForm[])
  ) => {
    const newValue =
      typeof value === "function" ? value(isagAdditionalForms) : value;
    updateSection("isagAdditionalForms", newValue);
  };

  const setEpepInfo = (value: EPEPInfo | ((prev: EPEPInfo) => EPEPInfo)) => {
    const newValue = typeof value === "function" ? value(epepInfo) : value;
    updateSection("epepInfo", newValue);
  };

  const setEpepAdditionalForms = (
    value:
      | Array<Omit<EPEPInfo, "isNA">>
      | ((prev: Array<Omit<EPEPInfo, "isNA">>) => Array<Omit<EPEPInfo, "isNA">>)
  ) => {
    const newValue =
      typeof value === "function" ? value(epepAdditionalForms) : value;
    updateSection("epepAdditionalForms", newValue);
  };

  const setRcfInfo = (value: RCFInfo | ((prev: RCFInfo) => RCFInfo)) => {
    const newValue = typeof value === "function" ? value(rcfInfo) : value;
    updateSection("rcfInfo", newValue);
  };

  const setRcfAdditionalForms = (
    value:
      | Array<Omit<RCFInfo, "isNA">>
      | ((prev: Array<Omit<RCFInfo, "isNA">>) => Array<Omit<RCFInfo, "isNA">>)
  ) => {
    const newValue =
      typeof value === "function" ? value(rcfAdditionalForms) : value;
    updateSection("rcfAdditionalForms", newValue);
  };

  const setMtfInfo = (value: RCFInfo | ((prev: RCFInfo) => RCFInfo)) => {
    const newValue = typeof value === "function" ? value(mtfInfo) : value;
    updateSection("mtfInfo", newValue);
  };

  const setMtfAdditionalForms = (
    value:
      | Array<Omit<RCFInfo, "isNA">>
      | ((prev: Array<Omit<RCFInfo, "isNA">>) => Array<Omit<RCFInfo, "isNA">>)
  ) => {
    const newValue =
      typeof value === "function" ? value(mtfAdditionalForms) : value;
    updateSection("mtfAdditionalForms", newValue);
  };

  const setFmrdfInfo = (value: RCFInfo | ((prev: RCFInfo) => RCFInfo)) => {
    const newValue = typeof value === "function" ? value(fmrdfInfo) : value;
    updateSection("fmrdfInfo", newValue);
  };

  const setFmrdfAdditionalForms = (
    value:
      | Array<Omit<RCFInfo, "isNA">>
      | ((prev: Array<Omit<RCFInfo, "isNA">>) => Array<Omit<RCFInfo, "isNA">>)
  ) => {
    const newValue =
      typeof value === "function" ? value(fmrdfAdditionalForms) : value;
    updateSection("fmrdfAdditionalForms", newValue);
  };

  const setMmtInfo = (value: MMTInfo | ((prev: MMTInfo) => MMTInfo)) => {
    const newValue = typeof value === "function" ? value(mmtInfo) : value;
    updateSection("mmtInfo", newValue);
  };

  const setGeneralInfo = (
    value: GeneralInfo | ((prev: GeneralInfo) => GeneralInfo)
  ) => {
    const newValue = typeof value === "function" ? value(generalInfo) : value;
    updateSection("generalInfo", newValue);
  };

  // Note: isDirty is automatically tracked by the store, no need for local hasUnsavedChanges

  const fillTestData = () => {
    setGeneralInfo({
      companyName: "Test Mining Company",
      projectName:
        storeProjectName || generalInfo.projectName || "Test Project",
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

      // Save to AsyncStorage using store
      await saveDraft();

      Alert.alert("Success", "Draft saved successfully");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      );
      clearReport();
      return true;
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

  const handleStay = () => {
    // Do nothing, just close the modal
    console.log("User chose to stay");
  };

  const handleSaveToDraft = async (): Promise<void> => {
    // Same as handleSave (using store's saveDraft)
    await handleSave();
  };

  const handleDiscard = () => {
    clearReport();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      })
    );
  };

  const handleSaveAndContinue = async () => {
    const currentFileName = storeFileName || contextFileName || "Untitled";

    if (!currentFileName || currentFileName.trim() === "") {
      Alert.alert(
        "File Name Required",
        "Please enter a file name before continuing.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      console.log("Continuing to next page...");

      // Store already has all the data - just navigate
      // No need to pass data via params anymore!
      navigation.navigate("CMVRPage2", {
        // Only pass metadata (not the actual form data)
        submissionId: storeSubmissionId,
        projectId: storeProjectId,
        projectName: storeProjectName,
        fileName: currentFileName,
      } as any);
    } catch (error) {
      console.error("Error navigating:", error);
    }
  };

  const handleBack = () => {
    // Always show the dialog to confirm discard or stay
    setShowBackDialog(true);
  };

  const confirmBack = () => {
    // Discard: Navigate back without saving to drafts
    setShowBackDialog(false);
    clearReport();
    navigation.goBack();
  };

  const handleGoToSummary = () => {
    (navigation as any).navigate("CMVRDocumentExport", {
      cmvrReportId: routeParams.submissionId || storeSubmissionId || undefined,
      fileName: storeFileName || contextFileName || "Untitled",
      projectId: routeParams.projectId || storeProjectId || undefined,
      projectName:
        routeParams.projectName ||
        storeProjectName ||
        generalInfo.projectName ||
        "",
    });
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
          onBack={handleBack}
          onSave={handleSave}
          onStay={handleStay}
          onSaveToDraft={handleSaveToDraft}
          onDiscard={handleDiscard}
          onGoToSummary={handleGoToSummary}
          allowEdit={true}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.statusBanner,
            isExistingSubmission
              ? styles.statusBannerExisting
              : styles.statusBannerNew,
          ]}
        >
          <Text style={styles.statusBannerLabel}>{statusLabel}</Text>
          <Text style={styles.statusBannerSubtext}>{statusSubtext}</Text>
        </View>
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
          fileName={storeFileName || contextFileName || "Untitled"}
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
          permitHolderList={permitHolderList}
          setPermitHolderList={setPermitHolderList}
        />
        <View style={styles.divider} />
        <EPEPSection
          epepInfo={epepInfo}
          setEpepInfo={setEpepInfo}
          epepAdditionalForms={epepAdditionalForms}
          setEpepAdditionalForms={setEpepAdditionalForms}
          permitHolderList={permitHolderList}
          setPermitHolderList={setPermitHolderList}
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
          permitHolderList={permitHolderList}
        />
        <View style={styles.divider} />
        <MMTSection mmtInfo={mmtInfo} setMmtInfo={setMmtInfo} />
        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndContinue}
        >
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        {/* filler gap ts not advisable tbh*/}
        <View style={{ height: 40 }} />
      </ScrollView>
      <ConfirmationDialog
        visible={showBackDialog}
        title="Go Back"
        message="Are you sure you want to go back? Any unsaved data will be lost."
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
