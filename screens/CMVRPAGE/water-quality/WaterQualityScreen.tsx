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
import { OverallComplianceSection } from "./components/OverallComplianceSection";
import { PortSection } from "./components/PortSection";
import {
  Parameter,
  LocationState,
  WaterQualityData,
  PortData,
} from "../types/WaterQualityScreen.types";
import { styles } from "../styles/WaterQualityScreen.styles";

export default function WaterQualityScreen({ navigation, route }: any) {
  const [selectedLocations, setSelectedLocations] = useState<LocationState>({
    quarry: false,
    plant: false,
    quarryPlant: false,
  });

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

  const handleLocationToggle = (location: keyof LocationState) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

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
        dateTime: "",
        weatherWind: "",
        explanation: "",
        isExplanationNA: false,
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
    setPorts((prev) => prev.filter((port) => port.id !== portId));
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
                dateTime: "",
                weatherWind: "",
                explanation: "",
                isExplanationNA: false,
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
    setPorts(
      ports.map((port) => {
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
    dateTime: data.dateTime,
    weatherWind: data.weatherWind,
    explanation: data.explanation,
    isExplanationNA: data.isExplanationNA,
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

    // Fill main data
    setData({
      quarryInput: "Station WQ-01 (Quarry settling pond effluent)",
      plantInput: "Station WQ-02 (Plant wastewater treatment outlet)",
      quarryPlantInput: "",
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
      remarks: "Compliant",
      dateTime: "March 15, 2025, 09:00 AM",
      weatherWind: "Partly cloudy, Wind 2-4 m/s",
      explanation:
        "Water sampling conducted at designated monitoring stations using standard protocols",
      isExplanationNA: false,
      overallCompliance:
        "All water quality parameters are within DENR Class C standards for industrial discharge",
    });

    // Add 3 additional parameters
    setParameters([
      {
        id: "1",
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
        dateTime: "March 15, 2025, 09:30 AM",
        weatherWind: "Partly cloudy",
        explanation: "Sediment control measures effective",
        isExplanationNA: false,
      },
      {
        id: "2",
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
        dateTime: "March 15, 2025, 10:00 AM",
        weatherWind: "Partly cloudy",
        explanation: "Organic load within limits",
        isExplanationNA: false,
      },
      {
        id: "3",
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
        dateTime: "March 15, 2025, 10:30 AM",
        weatherWind: "Partly cloudy",
        explanation: "Oil-water separator functioning properly",
        isExplanationNA: false,
      },
    ]);

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
            dateTime: "March 16, 2025, 08:30 AM",
            weatherWind: "Clear",
            explanation: "Healthy marine environment",
            isExplanationNA: false,
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
      "Water Quality filled with test data (3 parameters + 2 ports)"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader onBack={() => navigation.goBack()} onSave={handleSave} />
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

        <View style={styles.parameterSection}>
          <View style={styles.internalMonitoringContainer}>
            <Text style={styles.internalMonitoringTitle}>
              Internal Monitoring
            </Text>
            <ParameterForm
              parameter={mainParameter}
              isMain={true}
              onUpdate={handleMainParameterUpdate}
              mmtCurrent={data.mmtCurrent}
              mmtPrevious={data.mmtPrevious}
              isMMTNA={data.isMMTNA}
              onMMTInputChange={handleMMTInputChange}
              onMMTNAToggle={() => handleInputChange("isMMTNA", !data.isMMTNA)}
            />
          </View>

          {parameters.map((param) => (
            <ParameterForm
              key={param.id}
              parameter={param}
              isMain={false}
              onUpdate={(field, value) =>
                updateParameter(param.id, field, value)
              }
              onDelete={() => removeParameter(param.id)}
              mmtCurrent={param.mmtCurrent}
              mmtPrevious={param.mmtPrevious}
              isMMTNA={param.isMMTNA}
              onMMTInputChange={(field, value) =>
                updateParameter(
                  param.id,
                  field as keyof Omit<Parameter, "id">,
                  value
                )
              }
              onMMTNAToggle={() =>
                updateParameter(param.id, "isMMTNA", !param.isMMTNA)
              }
            />
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addParameter}>
            <Ionicons name="add-circle-outline" size={16} color="#02217C" />
            <Text style={styles.addButtonText}>Add More Parameter</Text>
          </TouchableOpacity>
        </View>

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

        <OverallComplianceSection
          value={data.overallCompliance}
          onChangeText={(text) => handleInputChange("overallCompliance", text)}
        />

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
      </ScrollView>
    </SafeAreaView>
  );
}
