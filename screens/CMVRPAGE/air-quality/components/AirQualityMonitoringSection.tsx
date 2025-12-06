import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AirQualityParameterForm } from "./AirQualityParameterForm";
import { AirQualitySamplingSection } from "./AirQualitySamplingSection";
import { AirQualityParameter } from "../../types/AirQualityScreen.types";
import { styles } from "./AirQualityMonitoringSection.styles";

export type AirQualityMonitoringSectionProps = {
  // Main parameter (first row)
  parameter: string;
  unit?: string; // ✅ NEW: Unit field
  currentSMR: string;
  previousSMR: string;
  currentMMT: string;
  previousMMT: string;
  eqplRedFlag: string;
  action: string;
  limitPM25: string;
  remarks: string;

  // Additional parameters
  parameters: AirQualityParameter[];

  // Sampling metadata
  dateTime: string;
  weatherWind: string;
  explanation: string;
  overallCompliance: string;

  // Handlers
  onMainParameterUpdate: (field: string, value: string) => void;
  onAddParameter: () => void;
  onUpdateParameter: (id: string, field: string, value: string) => void;
  onDeleteParameter: (id: string) => void;
  onSamplingDetailsChange: (field: string, value: string) => void;
};

export const AirQualityMonitoringSection: React.FC<
  AirQualityMonitoringSectionProps
> = ({
  parameter,
  unit,
  currentSMR,
  previousSMR,
  currentMMT,
  previousMMT,
  eqplRedFlag,
  action,
  limitPM25,
  remarks,
  parameters,
  dateTime,
  weatherWind,
  explanation,
  overallCompliance,
  onMainParameterUpdate,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
  onSamplingDetailsChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Parameter Section */}
      <View style={styles.mainParameterContainer}>
        <Text style={styles.mainParameterTitle}>Air Quality Monitoring</Text>

        <AirQualityParameterForm
          parameter={parameter}
          unit={unit} // ✅ NEW: Pass unit prop
          currentSMR={currentSMR}
          previousSMR={previousSMR}
          currentMMT={currentMMT}
          previousMMT={previousMMT}
          eqplRedFlag={eqplRedFlag}
          action={action}
          limitPM25={limitPM25}
          remarks={remarks}
          isMain={true}
          onUpdate={onMainParameterUpdate}
        />
      </View>

      {/* Additional Parameters */}
      {parameters.map((param, index) => (
        <AirQualityParameterForm
          key={param.id}
          parameter={param.parameter}
          unit={param.unit} // ✅ NEW: Pass unit prop
          currentSMR={param.currentSMR}
          previousSMR={param.previousSMR}
          currentMMT={param.currentMMT}
          previousMMT={param.previousMMT}
          eqplRedFlag={param.eqplRedFlag}
          action={param.action}
          limitPM25={param.limitPM25}
          remarks={param.remarks}
          index={index + 2}
          isMain={false}
          onUpdate={(field, value) => onUpdateParameter(param.id, field, value)}
          onDelete={() => onDeleteParameter(param.id)}
        />
      ))}

      {/* Add More Parameter Button */}
      <TouchableOpacity style={styles.addButton} onPress={onAddParameter}>
        <Ionicons name="add-circle-outline" size={16} color="#02217C" />
        <Text style={styles.addButtonText}>Add More Parameter</Text>
      </TouchableOpacity>

      {/* Sampling Details Section */}
      <AirQualitySamplingSection
        dateTime={dateTime}
        weatherWind={weatherWind}
        explanation={explanation}
        overallCompliance={overallCompliance}
        onInputChange={onSamplingDetailsChange}
      />
    </View>
  );
};
