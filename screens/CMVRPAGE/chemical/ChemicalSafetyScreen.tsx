import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
import { saveDraft } from "../../../lib/drafts";
import { ChemicalSafetySection } from "./components/ChemicalSafetySection";
import { ComplianceCheckboxSection } from "./components/ComplianceCheckboxSection";
import { ComplaintsSection } from "./components/ComplaintsSection";
import {
  ChemicalSafetyData,
  Complaint,
  YesNoNull,
  ChemicalCategory,
} from "../types/ChemicalSafetyScreen.types";
import { styles } from "../styles/ChemicalSafetyScreen.styles";

export default function ChemicalSafetyScreen({ navigation, route }: any) {
  const [chemicalSafety, setChemicalSafety] = useState<ChemicalSafetyData>({
    isNA: false,
    riskManagement: null,
    training: null,
    handling: null,
    emergencyPreparedness: null,
    remarks: "",
    chemicalCategory: null,
    othersSpecify: "",
  });
  const [healthSafetyChecked, setHealthSafetyChecked] = useState(false);
  const [socialDevChecked, setSocialDevChecked] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: `complaint-${Date.now()}`,
      isNA: false,
      dateFiled: "",
      filedLocation: null,
      othersSpecify: "",
      nature: "",
      resolutions: "",
    },
  ]);

  // Hydrate from route params when coming from a draft
  useEffect(() => {
    const params: any = route?.params || {};
    if (params.complianceWithGoodPracticeInChemicalSafetyManagement) {
      const cs = params.complianceWithGoodPracticeInChemicalSafetyManagement;
      setChemicalSafety((prev) => ({ ...prev, ...(cs.chemicalSafety || {}) }));
      if (typeof cs.healthSafetyChecked === "boolean") {
        setHealthSafetyChecked(cs.healthSafetyChecked);
      }
      if (typeof cs.socialDevChecked === "boolean") {
        setSocialDevChecked(cs.socialDevChecked);
      }
    }
    if (Array.isArray(params.complaintsVerificationAndManagement)) {
      setComplaints(params.complaintsVerificationAndManagement);
    }
  }, [route?.params]);

  const updateChemicalSafety = (
    field: keyof ChemicalSafetyData,
    value: YesNoNull | string | boolean | ChemicalCategory
  ) => {
    setChemicalSafety((prev) => {
      const newState = { ...prev };
      if (field === "isNA") {
        newState.isNA = value as boolean;
        if (newState.isNA) {
          newState.riskManagement = null;
          newState.training = null;
          newState.handling = null;
          newState.emergencyPreparedness = null;
          newState.remarks = "";
          newState.chemicalCategory = null;
          newState.othersSpecify = "";
        }
      } else {
        newState.isNA = false;
        (newState[field] as any) = value;
        if (field === "chemicalCategory" && value !== "Others") {
          newState.othersSpecify = "";
        }
      }
      return newState;
    });
  };

  const addComplaint = () => {
    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}`,
      isNA: false,
      dateFiled: "",
      filedLocation: null,
      othersSpecify: "",
      nature: "",
      resolutions: "",
    };
    setComplaints((prev) => [...prev, newComplaint]);
  };

  const updateComplaint = (
    id: string,
    field: keyof Omit<Complaint, "id">,
    value: string | boolean | Complaint["filedLocation"]
  ) => {
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          const updatedComplaint = { ...complaint };
          if (field === "isNA") {
            updatedComplaint.isNA = value as boolean;
            if (updatedComplaint.isNA) {
              updatedComplaint.dateFiled = "";
              updatedComplaint.filedLocation = null;
              updatedComplaint.othersSpecify = "";
              updatedComplaint.nature = "";
              updatedComplaint.resolutions = "";
            }
          } else {
            updatedComplaint.isNA = false;
            (updatedComplaint[field] as any) = value;
            if (field === "filedLocation" && value !== "Others") {
              updatedComplaint.othersSpecify = "";
            }
          }
          return updatedComplaint;
        }
        return complaint;
      })
    );
  };

  const removeComplaint = (id: string) => {
    Alert.alert(
      "Remove Complaint",
      "Are you sure you want to remove this complaint?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            if (complaints.length > 1) {
              setComplaints((prev) => prev.filter((c) => c.id !== id));
            } else {
              Alert.alert(
                "Cannot Remove",
                "At least one complaint entry is required."
              );
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    console.log("Saving Chemical Safety data...");

    // Collect all previous page data from route.params
    const prevPageData: any = route.params || {};

    // Prepare chemical safety data
    const complianceWithGoodPracticeInChemicalSafetyManagement = {
      chemicalSafety,
      healthSafetyChecked,
      socialDevChecked,
    };
    const complaintsVerificationAndManagement = complaints;

    // Combine all data from previous pages + current page
    const draftData = {
      generalInfo: prevPageData.generalInfo,
      eccInfo: prevPageData.eccInfo,
      eccAdditionalForms: prevPageData.eccAdditionalForms,
      isagInfo: prevPageData.isagInfo,
      isagAdditionalForms: prevPageData.isagAdditionalForms,
      epepInfo: prevPageData.epepInfo,
      epepAdditionalForms: prevPageData.epepAdditionalForms,
      rcfInfo: prevPageData.rcfInfo,
      rcfAdditionalForms: prevPageData.rcfAdditionalForms,
      mtfInfo: prevPageData.mtfInfo,
      mtfAdditionalForms: prevPageData.mtfAdditionalForms,
      fmrdfInfo: prevPageData.fmrdfInfo,
      fmrdfAdditionalForms: prevPageData.fmrdfAdditionalForms,
      mmtInfo: prevPageData.mmtInfo,
      executiveSummary: prevPageData.executiveSummary,
      processDocumentation: prevPageData.processDocumentation,
      complianceToProjectLocationAndCoverageLimits:
        prevPageData.complianceToProjectLocationAndCoverageLimits,
      eiaCompliance: prevPageData.eiaCompliance,
      wasteManagement: prevPageData.wasteManagement,
      complianceWithGoodPracticeInChemicalSafetyManagement,
      complaintsVerificationAndManagement,
      savedAt: new Date().toISOString(),
    };

    const fileName = prevPageData.fileName || "Untitled";

    // Save draft to AsyncStorage
    const success = await saveDraft(fileName, draftData);

    if (success) {
      Alert.alert("Success", "Draft saved successfully");
      // Navigate to Dashboard using CommonActions.reset
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      );
    } else {
      Alert.alert("Error", "Failed to save draft");
    }
  };

  const fillTestData = () => {
    setChemicalSafety({
      isNA: false,
      riskManagement: "YES",
      training: "YES",
      handling: "YES",
      emergencyPreparedness: "YES",
      remarks:
        "All chemical safety protocols are in place and being followed. Regular training conducted quarterly.",
      chemicalCategory: null,
      othersSpecify: "",
    });

    setHealthSafetyChecked(true);
    setSocialDevChecked(true);

    // Add 3 complaints
    setComplaints([
      {
        id: "1",
        isNA: false,
        dateFiled: "January 15, 2025",
        filedLocation: "DENR",
        othersSpecify: "",
        nature:
          "Noise complaint from nearby residents during blasting operations",
        resolutions:
          "Adjusted blasting schedule to avoid early morning hours. Provided advance notice to community. Issue resolved.",
      },
      {
        id: "2",
        isNA: false,
        dateFiled: "February 20, 2025",
        filedLocation: "Others",
        othersSpecify: "LGU",
        nature: "Dust accumulation on crops near haul road reported by farmer",
        resolutions:
          "Increased frequency of water spraying on haul road. Installed additional dust suppressors. Compensated affected farmer.",
      },
      {
        id: "3",
        isNA: false,
        dateFiled: "March 5, 2025",
        filedLocation: "Others",
        othersSpecify: "Barangay",
        nature:
          "Request for road maintenance on access road used by mining trucks",
        resolutions:
          "Agreed to co-fund road repair with LGU. Work scheduled for April 2025. Regular maintenance plan established.",
      },
    ]);

    Alert.alert(
      "Test Data",
      "Chemical Safety filled with test data (3 complaints)"
    );
  };

  const handleSaveNext = () => {
    console.log("Navigating to Recommendations screen (no draft save)...");
    const complianceWithGoodPracticeInChemicalSafetyManagement = {
      chemicalSafety,
      healthSafetyChecked,
      socialDevChecked,
    };
    const complaintsVerificationAndManagement = complaints;
    const nextParams = {
      ...(route?.params || {}),
      complianceWithGoodPracticeInChemicalSafetyManagement,
      complaintsVerificationAndManagement,
    } as any;
    console.log(
      "Navigating with ChemicalSafety params keys:",
      Object.keys(nextParams)
    );
    navigation.navigate("Recommendations", nextParams);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader
        fileName="Chemical Safety"
        onBack={() => navigation.goBack()}
        onSave={handleSave}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ChemicalSafetySection
          chemicalSafety={chemicalSafety}
          updateChemicalSafety={updateChemicalSafety}
        />
        <ComplianceCheckboxSection
          sectionNumber="5"
          title="Health and Safety Program"
          subtitle="Independent Monitoring c/o TSHES Team"
          icon="shield-checkmark"
          checked={healthSafetyChecked}
          onToggle={() => setHealthSafetyChecked(!healthSafetyChecked)}
        />
        <ComplianceCheckboxSection
          sectionNumber="6"
          title="Social Development Plan"
          subtitle="Independent Monitoring c/o TSHES Team"
          icon="people"
          checked={socialDevChecked}
          onToggle={() => setSocialDevChecked(!socialDevChecked)}
        />
        <ComplaintsSection
          complaints={complaints}
          updateComplaint={updateComplaint}
          addComplaint={addComplaint}
          removeComplaint={removeComplaint}
        />
        {__DEV__ && (
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: "#ff8c00", marginTop: 12 },
            ]}
            onPress={fillTestData}
          >
            <Text style={styles.saveButtonText}>Fill Test Data</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNext}>
          <Text style={styles.saveButtonText}>Save & Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
