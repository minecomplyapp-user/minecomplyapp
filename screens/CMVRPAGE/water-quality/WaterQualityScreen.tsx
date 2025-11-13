import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { CMSHeader } from "../../../components/CMSHeader";
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
  const [selectedLocations, setSelectedLocations] = useState<LocationState>({
    quarry: false,
    plant: false,
    quarryPlant: false,
  });

  // Separate state for each location
  const [quarryData, setQuarryData] = useState<LocationData>(
    createEmptyLocationData()
  );
  const [plantData, setPlantData] = useState<LocationData>(
    createEmptyLocationData()
  );
  const [quarryPlantData, setQuarryPlantData] = useState<LocationData>(
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
    const saved = params.waterQualityImpactAssessment;
    if (saved) {
      if (saved.selectedLocations)
        setSelectedLocations(saved.selectedLocations);

      // Load location-specific data
      if (saved.quarryData) setQuarryData(saved.quarryData);
      if (saved.plantData) setPlantData(saved.plantData);
      if (saved.quarryPlantData) setQuarryPlantData(saved.quarryPlantData);

      // Legacy support
      if (saved.data) setData((prev) => ({ ...prev, ...saved.data }));
      if (Array.isArray(saved.parameters)) setParameters(saved.parameters);
      if (Array.isArray(saved.ports)) setPorts(saved.ports);
    }
  }, [route?.params]);

  const handleSave = async () => {
    try {
      const prevPageData: any = route.params || {};

      const waterQualityImpactAssessment = {
        selectedLocations,
        quarryData,
        plantData,
        quarryPlantData,
        ports,
        // Legacy support
        data,
        parameters,
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
        selectedLocations,
        quarryData,
        plantData,
        quarryPlantData,
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
        selectedLocations,
        quarryData,
        plantData,
        quarryPlantData,
        ports,
        data,
        parameters,
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

  const handleLocationToggle = (location: keyof LocationState) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  // ============ QUARRY HANDLERS ============
  const handleQuarryLocationInputChange = (value: string) => {
    setQuarryData((prev) => ({ ...prev, locationInput: value }));
  };

  const handleQuarryMainParameterUpdate = (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setQuarryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuarryMMTInputChange = (field: string, value: string) => {
    setQuarryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuarryMMTNAToggle = () => {
    setQuarryData((prev) => ({ ...prev, isMMTNA: !prev.isMMTNA }));
  };

  const addQuarryParameter = () => {
    const newId = `quarry-param-${Date.now()}`;
    setQuarryData((prev) => ({
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

  const updateQuarryParameter = (
    id: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setQuarryData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteQuarryParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setQuarryData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handleQuarrySamplingDetailsChange = (
    field: string,
    value: string | boolean
  ) => {
    setQuarryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuarryExplanationNAToggle = () => {
    setQuarryData((prev) => ({
      ...prev,
      isExplanationNA: !prev.isExplanationNA,
    }));
  };

  // ============ PLANT HANDLERS ============
  const handlePlantLocationInputChange = (value: string) => {
    setPlantData((prev) => ({ ...prev, locationInput: value }));
  };

  const handlePlantMainParameterUpdate = (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlantMMTInputChange = (field: string, value: string) => {
    setPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlantMMTNAToggle = () => {
    setPlantData((prev) => ({ ...prev, isMMTNA: !prev.isMMTNA }));
  };

  const addPlantParameter = () => {
    const newId = `plant-param-${Date.now()}`;
    setPlantData((prev) => ({
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

  const updatePlantParameter = (
    id: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deletePlantParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setPlantData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handlePlantSamplingDetailsChange = (
    field: string,
    value: string | boolean
  ) => {
    setPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlantExplanationNAToggle = () => {
    setPlantData((prev) => ({
      ...prev,
      isExplanationNA: !prev.isExplanationNA,
    }));
  };

  // ============ QUARRY & PLANT HANDLERS ============
  const handleQuarryPlantLocationInputChange = (value: string) => {
    setQuarryPlantData((prev) => ({ ...prev, locationInput: value }));
  };

  const handleQuarryPlantMainParameterUpdate = (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setQuarryPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuarryPlantMMTInputChange = (field: string, value: string) => {
    setQuarryPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuarryPlantMMTNAToggle = () => {
    setQuarryPlantData((prev) => ({ ...prev, isMMTNA: !prev.isMMTNA }));
  };

  const addQuarryPlantParameter = () => {
    const newId = `quarryplant-param-${Date.now()}`;
    setQuarryPlantData((prev) => ({
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

  const updateQuarryPlantParameter = (
    id: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setQuarryPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteQuarryPlantParameter = (id: string) => {
    Alert.alert(
      "Remove Parameter",
      "Are you sure you want to remove this parameter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setQuarryPlantData((prev) => ({
              ...prev,
              parameters: prev.parameters.filter((param) => param.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handleQuarryPlantSamplingDetailsChange = (
    field: string,
    value: string | boolean
  ) => {
    setQuarryPlantData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuarryPlantExplanationNAToggle = () => {
    setQuarryPlantData((prev) => ({
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

  const addPortParameter = (portId: string) => {
    setPorts(
      ports.map((port) => {
        if (port.id === portId) {
          const newId = `param-${Date.now()}`;
          return {
            ...port,
            additionalParameters: [
              ...port.additionalParameters,
              {
                id: newId,
                parameter: "",
                resultType: "Month",
                tssCurrent: "",
                tssPrevious: "",
                eqplRedFlag: "",
                action: "",
                limit: "",
                remarks: "",
              },
            ],
          };
        }
        return port;
      })
    );
  };

  const updatePortParameter = (
    portId: string,
    parameterId: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => {
    setPorts(
      ports.map((port) => {
        if (port.id === portId) {
          return {
            ...port,
            additionalParameters: port.additionalParameters.map((param) =>
              param.id === parameterId ? { ...param, [field]: value } : param
            ),
          };
        }
        return port;
      })
    );
  };

  const deletePortParameter = (portId: string, parameterIndex: number) => {
    Alert.alert(
      "Delete Parameter",
      "Are you sure you want to delete this parameter?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPorts((prevPorts) =>
              prevPorts.map((port) => {
                if (port.id === portId) {
                  return {
                    ...port,
                    additionalParameters: port.additionalParameters.filter(
                      (_, i) => i !== parameterIndex
                    ),
                  };
                }
                return port;
              })
            );
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

        <LocationSection
          selectedLocations={selectedLocations}
          quarryInput={data.quarryInput}
          plantInput={data.plantInput}
          quarryPlantInput={data.quarryPlantInput}
          onLocationToggle={handleLocationToggle}
          onInputChange={handleLocationInputChange}
        />

        {/* Quarry Monitoring Section */}
        {selectedLocations.quarry && (
          <LocationMonitoringSection
            locationName="Quarry"
            locationInput={quarryData.locationInput}
            mainParameter={{
              id: "quarry-main",
              parameter: quarryData.parameter,
              resultType: quarryData.resultType,
              tssCurrent: quarryData.tssCurrent,
              tssPrevious: quarryData.tssPrevious,
              eqplRedFlag: quarryData.eqplRedFlag,
              action: quarryData.action,
              limit: quarryData.limit,
              remarks: quarryData.remarks,
              mmtCurrent: quarryData.mmtCurrent,
              mmtPrevious: quarryData.mmtPrevious,
              isMMTNA: quarryData.isMMTNA,
            }}
            parameters={quarryData.parameters}
            mmtCurrent={quarryData.mmtCurrent}
            mmtPrevious={quarryData.mmtPrevious}
            isMMTNA={quarryData.isMMTNA}
            dateTime={quarryData.dateTime}
            weatherWind={quarryData.weatherWind}
            explanation={quarryData.explanation}
            isExplanationNA={quarryData.isExplanationNA}
            overallCompliance={quarryData.overallCompliance}
            onLocationInputChange={handleQuarryLocationInputChange}
            onMainParameterUpdate={handleQuarryMainParameterUpdate}
            onMMTInputChange={handleQuarryMMTInputChange}
            onMMTNAToggle={handleQuarryMMTNAToggle}
            onAddParameter={addQuarryParameter}
            onUpdateParameter={updateQuarryParameter}
            onDeleteParameter={deleteQuarryParameter}
            onSamplingDetailsChange={handleQuarrySamplingDetailsChange}
            onExplanationNAToggle={handleQuarryExplanationNAToggle}
          />
        )}

        {/* Plant Monitoring Section */}
        {selectedLocations.plant && (
          <LocationMonitoringSection
            locationName="Plant"
            locationInput={plantData.locationInput}
            mainParameter={{
              id: "plant-main",
              parameter: plantData.parameter,
              resultType: plantData.resultType,
              tssCurrent: plantData.tssCurrent,
              tssPrevious: plantData.tssPrevious,
              eqplRedFlag: plantData.eqplRedFlag,
              action: plantData.action,
              limit: plantData.limit,
              remarks: plantData.remarks,
              mmtCurrent: plantData.mmtCurrent,
              mmtPrevious: plantData.mmtPrevious,
              isMMTNA: plantData.isMMTNA,
            }}
            parameters={plantData.parameters}
            mmtCurrent={plantData.mmtCurrent}
            mmtPrevious={plantData.mmtPrevious}
            isMMTNA={plantData.isMMTNA}
            dateTime={plantData.dateTime}
            weatherWind={plantData.weatherWind}
            explanation={plantData.explanation}
            isExplanationNA={plantData.isExplanationNA}
            overallCompliance={plantData.overallCompliance}
            onLocationInputChange={handlePlantLocationInputChange}
            onMainParameterUpdate={handlePlantMainParameterUpdate}
            onMMTInputChange={handlePlantMMTInputChange}
            onMMTNAToggle={handlePlantMMTNAToggle}
            onAddParameter={addPlantParameter}
            onUpdateParameter={updatePlantParameter}
            onDeleteParameter={deletePlantParameter}
            onSamplingDetailsChange={handlePlantSamplingDetailsChange}
            onExplanationNAToggle={handlePlantExplanationNAToggle}
          />
        )}

        {/* Quarry & Plant Monitoring Section */}
        {selectedLocations.quarryPlant && (
          <LocationMonitoringSection
            locationName="Quarry & Plant"
            locationInput={quarryPlantData.locationInput}
            mainParameter={{
              id: "quarryplant-main",
              parameter: quarryPlantData.parameter,
              resultType: quarryPlantData.resultType,
              tssCurrent: quarryPlantData.tssCurrent,
              tssPrevious: quarryPlantData.tssPrevious,
              eqplRedFlag: quarryPlantData.eqplRedFlag,
              action: quarryPlantData.action,
              limit: quarryPlantData.limit,
              remarks: quarryPlantData.remarks,
              mmtCurrent: quarryPlantData.mmtCurrent,
              mmtPrevious: quarryPlantData.mmtPrevious,
              isMMTNA: quarryPlantData.isMMTNA,
            }}
            parameters={quarryPlantData.parameters}
            mmtCurrent={quarryPlantData.mmtCurrent}
            mmtPrevious={quarryPlantData.mmtPrevious}
            isMMTNA={quarryPlantData.isMMTNA}
            dateTime={quarryPlantData.dateTime}
            weatherWind={quarryPlantData.weatherWind}
            explanation={quarryPlantData.explanation}
            isExplanationNA={quarryPlantData.isExplanationNA}
            overallCompliance={quarryPlantData.overallCompliance}
            onLocationInputChange={handleQuarryPlantLocationInputChange}
            onMainParameterUpdate={handleQuarryPlantMainParameterUpdate}
            onMMTInputChange={handleQuarryPlantMMTInputChange}
            onMMTNAToggle={handleQuarryPlantMMTNAToggle}
            onAddParameter={addQuarryPlantParameter}
            onUpdateParameter={updateQuarryPlantParameter}
            onDeleteParameter={deleteQuarryPlantParameter}
            onSamplingDetailsChange={handleQuarryPlantSamplingDetailsChange}
            onExplanationNAToggle={handleQuarryPlantExplanationNAToggle}
          />
        )}

        {ports.map((port, idx) => (
          <PortSection
            key={port.id}
            index={idx}
            port={port}
            onUpdate={updatePort}
            onDelete={deletePort}
            onAddParameter={addPortParameter}
            onUpdateParameter={updatePortParameter}
            onDeleteParameter={deletePortParameter}
          />
        ))}

        <TouchableOpacity style={styles.addPortButton} onPress={addPort}>
          <Ionicons name="add" size={20} color="#02217C" />
          <Text style={styles.addPortText}>Add PORT</Text>
        </TouchableOpacity>

        {__DEV__ && (
          <TouchableOpacity
            style={[
              styles.saveNextButton,
              { backgroundColor: "#ff8c00", marginTop: 12 },
            ]}
            onPress={fillTestData}
          >
            <Text style={styles.saveNextText}>Fill Test Data</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={() => {
            const waterQualityImpactAssessment = {
              selectedLocations,
              quarryData,
              plantData,
              quarryPlantData,
              data,
              parameters,
              ports,
            };
            const nextParams = {
              ...(route?.params || {}),
              waterQualityImpactAssessment,
            } as any;
            console.log(
              "Navigating with WaterQuality params keys:",
              Object.keys(nextParams)
            );
            navigation.navigate("NoiseQuality", nextParams);
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
