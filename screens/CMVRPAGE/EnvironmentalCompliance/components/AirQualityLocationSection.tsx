import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ParameterForm } from "./ParameterForm";
import { FormInputField } from "./FormInputField";
import { ParameterData } from "../../types/EnvironmentalComplianceScreen.types";
import { styles } from "../styles/AirQualityLocationSection.styles";

type Props = {
  locationName: string;
  locationInput: string;
  mainParameter: ParameterData;
  parameters: ParameterData[];
  dateTime: string;
  weatherWind: string;
  explanation: string;
  overallCompliance: string;
  naChecked: boolean;
  onLocationInputChange: (value: string) => void;
  onMainParameterUpdate: (
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => void;
  onNAChange: () => void;
  onAddParameter: () => void;
  onUpdateParameter: (
    id: string,
    field: keyof Omit<ParameterData, "id">,
    value: string
  ) => void;
  onDeleteParameter: (id: string) => void;
  onDateTimeChange: (value: string) => void;
  onWeatherWindChange: (value: string) => void;
  onExplanationChange: (value: string) => void;
  onOverallComplianceChange: (value: string) => void;
};

export const AirQualityLocationSection: React.FC<Props> = ({
  locationName,
  locationInput,
  mainParameter,
  parameters,
  dateTime,
  weatherWind,
  explanation,
  overallCompliance,
  naChecked,
  onLocationInputChange,
  onMainParameterUpdate,
  onNAChange,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
  onDateTimeChange,
  onWeatherWindChange,
  onExplanationChange,
  onOverallComplianceChange,
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
      <FormInputField
        label={`${locationName} Description:`}
        value={locationInput}
        onChangeText={onLocationInputChange}
        placeholder={`e.g., Air monitoring at ${locationName}`}
      />

      {/* Main Parameter Form */}
      <View style={styles.parametersSection}>
        <Text style={styles.sectionLabel}>Parameters</Text>
        <ParameterForm
          data={mainParameter}
          onUpdate={onMainParameterUpdate}
          showNA={true}
          naChecked={naChecked}
          onNAChange={onNAChange}
        />

        {/* Additional Parameters */}
        {parameters.map((param, index) => (
          <View key={param.id} style={styles.additionalParameterContainer}>
            <ParameterForm
              data={param}
              onUpdate={(field, value) =>
                onUpdateParameter(param.id, field, value)
              }
              showDelete={true}
              onDelete={() => onDeleteParameter(param.id)}
              index={index}
            />
          </View>
        ))}

        {/* Add More Parameter Button */}
        <TouchableOpacity style={styles.addButton} onPress={onAddParameter}>
          <Ionicons name="add-circle-outline" size={20} color="#02217C" />
          <Text style={styles.addButtonText}>Add More Parameter</Text>
        </TouchableOpacity>
      </View>

      {/* Sampling Details */}
      <View style={styles.samplingSection}>
        <Text style={styles.sectionLabel}>Sampling Details</Text>
        <FormInputField
          label="Date/Time of Sampling:"
          value={dateTime}
          onChangeText={onDateTimeChange}
        />

        <FormInputField
          label="Weather and Wind Direction:"
          value={weatherWind}
          onChangeText={onWeatherWindChange}
        />

        <FormInputField
          label="Explanation of why confirmatory sampling was conducted for specific parameter in the sampling station:"
          value={explanation}
          onChangeText={onExplanationChange}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Overall Compliance */}
      <View style={styles.overallSection}>
        <View style={styles.overallHeader}>
          <View style={styles.overallIconCircle}>
            <Text style={styles.overallIcon}>✓</Text>
          </View>
          <Text style={styles.overallLabel}>Overall Compliance Assessment</Text>
        </View>
        <FormInputField
          label=""
          value={overallCompliance}
          onChangeText={onOverallComplianceChange}
        />
      </View>
    </View>
  );
};
