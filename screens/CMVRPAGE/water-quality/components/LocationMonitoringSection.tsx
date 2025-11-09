import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ParameterForm } from "./ParameterForm";
import { SamplingDetailsSection } from "./SamplingDetailsSection";
import { Parameter } from "../../types/WaterQualityScreen.types";
import { styles } from "./LocationMonitoringSection.styles";

export type LocationMonitoringSectionProps = {
  locationName: string;
  locationInput: string;
  mainParameter: Parameter;
  parameters: Parameter[];
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  overallCompliance: string;
  mmtCurrent: string;
  mmtPrevious: string;
  isMMTNA: boolean;
  onLocationInputChange: (value: string) => void;
  onMainParameterUpdate: (
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => void;
  onMMTInputChange: (field: string, value: string) => void;
  onMMTNAToggle: () => void;
  onAddParameter: () => void;
  onUpdateParameter: (
    id: string,
    field: keyof Omit<Parameter, "id">,
    value: string | boolean
  ) => void;
  onDeleteParameter: (id: string) => void;
  onSamplingDetailsChange: (field: string, value: string) => void;
  onExplanationNAToggle: () => void;
};

export const LocationMonitoringSection: React.FC<
  LocationMonitoringSectionProps
> = ({
  locationName,
  locationInput,
  mainParameter,
  parameters,
  dateTime,
  weatherWind,
  explanation,
  isExplanationNA,
  overallCompliance,
  mmtCurrent,
  mmtPrevious,
  isMMTNA,
  onLocationInputChange,
  onMainParameterUpdate,
  onMMTInputChange,
  onMMTNAToggle,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
  onSamplingDetailsChange,
  onExplanationNAToggle,
}) => {
  return (
    <View style={styles.container}>
      {/* Location Header */}
      <View style={styles.locationHeader}>
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.locationTitle}>{locationName}</Text>
      </View>
      {/* Location Input */}
      <View style={styles.locationInputContainer}>
        <Text style={styles.locationInputLabel}>Location Description:</Text>
        <TextInput
          style={styles.locationInput}
          value={locationInput}
          onChangeText={onLocationInputChange}
          placeholder={`e.g., Station WQ-01 (${locationName} monitoring area)`}
          placeholderTextColor="#94A3B8"
          multiline
        />
      </View>
      {/* Internal Monitoring Section */}
      <View style={styles.internalMonitoringContainer}>
        <Text style={styles.internalMonitoringTitle}>Internal Monitoring</Text>

        <ParameterForm
          parameter={mainParameter}
          isMain={true}
          onUpdate={onMainParameterUpdate}
          mmtCurrent={mmtCurrent}
          mmtPrevious={mmtPrevious}
          isMMTNA={isMMTNA}
          onMMTInputChange={onMMTInputChange}
          onMMTNAToggle={onMMTNAToggle}
        />
      </View>
      {/* Additional Parameters */}
      {parameters.map((param, index) => (
        <ParameterForm
          key={param.id}
          parameter={param}
          index={index + 2}
          isMain={false}
          onUpdate={(field, value) => onUpdateParameter(param.id, field, value)}
          onDelete={() => onDeleteParameter(param.id)}
          mmtCurrent={param.mmtCurrent}
          mmtPrevious={param.mmtPrevious}
          isMMTNA={param.isMMTNA}
          onMMTInputChange={(field, value) =>
            onUpdateParameter(
              param.id,
              field as keyof Omit<Parameter, "id">,
              value
            )
          }
          onMMTNAToggle={() =>
            onUpdateParameter(param.id, "isMMTNA", !param.isMMTNA)
          }
        />
      ))}
      {/* Add More Parameter Button */}
      <TouchableOpacity style={styles.addButton} onPress={onAddParameter}>
        <Ionicons name="add-circle-outline" size={16} color="#02217C" />
        <Text style={styles.addButtonText}>Add More Parameter</Text>
      </TouchableOpacity>
      {/* Sampling Details Section */}
      <SamplingDetailsSection
        dateTime={dateTime}
        weatherWind={weatherWind}
        explanation={explanation}
        isExplanationNA={isExplanationNA}
        overallCompliance={overallCompliance}
        onInputChange={onSamplingDetailsChange}
        onExplanationNAToggle={onExplanationNAToggle}
      />
    </View>
  );
};
