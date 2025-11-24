import React from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AirQualityParameter } from "../../types/AirQualityScreen.types";
import { styles } from "./AirQualityLocationMonitoringSection.styles";

type Props = {
  locationName: string;
  locationInput: string;
  samplingDate: string;
  weatherAndWind: string;
  explanationForConfirmatorySampling: string;
  overallAssessment: string;
  parameters: AirQualityParameter[];
  onLocationInputChange: (value: string) => void;
  onSamplingDateChange: (value: string) => void;
  onWeatherAndWindChange: (value: string) => void;
  onExplanationChange: (value: string) => void;
  onOverallAssessmentChange: (value: string) => void;
  onAddParameter: () => void;
  onUpdateParameter: (
    id: string,
    field: keyof Omit<AirQualityParameter, "id">,
    value: string
  ) => void;
  onDeleteParameter: (id: string) => void;
};

export const AirQualityLocationMonitoringSection: React.FC<Props> = ({
  locationName,
  locationInput,
  samplingDate,
  weatherAndWind,
  explanationForConfirmatorySampling,
  overallAssessment,
  parameters,
  onLocationInputChange,
  onSamplingDateChange,
  onWeatherAndWindChange,
  onExplanationChange,
  onOverallAssessmentChange,
  onAddParameter,
  onUpdateParameter,
  onDeleteParameter,
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
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Location Description:</Text>
        <TextInput
          style={styles.textInput}
          value={locationInput}
          onChangeText={onLocationInputChange}
          placeholder={`e.g., Air monitoring station at ${locationName}`}
          placeholderTextColor="#94A3B8"
          multiline
        />
      </View>

      {/* Parameters Section */}
      <View style={styles.parametersSection}>
        <Text style={styles.sectionTitle}>Parameters</Text>

        {parameters.map((param, index) => (
          <View key={param.id} style={styles.parameterCard}>
            {/* Parameter Header */}
            <View style={styles.parameterHeader}>
              <Text style={styles.parameterNumber}>Parameter {index + 1}</Text>
              {index > 0 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      "Delete Parameter",
                      "Are you sure you want to delete this parameter?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => onDeleteParameter(param.id),
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>

            {/* Parameter Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Parameter Name:</Text>
              <TextInput
                style={styles.textInput}
                value={param.parameter}
                onChangeText={(value) =>
                  onUpdateParameter(param.id, "parameter", value)
                }
                placeholder="e.g., TSP, PM10"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* SMR Results Row */}
            <View style={styles.rowContainer}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Current SMR:</Text>
                <TextInput
                  style={styles.textInput}
                  value={param.currentSMR}
                  onChangeText={(value) =>
                    onUpdateParameter(param.id, "currentSMR", value)
                  }
                  placeholder="e.g., 45 µg/m³"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Previous SMR:</Text>
                <TextInput
                  style={styles.textInput}
                  value={param.previousSMR}
                  onChangeText={(value) =>
                    onUpdateParameter(param.id, "previousSMR", value)
                  }
                  placeholder="e.g., 40 µg/m³"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* MMT Results Row */}
            <View style={styles.rowContainer}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Current MMT:</Text>
                <TextInput
                  style={styles.textInput}
                  value={param.currentMMT}
                  onChangeText={(value) =>
                    onUpdateParameter(param.id, "currentMMT", value)
                  }
                  placeholder="e.g., 48 µg/m³"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Previous MMT:</Text>
                <TextInput
                  style={styles.textInput}
                  value={param.previousMMT}
                  onChangeText={(value) =>
                    onUpdateParameter(param.id, "previousMMT", value)
                  }
                  placeholder="e.g., 50 µg/m³"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* EQPL Section */}
            <View style={styles.eqplSection}>
              <Text style={styles.subsectionTitle}>EQPL</Text>
              <View style={styles.rowContainer}>
                <View style={styles.thirdField}>
                  <Text style={styles.fieldLabel}>Red Flag:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={param.eqplRedFlag}
                    onChangeText={(value) =>
                      onUpdateParameter(param.id, "eqplRedFlag", value)
                    }
                    placeholder="Yes/No"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={styles.thirdField}>
                  <Text style={styles.fieldLabel}>Action:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={param.action}
                    onChangeText={(value) =>
                      onUpdateParameter(param.id, "action", value)
                    }
                    placeholder="Action taken"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={styles.thirdField}>
                  <Text style={styles.fieldLabel}>Limit (PM2.5):</Text>
                  <TextInput
                    style={styles.textInput}
                    value={param.limitPM25}
                    onChangeText={(value) =>
                      onUpdateParameter(param.id, "limitPM25", value)
                    }
                    placeholder="e.g., 90 µg/m³"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Remarks */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Remarks:</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={param.remarks}
                onChangeText={(value) =>
                  onUpdateParameter(param.id, "remarks", value)
                }
                placeholder="Enter remarks or observations"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        ))}

        {/* Add Parameter Button */}
        <TouchableOpacity style={styles.addButton} onPress={onAddParameter}>
          <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
          <Text style={styles.addButtonText}>Add Parameter</Text>
        </TouchableOpacity>
      </View>

      {/* Sampling Details */}
      <View style={styles.samplingSection}>
        <Text style={styles.sectionTitle}>Sampling Details</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Sampling Date:</Text>
          <TextInput
            style={styles.textInput}
            value={samplingDate}
            onChangeText={onSamplingDateChange}
            placeholder="e.g., November 18-19, 2024"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Weather and Wind Condition:</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={weatherAndWind}
            onChangeText={onWeatherAndWindChange}
            placeholder="Describe weather and wind conditions during sampling"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Explanation for Confirmatory Sampling:
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={explanationForConfirmatorySampling}
            onChangeText={onExplanationChange}
            placeholder="Explain reason for confirmatory sampling"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Overall Assessment */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Overall Assessment:</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={overallAssessment}
          onChangeText={onOverallAssessmentChange}
          placeholder="Provide overall compliance assessment for this location"
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
};
