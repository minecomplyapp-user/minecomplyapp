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
import { useCmvrStore } from "../../../store/cmvrStore";
import { LocationSection } from "./components/LocationSection";
import { AirQualityLocationMonitoringSection } from "./components/AirQualityLocationMonitoringSection";
import {
  LocationState,
  AirQualityLocationData,
  AirQualityParameter,
  createEmptyAirQualityLocationData,
} from "../types/AirQualityScreen.types";
import { styles } from "../styles/AirQualityScreen.styles";

type LegacyLocationState = Partial<LocationState> & {
  quarryAndPlant?: boolean;
};

type RawAirQualityParameter = Partial<AirQualityParameter> &
  Record<string, unknown>;

type AirQualityParameterField = keyof Omit<AirQualityParameter, "id">;

const generateParameterId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeLocationState = (raw?: LegacyLocationState): LocationState => ({
  quarry: !!raw?.quarry,
  plant: !!raw?.plant,
  quarryPlant: !!(raw?.quarryPlant ?? raw?.quarryAndPlant),
  port: !!raw?.port,
});

const normalizeParameter = (
  param: RawAirQualityParameter
): AirQualityParameter => ({
  id: String(param.id ?? generateParameterId("air-param")),
  parameter:
    typeof param.parameter === "string"
      ? param.parameter
      : typeof param.name === "string"
        ? param.name
        : "",
  currentSMR:
    typeof param.currentSMR === "string"
      ? param.currentSMR
      : typeof param.inSMR === "string"
        ? param.inSMR
        : "",
  previousSMR: typeof param.previousSMR === "string" ? param.previousSMR : "",
  currentMMT:
    typeof param.currentMMT === "string"
      ? param.currentMMT
      : typeof param.mmtConfirmatorySampling === "string"
        ? param.mmtConfirmatorySampling
        : "",
  previousMMT: typeof param.previousMMT === "string" ? param.previousMMT : "",
  eqplRedFlag:
    typeof param.eqplRedFlag === "string"
      ? param.eqplRedFlag
      : typeof param.redFlag === "string"
        ? param.redFlag
        : "",
  action: typeof param.action === "string" ? param.action : "",
  limitPM25:
    typeof param.limitPM25 === "string"
      ? param.limitPM25
      : typeof param.limit === "string"
        ? param.limit
        : "",
  remarks: typeof param.remarks === "string" ? param.remarks : "",
});

const normalizeParameters = (
  parameters?: (AirQualityParameter | RawAirQualityParameter)[]
): AirQualityParameter[] => {
  if (!Array.isArray(parameters)) return [];
  return parameters.map((param) => normalizeParameter(param));
};

const initializeLocationData = (
  existing: AirQualityLocationData | undefined,
  fallbackIdPrefix: string
): AirQualityLocationData => {
  const base = existing ? { ...existing } : createEmptyAirQualityLocationData();
  const normalizedParams = normalizeParameters(base.parameters);
  return {
    ...base,
    parameters:
      normalizedParams.length > 0
        ? normalizedParams
        : [createEmptyParameter(fallbackIdPrefix)],
  };
};

const createEmptyParameter = (prefix: string): AirQualityParameter => ({
  id: generateParameterId(prefix),
  parameter: "",
  currentSMR: "",
  previousSMR: "",
  currentMMT: "",
  previousMMT: "",
  eqplRedFlag: "",
  action: "",
  limitPM25: "",
  remarks: "",
});

