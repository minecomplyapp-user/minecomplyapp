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
import { AirQualityLocationMonitoringSection } from "./components/AirQualityLocationMonitoringSection";
import {
  LocationState,
  AirQualityLocationData,
  createEmptyAirQualityLocationData,
} from "../types/AirQualityScreen.types";
import { styles } from "../styles/AirQualityScreen.styles";

export default function AirQualityScreen({ navigation, route }: any) {
  const [selectedLocations, setSelectedLocations] = useState<LocationState>({
    quarry: false,
    plant: false,
    quarryAndPlant: false,
    port: false,
  });

  // Separate state for each location
  const [quarryData, setQuarryData] = useState<AirQualityLocationData>(() => {
    const data = createEmptyAirQualityLocationData();
    data.parameters = [
      {
        id: "quarry-param-1",
        name: "",
        inSMR: "",
        mmtConfirmatorySampling: "",
        redFlag: "",
        action: "",
        limit: "",
        remarks: "",
      },
    ];
    return data;
  });
  const [plantData, setPlantData] = useState<AirQualityLocationData>(() => {
    const data = createEmptyAirQualityLocationData();
    data.parameters = [
      {
        id: "plant-param-1",
        name: "",
        inSMR: "",
        mmtConfirmatorySampling: "",
        redFlag: "",
        action: "",
        limit: "",
        remarks: "",
      },
    ];
    return data;
  });
  const [quarryAndPlantData, setQuarryAndPlantData] =
    useState<AirQualityLocationData>(() => {
      const data = createEmptyAirQualityLocationData();
      data.parameters = [
        {
          id: "quarryplant-param-1",
          name: "",
          inSMR: "",
          mmtConfirmatorySampling: "",
          redFlag: "",
          action: "",
          limit: "",
          remarks: "",
        },
      ];
      return data;
    });
  const [portData, setPortData] = useState<AirQualityLocationData>(() => {
    const data = createEmptyAirQualityLocationData();
    data.parameters = [
      {
        id: "port-param-1",
        name: "",
        inSMR: "",
        mmtConfirmatorySampling: "",
        redFlag: "",
        action: "",
        limit: "",
        remarks: "",
      },
    ];
    return data;
  });

  // Hydrate from route params when coming from a draft
  useEffect(() => {
    const params: any = route?.params || {};
    const saved = params.airQualityImpactAssessment;
    if (saved) {
      if (saved.selectedLocations)
        setSelectedLocations(saved.selectedLocations);
      if (saved.quarryData) setQuarryData(saved.quarryData);
      if (saved.plantData) setPlantData(saved.plantData);
      if (saved.quarryAndPlantData)
        setQuarryAndPlantData(saved.quarryAndPlantData);
      if (saved.portData) setPortData(saved.portData);
    }
  }, [route?.params]);

  const handleSave = async () => {
    try {
      const prevPageData: any = route.params || {};

      const airQualityImpactAssessment = {
        selectedLocations,
        quarryData,
        plantData,
        quarryAndPlantData,
        portData,
      };

      const draftData = {
        ...prevPageData,
        airQualityImpactAssessment,
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

      const airQualityImpactAssessment = {
        selectedLocations,
        quarryData,
        plantData,
        quarryAndPlantData,
        portData,
      };

      const draftData = {
        ...prevPageData,
        airQualityImpactAssessment,
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

  const handleLocationToggle = (location: keyof LocationState) => {
    setSelectedLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  // ============ QUARRY HANDLERS ============
  const addQuarryParameter = () => {
    const newId = `quarry-param-${Date.now()}`;
    setQuarryData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
          id: newId,
          name: "",
          inSMR: "",
          mmtConfirmatorySampling: "",
          redFlag: "",
          action: "",
          limit: "",
          remarks: "",
        },
      ],
    }));
  };

  const updateQuarryParameter = (id: string, field: string, value: string) => {
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
    const newId = `plant-param-${Date.now()}`;
    setPlantData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
          id: newId,
          name: "",
          inSMR: "",
          mmtConfirmatorySampling: "",
          redFlag: "",
          action: "",
          limit: "",
          remarks: "",
        },
      ],
    }));
  };

  const updatePlantParameter = (id: string, field: string, value: string) => {
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
  const addQuarryAndPlantParameter = () => {
    const newId = `quarryplant-param-${Date.now()}`;
    setQuarryAndPlantData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
          id: newId,
          name: "",
          inSMR: "",
          mmtConfirmatorySampling: "",
          redFlag: "",
          action: "",
          limit: "",
          remarks: "",
        },
      ],
    }));
  };

  const updateQuarryAndPlantParameter = (
    id: string,
    field: string,
    value: string
  ) => {
    setQuarryAndPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const deleteQuarryAndPlantParameter = (id: string) => {
    setQuarryAndPlantData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }));
  };

  // ============ PORT HANDLERS ============
  const addPortParameter = () => {
    const newId = `port-param-${Date.now()}`;
    setPortData((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        {
          id: newId,
          name: "",
          inSMR: "",
          mmtConfirmatorySampling: "",
          redFlag: "",
          action: "",
          limit: "",
          remarks: "",
        },
      ],
    }));
  };

  const updatePortParameter = (id: string, field: string, value: string) => {
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
      quarryAndPlant: false,
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
          name: "TSP",
          inSMR: "120 µg/Nm³",
          mmtConfirmatorySampling: "118 µg/Nm³",
          redFlag: "No",
          action: "Continue monitoring",
          limit: "230 µg/Nm³",
          remarks: "Within DENR standards for TSP",
        },
        {
          id: "quarry-2",
          name: "PM10",
          inSMR: "65 µg/Nm³",
          mmtConfirmatorySampling: "68 µg/Nm³",
          redFlag: "No",
          action: "Maintain dust suppression",
          limit: "150 µg/Nm³",
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
          name: "TSP",
          inSMR: "95 µg/Nm³",
          mmtConfirmatorySampling: "92 µg/Nm³",
          redFlag: "No",
          action: "No action required",
          limit: "230 µg/Nm³",
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
          name: "PM10",
          inSMR: "72 µg/Nm³",
          mmtConfirmatorySampling: "75 µg/Nm³",
          redFlag: "No",
          action: "Continue current protocols",
          limit: "150 µg/Nm³",
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
            <Text style={styles.sectionNumber}>B.3.</Text>
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

        {/* Quarry & Plant Monitoring Section */}
        {selectedLocations.quarryAndPlant && (
          <AirQualityLocationMonitoringSection
            locationName="Quarry & Plant"
            locationInput={quarryAndPlantData.locationInput}
            samplingDate={quarryAndPlantData.samplingDate}
            weatherAndWind={quarryAndPlantData.weatherAndWind}
            explanationForConfirmatorySampling={
              quarryAndPlantData.explanationForConfirmatorySampling
            }
            overallAssessment={quarryAndPlantData.overallAssessment}
            parameters={quarryAndPlantData.parameters}
            onLocationInputChange={(value) =>
              setQuarryAndPlantData((prev) => ({
                ...prev,
                locationInput: value,
              }))
            }
            onSamplingDateChange={(value) =>
              setQuarryAndPlantData((prev) => ({
                ...prev,
                samplingDate: value,
              }))
            }
            onWeatherAndWindChange={(value) =>
              setQuarryAndPlantData((prev) => ({
                ...prev,
                weatherAndWind: value,
              }))
            }
            onExplanationChange={(value) =>
              setQuarryAndPlantData((prev) => ({
                ...prev,
                explanationForConfirmatorySampling: value,
              }))
            }
            onOverallAssessmentChange={(value) =>
              setQuarryAndPlantData((prev) => ({
                ...prev,
                overallAssessment: value,
              }))
            }
            onAddParameter={addQuarryAndPlantParameter}
            onUpdateParameter={updateQuarryAndPlantParameter}
            onDeleteParameter={deleteQuarryAndPlantParameter}
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
              selectedLocations,
              quarryData,
              plantData,
              quarryAndPlantData,
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
      </ScrollView>
    </SafeAreaView>
  );
}
