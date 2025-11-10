import React from "react";
import { View, Text, TextInput } from "react-native";
import { Checkbox } from "../components/Checkbox";
import { styles } from "../styles/SamplingDetailsSection.styles";

export type SamplingDetailsSectionProps = {
  dateTime: string;
  weatherWind: string;
  explanation: string;
  isExplanationNA: boolean;
  overallCompliance: string;
  onInputChange: (field: string, value: string) => void;
  onExplanationNAToggle: () => void;
};

export const SamplingDetailsSection: React.FC<SamplingDetailsSectionProps> = ({
  dateTime,
  weatherWind,
  explanation,
  isExplanationNA,
  overallCompliance,
  onInputChange,
  onExplanationNAToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sampling Details</Text>

      {/* Sampling Date */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Sampling Date:</Text>
        <TextInput
          style={styles.input}
          value={dateTime}
          onChangeText={(text) => onInputChange("dateTime", text)}
          placeholder="e.g., June 29, 2025"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Weather & Wind */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Weather & Wind:</Text>
        <TextInput
          style={styles.input}
          value={weatherWind}
          onChangeText={(text) => onInputChange("weatherWind", text)}
          placeholder="e.g., Clear skies"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Explanation for Confirmatory Sampling */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Explanation for Confirmatory Sampling:</Text>
        <View style={styles.naCheckboxContainer}>
          <Checkbox checked={isExplanationNA} onPress={onExplanationNAToggle} />
          <Text style={styles.naLabel}>N/A</Text>
        </View>
        {!isExplanationNA && (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={explanation}
            onChangeText={(text) => onInputChange("explanation", text)}
            placeholder="Type here..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        )}
      </View>

      {/* Overall Compliance Assessment */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Overall Compliance Assessment:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={overallCompliance}
          onChangeText={(text) => onInputChange("overallCompliance", text)}
          placeholder="e.g., Within the DENR Standard"
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};
