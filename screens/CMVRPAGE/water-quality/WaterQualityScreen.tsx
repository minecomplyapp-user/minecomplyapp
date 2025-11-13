import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
import { Checkbox } from "../../../components/CheckBox";
import { saveDraft } from "../../../lib/drafts";
import { LocationSection } from "./components/LocationSection";
import { ParameterForm } from "./components/ParameterForm";
import { SamplingDetailsSection } from "./components/SamplingDetailsSection";
import { OverallComplianceSection } from "./components/OverallComplianceSection";
import { PortSection } from "./components/PortSection";
import { LocationMonitoringSection } from "./components/LocationMonitoringSection";
import {
  Parameter,
  LocationState,
  WaterQualityData,
  PortData,
  LocationData,
  createEmptyLocationData,
} from "../types/WaterQualityScreen.types";
import { styles } from "../styles/WaterQualityScreen.styles";

export default function WaterQualityScreen({ navigation, route }: any) {
  // Location checkboxes for enabling/disabling inputs
  const [quarryEnabled, setQuarryEnabled] = useState<boolean>(false);
  const [plantEnabled, setPlantEnabled] = useState<boolean>(false);
  const [quarryPlantEnabled, setQuarryPlantEnabled] = useState<boolean>(false);

  // Location description text inputs
  const [quarryInput, setQuarryInput] = useState<string>("");
  const [plantInput, setPlantInput] = useState<string>("");
  const [quarryPlantInput, setQuarryPlantInput] = useState<string>("");

  // Main water quality data (unified table)
  const [waterQualityData, setWaterQualityData] = useState<LocationData>(
    createEmptyLocationData()
  );

  // Port data (separate section)
  const [portData, setPortData] = useState<LocationData>(
    createEmptyLocationData()
  );

  // Legacy state for backward compatibility (will be removed after migration)
  const [data, setData] = useState<WaterQualityData>({
    quarryInput: "",
    plantInput: "",
    quarryPlantInput: "",
    parameter: "",
    resultType: "Month",
    tssCurrent: "",
    tssPrevious: "",
    mmtCurrent: "",
    mmtPrevious: "",
    isMMTNA: false,
    eqplRedFlag: "",
    action: "",
    limit: "",
    remarks: "",
    dateTime: "",
    weatherWind: "",
    explanation: "",
    isExplanationNA: false,
    overallCompliance: "",
  });

  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [ports, setPorts] = useState<PortData[]>([]);

  // Hydrate from route params when coming from a draft
  useEffect(() => {
    const params: any = route?.params || {};

    // Check for data from draftData first (coming from summary), then from direct params
    const draftData = params.draftData;
    const saved =
      draftData?.waterQualityImpactAssessment ||
      params.waterQualityImpactAssessment;

    if (saved) {
      console.log("Hydrating WaterQuality with saved data", saved);

      // New structure - location text inputs
      if (typeof saved.quarry === "string") {
        setQuarryInput(saved.quarry);
        setQuarryEnabled(saved.quarry.length > 0); // Enable if has content
      }
      if (typeof saved.plant === "string") {
        setPlantInput(saved.plant);
        setPlantEnabled(saved.plant.length > 0); // Enable if has content
      }
      if (typeof saved.quarryPlant === "string") {
        setQuarryPlantInput(saved.quarryPlant);
        setQuarryPlantEnabled(saved.quarryPlant.length > 0); // Enable if has content
      }

      // Restore checkbox states if explicitly saved
      if (typeof saved.quarryEnabled === "boolean")
        setQuarryEnabled(saved.quarryEnabled);
      if (typeof saved.plantEnabled === "boolean")
        setPlantEnabled(saved.plantEnabled);
      if (typeof saved.quarryPlantEnabled === "boolean")
        setQuarryPlantEnabled(saved.quarryPlantEnabled);

      // New structure - unified waterQuality table
      if (saved.waterQuality) setWaterQualityData(saved.waterQuality);

      // New structure - port data
      if (saved.port) setPortData(saved.port);

      // Legacy support - try to map old structure to new
      if (saved.quarryData) {
        // Old structure had separate tables, merge into unified waterQuality
        setWaterQualityData(saved.quarryData);
      }
      if (saved.data) setData((prev) => ({ ...prev, ...saved.data }));
      if (Array.isArray(saved.parameters)) setParameters(saved.parameters);
      if (Array.isArray(saved.ports)) setPorts(saved.ports);
    }
  }, [route?.params]);

  const handleSave = async () => {
    try {
      const prevPageData: any = route.params || {};

      const waterQualityImpactAssessment = {
        quarry: quarryInput,
        plant: plantInput,
        quarryPlant: quarryPlantInput,
        quarryEnabled,
        plantEnabled,
        quarryPlantEnabled,
        waterQuality: waterQualityData,
        port: portData,
        // Legacy support
        data,
        parameters,
        ports,
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
        waterQualityImpactAssessment,
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

      const waterQualityImpactAssessment = {
        quarry: quarryInput,
        plant: plantInput,
        quarryPlant: quarryPlantInput,
        quarryEnabled,
        plantEnabled,
        quarryPlantEnabled,
        waterQuality: waterQualityData,
        port: portData,
        // Legacy support
        data,
        parameters,
        ports,
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
        waterQualityImpactAssessment,
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
      console.log("Navigating to summary with current water quality data");

      const prevPageData: any = route.params || {};

      // Prepare current page data
      const waterQualityImpactAssessment = {
        quarry: quarryInput,
        plant: plantInput,
        quarryPlant: quarryPlantInput,
        quarryEnabled,
        plantEnabled,
        quarryPlantEnabled,
        waterQuality: waterQualityData,
        port: portData,
        // Legacy support
        data,
        parameters,
        ports,
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
        waterQualityImpactAssessment, // Current page data
        noiseQualityImpactAssessment: prevPageData.noiseQualityImpactAssessment,
        complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
          prevPageData.complianceWithGoodPracticeInSolidAndHazardousWasteManagement,
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
        waterQualityImpactAssessment,
        draftData: completeData,
      });
    } catch (error) {
      console.error("Error navigating to summary:", error);
      Alert.alert("Error", "Failed to navigate to summary. Please try again.");
    }
  };

  // ============ UNIFIED WATER QUALITY HANDLERS ============
  const handleWaterQualityMainParameterUpdate = (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setWaterQualityData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWaterQualityMMTInputChange = (field: string, value: string) => {
    setWaterQualityData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWaterQualityMMTNAToggle = () => {
    setWaterQualityData((prev) => ({ ...prev, isMMTNA: !prev.isMMTNA }));
  };

  const addWaterQualityParameter = () => {
    const newId = `water-quality-param-${Date.now()}`;
    setWaterQualityData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
          id: newId,
          parameter: "",
          resultType: "Month",
          tssCurrent: "",
          tssPrevious: "",
          mmtCurrent: "",
          mmtPrevious: "",
          isMMTNA: false,
          eqplRedFlag: "",
          action: "",
          limit: "",
          remarks: "",
        },
      ],
    }));
  };

  const updateWaterQualityParameter = (
    id: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setWaterQualityData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteWaterQualityParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setWaterQualityData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handleWaterQualitySamplingDetailsChange = (
    field: string,
    value: string | boolean
  ) => {
    setWaterQualityData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWaterQualityExplanationNAToggle = () => {
    setWaterQualityData((prev) => ({
      ...prev,
      isExplanationNA: !prev.isExplanationNA,
    }));
  };

  // ============ PORT HANDLERS ============
  const handlePortMainParameterUpdate = (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setPortData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePortMMTInputChange = (field: string, value: string) => {
    setPortData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePortMMTNAToggle = () => {
    setPortData((prev) => ({ ...prev, isMMTNA: !prev.isMMTNA }));
  };

  const addPortParameter = () => {
    const newId = `port-param-${Date.now()}`;
    setPortData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
          id: newId,
          parameter: "",
          resultType: "Month",
          tssCurrent: "",
          tssPrevious: "",
          mmtCurrent: "",
          mmtPrevious: "",
          isMMTNA: false,
          eqplRedFlag: "",
          action: "",
          limit: "",
          remarks: "",
        },
      ],
    }));
  };

  const updatePortParameter = (
    id: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setPortData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deletePortParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setPortData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handlePortSamplingDetailsChange = (
    field: string,
    value: string | boolean
  ) => {
    setPortData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePortExplanationNAToggle = () => {
    setPortData((prev) => ({
      ...prev,
      isExplanationNA: !prev.isExplanationNA,
    }));
  };

  // ============ LEGACY HANDLERS (for backward compatibility) ============
  const handleInputChange = (
    field: keyof WaterQualityData,
    value: string | boolean
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationInputChange = (field: string, value: string) => {
    handleInputChange(field as keyof WaterQualityData, value);
  };

  const handleMMTInputChange = (field: string, value: string) => {
    handleInputChange(field as keyof WaterQualityData, value);
  };

  const addParameter = () => {
    const newId = (parameters.length + 1).toString();
    setParameters((prev) => [
      ...prev,
      {
        id: newId,
        parameter: "",
        resultType: "Month",
        tssCurrent: "",
        tssPrevious: "",
        mmtCurrent: "",
        mmtPrevious: "",
        isMMTNA: false,
        eqplRedFlag: "",
        action: "",
        limit: "",
        remarks: "",
      },
    ]);
  };

  const updateParameter = (
    id: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const handleParameterMMTInputChange = (
    id: string,
    field: string,
    value: string
  ) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const removeParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setParameters(parameters.filter((param) => param.id !== id));
          },
        },
      ]
    );
  };

  const addPort = () => {
    const newId = `port-${Date.now()}`;
    setPorts((prev) => [
      ...prev,
      {
        id: newId,
        portName: "",
        parameter: "",
        resultType: "Month",
        tssCurrent: "",
        tssPrevious: "",
        mmtCurrent: "",
        mmtPrevious: "",
        isMMTNA: false,
        eqplRedFlag: "",
        action: "",
        limit: "",
        remarks: "",
        dateTime: "",
        weatherWind: "",
        explanation: "",
        isExplanationNA: false,
        additionalParameters: [],
      },
    ]);
  };

  const updatePort = (portId: string, field: string, value: any) => {
    setPorts(
      ports.map((port) =>
        port.id === portId ? { ...port, [field]: value } : port
      )
    );
  };

  const addLegacyPortParameter = (portId: string) => {
    const newParamId = `param-${Date.now()}`;
    setPorts(
      ports.map((port) =>
        port.id === portId
          ? {
              ...port,
              additionalParameters: [
                ...port.additionalParameters,
                {
                  id: newParamId,
                  parameter: "",
                  resultType: "Month",
                  tssCurrent: "",
                  tssPrevious: "",
                  mmtCurrent: "",
                  mmtPrevious: "",
                  isMMTNA: false,
                  eqplRedFlag: "",
                  action: "",
                  limit: "",
                  remarks: "",
                },
              ],
            }
          : port
      )
    );
  };

  const updateLegacyPortParameter = (
    portId: string,
    parameterId: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setPorts(
      ports.map((port) =>
        port.id === portId
          ? {
              ...port,
              additionalParameters: port.additionalParameters.map((param) =>
                param.id === parameterId ? { ...param, [field]: value } : param
              ),
            }
          : port
      )
    );
  };

  const deleteLegacyPortParameter = (
    portId: string,
    parameterIndex: number
  ) => {
    setPorts(
      ports.map((port) =>
        port.id === portId
          ? {
              ...port,
              additionalParameters: port.additionalParameters.filter(
                (_, index) => index !== parameterIndex
              ),
            }
          : port
      )
    );
  };

  const deletePort = (portId: string) => {
    Alert.alert(
      "Delete Port",
      "Are you sure you want to delete this port? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPorts((prev) => prev.filter((port) => port.id !== portId));
          },
        },
      ]
    );
  };

  const mainParameter: Parameter = {
    id: "main",
    parameter: data.parameter,
    resultType: data.resultType,
    tssCurrent: data.tssCurrent,
    tssPrevious: data.tssPrevious,
    eqplRedFlag: data.eqplRedFlag,
    action: data.action,
    limit: data.limit,
    remarks: data.remarks,
    mmtCurrent: data.mmtCurrent,
    mmtPrevious: data.mmtPrevious,
    isMMTNA: data.isMMTNA,
  };

  const handleMainParameterUpdate = (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    handleInputChange(field as keyof WaterQualityData, value);
  };

  const fillTestData = () => {
    // Enable all checkboxes
    setQuarryEnabled(true);
    setPlantEnabled(true);
    setQuarryPlantEnabled(true);

    // Fill location descriptions
    setQuarryInput("Station WQ-01 (Quarry settling pond effluent)");
    setPlantInput("Station WQ-02 (Plant wastewater treatment outlet)");
    setQuarryPlantInput(
      "Mobile crusher operations with temporary water management"
    );

    // Fill Water Quality Data (unified table)
    setWaterQualityData({
      locationInput: "",
      parameter: "TSS",
      resultType: "Month",
      tssCurrent: "18",
      tssPrevious: "6.2",
      mmtCurrent: "-",
      mmtPrevious: "-",
      isMMTNA: true,
      eqplRedFlag: "-",
      action: "-",
      limit: "150",
      remarks: "All monitoring stations within acceptable limits",
      dateTime: "June 27, 2025",
      weatherWind: "Sunny, light breeze from Northeast",
      explanation:
        "Confirmatory sampling conducted for validation of internal monitoring results",
      isExplanationNA: false,
      overallCompliance:
        "All water quality parameters are within DENR Class C standards",
      parameters: [
        {
          id: "wq-1",
          parameter: "pH",
          resultType: "Month",
          tssCurrent: "7.2",
          tssPrevious: "7.1",
          mmtCurrent: "7.25",
          mmtPrevious: "7.15",
          isMMTNA: false,
          eqplRedFlag: "-",
          action: "-",
          limit: "6.5-8.5",
          remarks: "pH levels stable and within range",
        },
      ],
    });

    // Fill Port Data
    setPortData({
      locationInput: "",
      parameter: "Turbidity",
      resultType: "Month",
      tssCurrent: "12",
      tssPrevious: "14",
      mmtCurrent: "13",
      mmtPrevious: "15",
      isMMTNA: false,
      eqplRedFlag: "No",
      action: "Maintain dust suppression during loading",
      limit: "20",
      remarks: "Below threshold",
      dateTime: "June 29, 2025",
      weatherWind: "Clear, Light breeze",
      explanation: "Minor turbidity from loading activities",
      isExplanationNA: false,
      overallCompliance:
        "All port water quality parameters are within DENR standards",
      parameters: [],
    });

    Alert.alert(
      "Test Data Loaded",
      "Water Quality filled with test data:\n• All location descriptions enabled\n• Water Quality: TSS + pH parameter\n• Port: Turbidity data"
    );
  };

  /* Old fillTestData - kept for reference
  const fillTestDataOld = () => {
    // Set locations
    setSelectedLocations({
      quarry: true,
      plant: true,
      quarryPlant: false,
    });

    // Fill Quarry Data
    setQuarryData({
      locationInput: "Station WQ-01 (Quarry settling pond effluent)",
      parameter: "pH",
      resultType: "Month",
      tssCurrent: "7.2",
      tssPrevious: "7.1",
      mmtCurrent: "7.3",
      mmtPrevious: "7.2",
      isMMTNA: false,
      eqplRedFlag: "No",
      action: "Within acceptable range, continue monitoring",
      limit: "6.0 - 9.0",
      remarks: "Compliant with DENR standards",
      dateTime: "March 15, 2025, 09:00 AM",
      weatherWind: "Partly cloudy, Wind 2-4 m/s",
      explanation:
        "Water sampling conducted at quarry settling pond using standard protocols",
      isExplanationNA: false,
      overallCompliance:
        "All quarry water quality parameters are within DENR Class C standards",
      parameters: [
        {
          id: "quarry-1",
          parameter: "TSS (Total Suspended Solids)",
          resultType: "Month",
          tssCurrent: "42 mg/L",
          tssPrevious: "45 mg/L",
          mmtCurrent: "43 mg/L",
          mmtPrevious: "46 mg/L",
          isMMTNA: false,
          eqplRedFlag: "No",
          action: "Maintain sediment pond efficiency",
          limit: "50 mg/L",
          remarks: "Below threshold",
        },
        {
          id: "quarry-2",
          parameter: "Iron (Fe)",
          resultType: "Month",
          tssCurrent: "4.8 mg/L",
          tssPrevious: "5.2 mg/L",
          mmtCurrent: "4.9 mg/L",
          mmtPrevious: "5.3 mg/L",
          isMMTNA: false,
          eqplRedFlag: "No",
          action: "Continue monitoring",
          limit: "7.0 mg/L",
          remarks: "Within limits",
        },
      ],
    });

    // Fill Plant Data
    setPlantData({
      locationInput: "Station WQ-02 (Plant wastewater treatment outlet)",
      parameter: "BOD (Biochemical Oxygen Demand)",
      resultType: "Month",
      tssCurrent: "18 mg/L",
      tssPrevious: "20 mg/L",
      mmtCurrent: "19 mg/L",
      mmtPrevious: "21 mg/L",
      isMMTNA: false,
      eqplRedFlag: "No",
      action: "No action required",
      limit: "30 mg/L",
      remarks: "Compliant",
      dateTime: "March 15, 2025, 10:30 AM",
      weatherWind: "Clear skies, Calm winds",
      explanation:
        "Plant wastewater sampling at treatment facility outlet point",
      isExplanationNA: false,
      overallCompliance:
        "Plant discharge meets all regulatory requirements for water quality",
      parameters: [
        {
          id: "plant-1",
          parameter: "Oil and Grease",
          resultType: "Month",
          tssCurrent: "3.2 mg/L",
          tssPrevious: "3.5 mg/L",
          mmtCurrent: "3.3 mg/L",
          mmtPrevious: "3.6 mg/L",
          isMMTNA: false,
          eqplRedFlag: "No",
          action: "Continue oil-water separator maintenance",
          limit: "5 mg/L",
          remarks: "Well below limit",
        },
        {
          id: "plant-2",
          parameter: "Chromium (Cr)",
          resultType: "Month",
          tssCurrent: "0.08 mg/L",
          tssPrevious: "0.09 mg/L",
          mmtCurrent: "0.09 mg/L",
          mmtPrevious: "0.10 mg/L",
          isMMTNA: false,
          eqplRedFlag: "No",
          action: "No action needed",
          limit: "0.5 mg/L",
          remarks: "Trace amounts only",
        },
      ],
    });

    // Add 2 ports with parameters
    setPorts([
      {
        id: "port-1",
        portName: "Port Loading Area - North Pier",
        parameter: "pH",
        resultType: "Month",
        tssCurrent: "8.1",
        tssPrevious: "8.0",
        mmtCurrent: "8.2",
        mmtPrevious: "8.1",
        isMMTNA: false,
        eqplRedFlag: "No",
        action: "Continue monitoring",
        limit: "6.5 - 8.5",
        remarks: "Within marine water standards",
        dateTime: "March 16, 2025, 08:00 AM",
        weatherWind: "Clear, Calm sea",
        explanation: "Marine water quality sampling at port vicinity",
        isExplanationNA: false,
        additionalParameters: [
          {
            id: "param-1",
            parameter: "Dissolved Oxygen",
            resultType: "Month",
            tssCurrent: "6.8 mg/L",
            tssPrevious: "6.5 mg/L",
            mmtCurrent: "6.7 mg/L",
            mmtPrevious: "6.6 mg/L",
            isMMTNA: false,
            eqplRedFlag: "No",
            action: "No action needed",
            limit: ">5 mg/L",
            remarks: "Adequate oxygen levels",
          },
        ],
      },
      {
        id: "port-2",
        portName: "Port Loading Area - South Pier",
        parameter: "Turbidity",
        resultType: "Month",
        tssCurrent: "12 NTU",
        tssPrevious: "14 NTU",
        mmtCurrent: "13 NTU",
        mmtPrevious: "15 NTU",
        isMMTNA: false,
        eqplRedFlag: "No",
        action: "Maintain dust suppression during loading",
        limit: "20 NTU",
        remarks: "Below threshold",
        dateTime: "March 16, 2025, 09:00 AM",
        weatherWind: "Clear, Light breeze",
        explanation: "Minor turbidity from loading activities",
        isExplanationNA: false,
        additionalParameters: [],
      },
    ]);

    Alert.alert(
      "Test Data",
      "Water Quality filled with test data:\n• Quarry: pH + 2 parameters\n• Plant: BOD + 2 parameters\n• 2 Ports with sampling details"
    );
  };
  */

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader
        onBack={() => navigation.goBack()}
        onSave={handleSave}
        onStay={handleStay}
        onSaveToDraft={handleSaveToDraft}
        onDiscard={handleDiscard}
        onGoToSummary={handleGoToSummary}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumberBadge}>
            <Text style={styles.sectionNumber}>B.4.</Text>
          </View>
          <Text style={styles.sectionTitle}>
            Water Quality Impact Assessment
          </Text>
        </View>

        {/* Location Description Text Inputs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Descriptions</Text>

          <View style={styles.inputGroup}>
            <View style={styles.checkboxRow}>
              <Checkbox
                value={quarryEnabled}
                onToggle={() => setQuarryEnabled(!quarryEnabled)}
                label="Quarry"
              />
            </View>
            <TextInput
              style={[
                styles.textInput,
                !quarryEnabled && styles.textInputDisabled,
              ]}
              value={quarryInput}
              onChangeText={setQuarryInput}
              placeholder="Enter quarry location description"
              multiline
              editable={quarryEnabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.checkboxRow}>
              <Checkbox
                value={plantEnabled}
                onToggle={() => setPlantEnabled(!plantEnabled)}
                label="Plant"
              />
            </View>
            <TextInput
              style={[
                styles.textInput,
                !plantEnabled && styles.textInputDisabled,
              ]}
              value={plantInput}
              onChangeText={setPlantInput}
              placeholder="Enter plant location description"
              multiline
              editable={plantEnabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.checkboxRow}>
              <Checkbox
                value={quarryPlantEnabled}
                onToggle={() => setQuarryPlantEnabled(!quarryPlantEnabled)}
                label="Quarry & Plant"
              />
            </View>
            <TextInput
              style={[
                styles.textInput,
                !quarryPlantEnabled && styles.textInputDisabled,
              ]}
              value={quarryPlantInput}
              onChangeText={setQuarryPlantInput}
              placeholder="Enter quarry & plant location description"
              multiline
              editable={quarryPlantEnabled}
            />
          </View>
        </View>

        {/* Water Quality Monitoring Section */}
        <LocationMonitoringSection
          locationName="Water Quality"
          locationInput=""
          mainParameter={{
            id: "water-quality-main",
            parameter: waterQualityData.parameter,
            resultType: waterQualityData.resultType,
            tssCurrent: waterQualityData.tssCurrent,
            tssPrevious: waterQualityData.tssPrevious,
            eqplRedFlag: waterQualityData.eqplRedFlag,
            action: waterQualityData.action,
            limit: waterQualityData.limit,
            remarks: waterQualityData.remarks,
            mmtCurrent: waterQualityData.mmtCurrent,
            mmtPrevious: waterQualityData.mmtPrevious,
            isMMTNA: waterQualityData.isMMTNA,
          }}
          parameters={waterQualityData.parameters}
          mmtCurrent={waterQualityData.mmtCurrent}
          mmtPrevious={waterQualityData.mmtPrevious}
          isMMTNA={waterQualityData.isMMTNA}
          dateTime={waterQualityData.dateTime}
          weatherWind={waterQualityData.weatherWind}
          explanation={waterQualityData.explanation}
          isExplanationNA={waterQualityData.isExplanationNA}
          overallCompliance={waterQualityData.overallCompliance}
          onLocationInputChange={() => {}}
          onMainParameterUpdate={handleWaterQualityMainParameterUpdate}
          onMMTInputChange={handleWaterQualityMMTInputChange}
          onMMTNAToggle={handleWaterQualityMMTNAToggle}
          onAddParameter={addWaterQualityParameter}
          onUpdateParameter={updateWaterQualityParameter}
          onDeleteParameter={deleteWaterQualityParameter}
          onSamplingDetailsChange={handleWaterQualitySamplingDetailsChange}
          onExplanationNAToggle={handleWaterQualityExplanationNAToggle}
        />

        {/* Port Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumberBadge}>
            <Text style={styles.sectionNumber}>PORT</Text>
          </View>
          <Text style={styles.sectionTitle}>Port Monitoring</Text>
        </View>

        {/* Port Monitoring Section */}
        <LocationMonitoringSection
          locationName="Port"
          locationInput=""
          mainParameter={{
            id: "port-main",
            parameter: portData.parameter,
            resultType: portData.resultType,
            tssCurrent: portData.tssCurrent,
            tssPrevious: portData.tssPrevious,
            eqplRedFlag: portData.eqplRedFlag,
            action: portData.action,
            limit: portData.limit,
            remarks: portData.remarks,
            mmtCurrent: portData.mmtCurrent,
            mmtPrevious: portData.mmtPrevious,
            isMMTNA: portData.isMMTNA,
          }}
          parameters={portData.parameters}
          mmtCurrent={portData.mmtCurrent}
          mmtPrevious={portData.mmtPrevious}
          isMMTNA={portData.isMMTNA}
          dateTime={portData.dateTime}
          weatherWind={portData.weatherWind}
          explanation={portData.explanation}
          isExplanationNA={portData.isExplanationNA}
          overallCompliance={portData.overallCompliance}
          onLocationInputChange={() => {}}
          onMainParameterUpdate={handlePortMainParameterUpdate}
          onMMTInputChange={handlePortMMTInputChange}
          onMMTNAToggle={handlePortMMTNAToggle}
          onAddParameter={addPortParameter}
          onUpdateParameter={updatePortParameter}
          onDeleteParameter={deletePortParameter}
          onSamplingDetailsChange={handlePortSamplingDetailsChange}
          onExplanationNAToggle={handlePortExplanationNAToggle}
        />

        {/* Legacy Port Sections (for multiple ports) */}
        {ports.map((port, index) => (
          <PortSection
            key={port.id}
            port={port}
            index={index}
            onUpdate={updatePort}
            onDelete={deletePort}
            onAddParameter={addLegacyPortParameter}
            onUpdateParameter={updateLegacyPortParameter}
            onDeleteParameter={deleteLegacyPortParameter}
          />
        ))}

        {/* Add More Port Button */}
        <TouchableOpacity style={styles.addButton} onPress={addPort}>
          <Ionicons name="add-circle-outline" size={20} color="#02217C" />
          <Text style={styles.addButtonText}>Add More Port</Text>
        </TouchableOpacity>

        {/* Fill Test Data Button (Dev Only) */}
        {__DEV__ && (
          <TouchableOpacity
            style={[
              styles.saveNextButton,
              { backgroundColor: "#ff8c00", marginTop: 12 },
            ]}
            onPress={fillTestData}
          >
            <Text style={styles.saveNextText}>🧪 Fill Test Data</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={async () => {
            await handleSave();
            navigation.navigate("NoiseQuality", route.params);
          }}
        >
          <Text style={styles.saveNextText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        {/* filler gap ts not advisable tbh*/}   
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
