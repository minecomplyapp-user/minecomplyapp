import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { CMSHeader } from "../../../components/CMSHeader";
import { saveDraft } from "../../../lib/drafts";
import { QuarrySection } from "./components/QuarrySection";
import { PlantSection } from "./components/PlantSection";
import { PlantPortSection } from "./components/PlantPortSection";
import { PortSection } from "./components/PortSection";
import {
  WasteEntry,
  PlantPortSectionData,
  QuarrySectionData,
  PortSectionData,
  PlantSectionData,
} from "../types/WasteManagementScreen.types";
import {
  styles,
  pickerSelectStyles,
} from "../styles/WasteManagementScreen.styles";

export default function WasteManagementScreen({ navigation, route }: any) {
  const [quarryData, setQuarryData] = useState<QuarrySectionData>({
    noSignificantImpact: false,
    generateTable: false,
    N_A: false,
  });

  const [plantSimpleData, setPlantSimpleData] = useState<PlantSectionData>({
    noSignificantImpact: false,
    generateTable: false,
    N_A: false,
  });

  const [selectedQuarter, setSelectedQuarter] = useState("Q2");

  const quarterItems = [
    { label: "Q1", value: "Q1" },
    { label: "Q2", value: "Q2" },
    { label: "Q3", value: "Q3" },
    { label: "Q4", value: "Q4" },
  ];

  const [quarryPlantData, setQuarryPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: "",
    eccEpepCommitments: [
      {
        id: `waste-${Date.now()}-quarry`,
        handling: "",
        storage: "",
        disposal: "",
      },
    ],
    isAdequate: null,
    previousRecord: "",
    currentQuarterWaste: "",
  });

  const [plantData, setPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: "",
    eccEpepCommitments: [
      { id: `waste-${Date.now()}-1`, handling: "", storage: "", disposal: "" },
    ],
    isAdequate: null,
    previousRecord: "",
    currentQuarterWaste: "",
  });

  const [portData, setPortData] = useState<PortSectionData>({
    noSignificantImpact: false,
    generateTable: false,
    N_A: false,
  });

  const [portPlantData, setPortPlantData] = useState<PlantPortSectionData>({
    typeOfWaste: "",
    eccEpepCommitments: [
      { id: `waste-${Date.now()}-2`, handling: "", storage: "", disposal: "" },
    ],
    isAdequate: null,
    previousRecord: "",
    currentQuarterWaste: "",
  });

  // Hydrate from route params when coming from a draft
  React.useEffect(() => {
    const params: any = route?.params || {};
    const saved =
      params.complianceWithGoodPracticeInSolidAndHazardousWasteManagement;
    if (saved) {
      if (typeof saved.selectedQuarter === "string")
        setSelectedQuarter(saved.selectedQuarter);
      if (saved.quarryData)
        setQuarryData((prev) => ({ ...prev, ...saved.quarryData }));
      if (saved.quarryPlantData)
        setQuarryPlantData((prev) => ({ ...prev, ...saved.quarryPlantData }));
      if (saved.plantSimpleData)
        setPlantSimpleData((prev) => ({ ...prev, ...saved.plantSimpleData }));
      if (saved.plantData)
        setPlantData((prev) => ({ ...prev, ...saved.plantData }));
      if (saved.portData)
        setPortData((prev) => ({ ...prev, ...saved.portData }));
      if (saved.portPlantData)
        setPortPlantData((prev) => ({ ...prev, ...saved.portPlantData }));
    }
  }, [route?.params]);

  const updateQuarryData = (field: keyof QuarrySectionData, value: boolean) => {
    setQuarryData((prev) => {
      if (field === "N_A") {
        return {
          ...prev,
          N_A: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === "noSignificantImpact") {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === "generateTable") {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
        };
      }
      return prev;
    });
  };

  const updatePlantSimpleData = (
    field: keyof PlantSectionData,
    value: boolean
  ) => {
    setPlantSimpleData((prev) => {
      if (field === "N_A") {
        return {
          ...prev,
          N_A: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === "noSignificantImpact") {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
        };
      } else if (field === "generateTable") {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
        };
      }
      return prev;
    });
  };

  const updatePortData = (field: keyof PortSectionData, value: boolean) => {
    setPortData((prev) => {
      if (field === "noSignificantImpact") {
        return {
          ...prev,
          noSignificantImpact: value,
          generateTable: value ? false : prev.generateTable,
          N_A: value ? false : prev.N_A,
        };
      } else if (field === "generateTable") {
        return {
          ...prev,
          generateTable: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          N_A: value ? false : prev.N_A,
        };
      } else if (field === "N_A") {
        return {
          ...prev,
          N_A: value,
          noSignificantImpact: value ? false : prev.noSignificantImpact,
          generateTable: value ? false : prev.generateTable,
        };
      }
      return prev;
    });
  };

  const addWasteEntry = (section: "quarry" | "plant" | "port") => {
    const newEntry = {
      id: `waste-${Date.now()}-${section}`,
      handling: "",
      storage: "",
      disposal: "",
    };

    if (section === "quarry") {
      setQuarryPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    } else if (section === "plant") {
      setPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    } else {
      setPortPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: [...prev.eccEpepCommitments, newEntry],
      }));
    }
  };

  const updateWasteEntry = (
    section: "quarry" | "plant" | "port",
    id: string,
    field: keyof Omit<WasteEntry, "id">,
    value: string
  ) => {
    if (section === "quarry") {
      setQuarryPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    } else if (section === "plant") {
      setPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    } else if (section === "port") {
      setPortPlantData((prev) => ({
        ...prev,
        eccEpepCommitments: prev.eccEpepCommitments.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        ),
      }));
    }
  };

  const removeWasteEntry = (
    section: "quarry" | "plant" | "port",
    id: string
  ) => {
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this waste entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            if (section === "quarry") {
              if (quarryPlantData.eccEpepCommitments.length > 1) {
                setQuarryPlantData((prev) => ({
                  ...prev,
                  eccEpepCommitments: prev.eccEpepCommitments.filter(
                    (entry) => entry.id !== id
                  ),
                }));
              } else {
                Alert.alert(
                  "Cannot Remove",
                  "At least one waste entry is required."
                );
              }
            } else if (section === "plant") {
              if (plantData.eccEpepCommitments.length > 1) {
                setPlantData((prev) => ({
                  ...prev,
                  eccEpepCommitments: prev.eccEpepCommitments.filter(
                    (entry) => entry.id !== id
                  ),
                }));
              } else {
                Alert.alert(
                  "Cannot Remove",
                  "At least one waste entry is required."
                );
              }
            } else if (section === "port") {
              if (portPlantData.eccEpepCommitments.length > 1) {
                setPortPlantData((prev) => ({
                  ...prev,
                  eccEpepCommitments: prev.eccEpepCommitments.filter(
                    (entry) => entry.id !== id
                  ),
                }));
              } else {
                Alert.alert(
                  "Cannot Remove",
                  "At least one waste entry is required."
                );
              }
            }
          },
        },
      ]
    );
  };

  const updateQuarryPlantData = (
    field: keyof PlantPortSectionData,
    value: any
  ) => {
    setQuarryPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePlantData = (field: keyof PlantPortSectionData, value: any) => {
    setPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePortPlantData = (
    field: keyof PlantPortSectionData,
    value: any
  ) => {
    setPortPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const prevPageData: any = route.params || {};

      const complianceWithGoodPracticeInSolidAndHazardousWasteManagement = {
        quarryData,
        plantSimpleData,
        selectedQuarter,
        quarryPlantData,
        plantData,
        portData,
        portPlantData,
      };

      const draftData = {
        ...prevPageData.generalInfo,
        ...prevPageData.eccInfo,
        ...prevPageData.eccAdditionalForms,
        ...prevPageData.isagInfo,
        ...prevPageData.isagAdditionalForms,
        ...prevPageData.epepInfo,
        ...prevPageData.epepAdditionalForms,
        ...prevPageData.rcfInfo,
        ...prevPageData.rcfAdditionalForms,
        ...prevPageData.mtfInfo,
        ...prevPageData.mtfAdditionalForms,
        ...prevPageData.fmrdfInfo,
        ...prevPageData.fmrdfAdditionalForms,
        ...prevPageData.mmtInfo,
        fileName: prevPageData.fileName || "Untitled",
        executiveSummaryOfCompliance: prevPageData.executiveSummaryOfCompliance,
        processDocumentationOfActivitiesUndertaken:
          prevPageData.processDocumentationOfActivitiesUndertaken,
        complianceToProjectLocationAndCoverageLimits:
          prevPageData.complianceToProjectLocationAndCoverageLimits,
        complianceToImpactManagementCommitments:
          prevPageData.complianceToImpactManagementCommitments,
        airQualityImpactAssessment: prevPageData.airQualityImpactAssessment,
        waterQualityImpactAssessment: prevPageData.waterQualityImpactAssessment,
        noiseQualityImpactAssessment: prevPageData.noiseQualityImpactAssessment,
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement,
        savedAt: new Date().toISOString(),
      };

      const fileName = prevPageData.fileName || "Untitled";
      const success = await saveDraft(fileName, draftData);

      if (success) {
        Alert.alert("Success", "Draft saved successfully");
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
    console.log("User chose to stay");
  };

  const handleSaveToDraft = async () => {
    try {
      const prevPageData: any = route.params || {};

      const complianceWithGoodPracticeInSolidAndHazardousWasteManagement = {
        quarryData,
        plantSimpleData,
        selectedQuarter,
        quarryPlantData,
        plantData,
        portData,
        portPlantData,
      };

      const draftData = {
        ...prevPageData.generalInfo,
        ...prevPageData.eccInfo,
        ...prevPageData.eccAdditionalForms,
        ...prevPageData.isagInfo,
        ...prevPageData.isagAdditionalForms,
        ...prevPageData.epepInfo,
        ...prevPageData.epepAdditionalForms,
        ...prevPageData.rcfInfo,
        ...prevPageData.rcfAdditionalForms,
        ...prevPageData.mtfInfo,
        ...prevPageData.mtfAdditionalForms,
        ...prevPageData.fmrdfInfo,
        ...prevPageData.fmrdfAdditionalForms,
        ...prevPageData.mmtInfo,
        fileName: prevPageData.fileName || "Untitled",
        executiveSummaryOfCompliance: prevPageData.executiveSummaryOfCompliance,
        processDocumentationOfActivitiesUndertaken:
          prevPageData.processDocumentationOfActivitiesUndertaken,
        complianceToProjectLocationAndCoverageLimits:
          prevPageData.complianceToProjectLocationAndCoverageLimits,
        complianceToImpactManagementCommitments:
          prevPageData.complianceToImpactManagementCommitments,
        airQualityImpactAssessment: prevPageData.airQualityImpactAssessment,
        waterQualityImpactAssessment: prevPageData.waterQualityImpactAssessment,
        noiseQualityImpactAssessment: prevPageData.noiseQualityImpactAssessment,
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement,
        savedAt: new Date().toISOString(),
      };

      const fileName = prevPageData.fileName || "Untitled";
      const success = await saveDraft(fileName, draftData);

      if (success) {
        Alert.alert("Success", "Draft saved successfully");
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

  const handleGoToSummary = async () => {
    try {
      console.log("Navigating to summary with current waste management data");

      const prevPageData: any = route.params || {};

      // Prepare current page data
      const complianceWithGoodPracticeInSolidAndHazardousWasteManagement = {
        quarryData,
        plantSimpleData,
        selectedQuarter,
        quarryPlantData,
        plantData,
        portData,
        portPlantData,
      };

      // Prepare complete snapshot with all sections
      const completeData = {
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
        executiveSummaryOfCompliance: prevPageData.executiveSummaryOfCompliance,
        processDocumentationOfActivitiesUndertaken:
          prevPageData.processDocumentationOfActivitiesUndertaken,
        complianceToProjectLocationAndCoverageLimits:
          prevPageData.complianceToProjectLocationAndCoverageLimits,
        complianceToImpactManagementCommitments:
          prevPageData.complianceToImpactManagementCommitments,
        airQualityImpactAssessment: prevPageData.airQualityImpactAssessment,
        waterQualityImpactAssessment: prevPageData.waterQualityImpactAssessment,
        noiseQualityImpactAssessment: prevPageData.noiseQualityImpactAssessment,
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement, // Current page data
        complianceWithGoodPracticeInChemicalSafetyManagement:
          prevPageData.complianceWithGoodPracticeInChemicalSafetyManagement,
        complaintsVerificationAndManagement:
          prevPageData.complaintsVerificationAndManagement,
        recommendationsData: prevPageData.recommendationsData,
        attendanceUrl: prevPageData.attendanceUrl,
        savedAt: new Date().toISOString(),
      };

      const resolvedFileName = prevPageData.fileName || "Untitled";

      // Save to draft before navigating
      await saveDraft(resolvedFileName, completeData);

      // Navigate to summary screen with all data
      navigation.navigate("CMVRDocumentExport", {
        ...prevPageData,
        fileName: resolvedFileName,
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement,
        draftData: completeData,
      });
    } catch (error) {
      console.error("Error navigating to summary:", error);
      Alert.alert("Error", "Failed to navigate to summary. Please try again.");
    }
  };

  const handleSaveAndNext = () => {
    console.log("Saving Waste Management data...");
    console.log("Selected Quarter:", selectedQuarter);
    console.log("Quarry Checkboxes:", quarryData);
    console.log("Quarry Table:", quarryPlantData);
    console.log("Plant Checkboxes:", plantSimpleData);
    console.log("Plant Table:", plantData);
    console.log("Port Checkboxes:", portData);
    console.log("Port Table:", portPlantData);
    const complianceWithGoodPracticeInSolidAndHazardousWasteManagement = {
      selectedQuarter,
      quarryData,
      quarryPlantData,
      plantSimpleData,
      plantData,
      portData,
      portPlantData,
    };
    const nextParams = {
      ...(route?.params || {}),
      complianceWithGoodPracticeInSolidAndHazardousWasteManagement,
    } as any;
    console.log(
      "Navigating with WasteManagement params keys:",
      Object.keys(nextParams)
    );
    navigation.navigate("ChemicalSafety", nextParams);
  };

  const fillTestData = () => {
    setSelectedQuarter("Q2");

    // Quarry section
    setQuarryData({
      noSignificantImpact: false,
      generateTable: true,
      N_A: false,
    });

    setQuarryPlantData({
      typeOfWaste: "Overburden, Topsoil, Mine Tailings",
      eccEpepCommitments: [
        {
          id: "1",
          handling: "Segregated handling by type",
          storage: "Designated stockpile areas with erosion control",
          disposal: "Progressive backfilling and rehabilitation",
        },
        {
          id: "2",
          handling: "Use of covered trucks for transport",
          storage: "Temporary storage in lined containment",
          disposal: "Treatment before disposal",
        },
        {
          id: "3",
          handling: "Immediate containment of spills",
          storage: "Bunded storage areas",
          disposal: "Licensed disposal facility",
        },
      ],
      isAdequate: "YES",
      previousRecord: "2,450 tons",
      currentQuarterWaste: "2,680 tons",
    });

    // Plant section
    setPlantSimpleData({
      noSignificantImpact: false,
      generateTable: true,
      N_A: false,
    });

    setPlantData({
      typeOfWaste: "Used oil, Filters, Scrap metal, Office waste",
      eccEpepCommitments: [
        {
          id: "1",
          handling: "Segregation at source",
          storage: "Designated waste storage shed",
          disposal: "Accredited TSD facility",
        },
        {
          id: "2",
          handling: "Containerized collection",
          storage: "Roofed and secured area",
          disposal: "Recycling facility",
        },
        {
          id: "3",
          handling: "Regular collection schedule",
          storage: "Separate biodegradable and non-biodegradable bins",
          disposal: "Municipal waste collection",
        },
      ],
      isAdequate: "YES",
      previousRecord: "850 liters (used oil), 12 tons (scrap)",
      currentQuarterWaste: "920 liters (used oil), 14 tons (scrap)",
    });

    // Port section
    setPortData({
      noSignificantImpact: false,
      generateTable: true,
      N_A: false,
    });

    setPortPlantData({
      typeOfWaste: "Bilge water, Oily rags, Packaging materials",
      eccEpepCommitments: [
        {
          id: "1",
          handling: "Spill containment protocols",
          storage: "Sealed drums in designated area",
          disposal: "Authorized waste hauler",
        },
        {
          id: "2",
          handling: "Immediate bagging and labeling",
          storage: "Secured hazmat storage",
          disposal: "TSD facility",
        },
        {
          id: "3",
          handling: "Segregation and compaction",
          storage: "Covered waste bins",
          disposal: "Recycling or proper disposal",
        },
      ],
      isAdequate: "YES",
      previousRecord: "180 liters (bilge), 0.5 tons (packaging)",
      currentQuarterWaste: "165 liters (bilge), 0.6 tons (packaging)",
    });

    Alert.alert(
      "Test Data",
      "Waste Management filled with test data (3 entries per section)"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <CMSHeader
          onBack={() => navigation.goBack()}
          onSave={handleSave}
          onStay={handleStay}
          onSaveToDraft={handleSaveToDraft}
          onDiscard={handleDiscard}
          onGoToSummary={handleGoToSummary}
          allowEdit={true}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeaderContent}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>
              Compliance with Good Practice in Solid and Hazardous Waste
              Management
            </Text>
          </View>
        </View>

        <View style={styles.quarterPickerContainer}>
          <Text style={styles.quarterLabel}>Select Quarter</Text>
          <View style={styles.quarterButtonsRow}>
            {quarterItems.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.quarterButton,
                  selectedQuarter === item.value && styles.quarterButtonActive,
                ]}
                onPress={() => setSelectedQuarter(item.value)}
              >
                <Text
                  style={[
                    styles.quarterButtonText,
                    selectedQuarter === item.value &&
                      styles.quarterButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <QuarrySection data={quarryData} onUpdate={updateQuarryData} />

        {quarryData.generateTable && !quarryData.N_A && (
          <PlantPortSection
            title="QUARRY DETAILS"
            icon="hammer"
            data={quarryPlantData}
            selectedQuarter={selectedQuarter}
            onUpdateData={updateQuarryPlantData}
            onAddWaste={() => addWasteEntry("quarry")}
            onUpdateWaste={(id, field, value) =>
              updateWasteEntry("quarry", id, field, value)
            }
            onRemoveWaste={(id) => removeWasteEntry("quarry", id)}
          />
        )}

        <PlantSection data={plantSimpleData} onUpdate={updatePlantSimpleData} />

        {plantSimpleData.generateTable && !plantSimpleData.N_A && (
          <PlantPortSection
            title="PLANT DETAILS"
            icon="business"
            data={plantData}
            selectedQuarter={selectedQuarter}
            onUpdateData={updatePlantData}
            onAddWaste={() => addWasteEntry("plant")}
            onUpdateWaste={(id, field, value) =>
              updateWasteEntry("plant", id, field, value)
            }
            onRemoveWaste={(id) => removeWasteEntry("plant", id)}
          />
        )}

        <PortSection data={portData} onUpdate={updatePortData} />

        {portData.generateTable && !portData.N_A && (
          <PlantPortSection
            title="PORT DETAILS"
            icon="boat"
            data={portPlantData}
            selectedQuarter={selectedQuarter}
            onUpdateData={updatePortPlantData}
            onAddWaste={() => addWasteEntry("port")}
            onUpdateWaste={(id, field, value) =>
              updateWasteEntry("port", id, field, value)
            }
            onRemoveWaste={(id) => removeWasteEntry("port", id)}
          />
        )}

        {__DEV__ && (
          <TouchableOpacity
            style={[
              styles.saveNextButton,
              { backgroundColor: "#ff8c00", marginTop: 12 },
            ]}
            onPress={fillTestData}
          >
            <Text style={styles.saveNextButtonText}>Fill Test Data</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={handleSaveAndNext}
        >
          <Text style={styles.saveNextButtonText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.bottomSpacing} />
        {/* filler gap ts not advisable tbh*/}   
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
