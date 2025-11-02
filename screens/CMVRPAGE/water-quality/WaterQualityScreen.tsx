import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CMSHeader } from "../../../components/CMSHeader";
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

export default function WaterQualityScreen({ navigation }: any) {
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

  const handleParameterMMTInputChange = (id: string, field: string, value: string) => {
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
      ports.map((port) => (port.id === portId ? { ...port, [field]: value } : port))
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

  return (
    <SafeAreaView style={styles.container}>
      <CMSHeader onBack={() => navigation.goBack()} />
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
              onUpdate={(field, value) => updateParameter(param.id, field, value)}
              onDelete={() => removeParameter(param.id)}
              mmtCurrent={param.mmtCurrent}
              mmtPrevious={param.mmtPrevious}
              isMMTNA={param.isMMTNA}
              onMMTInputChange={(field, value) => updateParameter(param.id, field as keyof Omit<Parameter, "id">, value)}
              onMMTNAToggle={() => updateParameter(param.id, "isMMTNA", !param.isMMTNA)}
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

        <TouchableOpacity
          style={styles.saveNextButton}
          onPress={() => navigation.navigate("NoiseQuality")}
        >
          <Text style={styles.saveNextText}>Save & Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}