export default function AirQualityScreen({ navigation, route }: any) {
  // **ZUSTAND STORE** - Single source of truth
  const {
    currentReport,
    fileName: storeFileName,
    submissionId: storeSubmissionId,
    projectId: storeProjectId,
    projectName: storeProjectName,
    updateSection,
    saveDraft,
  } = useCmvrStore();

  // Initialize from store
  const storedAirQuality = currentReport?.airQualityImpactAssessment;

  const [selectedLocations, setSelectedLocations] = useState<LocationState>(
    () => normalizeLocationState(storedAirQuality?.selectedLocations)
  );

  // Separate state for each location - initialized from store
  const [quarryData, setQuarryData] = useState<AirQualityLocationData>(() =>
    initializeLocationData(storedAirQuality?.quarryData, "quarry-param")
  );

  const [plantData, setPlantData] = useState<AirQualityLocationData>(() =>
    initializeLocationData(storedAirQuality?.plantData, "plant-param")
  );

  const [quarryPlantData, setQuarryPlantData] =
    useState<AirQualityLocationData>(() =>
      initializeLocationData(
        storedAirQuality?.quarryPlantData ||
          (storedAirQuality as Record<string, any>)?.quarryAndPlantData,
        "quarryplant-param"
      )
    );

  const [portData, setPortData] = useState<AirQualityLocationData>(() =>
    initializeLocationData(storedAirQuality?.portData, "port-param")
  );

  // Auto-sync to store
  useEffect(() => {
    updateSection("airQualityImpactAssessment", {
      selectedLocations: {
        ...selectedLocations,
        quarryAndPlant: selectedLocations.quarryPlant,
      },
      quarryData,
      plantData,
      quarryPlantData,
      quarryAndPlantData: quarryPlantData,
      portData,
    });
  }, [selectedLocations, quarryData, plantData, quarryPlantData, portData]);

  const handleSave = async () => {
    try {
      await saveDraft();
      Alert.alert("Success", "Draft saved successfully");
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
    console.log("User chose to stay");
  };

  const handleSaveToDraft = async () => {
    try {
      await saveDraft();
      Alert.alert("Success", "Draft saved successfully");
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

  const handleLocationToggle = (location: keyof LocationState) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  // ============ QUARRY HANDLERS ============
  const addQuarryParameter = () => {
    setQuarryData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, createEmptyParameter("quarry-param")],
    }));
  };

  const updateQuarryParameter = (
    id: string,
    field: AirQualityParameterField,
    value: string
  ) => {
    setQuarryData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteQuarryParameter = (id: string) => {
    setQuarryData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }));
  };

  // ============ PLANT HANDLERS ============
  const addPlantParameter = () => {
    setPlantData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, createEmptyParameter("plant-param")],
    }));
  };

  const updatePlantParameter = (
    id: string,
    field: AirQualityParameterField,
    value: string
  ) => {
    setPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deletePlantParameter = (id: string) => {
    setPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }));
  };

  // ============ QUARRY & PLANT HANDLERS ============
  const addQuarryPlantParameter = () => {
    setQuarryPlantData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        createEmptyParameter("quarryplant-param"),
      ],
    }));
  };

  const updateQuarryPlantParameter = (
    id: string,
    field: AirQualityParameterField,
    value: string
  ) => {
    setQuarryPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteQuarryPlantParameter = (id: string) => {
    setQuarryPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }));
  };

  // ============ PORT HANDLERS ============
  const addPortParameter = () => {
    setPortData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, createEmptyParameter("port-param")],
    }));
  };

  const updatePortParameter = (
    id: string,
    field: AirQualityParameterField,
    value: string
  ) => {
    setPortData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deletePortParameter = (id: string) => {
    setPortData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }));
  };

  const fillTestData = () => {
    // Set locations
    setSelectedLocations({
      quarry: true,
      plant: true,
      quarryPlant: false,
      port: true,
    });

    // Fill Quarry Data
    setQuarryData({
      locationInput:
        "Water Sprinkling and imposition of 30kph Speed Limit. TSP, PM10 and PM2.5 monitoring within periphery.",
      samplingDate: "November 18-19, 2024",
      weatherAndWind: "Partly cloudy, Wind speed 2-4 m/s from Northeast",
      explanationForConfirmatorySampling:
        "Confirmatory sampling conducted to verify compliance with DENR standards during peak operations",
      overallAssessment:
        "All air quality parameters within acceptable limits. Dust control measures effective.",
      parameters: [
        {
          id: "quarry-1",
          parameter: "TSP",
          currentSMR: "120 µg/Nm³",
          previousSMR: "118 µg/Nm³",
          currentMMT: "118 µg/Nm³",
          previousMMT: "120 µg/Nm³",
          eqplRedFlag: "No",
          action: "Continue monitoring",
          limitPM25: "230 µg/Nm³",
          remarks: "Within DENR standards for TSP",
        },
        {
          id: "quarry-2",
          parameter: "PM10",
          currentSMR: "65 µg/Nm³",
          previousSMR: "66 µg/Nm³",
          currentMMT: "68 µg/Nm³",
          previousMMT: "70 µg/Nm³",
          eqplRedFlag: "No",
          action: "Maintain dust suppression",
          limitPM25: "150 µg/Nm³",
          remarks: "Compliant with PM10 limits",
        },
      ],
    });

    // Fill Plant Data
    setPlantData({
      locationInput:
        "Regular water sprinkling on haul roads and stockpile areas. PM monitoring at plant boundary.",
      samplingDate: "November 20, 2024",
      weatherAndWind: "Clear skies, Calm winds <1 m/s",
      explanationForConfirmatorySampling:
        "Monthly monitoring as per EPEP requirements",
      overallAssessment:
        "Plant air quality meets regulatory standards. Dust control systems operating effectively.",
      parameters: [
        {
          id: "plant-1",
          parameter: "TSP",
          currentSMR: "95 µg/Nm³",
          previousSMR: "98 µg/Nm³",
          currentMMT: "92 µg/Nm³",
          previousMMT: "95 µg/Nm³",
          eqplRedFlag: "No",
          action: "No action required",
          limitPM25: "230 µg/Nm³",
          remarks: "Well below threshold",
        },
      ],
    });

    // Fill Port Data
    setPortData({
      locationInput:
        "Dust suppression during loading operations. PM monitoring at port perimeter.",
      samplingDate: "November 22, 2024",
      weatherAndWind: "Light breeze, Wind 3-5 m/s from East",
      explanationForConfirmatorySampling:
        "Verification sampling during active loading operations",
      overallAssessment:
        "Port area air quality compliant. Loading procedures minimize dust generation.",
      parameters: [
        {
          id: "port-1",
          parameter: "PM10",
          currentSMR: "72 µg/Nm³",
          previousSMR: "70 µg/Nm³",
          currentMMT: "75 µg/Nm³",
          previousMMT: "74 µg/Nm³",
          eqplRedFlag: "No",
          action: "Continue current protocols",
          limitPM25: "150 µg/Nm³",
          remarks: "Acceptable levels during operations",
        },
      ],
    });

    Alert.alert(
      "Test Data",
      "Air Quality filled with test data:\n• Quarry: 2 parameters\n• Plant: 1 parameter\n• Port: 1 parameter"
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
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumberBadge}>
            <Text style={styles.sectionNumber}>B.2.</Text>
          </View>
          <Text style={styles.sectionTitle}>Air Quality Impact Assessment</Text>
        </View>

        <LocationSection
          selectedLocations={selectedLocations}
          onLocationToggle={handleLocationToggle}
        />

        {/* Quarry Monitoring Section */}
        {selectedLocations.quarry && (
          <AirQualityLocationMonitoringSection
            locationName="Quarry"
            locationInput={quarryData.locationInput}
            samplingDate={quarryData.samplingDate}
            weatherAndWind={quarryData.weatherAndWind}
            explanationForConfirmatorySampling={
              quarryData.explanationForConfirmatorySampling
            }
            overallAssessment={quarryData.overallAssessment}
            parameters={quarryData.parameters}
            onLocationInputChange={(value) =>
              setQuarryData((prev) => ({ ...prev, locationInput: value }))
            }
            onSamplingDateChange={(value) =>
              setQuarryData((prev) => ({ ...prev, samplingDate: value }))
            }
            onWeatherAndWindChange={(value) =>
              setQuarryData((prev) => ({ ...prev, weatherAndWind: value }))
            }
            onExplanationChange={(value) =>
              setQuarryData((prev) => ({
                ...prev,
                explanationForConfirmatorySampling: value,
              }))
            }
            onOverallAssessmentChange={(value) =>
              setQuarryData((prev) => ({ ...prev, overallAssessment: value }))
            }
            onAddParameter={addQuarryParameter}
            onUpdateParameter={updateQuarryParameter}
            onDeleteParameter={deleteQuarryParameter}
          />
        )}

        {/* Plant Monitoring Section */}
        {selectedLocations.plant && (
          <AirQualityLocationMonitoringSection
            locationName="Plant"
            locationInput={plantData.locationInput}
            samplingDate={plantData.samplingDate}
            weatherAndWind={plantData.weatherAndWind}
            explanationForConfirmatorySampling={
              plantData.explanationForConfirmatorySampling
            }
            overallAssessment={plantData.overallAssessment}
            parameters={plantData.parameters}
            onLocationInputChange={(value) =>
              setPlantData((prev) => ({ ...prev, locationInput: value }))
            }
            onSamplingDateChange={(value) =>
              setPlantData((prev) => ({ ...prev, samplingDate: value }))
            }
            onWeatherAndWindChange={(value) =>
              setPlantData((prev) => ({ ...prev, weatherAndWind: value }))
            }
            onExplanationChange={(value) =>
              setPlantData((prev) => ({
                ...prev,
                explanationForConfirmatorySampling: value,
              }))
            }
            onOverallAssessmentChange={(value) =>
              setPlantData((prev) => ({ ...prev, overallAssessment: value }))
            }
            onAddParameter={addPlantParameter}
            onUpdateParameter={updatePlantParameter}
            onDeleteParameter={deletePlantParameter}
          />
        )}

        {/* Quarry / Plant Monitoring Section */}
        {selectedLocations.quarryPlant && (
          <AirQualityLocationMonitoringSection
            locationName="Quarry / Plant"
            locationInput={quarryPlantData.locationInput}
            samplingDate={quarryPlantData.samplingDate}
            weatherAndWind={quarryPlantData.weatherAndWind}
            explanationForConfirmatorySampling={
              quarryPlantData.explanationForConfirmatorySampling
            }
            overallAssessment={quarryPlantData.overallAssessment}
            parameters={quarryPlantData.parameters}
            onLocationInputChange={(value) =>
              setQuarryPlantData((prev) => ({
                ...prev,
                locationInput: value,
              }))
            }
            onSamplingDateChange={(value) =>
              setQuarryPlantData((prev) => ({
                ...prev,
                samplingDate: value,
              }))
            }
            onWeatherAndWindChange={(value) =>
              setQuarryPlantData((prev) => ({
                ...prev,
                weatherAndWind: value,
              }))
            }
            onExplanationChange={(value) =>
              setQuarryPlantData((prev) => ({
                ...prev,
                explanationForConfirmatorySampling: value,
              }))
            }
            onOverallAssessmentChange={(value) =>
              setQuarryPlantData((prev) => ({
                ...prev,
                overallAssessment: value,
              }))
            }
            onAddParameter={addQuarryPlantParameter}
            onUpdateParameter={updateQuarryPlantParameter}
            onDeleteParameter={deleteQuarryPlantParameter}
          />
        )}

        {/* Port Monitoring Section */}
        {selectedLocations.port && (
          <AirQualityLocationMonitoringSection
            locationName="Port"
            locationInput={portData.locationInput}
            samplingDate={portData.samplingDate}
            weatherAndWind={portData.weatherAndWind}
            explanationForConfirmatorySampling={
              portData.explanationForConfirmatorySampling
            }
            overallAssessment={portData.overallAssessment}
            parameters={portData.parameters}
            onLocationInputChange={(value) =>
              setPortData((prev) => ({ ...prev, locationInput: value }))
            }
            onSamplingDateChange={(value) =>
              setPortData((prev) => ({ ...prev, samplingDate: value }))
            }
            onWeatherAndWindChange={(value) =>
              setPortData((prev) => ({ ...prev, weatherAndWind: value }))
            }
            onExplanationChange={(value) =>
              setPortData((prev) => ({
                ...prev,
                explanationForConfirmatorySampling: value,
              }))
            }
            onOverallAssessmentChange={(value) =>
              setPortData((prev) => ({ ...prev, overallAssessment: value }))
            }
            onAddParameter={addPortParameter}
            onUpdateParameter={updatePortParameter}
            onDeleteParameter={deletePortParameter}
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
            <Text style={styles.saveNextText}>Fill Test Data</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={() => {
            const airQualityImpactAssessment = {
              selectedLocations: {
                ...selectedLocations,
                quarryAndPlant: selectedLocations.quarryPlant,
              },
              quarryData,
              plantData,
              quarryPlantData,
              quarryAndPlantData: quarryPlantData,
              portData,
            };
            const nextParams = {
              ...(route?.params || {}),
              airQualityImpactAssessment,
            } as any;
            console.log(
              "Navigating with AirQuality params keys:",
              Object.keys(nextParams)
            );
            navigation.navigate("WaterQuality", nextParams);
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
